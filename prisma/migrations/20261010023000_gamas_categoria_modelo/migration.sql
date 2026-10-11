-- Entrega 1: ampliación aditiva; no modifica migraciones aplicadas.
BEGIN;
SET LOCAL search_path TO public;

-- CreateEnum
CREATE TYPE "enum_tipo_dato_atributo" AS ENUM ('texto', 'numero', 'booleano');

-- DropForeignKey
ALTER TABLE "categoria_atributo" DROP CONSTRAINT "categoria_atributo_atributo_id_fkey";

-- AlterTable
ALTER TABLE "atributos_tecnico" ADD COLUMN     "tipo_dato" "enum_tipo_dato_atributo" NOT NULL DEFAULT 'numero';

-- AlterTable
ALTER TABLE "categoria_atributo" ADD COLUMN     "tipo_dato" "enum_tipo_dato_atributo" NOT NULL DEFAULT 'numero',
ADD COLUMN     "valor_booleano" BOOLEAN,
ADD COLUMN     "valor_texto" TEXT;

-- CreateTable
CREATE TABLE "gamas_categoria" (
    "id" BIGSERIAL NOT NULL,
    "categoria_id" BIGINT NOT NULL,
    "producto_id" BIGINT NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "imagen" VARCHAR(2048),
    "gama_origen_id" BIGINT,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gamas_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantillas_gama_producto" (
    "producto_id" BIGINT NOT NULL,
    "gama_id" BIGINT NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plantillas_gama_producto_pkey" PRIMARY KEY ("producto_id")
);

