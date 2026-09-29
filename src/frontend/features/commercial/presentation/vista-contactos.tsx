import { contactosApi } from '../api/contactos'
import type { ContactoCrm } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'respondido' | 'archivar'
const config: ConfiguracionCrm<ContactoCrm, Accion> = {
  recurso: 'contactos', titulo: 'Bandeja de contactos',
  descripcion: 'Mensajes recibidos desde el sitio público. Consulta el mensaje completo y actualiza su estado.',
  columnas: [{ clave: 'nombre', titulo: 'Remitente' }, { clave: 'email', titulo: 'Correo' },
  { clave: 'mensaje', titulo: 'Mensaje' }, { clave: 'creadoEn', titulo: 'Recibido' }],
  campos: [],
  acciones: [{ valor: 'respondido', etiqueta: 'Marcar respondido', estados: ['nuevo'] },
  { valor: 'archivar', etiqueta: 'Archivar', estados: ['nuevo', 'respondido'] }],
  listar: contactosApi.listar, obtener: contactosApi.obtener, cambiar: contactosApi.cambiar,
}
export function VistaContactos() { return <ListadoRecursoCrm config={config} /> }
