-- Correas Center | carga inicial de gama Trapezoidales | 2026-10-11
-- Ejecutar TODO este archivo en PostgreSQL, con las entregas 1 a 5 de gamas aplicadas.
-- Destino comprobado: categoría 1, producto 1, slug correas/trapezoidales.
-- No cambia schema.prisma ni migraciones. No modifica otras categorías.
-- Repetir el archivo NO repone valores borrados ni sobrescribe cambios de Administración.
-- Si ya existe una gama con estructura, se detiene sin mezclar ni borrar sus datos.
-- Una gama vacía y activa puede reutilizarse. Todo se confirma en una transacción.
--
-- FUENTE TÉCNICA: Megadyne, V-BELTS Technical Handbook, EN 09.2023, PDF adjunto.
-- Referencia de PRESENTACIÓN (no de medidas):
-- https://www.pixtrans.es/products/industrial-belts/range/wrap/wrap-hexagonal-belts.php
-- Sección = nombre de fila. Seis columnas: ancho, espesor, ángulo, mínimo, máximo,
-- designación. Mínimo/máximo se agrupan bajo «Rango de longitudes catalogadas».
-- Longitudes en mm, sin conversiones de pulgadas ni equivalencias entre Li/Le/Lp.
-- Li = longitud interior; Le = exterior; Lp = primitiva (pitch).
-- Los extremos son el menor/mayor valor listado en la línea comercial citada;
-- NO son límites garantizados de fabricación, ni inventario, ni todas las tallas intermedias.
-- No se importan potencias, velocidades, temperaturas ni certificaciones como si fueran
-- universales para un perfil. Tampoco se crean enlaces públicos aún inexistentes.
--
-- DECISIONES DE EXTRACCIÓN:
-- A/B/C y SPZ/SPA: OLEOSTATIC GOLD; AX/BX/CX y XPZ/XPA: LINEA GOLD;
-- 3V/5V: OLEOSTATIC; AA/BB/CC: ESAFLEX. No se suman catálogos de distintas líneas.
-- AA/BB/CC: se transcriben las cotas de los DIBUJOS de p. impresa 112 (PDF 113):
-- 13.20 x 10.30 / 16.90 x 13.60 / 22.50 x 17.70 mm. Hay discrepancia con la
-- tabla general de p.111 (13x10 / 17x14 / 22x19). Confirmar con proveedor antes
-- de utilizarlas para selección dimensional; la discrepancia queda en cada fila.
-- 3VX y 5VX individuales: se crean las filas SIN celdas técnicas; el manual detalla
-- R3VX/R5VX PLURIBAND unidas (pp.119 y 123), que no se deben equiparar sin validación.
-- No se usan ceros ni textos «pendiente» dentro de campos numéricos.
--
-- PARA AMPLIAR: Administración > Catálogo > Categorías > Trapezoidales > Gama técnica.
-- Estructura: agregar filas/perfiles y columnas. Tabla técnica: completar sus valores.
-- El script no limita los perfiles permitidos. No hace falta volver a ejecutarlo.
-- La gama se propone como plantilla del producto 1 SOLO si aún no tiene una.
-- Registro de esta carga: auditoria.metadata.semilla = gamas-v-megadyne-2023-v1.

BEGIN;
SET LOCAL search_path TO public, pg_temp;
SET LOCAL lock_timeout = '10s';

DO $carga$
DECLARE
  v_categoria constant bigint := 1;
  v_producto constant bigint := 1;
  v_semilla constant text := 'gamas-v-megadyne-2023-v1';
  v_gama bigint;
  v_tipo bigint;
  v_atributo bigint;
  v_columna bigint;
  v_fila bigint;
  v_dimensiones bigint;
  v_longitudes bigint;
  v_columnas bigint[] := ARRAY[]::bigint[];
  v_numero numeric;
  v_orden integer := 0;
  v_cantidad integer;
  v_nueva boolean := false;
  v_version_anterior timestamptz;
  v_fecha timestamptz := date_trunc('milliseconds', clock_timestamp());
  v_i integer;
  r record;
