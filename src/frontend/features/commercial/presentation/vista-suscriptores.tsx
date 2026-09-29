import { suscriptoresApi } from '../api/suscriptores'
import type { EntradaSuscriptor, SuscriptorCrm } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'activar' | 'inactivar' | 'desuscribir' | 'eliminar'
const config: ConfiguracionCrm<SuscriptorCrm, Accion> = {
  recurso: 'suscriptores', titulo: 'Suscriptores', descripcion: 'Suscripciones y estados de comunicación.',
  columnas: [{ clave: 'email', titulo: 'Correo' }, { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'empresaId', titulo: 'Empresa' }, { clave: 'emailVerificadoEn', titulo: 'Verificado' }],
  campos: [{ clave: 'empresaId', etiqueta: 'Empresa', obligatorio: true, soloCrear: true },
    { clave: 'email', etiqueta: 'Correo', tipo: 'email', obligatorio: true, soloCrear: true },
    { clave: 'nombre', etiqueta: 'Nombre' }],
  acciones: [{ valor: 'activar', etiqueta: 'Activar', estados: ['inactivo'] },
    { valor: 'inactivar', etiqueta: 'Inactivar', estados: ['activo'] },
    { valor: 'desuscribir', etiqueta: 'Desuscribir', estados: ['activo', 'inactivo'] },
    { valor: 'eliminar', etiqueta: 'Dar de baja', estados: ['activo', 'inactivo', 'desuscrito'] }],
  ...suscriptoresApi,
  crear: (datos) => suscriptoresApi.crear(datos as EntradaSuscriptor & { empresaId: string }),
  editar: (id, datos) => suscriptoresApi.editar(id, (datos.nombre as string | null) ?? null),
}
export function VistaSuscriptores() { return <ListadoRecursoCrm config={config} /> }
