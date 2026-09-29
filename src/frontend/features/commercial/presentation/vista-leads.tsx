import { leadsApi } from '../api/leads'
import type { EntradaLead, LeadCrm } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'calificar' | 'descartar' | 'eliminar'
const config: ConfiguracionCrm<LeadCrm, Accion> = {
  recurso: 'leads', titulo: 'Leads', descripcion: 'Prospectos comerciales y responsables asignados.',
  columnas: [{ clave: 'empresaId', titulo: 'Empresa' }, { clave: 'contactoId', titulo: 'Contacto' },
    { clave: 'responsableId', titulo: 'Responsable' }],
  campos: [{ clave: 'empresaId', etiqueta: 'Empresa', obligatorio: true, soloCrear: true },
    { clave: 'contactoId', etiqueta: 'ID del contacto', soloCrear: true },
    { clave: 'responsableId', etiqueta: 'UUID del responsable', tipo: 'uuid' }],
  acciones: [{ valor: 'calificar', etiqueta: 'Calificar', estados: ['nuevo'] },
    { valor: 'descartar', etiqueta: 'Descartar', estados: ['nuevo'] },
    { valor: 'eliminar', etiqueta: 'Dar de baja', estados: ['nuevo', 'calificado', 'descartado'] }],
  ...leadsApi,
  crear: (datos) => leadsApi.crear(datos as EntradaLead & { empresaId: string }),
  editar: (id, datos) => leadsApi.asignarResponsable(id, (datos.responsableId as string | null) ?? null),
}
export function VistaLeads() { return <ListadoRecursoCrm config={config} /> }
