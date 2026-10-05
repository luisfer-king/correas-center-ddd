import { Menu } from '../../domain/menu.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'
import { RutaInterna, destinoCMS } from '../../domain/cms-values.js'
import type { TipoDestinoCMS } from '../../domain/cms-values.js'
import type { FilaMenuItem } from './menu-item.js'
import { mapearMenuItem } from './menu-item.js'

/** Campos escalares del modelo Prisma Menu; no requiere cliente ni conexión. */
export type FilaMenu = Readonly<{
  id: bigint
  empresaId: bigint
  grupo: string
  tipoRegistro: string
  registroId: bigint
  ruta: string
  icono: string | null
  mostrar: boolean
  orden: number
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
  cargarSubmenu: string | null
}>

function tipoDestino(valor: string): TipoDestinoCMS {
  if (valor !== 'producto' && valor !== 'industria' && valor !== 'servicio') throw new Error('Tipo de destino CMS inválido')
  return valor
}

export function mapearMenu(fila: FilaMenu & Readonly<{ relMenuItem: readonly FilaMenuItem[] }>): Menu {
  const submenu = fila.cargarSubmenu
  if (submenu !== null && submenu !== 'activo' && submenu !== 'inactivo') throw new Error('Submenú inválido')
  return new Menu({
    id: fila.id,
    empresaId: fila.empresaId,
    grupo: fila.grupo,
    ruta: RutaInterna.create(fila.ruta),
    icono: fila.icono,
    mostrar: fila.mostrar,
    orden: Orden.create(fila.orden),
    estado: fila.estado,
    cargarSubmenu: submenu,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
    destino: destinoCMS(tipoDestino(fila.tipoRegistro), fila.registroId),
    items: fila.relMenuItem.map(mapearMenuItem),
  })
}
