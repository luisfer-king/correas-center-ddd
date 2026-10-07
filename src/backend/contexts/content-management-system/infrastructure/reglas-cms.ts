import { grupoMenu, validarReferenciaGrupoMenu } from '../domain/menu-values.js'
import type { TxCms } from './operaciones-cms.js'
import { empresaCms, destinoDisponibleCms } from './operaciones-cms.js'
import type { TipoSeccion } from '../domain/tipo-seccion.js'
import type { ContenidoSeccion } from '../domain/contenido-seccion.js'
import type { Menu } from '../domain/menu.js'
import type { MenuItem } from '../domain/menu-item.js'
import type { FooterElemento } from '../domain/footer-elemento.js'
import type { ConfiguracionSitio } from '../domain/configuracion-sitio.js'
import type { PasoWizard } from '../domain/paso-wizard.js'
import type { RegistroCMS } from '../domain/registro-cms.js'
import type { ContenidoRegistro } from '../domain/contenido-registro.js'
import { mapearTipoSeccion } from './mappers/tipo-seccion.js'

export async function validarTipoSeccion(tx: TxCms, entidad: TipoSeccion): Promise<void> {
  // Revisar TODOS los contenidos, sin paginación: también las bajas conservadas en BD.
  const filas = await tx.contenidoSeccion.findMany({ where: { tipoSeccionId: entidad.id }, select: { metadata: true, estado: true } })
  for (const fila of filas) {
    entidad.validarMetadata(fila.metadata)
    if (entidad.estado !== 'activo' && fila.estado === 'activo') throw new Error('Tipo de sección con contenidos activos')
  }
}
export async function validarContenidoSeccion(tx: TxCms, entidad: ContenidoSeccion): Promise<void> {
  await empresaCms(tx, entidad.empresaId, entidad.estado === 'activo')
  const fila = await tx.tipoSeccion.findUnique({ where: { id: entidad.tipoSeccionId } })
  if (!fila || fila.eliminadoEn !== null || (entidad.estado === 'activo' && fila.estado !== 'activo')) throw new Error('Tipo de sección no disponible')
  mapearTipoSeccion(fila).validarMetadata(entidad.metadata)
}
export async function validarMenu(tx: TxCms, entidad: Menu): Promise<void> {
  validarReferenciaGrupoMenu(grupoMenu(entidad.grupo),entidad.destino)
  await empresaCms(tx, entidad.empresaId, entidad.estado === 'activo')
  await destinoDisponibleCms(tx, entidad.empresaId, entidad.destino, entidad.estado === 'activo')
  if (entidad.estado !== 'activo' && await tx.menuItem.findFirst({ where: { menuId: entidad.id, estado: 'activo', eliminadoEn: null }, select: { id: true } })) throw new Error('Menú con ítems activos')
}
export async function validarMenuItem(tx: TxCms, entidad: MenuItem): Promise<void> {
  const menu = await tx.menu.findUnique({ where: { id: entidad.menuId } })
  if (!menu || menu.eliminadoEn !== null || (entidad.estado === 'activo' && menu.estado !== 'activo')) throw new Error('Menú no disponible')
  await empresaCms(tx, menu.empresaId, entidad.estado === 'activo')
}
export async function validarFooterElemento(tx: TxCms, entidad: FooterElemento): Promise<void> {
  await empresaCms(tx, entidad.empresaId, entidad.estado === 'activo')
  if (entidad.destino !== null) await destinoDisponibleCms(tx, entidad.empresaId, entidad.destino, entidad.estado === 'activo')
}
export async function validarConfiguracionSitio(tx: TxCms, entidad: ConfiguracionSitio): Promise<void> {
  if (entidad.empresaId !== null) await empresaCms(tx, entidad.empresaId, entidad.activo === true)
}
export async function validarPasoWizard(tx: TxCms, entidad: PasoWizard): Promise<void> {
  await empresaCms(tx, entidad.empresaId, entidad.estado === 'activo')
}
export async function validarRegistroCMS(tx: TxCms, entidad: RegistroCMS): Promise<void> {
  if (entidad.estado !== 'activo' && await tx.contenidoRegistro.findFirst({ where: { registroId: entidad.id, estado: 'activo', eliminadoEn: null }, select: { id: true } })) throw new Error('Registro CMS con contenidos activos')
}
export async function validarContenidoRegistro(tx: TxCms, entidad: ContenidoRegistro): Promise<void> {
  await empresaCms(tx, entidad.empresaId, entidad.estado === 'activo')
  if (!await tx.registroCMS.findFirst({ where: { id: entidad.registroId, eliminadoEn: null, ...(entidad.estado === 'activo' ? { estado: 'activo' } : {}) }, select: { id: true } })) throw new Error('Registro CMS no disponible')
}