BEGIN
  -- Serializa esta carga y evita que la edición concurrente cambie la estructura.
  PERFORM pg_advisory_xact_lock(20261011, 1);
  LOCK TABLE gamas_categoria, grupos_columnas_gama, grupos_filas_gama,
    columnas_gama, filas_gama, valores_gama, plantillas_gama_producto,
    tipo_atributo, atributos_tecnico IN SHARE ROW EXCLUSIVE MODE;

  PERFORM 1 FROM categorias c JOIN productos p ON p.id = c.producto_id
    WHERE c.id = v_categoria AND c.producto_id = v_producto
      AND c.slug = 'correas/trapezoidales'
      AND c.estado = 'activo' AND c.eliminado_en IS NULL
      AND p.estado = 'activo' AND p.eliminado_en IS NULL
    FOR UPDATE OF c, p;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Destino no coincide: se requiere categoría 1 activa, slug correas/trapezoidales, del producto 1 activo. No se insertó ningún dato.';
  END IF;

  SELECT id, actualizado_en INTO v_gama, v_version_anterior
    FROM gamas_categoria WHERE categoria_id = v_categoria;
  IF v_gama IS NOT NULL AND EXISTS (
    SELECT 1 FROM auditoria WHERE tabla_afectada = 'gamas_categoria'
      AND registro_id = v_gama::text AND metadata->>'semilla' = v_semilla
  ) THEN
    RAISE NOTICE 'Esta carga ya se aplicó a la gama %. Se conservan todos los cambios posteriores; no se insertó ni actualizó nada.', v_gama;
    RETURN;
  END IF;

  IF v_gama IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM gamas_categoria WHERE id = v_gama
      AND (estado <> 'activo' OR eliminado_en IS NOT NULL OR producto_id <> v_producto)) THEN
      RAISE EXCEPTION 'La gama existente no está activa o pertenece a otro producto. No se modifica.';
    END IF;
    IF EXISTS (SELECT 1 FROM columnas_gama WHERE gama_id = v_gama)
      OR EXISTS (SELECT 1 FROM filas_gama WHERE gama_id = v_gama)
      OR EXISTS (SELECT 1 FROM grupos_columnas_gama WHERE gama_id = v_gama)
      OR EXISTS (SELECT 1 FROM grupos_filas_gama WHERE gama_id = v_gama) THEN
      RAISE EXCEPTION 'La categoría ya tiene una gama con estructura (id %). Esta carga inicial no la sobrescribe. No se aplicó ningún cambio.', v_gama;
    END IF;
  ELSE
    INSERT INTO gamas_categoria (categoria_id, producto_id, titulo, descripcion, creado_en, actualizado_en)
      VALUES (v_categoria, v_producto, 'Gama de correas trapezoidales (V)',
        'Perfiles disponibles en Correas Center. Dimensiones y extremos de longitudes catalogadas según líneas de referencia Megadyne, manual EN 09.2023; no representan inventario ni disponibilidad de cada longitud. Li: interior; Le: exterior; Lp: primitiva. AA/BB/CC: cotas del dibujo, discrepantes con la tabla general; confirmar con proveedor. 3VX/5VX: ficha individual pendiente de validación.',
        v_fecha, v_fecha) RETURNING id INTO v_gama;
    v_nueva := true;
  END IF;

  SELECT id INTO v_tipo FROM tipo_atributo WHERE slug = 'gama-correas-v';
  IF v_tipo IS NULL THEN
    INSERT INTO tipo_atributo (nombre, slug, descripcion, permite_descripcion,
      permite_valor_numerico, permite_unidad_medida, orden, creado_en, actualizado_en)
    SELECT 'Gama de correas trapezoidales', 'gama-correas-v',
      'Definiciones para tablas comparativas por perfil. Los valores pertenecen a cada gama.',
      true, true, true, COALESCE(MAX(orden), 0) + 1, v_fecha, v_fecha
      FROM tipo_atributo WHERE estado <> 'eliminado'
    RETURNING id INTO v_tipo;
  ELSIF EXISTS (SELECT 1 FROM tipo_atributo WHERE id = v_tipo
    AND (estado <> 'activo' OR eliminado_en IS NOT NULL)) THEN
    RAISE EXCEPTION 'El tipo de atributo gama-correas-v existe pero no está activo.';
  END IF;

  INSERT INTO grupos_columnas_gama (gama_id, codigo, nombre, orden, creado_en, actualizado_en)
    VALUES (v_gama, 'dimensiones', 'Dimensiones de sección', 1, v_fecha, v_fecha)
    RETURNING id INTO v_dimensiones;
  INSERT INTO grupos_columnas_gama (gama_id, codigo, nombre, orden, creado_en, actualizado_en)
    VALUES (v_gama, 'longitudes-catalogadas', 'Rango de longitudes catalogadas', 2, v_fecha, v_fecha)
    RETURNING id INTO v_longitudes;

  FOR r IN SELECT * FROM (VALUES
    (1, 'Ancho superior', 'numero', 'mm', v_dimensiones,
      'Ancho a indicado por el fabricante; en doble V se usa el ancho indicado en el dibujo.'),
    (2, 'Espesor', 'numero', 'mm', v_dimensiones, 'Altura total de la sección según el dibujo.'),
    (3, 'Ángulo', 'numero', '°', v_dimensiones, 'Ángulo de sección del dibujo; no es una especificación universal de polea.'),
    (4, 'Longitud mínima catalogada', 'numero', 'mm', v_longitudes,
      'Menor longitud listada en la línea y edición citadas. Consultar su designación.'),
    (5, 'Longitud máxima catalogada', 'numero', 'mm', v_longitudes,
      'Mayor longitud listada en la línea y edición citadas. No garantiza tallas intermedias.'),
    (6, 'Designación de longitud', 'texto', NULL, NULL::bigint,
      'Li = interior; Le = exterior; Lp = primitiva. No intercambiar ni convertir sin datos del fabricante.')
  ) AS d(orden, nombre, tipo, unidad, grupo, descripcion) ORDER BY orden
  LOOP
    SELECT count(*), min(id) INTO v_cantidad, v_atributo FROM atributos_tecnico
      WHERE tipo_atributo_id = v_tipo AND nombre = r.nombre;
    IF v_cantidad > 1 THEN
      RAISE EXCEPTION 'Hay atributos duplicados para %. Revisar antes de cargar.', r.nombre;
    END IF;
    IF v_atributo IS NULL THEN
      INSERT INTO atributos_tecnico (tipo_atributo_id, nombre, descripcion, tipo_dato,
        unidad_medida, orden, creado_en, actualizado_en)
      SELECT v_tipo, r.nombre, r.descripcion, r.tipo::enum_tipo_dato_atributo, r.unidad,
        COALESCE(MAX(orden), 0) + 1, v_fecha, v_fecha
        FROM atributos_tecnico WHERE tipo_atributo_id = v_tipo AND estado <> 'eliminado'
      RETURNING id INTO v_atributo;
    ELSIF EXISTS (SELECT 1 FROM atributos_tecnico WHERE id = v_atributo
      AND (tipo_dato::text <> r.tipo OR estado <> 'activo' OR eliminado_en IS NOT NULL)) THEN
      RAISE EXCEPTION 'Atributo % incompatible o inactivo. No se alteró su definición.', r.nombre;
    END IF;
    INSERT INTO columnas_gama (gama_id, atributo_id, tipo_dato, grupo_id, etiqueta,
      unidad_medida, orden, creado_en, actualizado_en)
      VALUES (v_gama, v_atributo, r.tipo::enum_tipo_dato_atributo, r.grupo, r.nombre,
        r.unidad, r.orden, v_fecha, v_fecha) RETURNING id INTO v_columna;
    v_columnas := array_append(v_columnas, v_columna);
  END LOOP;

  -- PERFIL | ANCHO | ESPESOR | ÁNGULO | MÍNIMO | MÁXIMO | DESIGNACIÓN | TRAZABILIDAD
  -- Orden de filas: el solicitado; códigos internos en minúscula y nombres visibles en mayúscula.
  FOR r IN SELECT * FROM (VALUES
    ( 1, 'A',   13.00,  8.00, 40,  457,  5477, 'Li', 'OLEOSTATIC GOLD. Clásica revestida. P. impresa 32 / PDF 33.'),
    ( 2, 'AX',  13.00,  8.00, 40,  585,  4620, 'Le', 'LINEA GOLD. Clásica de flancos abiertos. P. impresa 80 / PDF 81.'),
    ( 3, 'AA',  13.20, 10.30, 40, 1350,  4195, 'Lp', 'ESAFLEX. Doble V. Dibujo p.112 / PDF 113: 13.20 x 10.30 mm; tabla p.111: 13 x 10 mm. Discrepancia: confirmar con proveedor.'),
    ( 4, 'B',   17.00, 11.00, 40,  570, 16992, 'Li', 'OLEOSTATIC GOLD. Clásica revestida. P. impresa 36 / PDF 37.'),
    ( 5, 'BX',  17.00, 11.00, 40,  785,  4930, 'Le', 'LINEA GOLD. Clásica de flancos abiertos. P. impresa 82 / PDF 83.'),
    ( 6, 'BB',  16.90, 13.60, 40, 1345,  6895, 'Lp', 'ESAFLEX. Doble V. Dibujo p.112 / PDF 113: 16.90 x 13.60 mm; tabla p.111: 17 x 14 mm. Discrepancia: confirmar con proveedor.'),
    ( 7, 'C',   22.00, 14.00, 40,  858, 10733, 'Li', 'OLEOSTATIC GOLD. Clásica revestida. P. impresa 40 / PDF 41.'),
    ( 8, 'CX',  22.00, 14.00, 40, 1400,  4680, 'Le', 'LINEA GOLD. Clásica de flancos abiertos. P. impresa 84 / PDF 85.'),
    ( 9, 'CC',  22.50, 17.70, 40, 2160, 10720, 'Lp', 'ESAFLEX. Doble V. Dibujo p.112 / PDF 113: 22.50 x 17.70 mm; tabla p.111: 22 x 19 mm. Discrepancia: confirmar con proveedor.'),
    (10, 'SPZ',  9.70,  8.00, 38,  500,  3563, 'Le', 'OLEOSTATIC GOLD. Estrecha revestida DIN. P. impresa 56 / PDF 57. Longitudes exteriores Le, no el número del código comercial.'),
    (11, 'XPZ',  9.70,  8.00, 38,  525,  3563, 'Le', 'LINEA GOLD. Estrecha de flancos abiertos DIN. P. impresa 90 / PDF 91.'),
    (12, 'SPA', 12.70, 10.00, 38,  675,  4768, 'Le', 'OLEOSTATIC GOLD. Estrecha revestida DIN. P. impresa 60 / PDF 61. Longitudes exteriores Le, no el número del código comercial.'),
    (13, 'XPA', 12.70, 10.00, 38,  685,  4518, 'Le', 'LINEA GOLD. Estrecha de flancos abiertos DIN. P. impresa 94 / PDF 95.'),
    (14, '3V',   9.00,  8.00, 38,  635,  3810, 'Le', 'OLEOSTATIC. Estrecha revestida ARPM. P. impresa 72 / PDF 73.'),
    (15, '3VX',  NULL,  NULL, NULL, NULL, NULL, NULL, 'Perfil indicado por Correas Center. Datos de la versión individual pendientes de validación: el manual describe R3VX PLURIBAND unida, pp.119 y 123 / PDF 120 y 124. No se trasladan sus medidas.'),
    (16, '5V',  15.00, 13.00, 38, 1270,  9000, 'Le', 'OLEOSTATIC. Estrecha revestida ARPM. P. impresa 74 / PDF 75.'),
    (17, '5VX',  NULL,  NULL, NULL, NULL, NULL, NULL, 'Perfil indicado por Correas Center. Datos de la versión individual pendientes de validación: el manual describe R5VX PLURIBAND unida, pp.119 y 123 / PDF 120 y 124. No se trasladan sus medidas.')
  ) AS d(orden, perfil, ancho, espesor, angulo, minimo, maximo, designacion, fuente)
    ORDER BY orden
  LOOP
    INSERT INTO filas_gama (gama_id, codigo, nombre, descripcion, orden, creado_en, actualizado_en)
      VALUES (v_gama, lower(r.perfil), r.perfil,
        r.fuente || ' Fuente: Megadyne V-BELTS Technical Handbook EN 09.2023.',
        r.orden, v_fecha, v_fecha) RETURNING id INTO v_fila;
    FOR v_i IN 1..5 LOOP
      v_numero := (ARRAY[r.ancho, r.espesor, r.angulo, r.minimo, r.maximo])[v_i];
      IF v_numero IS NOT NULL THEN
        INSERT INTO valores_gama (fila_id, columna_id, gama_id, tipo_dato, valor_numero, creado_en, actualizado_en)
          VALUES (v_fila, v_columnas[v_i], v_gama, 'numero', v_numero, v_fecha, v_fecha);
      END IF;
    END LOOP;
    IF r.designacion IS NOT NULL THEN
      INSERT INTO valores_gama (fila_id, columna_id, gama_id, tipo_dato, valor_texto, creado_en, actualizado_en)
        VALUES (v_fila, v_columnas[6], v_gama, 'texto', r.designacion, v_fecha, v_fecha);
    END IF;
    v_orden := v_orden + 1;
  END LOOP;

  -- Respeta la referencia de plantilla ya elegida para el producto.
  INSERT INTO plantillas_gama_producto (producto_id, gama_id, creado_en, actualizado_en)
    VALUES (v_producto, v_gama, v_fecha, v_fecha)
    ON CONFLICT (producto_id) DO NOTHING;

  -- Versión compatible con la concurrencia optimista de la API (precisión de milisegundos).
  UPDATE gamas_categoria SET actualizado_en = GREATEST(
    date_trunc('milliseconds', clock_timestamp()),
    date_trunc('milliseconds', actualizado_en) + interval '1 millisecond')
    WHERE id = v_gama;

  INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_nuevos, metadata)
    VALUES (NULL, CASE WHEN v_nueva THEN 'Creación'::enum_accion_auditoria ELSE 'Edición'::enum_accion_auditoria END,
      'gamas_categoria', v_gama::text,
      jsonb_build_object('categoriaId', v_categoria::text, 'productoId', v_producto::text,
        'filas', v_orden, 'columnas', 6, 'valores', 90),
      jsonb_build_object('semilla', v_semilla, 'origen', 'SQL manual solicitado',
        'fuente', 'Megadyne V-BELTS Technical Handbook EN 09.2023',
        'perfilesPendientes', jsonb_build_array('3VX', '5VX'),
        'cotasDiscrepantes', jsonb_build_array('AA', 'BB', 'CC'),
        'versionAnterior', v_version_anterior));
  RAISE NOTICE 'OK: gama %, categoría %, 17 perfiles, 6 columnas, 90 valores. 3VX/5VX quedan sin valores técnicos hasta su validación.', v_gama, v_categoria;
