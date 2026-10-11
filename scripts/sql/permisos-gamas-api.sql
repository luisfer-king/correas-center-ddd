-- Entrega 4: alta idempotente de los códigos que exige la API.
-- No cambia permisos existentes, estados ni asignaciones de roles.
-- Ejecutar con el propietario de la BD; después asignar desde IAM a los roles adecuados.
BEGIN;
INSERT INTO public.permisos (nombre, slug, grupo, descripcion)
SELECT slug,
    slug,
    'catalog',
    descripcion
FROM (
        VALUES (
                'catalog.categorias.read',
                'Consultar categorías, gamas y plantillas'
            ),
            (
                'catalog.categorias.manage',
                'Gestionar categorías, gamas y plantillas'
            ),
            (
                'catalog.tipos_atributo.read',
                'Consultar grupos de atributos técnicos'
            ),
            (
                'catalog.tipos_atributo.manage',
                'Gestionar grupos de atributos técnicos'
            ),
            (
                'catalog.atributos_tecnicos.read',
                'Consultar definiciones de atributos técnicos'
            ),
            (
                'catalog.atributos_tecnicos.manage',
                'Gestionar definiciones de atributos técnicos'
            ),
            (
                'catalog.asignaciones_atributo.read',
                'Consultar valores generales de categoría'
            ),
            (
                'catalog.asignaciones_atributo.manage',
                'Gestionar valores generales de categoría'
            )
    ) AS nuevos(slug, descripcion) ON CONFLICT DO NOTHING;
COMMIT;
-- Revisar estado y asignaciones. Los códigos catalog.atributos.* antiguos se conservan,
-- pero no sustituyen catalog.atributos_tecnicos.* en el contrato vigente.
SELECT p.slug,
    p.estado,
    p.eliminado_en,
    r.slug AS rol,
    rp.estado AS estado_asignacion
FROM public.permisos p
    LEFT JOIN public.rol_permiso rp ON rp.permiso_id = p.id
    LEFT JOIN public.roles r ON r.id = rp.rol_id
WHERE p.slug LIKE 'catalog.categorias.%'
    OR p.slug LIKE 'catalog.tipos_atributo.%'
    OR p.slug LIKE 'catalog.atributos_tecnicos.%'
    OR p.slug LIKE 'catalog.asignaciones_atributo.%'
ORDER BY p.slug,
    r.slug;