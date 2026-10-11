-- Completa SOLO 3VX y 5VX de la gama de categoría 1 (correas/trapezoidales).
-- Requiere la carga inicial ya aplicada. Copiar y ejecutar TODO el archivo.
-- Fuente oficial consultada 2026-10-11: Megadyne DYNAMIC-X, pp. 6 y 7:
-- https://megadynegroup.com/files/resources/attachments/md_broc_v-belts_dynamic-x_am-en_230712_web_2.pdf
-- 3VX: 0.38 x 0.31 pulgadas, 38 grados, Le 25–150 pulgadas.
-- 5VX: 0.63 x 0.53 pulgadas, 38 grados, Le 45–190 pulgadas (EPDM).
-- Conversión aritmética: 1 pulgada = 25.4 mm. Los decimales convertidos no
-- representan una tolerancia de fabricación más precisa que la fuente.
-- El catálogo también lista 5VX2000 (200 pulgadas), pero SOLO en cloropreno
-- UNIMATCH; se excluye del máximo de DYNAMIC-X EPDM para no mezclar materiales.
-- Estos son extremos catalogados, no existencias ni garantía de todas las tallas.
-- Transaccional e idempotente: al repetir no duplica ni repone ediciones posteriores.
-- Si hay valores distintos ya registrados o cambió la estructura/unidad, aborta.
BEGIN;
SET LOCAL search_path TO public, pg_temp;
SET LOCAL lock_timeout = '10s';
DO $carga$
DECLARE
  g bigint; f bigint; c bigint; n integer; r record; d record;
  fecha timestamptz := date_trunc('milliseconds', clock_timestamp());
  marca constant text := 'completar-3vx-5vx-dynamic-x-v1';
  fuente constant text := 'Megadyne DYNAMIC-X EPDM, folleto oficial pp.6–7. https://megadynegroup.com/files/resources/attachments/md_broc_v-belts_dynamic-x_am-en_230712_web_2.pdf';
