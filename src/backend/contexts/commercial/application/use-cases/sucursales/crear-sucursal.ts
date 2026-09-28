import { Email, Orden } from '../../../../../shared/domain/value-objects.js'
import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import type { RepositorioSucursales } from '../../ports/repositorio-sucursales.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { textoOpcionalCrm } from '../../validaciones-crm.js'
import { Ubicacion, idCRM, textoCRM } from '../../../domain/commercial-values.js'
import { Sucursal } from '../../../domain/sucursal.js'
import type { DatosNuevaSucursal } from '../../ports/repositorio-sucursales.js'

export type EntradaSucursal = {
  empresaId: bigint; nombre: string; direccion: string; telefono: string
  email: string | null; horarios: string | null; mapaIncrustado: string | null
  latitud: string | null; longitud: string | null; orden: number; esPrincipal: boolean
}

export function prepararSucursal(datos: EntradaSucursal): DatosNuevaSucursal {
  const ahora = new Date()
  const sucursal = new Sucursal({ id: 1n, empresaId: idCRM(datos.empresaId),
    datos: { nombre: textoCRM(datos.nombre, 'Nombre'), direccion: textoCRM(datos.direccion, 'Dirección'),
      telefono: textoCRM(datos.telefono, 'Teléfono'),
      email: datos.email === null ? null : Email.create(datos.email),
      horarios: textoOpcionalCrm(datos.horarios, 'Horarios'),
      mapaIncrustado: textoOpcionalCrm(datos.mapaIncrustado, 'Mapa', 16000),
      ubicacion: Ubicacion.create(datos.latitud, datos.longitud) },
    esPrincipal: datos.esPrincipal, orden: Orden.create(datos.orden), estado: 'activo',
    fechas: { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null } })
  return { empresaId: sucursal.empresaId, datos: sucursal.datos as DatosNuevaSucursal['datos'],
    esPrincipal: sucursal.esPrincipal, orden: sucursal.orden }
}

export class CrearSucursal {
  constructor(private readonly sucursales: RepositorioSucursales,
    private readonly empresas: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, datos: EntradaSucursal) {
    await exigirGestion(this.autorizar, actorId, 'sucursales')
    const entrada = prepararSucursal(datos)
    const empresa = await this.empresas.buscarPorId(entrada.empresaId, false)
    if (empresa?.estado !== 'activo') throw new Error('Empresa no disponible')
    return this.sucursales.crear(entrada, actorId)
  }
}