-- CreateTable
CREATE TABLE "grupos_columnas_gama" (
    "id" BIGSERIAL NOT NULL,
    "gama_id" BIGINT NOT NULL,
    "codigo" VARCHAR(80) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "orden" INTEGER NOT NULL,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupos_columnas_gama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos_filas_gama" (
    "id" BIGSERIAL NOT NULL,
    "gama_id" BIGINT NOT NULL,
    "codigo" VARCHAR(80) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "orden" INTEGER NOT NULL,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupos_filas_gama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "columnas_gama" (
    "id" BIGSERIAL NOT NULL,
    "gama_id" BIGINT NOT NULL,
    "atributo_id" BIGINT NOT NULL,
    "tipo_dato" "enum_tipo_dato_atributo" NOT NULL,
    "grupo_id" BIGINT,
    "etiqueta" VARCHAR(255),
    "unidad_medida" VARCHAR(80),
    "orden" INTEGER NOT NULL,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "columnas_gama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filas_gama" (
    "id" BIGSERIAL NOT NULL,
    "gama_id" BIGINT NOT NULL,
    "grupo_id" BIGINT,
    "codigo" VARCHAR(80) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "enlace_detalle" VARCHAR(2048),
    "orden" INTEGER NOT NULL,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "filas_gama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valores_gama" (
    "fila_id" BIGINT NOT NULL,
    "columna_id" BIGINT NOT NULL,
    "gama_id" BIGINT NOT NULL,
    "tipo_dato" "enum_tipo_dato_atributo" NOT NULL,
    "valor_texto" TEXT,
    "valor_numero" DECIMAL,
    "valor_booleano" BOOLEAN,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valores_gama_pkey" PRIMARY KEY ("fila_id","columna_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gamas_categoria_categoria_id_key" ON "gamas_categoria"("categoria_id");

-- CreateIndex
CREATE INDEX "gamas_categoria_producto_id_estado_idx" ON "gamas_categoria"("producto_id", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "gamas_categoria_categoria_id_producto_id_key" ON "gamas_categoria"("categoria_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "gamas_categoria_id_producto_id_key" ON "gamas_categoria"("id", "producto_id");

-- CreateIndex
CREATE INDEX "grupos_columnas_gama_gama_id_estado_orden_idx" ON "grupos_columnas_gama"("gama_id", "estado", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "grupos_columnas_gama_id_gama_id_key" ON "grupos_columnas_gama"("id", "gama_id");

-- CreateIndex
CREATE INDEX "grupos_filas_gama_gama_id_estado_orden_idx" ON "grupos_filas_gama"("gama_id", "estado", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "grupos_filas_gama_id_gama_id_key" ON "grupos_filas_gama"("id", "gama_id");

-- CreateIndex
CREATE INDEX "columnas_gama_gama_id_estado_orden_idx" ON "columnas_gama"("gama_id", "estado", "orden");

-- CreateIndex
CREATE INDEX "columnas_gama_atributo_id_idx" ON "columnas_gama"("atributo_id");

-- CreateIndex
CREATE UNIQUE INDEX "columnas_gama_id_gama_id_tipo_dato_key" ON "columnas_gama"("id", "gama_id", "tipo_dato");

-- CreateIndex
CREATE INDEX "filas_gama_gama_id_estado_orden_idx" ON "filas_gama"("gama_id", "estado", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "filas_gama_id_gama_id_key" ON "filas_gama"("id", "gama_id");

-- CreateIndex
CREATE INDEX "valores_gama_columna_id_gama_id_tipo_dato_idx" ON "valores_gama"("columna_id", "gama_id", "tipo_dato");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_id_producto_gama_key" ON "categorias"("id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "atributos_tecnico_id_tipo_dato_key" ON "atributos_tecnico"("id", "tipo_dato");

-- AddForeignKey
ALTER TABLE "categoria_atributo" ADD CONSTRAINT "categoria_atributo_atributo_id_tipo_dato_fkey" FOREIGN KEY ("atributo_id", "tipo_dato") REFERENCES "atributos_tecnico"("id", "tipo_dato") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamas_categoria" ADD CONSTRAINT "gamas_categoria_categoria_id_producto_id_fkey" FOREIGN KEY ("categoria_id", "producto_id") REFERENCES "categorias"("id", "producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gamas_categoria" ADD CONSTRAINT "gamas_categoria_gama_origen_id_producto_id_fkey" FOREIGN KEY ("gama_origen_id", "producto_id") REFERENCES "gamas_categoria"("id", "producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantillas_gama_producto" ADD CONSTRAINT "plantillas_gama_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plantillas_gama_producto" ADD CONSTRAINT "plantillas_gama_producto_gama_id_producto_id_fkey" FOREIGN KEY ("gama_id", "producto_id") REFERENCES "gamas_categoria"("id", "producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupos_columnas_gama" ADD CONSTRAINT "grupos_columnas_gama_gama_id_fkey" FOREIGN KEY ("gama_id") REFERENCES "gamas_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupos_filas_gama" ADD CONSTRAINT "grupos_filas_gama_gama_id_fkey" FOREIGN KEY ("gama_id") REFERENCES "gamas_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "columnas_gama" ADD CONSTRAINT "columnas_gama_gama_id_fkey" FOREIGN KEY ("gama_id") REFERENCES "gamas_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "columnas_gama" ADD CONSTRAINT "columnas_gama_atributo_id_tipo_dato_fkey" FOREIGN KEY ("atributo_id", "tipo_dato") REFERENCES "atributos_tecnico"("id", "tipo_dato") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "columnas_gama" ADD CONSTRAINT "columnas_gama_grupo_id_gama_id_fkey" FOREIGN KEY ("grupo_id", "gama_id") REFERENCES "grupos_columnas_gama"("id", "gama_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "filas_gama" ADD CONSTRAINT "filas_gama_gama_id_fkey" FOREIGN KEY ("gama_id") REFERENCES "gamas_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "filas_gama" ADD CONSTRAINT "filas_gama_grupo_id_gama_id_fkey" FOREIGN KEY ("grupo_id", "gama_id") REFERENCES "grupos_filas_gama"("id", "gama_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "valores_gama" ADD CONSTRAINT "valores_gama_fila_id_gama_id_fkey" FOREIGN KEY ("fila_id", "gama_id") REFERENCES "filas_gama"("id", "gama_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "valores_gama" ADD CONSTRAINT "valores_gama_columna_id_gama_id_tipo_dato_fkey" FOREIGN KEY ("columna_id", "gama_id", "tipo_dato") REFERENCES "columnas_gama"("id", "gama_id", "tipo_dato") ON DELETE NO ACTION ON UPDATE CASCADE;


-- Invariantes no expresables completamente en schema.prisma.
ALTER TABLE atributos_tecnico ADD CONSTRAINT atributo_valor_heredado_tipo_check
  CHECK (valor_numerico IS NULL OR (tipo_dato = 'numero' AND valor_numerico::text NOT IN ('NaN', 'Infinity', '-Infinity')));
ALTER TABLE categoria_atributo ADD CONSTRAINT categoria_atributo_valor_tipo_check CHECK (
  num_nonnulls(valor_personalizado, valor_texto, valor_booleano) <= 1 AND
  (valor_personalizado IS NULL OR (tipo_dato = 'numero' AND valor_personalizado::text NOT IN ('NaN', 'Infinity', '-Infinity'))) AND
  (valor_texto IS NULL OR tipo_dato = 'texto') AND
  (valor_booleano IS NULL OR tipo_dato = 'booleano')
);
ALTER TABLE valores_gama ADD CONSTRAINT valor_gama_tipo_check CHECK (
  num_nonnulls(valor_numero, valor_texto, valor_booleano) = 1 AND
  (valor_numero IS NULL OR (tipo_dato = 'numero' AND valor_numero::text NOT IN ('NaN', 'Infinity', '-Infinity'))) AND
  (valor_texto IS NULL OR tipo_dato = 'texto') AND
  (valor_booleano IS NULL OR tipo_dato = 'booleano')
);
ALTER TABLE gamas_categoria ADD CONSTRAINT gama_origen_distinto_check CHECK (gama_origen_id IS DISTINCT FROM id);
ALTER TABLE gamas_categoria ADD CONSTRAINT gama_titulo_check CHECK (length(btrim(titulo)) > 0);
ALTER TABLE gamas_categoria ADD CONSTRAINT gamas_categoria_estado_fechas_check CHECK (
  (estado = 'eliminado') = (eliminado_en IS NOT NULL) AND actualizado_en >= creado_en AND
  (eliminado_en IS NULL OR eliminado_en >= creado_en)
);
ALTER TABLE grupos_columnas_gama ADD CONSTRAINT grupos_columnas_gama_estado_fechas_check CHECK (
  (estado = 'eliminado') = (eliminado_en IS NOT NULL) AND actualizado_en >= creado_en AND
  (eliminado_en IS NULL OR eliminado_en >= creado_en)
);
ALTER TABLE grupos_filas_gama ADD CONSTRAINT grupos_filas_gama_estado_fechas_check CHECK (
  (estado = 'eliminado') = (eliminado_en IS NOT NULL) AND actualizado_en >= creado_en AND
  (eliminado_en IS NULL OR eliminado_en >= creado_en)
);
ALTER TABLE columnas_gama ADD CONSTRAINT columnas_gama_estado_fechas_check CHECK (
  (estado = 'eliminado') = (eliminado_en IS NOT NULL) AND actualizado_en >= creado_en AND
  (eliminado_en IS NULL OR eliminado_en >= creado_en)
);
ALTER TABLE filas_gama ADD CONSTRAINT filas_gama_estado_fechas_check CHECK (
  (estado = 'eliminado') = (eliminado_en IS NOT NULL) AND actualizado_en >= creado_en AND
  (eliminado_en IS NULL OR eliminado_en >= creado_en)
);
ALTER TABLE plantillas_gama_producto ADD CONSTRAINT plantillas_gama_producto_fechas_check CHECK (actualizado_en >= creado_en);
ALTER TABLE valores_gama ADD CONSTRAINT valores_gama_fechas_check CHECK (actualizado_en >= creado_en);
ALTER TABLE grupos_columnas_gama ADD CONSTRAINT grupos_columnas_gama_orden_check CHECK (orden >= 1);
CREATE UNIQUE INDEX grupos_columnas_gama_orden_vigente_key ON grupos_columnas_gama (gama_id, orden) WHERE estado <> 'eliminado';
ALTER TABLE grupos_filas_gama ADD CONSTRAINT grupos_filas_gama_orden_check CHECK (orden >= 1);
CREATE UNIQUE INDEX grupos_filas_gama_orden_vigente_key ON grupos_filas_gama (gama_id, orden) WHERE estado <> 'eliminado';
ALTER TABLE columnas_gama ADD CONSTRAINT columnas_gama_orden_check CHECK (orden >= 1);
CREATE UNIQUE INDEX columnas_gama_orden_vigente_key ON columnas_gama (gama_id, orden) WHERE estado <> 'eliminado';
ALTER TABLE filas_gama ADD CONSTRAINT filas_gama_orden_check CHECK (orden >= 1);
CREATE UNIQUE INDEX filas_gama_orden_vigente_key ON filas_gama (gama_id, orden) WHERE estado <> 'eliminado';
ALTER TABLE grupos_columnas_gama ADD CONSTRAINT grupos_columnas_gama_codigo_check CHECK (codigo ~ '^[a-z0-9][a-z0-9_-]{0,79}$');
ALTER TABLE grupos_columnas_gama ADD CONSTRAINT grupos_columnas_gama_nombre_check CHECK (length(btrim(nombre)) > 0);
CREATE UNIQUE INDEX grupos_columnas_gama_codigo_vigente_key ON grupos_columnas_gama (gama_id, codigo) WHERE estado <> 'eliminado';
ALTER TABLE grupos_filas_gama ADD CONSTRAINT grupos_filas_gama_codigo_check CHECK (codigo ~ '^[a-z0-9][a-z0-9_-]{0,79}$');
ALTER TABLE grupos_filas_gama ADD CONSTRAINT grupos_filas_gama_nombre_check CHECK (length(btrim(nombre)) > 0);
CREATE UNIQUE INDEX grupos_filas_gama_codigo_vigente_key ON grupos_filas_gama (gama_id, codigo) WHERE estado <> 'eliminado';
ALTER TABLE filas_gama ADD CONSTRAINT filas_gama_codigo_check CHECK (codigo ~ '^[a-z0-9][a-z0-9_-]{0,79}$');
ALTER TABLE filas_gama ADD CONSTRAINT filas_gama_nombre_check CHECK (length(btrim(nombre)) > 0);
CREATE UNIQUE INDEX filas_gama_codigo_vigente_key ON filas_gama (gama_id, codigo) WHERE estado <> 'eliminado';
CREATE UNIQUE INDEX columnas_gama_atributo_vigente_key ON columnas_gama (gama_id, atributo_id) WHERE estado <> 'eliminado';
COMMIT;
