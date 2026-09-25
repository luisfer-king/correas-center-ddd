-- CreateEnum
CREATE TYPE "enum_estado_asignacion" AS ENUM ('activo', 'inactivo');

-- AlterTable
ALTER TABLE "rol_permiso" ADD COLUMN     "estado" "enum_estado_asignacion" NOT NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE "usuario_rol" ADD COLUMN     "estado" "enum_estado_asignacion" NOT NULL DEFAULT 'activo';
