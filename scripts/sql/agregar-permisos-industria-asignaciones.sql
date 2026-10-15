BEGIN;
-- Rol que recibirá los permisos.
CREATE TEMP TABLE rol_destino_industrias (slug TEXT PRIMARY KEY) ON COMMIT DROP;
INSERT INTO rol_destino_industrias (slug)
VALUES ('super_admin');
-- Evita terminar sin haber encontrado el rol.
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM public.roles r
        JOIN rol_destino_industrias d ON d.slug = r.slug
    WHERE r.estado = 'activo'
        AND r.eliminado_en IS NULL
) THEN RAISE EXCEPTION 'El rol indicado no existe o no está activo. Revisa su slug.';
END IF;
END $$;
CREATE TEMP TABLE permisos_industrias (
    slug TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL
) ON COMMIT DROP;
INSERT INTO permisos_industrias (slug, descripcion)
VALUES (
        'catalog.industrias.read',
        'Consultar industrias'
    ),
    (
        'catalog.productos.read',
        'Consultar productos para seleccionar sus categorías'
    ),
    (
        'catalog.categorias.read',
        'Consultar categorías de productos'
    ),
    (
        'catalog.servicios.read',
        'Consultar servicios'
    ),
    (
        'catalog.asignaciones_industria.read',
        'Consultar categorías y servicios asignados a industrias'
    ),
    (
        'catalog.asignaciones_industria.manage',
        'Asignar, ordenar, activar y retirar relaciones de industrias'
    );
-- Crea los permisos faltantes y reactiva los existentes.
INSERT INTO public.permisos (
        nombre,
        slug,
        grupo,
        descripcion,
        estado,
        eliminado_en
    )
SELECT slug,
    slug,
    'catalog',
    descripcion,
    'activo',
    NULL
FROM permisos_industrias ON CONFLICT (slug) DO
UPDATE
SET estado = 'activo',
    eliminado_en = NULL,
    actualizado_en = CURRENT_TIMESTAMP;
-- Asigna los permisos al rol o reactiva la asignación existente.
INSERT INTO public.rol_permiso (rol_id, permiso_id, estado)
SELECT r.id,
    p.id,
    'activo'
FROM public.roles r
    JOIN rol_destino_industrias d ON d.slug = r.slug
    CROSS JOIN permisos_industrias requerido
    JOIN public.permisos p ON p.slug = requerido.slug
WHERE r.estado = 'activo'
    AND r.eliminado_en IS NULL ON CONFLICT (rol_id, permiso_id) DO
UPDATE
SET estado = 'activo';
-- Comprobación: deben aparecer seis filas con ambos estados activos.
SELECT r.slug AS rol,
    p.slug AS permiso,
    p.estado AS estado_permiso,
    rp.estado AS estado_asignacion
FROM public.rol_permiso rp
    JOIN public.roles r ON r.id = rp.rol_id
    JOIN rol_destino_industrias d ON d.slug = r.slug
    JOIN public.permisos p ON p.id = rp.permiso_id
    JOIN permisos_industrias requerido ON requerido.slug = p.slug
ORDER BY p.slug;
COMMIT;