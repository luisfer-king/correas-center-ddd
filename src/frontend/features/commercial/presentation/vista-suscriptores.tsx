import { suscriptoresApi } from '../api/suscriptores'
import type { SuscriptorCrm } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'activar' | 'inactivar' | 'desuscribir'
const config: ConfiguracionCrm<SuscriptorCrm, Accion> = {
  recurso: 'suscriptores', titulo: 'Bandeja de suscriptores',
  descripcion: 'Consulta las suscripciones recibidas y administra su estado: activo, inactivo o desuscrito.',
  columnas: [{ clave: 'email', titulo: 'Correo' }, { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'creadoEn', titulo: 'Suscripción' }, { clave: 'emailVerificadoEn', titulo: 'Correo verificado el' }],
  campos: [],
  acciones: [{ valor: 'activar', etiqueta: 'Activar', estados: ['inactivo'] },
  { valor: 'inactivar', etiqueta: 'Inactivar', estados: ['activo'] },
  { valor: 'desuscribir', etiqueta: 'Desuscribir', estados: ['activo', 'inactivo'] }],
  listar: suscriptoresApi.listar, obtener: suscriptoresApi.obtener, cambiar: suscriptoresApi.cambiar,
}
export function VistaSuscriptores() { return <ListadoRecursoCrm config={config} /> }
