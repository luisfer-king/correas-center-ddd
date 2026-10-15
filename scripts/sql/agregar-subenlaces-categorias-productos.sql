-- Entrega 5 | subenlaces de categorías existentes a menús de su propio producto.
-- Ejecutar TODO el archivo. Cambiar v_empresa_id si tu empresa no es la 1.
-- No crea categorías ni padres; no modifica cargar_submenu.
-- Conserva subenlaces existentes incluso inactivos/eliminados y no los reactiva.
-- Agrega al final en orden de categoría, sin sustituir órdenes o rutas editados.
-- En el respaldo recibido: 15 menús de producto, 64 categorías, 4 vínculos;
-- resultado previsto: 60 vínculos nuevos, si esos datos no cambiaron.
BEGIN;
LOCK TABLE public.menus, public.menu_item IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.productos, public.categorias IN SHARE MODE;
DO $subenlaces$
DECLARE
  v_empresa_id bigint := 1;
  v_secuencia regclass;
  v_max bigint;
  v_actual bigint;
  v_llamada boolean;
  v_insertadas integer;
BEGIN
  PERFORM pg_advisory_xact_lock(20261013,5);
  IF NOT EXISTS (SELECT 1 FROM public.productos WHERE empresa_id=v_empresa_id AND estado='activo' AND eliminado_en IS NULL) THEN
    RAISE EXCEPTION 'No hay productos activos para la empresa seleccionada';
  END IF;
  v_secuencia:=pg_get_serial_sequence('public.menu_item','id')::regclass;
  IF v_secuencia IS NULL THEN RAISE EXCEPTION 'menu_item.id no tiene secuencia asociada'; END IF;
  SELECT COALESCE(MAX(id),0) INTO v_max FROM public.menu_item;
  EXECUTE format('SELECT last_value,is_called FROM %s',v_secuencia) INTO v_actual,v_llamada;
  IF v_max>v_actual OR (v_max=v_actual AND NOT v_llamada) THEN PERFORM setval(v_secuencia,v_max,true); END IF;
  IF EXISTS (
    SELECT 1 FROM public.menus m JOIN public.productos p ON p.id=m.registro_id JOIN public.categorias c ON c.producto_id=p.id
    WHERE m.empresa_id=v_empresa_id AND p.empresa_id=v_empresa_id AND m.tipo_registro='producto'
      AND m.estado='activo' AND m.eliminado_en IS NULL AND p.estado='activo' AND p.eliminado_en IS NULL AND c.estado='activo' AND c.eliminado_en IS NULL
      AND (p.slug !~ '^[a-zA-Z0-9_-]+$' OR c.slug !~ '^[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*$')
  ) THEN RAISE EXCEPTION 'Hay slugs no compatibles con las rutas; revisar antes de importar'; END IF;
  WITH candidatos AS (
    SELECT m.id AS menu_id,c.id AS categoria_id,c.nombre,c.orden,
      '/products/'||p.slug||'/'||CASE WHEN left(c.slug,length(p.slug)+1)=p.slug||'/' THEN substring(c.slug FROM length(p.slug)+2) ELSE c.slug END||'/' AS ruta
    FROM public.menus m JOIN public.productos p ON p.id=m.registro_id JOIN public.categorias c ON c.producto_id=p.id
    WHERE m.empresa_id=v_empresa_id AND p.empresa_id=v_empresa_id AND m.tipo_registro='producto'
      AND m.estado='activo' AND m.eliminado_en IS NULL AND p.estado='activo' AND p.eliminado_en IS NULL AND c.estado='activo' AND c.eliminado_en IS NULL
  ), faltantes AS (
    SELECT c.* FROM candidatos c WHERE NOT EXISTS (
      SELECT 1 FROM public.menu_item i WHERE i.menu_id=c.menu_id AND
        (i.categoria_id=c.categoria_id OR rtrim(i.ruta,'/')=rtrim(c.ruta,'/'))
    )
  ), numerados AS (
    SELECT f.*,COALESCE((SELECT MAX(i.orden) FROM public.menu_item i WHERE i.menu_id=f.menu_id AND i.eliminado_en IS NULL),0)
      +row_number() OVER(PARTITION BY f.menu_id ORDER BY f.orden,f.categoria_id) AS nuevo_orden FROM faltantes f
  )
  INSERT INTO public.menu_item(menu_id,categoria_id,nombre,ruta,orden,estado,eliminado_en,creado_en,actualizado_en)
    SELECT menu_id,categoria_id,nombre,ruta,nuevo_orden::integer,'activo',NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM numerados ORDER BY menu_id,nuevo_orden;
  GET DIAGNOSTICS v_insertadas=ROW_COUNT;
  RAISE NOTICE 'Subenlaces agregados: %. Los registros previos se conservaron.',v_insertadas;
END
$subenlaces$;
COMMIT;
