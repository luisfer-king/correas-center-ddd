BEGIN;
LOCK TABLE public.menu_item IN ACCESS EXCLUSIVE MODE;

-- La migración anterior ya agregó nombre. No se agrega de nuevo.
ALTER TABLE public.menu_item ADD COLUMN categoria_id BIGINT;

-- Evita truncar nombres existentes al ajustar el límite del formulario.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.menu_item WHERE CHAR_LENGTH(nombre) > 255) THEN
    RAISE EXCEPTION 'Hay nombres de menu_item de más de 255 caracteres. Revísalos antes de aplicar esta migración.';
  END IF;
END;
$$;
ALTER TABLE public.menu_item ALTER COLUMN nombre TYPE VARCHAR(255);
ALTER TABLE public.menu_item ALTER COLUMN orden SET DEFAULT 1;

-- Completar únicamente nombres vacíos; conservar los nombres personalizados.
UPDATE public.menu_item
SET nombre = LEFT(COALESCE(NULLIF(INITCAP(REPLACE(REGEXP_REPLACE(TRIM(BOTH '/' FROM ruta), '^.*/', ''), '-', ' ')), ''), 'Ítem ' || id::text), 255)
WHERE nombre IS NULL OR BTRIM(nombre) = '';
ALTER TABLE public.menu_item ALTER COLUMN nombre SET NOT NULL;

-- Retirar solo el índice de esta funcionalidad para permitir la normalización.
DROP INDEX IF EXISTS public.menu_item_menu_orden_vigente_key;
WITH posiciones AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY menu_id ORDER BY orden, id)::integer AS nuevo_orden
  FROM public.menu_item WHERE eliminado_en IS NULL
)
UPDATE public.menu_item AS item SET orden = posiciones.nuevo_orden
FROM posiciones WHERE item.id = posiciones.id;
UPDATE public.menu_item SET orden = GREATEST(1, COALESCE(orden, 1)) WHERE eliminado_en IS NOT NULL;

-- Permite posiciones negativas temporales durante el intercambio transaccional.
CREATE UNIQUE INDEX menu_item_menu_orden_vigente_key
ON public.menu_item (menu_id, orden) WHERE eliminado_en IS NULL AND orden > 0;
COMMIT;
