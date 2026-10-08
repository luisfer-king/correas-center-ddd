/*
  Warnings:

  - Added the required column `nombre` to the `menu_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "menu_item" ADD COLUMN     "nombre" VARCHAR NOT NULL;
