-- Entrega 5 | reparación del conflicto de creación en Configuración del sitio.
-- Ejecutar el archivo completo. No modifica registros ni sus IDs.
-- Respeta una secuencia que ya esté por delante del máximo y puede repetirse.
BEGIN;
LOCK TABLE public.configuracion_sitio IN SHARE ROW EXCLUSIVE MODE;
DO $reparar$
DECLARE
  v_secuencia regclass;
  v_max bigint;
  v_actual bigint;
  v_llamada boolean;
BEGIN
  v_secuencia := pg_get_serial_sequence('public.configuracion_sitio','id')::regclass;
  IF v_secuencia IS NULL THEN RAISE EXCEPTION 'configuracion_sitio.id no tiene secuencia asociada'; END IF;
  SELECT COALESCE(MAX(id),0) INTO v_max FROM public.configuracion_sitio;
  EXECUTE format('SELECT last_value, is_called FROM %s',v_secuencia) INTO v_actual,v_llamada;
  IF v_max > v_actual OR (v_max = v_actual AND NOT v_llamada) THEN
    PERFORM setval(v_secuencia,v_max,true);
    RAISE NOTICE 'Secuencia reparada. Siguiente ID: %',v_max+1;
  ELSE
    RAISE NOTICE 'Secuencia ya consistente; no se modificó';
  END IF;
END
$reparar$;
COMMIT;
