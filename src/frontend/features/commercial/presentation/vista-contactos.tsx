import { contactosApi } from '../api/contactos'
import type { ContactoCrm, EntradaContacto } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'respondido' | 'archivar' | 'eliminar'
const config: ConfiguracionCrm<ContactoCrm, Accion> = {
  recurso: 'contactos', titulo: 'Contactos entrantes', descripcion: 'Mensajes recibidos y seguimiento de respuesta.',
  columnas: [{ clave: 'nombre', titulo: 'Nombre' }, { clave: 'empresaId', titulo: 'Empresa' },
    { clave: 'email', titulo: 'Correo' }, { clave: 'mensaje', titulo: 'Mensaje' }],
  campos: [{ clave: 'empresaId', etiqueta: 'Empresa', obligatorio: true },
    { clave: 'nombre', etiqueta: 'Nombre', obligatorio: true },
    { clave: 'empresaDeclarada', etiqueta: 'Empresa declarada' },
    { clave: 'telefono', etiqueta: 'Teléfono', obligatorio: true },
    { clave: 'email', etiqueta: 'Correo', tipo: 'email', obligatorio: true },
    { clave: 'mensaje', etiqueta: 'Mensaje', tipo: 'textarea', obligatorio: true }],
  acciones: [{ valor: 'respondido', etiqueta: 'Marcar respondido', estados: ['nuevo'] },
    { valor: 'archivar', etiqueta: 'Archivar', estados: ['nuevo', 'respondido'] },
    { valor: 'eliminar', etiqueta: 'Dar de baja', estados: ['nuevo', 'respondido', 'archivado'] }],
  ...contactosApi,
  crear: (datos) => contactosApi.crear(datos as EntradaContacto & { empresaId: string }),
}
export function VistaContactos() { return <ListadoRecursoCrm config={config} /> }
