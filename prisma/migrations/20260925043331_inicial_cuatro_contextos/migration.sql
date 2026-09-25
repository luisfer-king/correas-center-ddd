-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";
-- CreateEnum
CREATE TYPE "enum_estado" AS ENUM ('activo', 'inactivo', 'eliminado');
-- CreateEnum
CREATE TYPE "enum_estado_contacto" AS ENUM ('nuevo', 'respondido', 'archivado');
-- CreateEnum
CREATE TYPE "enum_estado_suscriptor" AS ENUM ('activo', 'inactivo', 'desuscrito');
-- CreateEnum
CREATE TYPE "enum_accion_auditoria" AS ENUM ('Lectura', 'Creación', 'Edición', 'Eliminación');
-- CreateEnum
CREATE TYPE "enum_estado_lead" AS ENUM ('nuevo', 'calificado', 'descartado');
-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR,
    "encrypted_password" VARCHAR,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "empresas" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "logo" VARCHAR,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "sucursales" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "direccion" VARCHAR NOT NULL,
    "telefono" VARCHAR NOT NULL,
    "email" VARCHAR,
    "horarios" VARCHAR,
    "mapa_incrustado" TEXT,
    "latitud" DECIMAL,
    "longitud" DECIMAL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "productos" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "imagen" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "categorias" (
    "id" BIGSERIAL NOT NULL,
    "producto_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "imagen" VARCHAR,
    "descripcion" TEXT,
    "descripcion_corta" TEXT,
    "uso" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "marcas" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "logo" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "producto_marca" (
    "id" BIGSERIAL NOT NULL,
    "producto_id" BIGINT NOT NULL,
    "marca_id" BIGINT NOT NULL,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orden" INTEGER,
    CONSTRAINT "producto_marca_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "tipo_atributo" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "permite_descripcion" BOOLEAN NOT NULL DEFAULT false,
    "permite_valor_numerico" BOOLEAN NOT NULL DEFAULT false,
    "permite_unidad_medida" BOOLEAN NOT NULL DEFAULT false,
    "icono" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tipo_atributo_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "atributos_tecnico" (
    "id" BIGSERIAL NOT NULL,
    "tipo_atributo_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "valor_numerico" DECIMAL,
    "unidad_medida" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "atributos_tecnico_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "categoria_atributo" (
    "id" BIGSERIAL NOT NULL,
    "categoria_id" BIGINT NOT NULL,
    "atributo_id" BIGINT NOT NULL,
    "valor_personalizado" DECIMAL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categoria_atributo_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "industrias" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "imagen" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "industrias_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "servicios" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "imagen" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "industria_asignacion" (
    "id" BIGSERIAL NOT NULL,
    "industria_id" BIGINT NOT NULL,
    "tipo_registro" VARCHAR NOT NULL,
    "registro_id" BIGINT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "industria_asignacion_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "tipo_seccion" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "campos_metadata" JSONB NOT NULL DEFAULT '[]',
    "icono" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tipo_seccion_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "contenido_seccion" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "tipo_seccion_id" BIGINT NOT NULL,
    "titulo" VARCHAR,
    "subtitulo" VARCHAR,
    "descripcion" TEXT,
    "icono" VARCHAR,
    "imagen" VARCHAR,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "mostrar" BOOLEAN NOT NULL DEFAULT true,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contenido_seccion_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "registros" (
    "id" BIGSERIAL NOT NULL,
    "identificador" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "registro_contenido" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "registro_id" BIGINT NOT NULL,
    "titulo" VARCHAR,
    "subtitulo" VARCHAR,
    "descripcion" TEXT,
    "icono" VARCHAR,
    "stats" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registro_contenido_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "menus" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "grupo" VARCHAR NOT NULL,
    "tipo_registro" VARCHAR NOT NULL,
    "registro_id" BIGINT NOT NULL,
    "ruta" VARCHAR NOT NULL,
    "icono" VARCHAR,
    "mostrar" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cargar_submenu" TEXT DEFAULT 'activo',
    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "menu_item" (
    "id" BIGSERIAL NOT NULL,
    "menu_id" BIGINT NOT NULL,
    "ruta" VARCHAR NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "menu_item_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "footers" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "tipo" VARCHAR NOT NULL,
    "tipo_registro" VARCHAR,
    "registro_id" BIGINT,
    "titulo" VARCHAR,
    "url" VARCHAR,
    "icono" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "mostrar" BOOLEAN NOT NULL DEFAULT true,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "footers_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "pasos_wizard" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "identificador" VARCHAR NOT NULL,
    "titulo" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "fuente_datos" VARCHAR NOT NULL,
    "campo_filtro" VARCHAR,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pasos_wizard_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "contactos" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "empresa" VARCHAR,
    "telefono" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" "enum_estado_contacto" NOT NULL DEFAULT 'nuevo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "suscriptores" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR NOT NULL,
    "nombre" VARCHAR,
    "estado" "enum_estado_suscriptor" NOT NULL DEFAULT 'activo',
    "email_verificado_en" TIMESTAMPTZ(6),
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresa_id" BIGINT NOT NULL,
    CONSTRAINT "suscriptores_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "perfiles" (
    "id" UUID NOT NULL,
    "nombre_completo" VARCHAR NOT NULL,
    "telefono" VARCHAR,
    "avatar_url" VARCHAR,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR,
    "email_verified_at" TIMESTAMPTZ(6),
    CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "es_sistema" BOOLEAN NOT NULL DEFAULT false,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "permisos" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "grupo" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "eliminado_en" TIMESTAMPTZ(6),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "rol_permiso" (
    "rol_id" BIGINT NOT NULL,
    "permiso_id" BIGINT NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rol_permiso_pkey" PRIMARY KEY ("rol_id", "permiso_id")
);
-- CreateTable
CREATE TABLE "usuario_rol" (
    "usuario_id" UUID NOT NULL,
    "rol_id" BIGINT NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuario_id", "rol_id")
);
-- CreateTable
CREATE TABLE "auditoria" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" UUID,
    "accion" "enum_accion_auditoria" NOT NULL,
    "tabla_afectada" VARCHAR NOT NULL,
    "registro_id" VARCHAR,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip_address" VARCHAR,
    "user_agent" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "configuracion_sitio" (
    "id" SERIAL NOT NULL,
    "empresa_id" BIGINT,
    "clave" VARCHAR NOT NULL,
    "valor" TEXT,
    "tipo" VARCHAR DEFAULT 'texto',
    "descripcion" TEXT,
    "grupo" VARCHAR,
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "configuracion_sitio_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "sesiones" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "huella_token" VARCHAR(64) NOT NULL,
    "expira_en" TIMESTAMPTZ(6) NOT NULL,
    "revocada_en" TIMESTAMPTZ(6),
    "estado" "enum_estado" NOT NULL DEFAULT 'activo',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ(6),
    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "contacto_id" BIGINT,
    "responsable_id" UUID,
    "estado" "enum_estado_lead" NOT NULL DEFAULT 'nuevo',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ(6),
    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");
-- CreateIndex
CREATE INDEX "sucursales_empresa_id_estado_orden_idx" ON "sucursales"("empresa_id", "estado", "orden");
-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");
-- CreateIndex
CREATE INDEX "productos_empresa_id_estado_orden_idx" ON "productos"("empresa_id", "estado", "orden");
-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");
-- CreateIndex
CREATE INDEX "categorias_producto_id_estado_orden_idx" ON "categorias"("producto_id", "estado", "orden");
-- CreateIndex
CREATE UNIQUE INDEX "marcas_slug_key" ON "marcas"("slug");
-- CreateIndex
CREATE INDEX "producto_marca_producto_id_estado_orden_idx" ON "producto_marca"("producto_id", "estado", "orden");
-- CreateIndex
CREATE UNIQUE INDEX "tipo_atributo_nombre_key" ON "tipo_atributo"("nombre");
-- CreateIndex
CREATE UNIQUE INDEX "tipo_atributo_slug_key" ON "tipo_atributo"("slug");
-- CreateIndex
CREATE INDEX "atributos_tecnico_tipo_atributo_id_estado_idx" ON "atributos_tecnico"("tipo_atributo_id", "estado");
-- CreateIndex
CREATE INDEX "categoria_atributo_categoria_id_estado_orden_idx" ON "categoria_atributo"("categoria_id", "estado", "orden");
-- CreateIndex
CREATE UNIQUE INDEX "industrias_slug_key" ON "industrias"("slug");
-- CreateIndex
CREATE INDEX "industrias_empresa_id_estado_orden_idx" ON "industrias"("empresa_id", "estado", "orden");
-- CreateIndex
CREATE INDEX "servicios_empresa_id_estado_orden_idx" ON "servicios"("empresa_id", "estado", "orden");
-- CreateIndex
CREATE INDEX "industria_asignacion_industria_id_estado_orden_idx" ON "industria_asignacion"("industria_id", "estado", "orden");
-- CreateIndex
CREATE UNIQUE INDEX "tipo_seccion_nombre_key" ON "tipo_seccion"("nombre");
-- CreateIndex
CREATE UNIQUE INDEX "tipo_seccion_slug_key" ON "tipo_seccion"("slug");
-- CreateIndex
CREATE INDEX "contenido_seccion_empresa_id_tipo_seccion_id_estado_mostrar_idx" ON "contenido_seccion"(
    "empresa_id",
    "tipo_seccion_id",
    "estado",
    "mostrar",
    "orden"
);
-- CreateIndex
CREATE UNIQUE INDEX "registros_identificador_key" ON "registros"("identificador");
-- CreateIndex
CREATE INDEX "registro_contenido_empresa_id_registro_id_estado_orden_idx" ON "registro_contenido"("empresa_id", "registro_id", "estado", "orden");
-- CreateIndex
CREATE INDEX "menus_empresa_id_estado_mostrar_orden_idx" ON "menus"("empresa_id", "estado", "mostrar", "orden");
-- CreateIndex
CREATE INDEX "menu_item_menu_id_estado_orden_idx" ON "menu_item"("menu_id", "estado", "orden");
-- CreateIndex
CREATE INDEX "footers_empresa_id_estado_mostrar_orden_idx" ON "footers"("empresa_id", "estado", "mostrar", "orden");
-- CreateIndex
CREATE INDEX "pasos_wizard_empresa_id_estado_orden_idx" ON "pasos_wizard"("empresa_id", "estado", "orden");
-- CreateIndex
CREATE INDEX "contactos_empresa_id_estado_creado_en_idx" ON "contactos"("empresa_id", "estado", "creado_en");
-- CreateIndex
CREATE UNIQUE INDEX "suscriptores_email_key" ON "suscriptores"("email");
-- CreateIndex
CREATE INDEX "suscriptores_empresa_id_estado_idx" ON "suscriptores"("empresa_id", "estado");
-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");
-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");
-- CreateIndex
CREATE UNIQUE INDEX "permisos_nombre_key" ON "permisos"("nombre");
-- CreateIndex
CREATE UNIQUE INDEX "permisos_slug_key" ON "permisos"("slug");
-- CreateIndex
CREATE INDEX "rol_permiso_permiso_id_idx" ON "rol_permiso"("permiso_id");
-- CreateIndex
CREATE INDEX "usuario_rol_rol_id_idx" ON "usuario_rol"("rol_id");
-- CreateIndex
CREATE UNIQUE INDEX "sesiones_huella_token_key" ON "sesiones"("huella_token");
-- CreateIndex
CREATE INDEX "sesiones_usuario_id_estado_expira_en_idx" ON "sesiones"("usuario_id", "estado", "expira_en");
-- CreateIndex
CREATE UNIQUE INDEX "leads_contacto_id_key" ON "leads"("contacto_id");
-- CreateIndex
CREATE INDEX "leads_empresa_id_estado_idx" ON "leads"("empresa_id", "estado");
-- CreateIndex
CREATE INDEX "leads_responsable_id_estado_idx" ON "leads"("responsable_id", "estado");
-- AddForeignKey
ALTER TABLE "sucursales"
ADD CONSTRAINT "sucursales_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "productos"
ADD CONSTRAINT "productos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "categorias"
ADD CONSTRAINT "categorias_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "producto_marca"
ADD CONSTRAINT "producto_marca_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "producto_marca"
ADD CONSTRAINT "producto_marca_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "atributos_tecnico"
ADD CONSTRAINT "atributos_tecnico_tipo_atributo_id_fkey" FOREIGN KEY ("tipo_atributo_id") REFERENCES "tipo_atributo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "categoria_atributo"
ADD CONSTRAINT "categoria_atributo_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "categoria_atributo"
ADD CONSTRAINT "categoria_atributo_atributo_id_fkey" FOREIGN KEY ("atributo_id") REFERENCES "atributos_tecnico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "industrias"
ADD CONSTRAINT "industrias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "servicios"
ADD CONSTRAINT "servicios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "industria_asignacion"
ADD CONSTRAINT "industria_asignacion_industria_id_fkey" FOREIGN KEY ("industria_id") REFERENCES "industrias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "contenido_seccion"
ADD CONSTRAINT "contenido_seccion_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "contenido_seccion"
ADD CONSTRAINT "contenido_seccion_tipo_seccion_id_fkey" FOREIGN KEY ("tipo_seccion_id") REFERENCES "tipo_seccion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "registro_contenido"
ADD CONSTRAINT "registro_contenido_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "registro_contenido"
ADD CONSTRAINT "registro_contenido_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "registros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "menus"
ADD CONSTRAINT "menus_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "menu_item"
ADD CONSTRAINT "menu_item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "footers"
ADD CONSTRAINT "footers_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "pasos_wizard"
ADD CONSTRAINT "pasos_wizard_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "contactos"
ADD CONSTRAINT "contactos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "suscriptores"
ADD CONSTRAINT "suscriptores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "perfiles"
ADD CONSTRAINT "perfiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "rol_permiso"
ADD CONSTRAINT "rol_permiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "rol_permiso"
ADD CONSTRAINT "rol_permiso_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "usuario_rol"
ADD CONSTRAINT "usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "perfiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "usuario_rol"
ADD CONSTRAINT "usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "auditoria"
ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "perfiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "configuracion_sitio"
ADD CONSTRAINT "configuracion_sitio_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "sesiones"
ADD CONSTRAINT "sesiones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "leads"
ADD CONSTRAINT "leads_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "leads"
ADD CONSTRAINT "leads_contacto_id_fkey" FOREIGN KEY ("contacto_id") REFERENCES "contactos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "leads"
ADD CONSTRAINT "leads_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "perfiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE public.empresas
ADD CONSTRAINT empresas_nombre_no_vacio CHECK (nombre <> '');
ALTER TABLE public.industria_asignacion
ADD CONSTRAINT industria_asignacion_tipo_valido CHECK (tipo_registro IN ('categoria', 'servicio'));
ALTER TABLE public.menus
ADD CONSTRAINT menus_tipo_registro_valido CHECK (
        tipo_registro IN ('producto', 'industria', 'servicio')
    );
ALTER TABLE public.menus
ADD CONSTRAINT menus_cargar_submenu_valido CHECK (cargar_submenu IN ('activo', 'inactivo'));
ALTER TABLE public.footers
ADD CONSTRAINT footers_tipo_valido CHECK (
        tipo IN (
            'producto',
            'industria',
            'servicio',
            'red_social'
        )
    );
ALTER TABLE public.footers
ADD CONSTRAINT footers_tipo_registro_valido CHECK (
        tipo_registro IN ('producto', 'industria', 'servicio')
    );
-- Nueva protección local: la comparación de email de login ignora mayúsculas.
CREATE UNIQUE INDEX users_email_normalizado_unique ON auth.users (lower(email))
WHERE email IS NOT NULL;