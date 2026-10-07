-- Ejecutar una vez desde tu herramienta PostgreSQL habitual. Se puede repetir.
-- Registra los permisos CMS y los asigna al rol activo super_admin.
-- Las asignaciones de otros roles se realizan desde el portal IAM.
-- No reactiva permisos ni asignaciones revocados: detecta el conflicto y revierte.
BEGIN;
CREATE TEMP TABLE cc_cms_permisos (
    slug text PRIMARY KEY,
    nombre text,
    descripcion text
) ON COMMIT DROP;
INSERT INTO cc_cms_permisos
SELECT 'cms.' || recurso || '.' || accion,
    'CMS · ' || etiqueta || ' · ' || CASE
        accion
        WHEN 'read' THEN 'Consultar'
        ELSE 'Gestionar'
    END,
    'Administración CMS: ' || etiqueta
FROM (
        VALUES ('tipos_seccion', 'Tipos de sección'),
            ('contenidos_seccion', 'Contenidos de sección'),
            ('metadata_seccion', 'Metadata de sección'),
            ('menus', 'Menús'),
            ('items_menu', 'Ítems de menú'),
            ('elementos_footer', 'Elementos del footer'),
            ('configuracion_sitio', 'Configuración del sitio'),
            ('pasos_wizard', 'Pasos del wizard'),
            ('registros_cms', 'Registros CMS'),
            ('contenidos_registro', 'Contenidos de registro')
    ) AS recursos(recurso, etiqueta)
    CROSS JOIN (
        VALUES ('read'),
            ('manage')
    ) AS acciones(accion);
INSERT INTO public.permisos (
        nombre,
        slug,
        grupo,
        descripcion,
        estado,
        creado_en,
        actualizado_en
    )
SELECT nombre,
    slug,
    'CMS',
    descripcion,
    'activo'::public.enum_estado,
    now(),
    now()
FROM cc_cms_permisos ON CONFLICT (slug) DO NOTHING;
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM public.roles
    WHERE slug = 'super_admin'
        AND estado = 'activo'
        AND eliminado_en IS NULL
) THEN RAISE EXCEPTION 'No existe un rol super_admin activo';
END IF;
IF EXISTS (
    SELECT 1
    FROM public.permisos p
        JOIN cc_cms_permisos d ON d.slug = p.slug
    WHERE p.estado <> 'activo'
        OR p.eliminado_en IS NOT NULL
) THEN RAISE EXCEPTION 'Hay permisos CMS inactivos o eliminados; revisar desde IAM antes de provisionar';
END IF;
IF EXISTS (
    SELECT 1
    FROM public.rol_permiso rp
        JOIN public.roles r ON r.id = rp.rol_id
        JOIN public.permisos p ON p.id = rp.permiso_id
        JOIN cc_cms_permisos d ON d.slug = p.slug
    WHERE r.slug = 'super_admin'
        AND rp.estado <> 'activo'
) THEN RAISE EXCEPTION 'Hay asignaciones CMS revocadas para super_admin; revisar desde IAM';
END IF;
END $$;
INSERT INTO public.rol_permiso (rol_id, permiso_id, estado, creado_en)
SELECT r.id,
    p.id,
    'activo',
    now()
FROM public.roles r
    CROSS JOIN public.permisos p
    JOIN cc_cms_permisos d ON d.slug = p.slug
WHERE r.slug = 'super_admin'
    AND r.estado = 'activo'
    AND r.eliminado_en IS NULL ON CONFLICT (rol_id, permiso_id) DO NOTHING;
COMMIT;