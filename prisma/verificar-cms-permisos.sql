-- Diagnóstico solamente: no crea ni modifica permisos o asignaciones.
SELECT r.id AS rol_id,
    r.slug AS rol,
    r.estado AS estado_rol,
    p.id AS permiso_id,
    p.slug AS permiso,
    p.estado AS estado_permiso,
    rp.estado AS estado_asignacion
FROM public.roles r
    JOIN public.rol_permiso rp ON rp.rol_id = r.id
    JOIN public.permisos p ON p.id = rp.permiso_id
WHERE p.slug LIKE 'cms.%'
ORDER BY r.id,
    p.slug;