BEGIN
  PERFORM pg_advisory_xact_lock(20261011, 1);
  LOCK TABLE gamas_categoria, filas_gama, columnas_gama, valores_gama,
    atributos_tecnico IN SHARE ROW EXCLUSIVE MODE;
  SELECT ga.id INTO g FROM gamas_categoria ga JOIN categorias ca ON ca.id=ga.categoria_id
    WHERE ca.id=1 AND ca.producto_id=1 AND ca.slug='correas/trapezoidales'
      AND ca.estado='activo' AND ga.estado='activo' AND ga.eliminado_en IS NULL;
  IF g IS NULL THEN RAISE EXCEPTION 'No se encontró la gama activa de Trapezoidales, categoría 1. Aplicar primero la carga inicial.'; END IF;
  IF EXISTS (SELECT 1 FROM auditoria WHERE tabla_afectada='gamas_categoria'
    AND registro_id=g::text AND metadata->>'semilla'=marca) THEN
    RAISE NOTICE '3VX/5VX ya completadas. Se conservan las ediciones posteriores.'; RETURN;
  END IF;
  FOR r IN SELECT * FROM (VALUES
    ('3vx', 9.652::numeric, 7.874::numeric, 635::numeric, 3810::numeric,
      'Perfil individual 3VX. Cotas originales 0.38 x 0.31 pulgadas; longitudes exteriores 25–150 pulgadas.'),
    ('5vx', 16.002::numeric, 13.462::numeric, 1143::numeric, 4826::numeric,
      'Perfil individual 5VX. Cotas originales 0.63 x 0.53 pulgadas; longitudes exteriores 45–190 pulgadas. Se excluye 5VX2000 (200 pulgadas): la fuente lo ofrece solo en cloropreno UNIMATCH, no EPDM.')
  ) AS perfiles(codigo, ancho, espesor, minimo, maximo, nota)
  LOOP
    SELECT id INTO f FROM filas_gama WHERE gama_id=g AND codigo=r.codigo AND estado='activo';
    IF f IS NULL THEN RAISE EXCEPTION 'Falta la fila activa %. No se recrea una fila eliminada.',r.codigo; END IF;
    FOR d IN SELECT * FROM (VALUES
      ('Ancho superior','numero','mm',r.ancho,NULL::text),
      ('Espesor','numero','mm',r.espesor,NULL::text),
      ('Ángulo','numero','°',38::numeric,NULL::text),
      ('Longitud mínima catalogada','numero','mm',r.minimo,NULL::text),
      ('Longitud máxima catalogada','numero','mm',r.maximo,NULL::text),
      ('Designación de longitud','texto',NULL,NULL::numeric,'Le')
    ) AS campos(nombre,tipo,unidad,numero,texto)
    LOOP
      SELECT count(*),min(co.id) INTO n,c FROM columnas_gama co
        JOIN atributos_tecnico a ON a.id=co.atributo_id
        WHERE co.gama_id=g AND co.estado='activo' AND a.estado='activo'
          AND a.nombre=d.nombre AND co.tipo_dato::text=d.tipo
          AND co.unidad_medida IS NOT DISTINCT FROM d.unidad;
      IF n<>1 THEN RAISE EXCEPTION 'Columna % ausente, duplicada o con tipo/unidad diferente.', d.nombre; END IF;
      IF EXISTS (SELECT 1 FROM valores_gama WHERE fila_id=f AND columna_id=c
        AND (tipo_dato::text<>d.tipo OR valor_numero IS DISTINCT FROM d.numero
          OR valor_texto IS DISTINCT FROM d.texto OR valor_booleano IS NOT NULL)) THEN
        RAISE EXCEPTION 'Ya hay un valor diferente para % / %. No se sobrescribe.',r.codigo,d.nombre;
      END IF;
      INSERT INTO valores_gama(fila_id,columna_id,gama_id,tipo_dato,valor_numero,valor_texto,creado_en,actualizado_en)
        VALUES(f,c,g,d.tipo::enum_tipo_dato_atributo,d.numero,d.texto,fecha,fecha)
        ON CONFLICT(fila_id,columna_id) DO NOTHING;
    END LOOP;
    UPDATE filas_gama SET descripcion=r.nota || ' ' || fuente,
      actualizado_en=GREATEST(fecha,date_trunc('milliseconds',actualizado_en)+interval '1 millisecond') WHERE id=f;
  END LOOP;
  UPDATE gamas_categoria SET
    descripcion=replace(descripcion,'3VX/5VX: ficha individual pendiente de validación.',
      '3VX/5VX: Megadyne DYNAMIC-X EPDM, folleto oficial pp.6–7; cotas convertidas de pulgadas a mm.'),
    actualizado_en=GREATEST(fecha,date_trunc('milliseconds',actualizado_en)+interval '1 millisecond') WHERE id=g;
  INSERT INTO auditoria(accion,tabla_afectada,registro_id,datos_nuevos,metadata)
    VALUES('Edición','gamas_categoria',g::text,
      jsonb_build_object('perfiles',jsonb_build_array('3VX','5VX'),'celdasCompletadas',12),
      jsonb_build_object('semilla',marca,'fuente',fuente,'origen','SQL manual solicitado'));
  RAISE NOTICE 'OK: 3VX y 5VX completadas (12 celdas). Los otros 15 perfiles se conservan.';
END;
$carga$;
COMMIT;
SELECT f.nombre AS perfil,c.etiqueta,c.unidad_medida,v.valor_numero,v.valor_texto
FROM public.gamas_categoria g JOIN public.filas_gama f ON f.gama_id=g.id
JOIN public.valores_gama v ON v.fila_id=f.id JOIN public.columnas_gama c ON c.id=v.columna_id
WHERE g.categoria_id=1 AND f.codigo IN ('3vx','5vx') AND f.estado='activo'
ORDER BY f.orden,c.orden;