END;
$carga$;

COMMIT;

-- Resultado de lectura: si ya editaste la gama, muestra los valores actuales.
SELECT g.id AS gama_id, g.categoria_id, f.orden, f.nombre AS seccion,
  max(v.valor_numero) FILTER (WHERE a.nombre = 'Ancho superior') AS ancho_mm,
  max(v.valor_numero) FILTER (WHERE a.nombre = 'Espesor') AS espesor_mm,
  max(v.valor_numero) FILTER (WHERE a.nombre = 'Ángulo') AS angulo_grados,
  max(v.valor_numero) FILTER (WHERE a.nombre = 'Longitud mínima catalogada') AS longitud_min_mm,
  max(v.valor_numero) FILTER (WHERE a.nombre = 'Longitud máxima catalogada') AS longitud_max_mm,
  max(v.valor_texto) FILTER (WHERE a.nombre = 'Designación de longitud') AS designacion,
  f.descripcion AS fuente_y_observaciones
FROM public.gamas_categoria g
JOIN public.filas_gama f ON f.gama_id = g.id AND f.estado <> 'eliminado'
LEFT JOIN public.valores_gama v ON v.fila_id = f.id AND v.gama_id = g.id
LEFT JOIN public.columnas_gama c ON c.id = v.columna_id AND c.estado <> 'eliminado'
LEFT JOIN public.atributos_tecnico a ON a.id = c.atributo_id
WHERE g.categoria_id = 1
GROUP BY g.id, g.categoria_id, f.id, f.orden, f.nombre, f.descripcion
ORDER BY f.orden;
