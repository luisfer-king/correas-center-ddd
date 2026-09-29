import { sucursalesApi } from '../api/sucursales'
import type { EntradaSucursal, SucursalCrm } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'activar' | 'inactivar' | 'eliminar'
const config: ConfiguracionCrm<SucursalCrm, Accion> = {
  recurso: 'sucursales', titulo: 'Sucursales', descripcion: 'Sedes y sucursal principal de cada empresa.',
  columnas: [{ clave: 'nombre', titulo: 'Nombre' }, { clave: 'empresaId', titulo: 'Empresa' },
    { clave: 'direccion', titulo: 'Dirección' }, { clave: 'esPrincipal', titulo: 'Principal' }],
  campos: [{ clave: 'empresaId', etiqueta: 'Empresa', obligatorio: true, soloCrear: true },
    { clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'direccion', etiqueta: 'Dirección', obligatorio: true },
    { clave: 'telefono', etiqueta: 'Teléfono', obligatorio: true }, { clave: 'email', etiqueta: 'Correo', tipo: 'email' },
    { clave: 'horarios', etiqueta: 'Horarios' }, { clave: 'mapaIncrustado', etiqueta: 'Mapa', tipo: 'textarea' },
    { clave: 'latitud', etiqueta: 'Latitud', ayuda: 'Coordenada decimal opcional.' },
    { clave: 'longitud', etiqueta: 'Longitud', ayuda: 'Coordenada decimal opcional.' },
    { clave: 'orden', etiqueta: 'Orden', tipo: 'number', obligatorio: true },
    { clave: 'esPrincipal', etiqueta: 'Sucursal principal', tipo: 'checkbox' }],
  acciones: [{ valor: 'activar', etiqueta: 'Activar', estados: ['inactivo'] },
    { valor: 'inactivar', etiqueta: 'Inactivar', estados: ['activo'] },
    { valor: 'eliminar', etiqueta: 'Dar de baja', estados: ['activo', 'inactivo'] }],
  ...sucursalesApi,
  crear: (datos) => sucursalesApi.crear(datos as EntradaSucursal & { empresaId: string }),
  editar: (id, datos) => sucursalesApi.editar(id, datos as EntradaSucursal),
}
export function VistaSucursales() { return <ListadoRecursoCrm config={config} /> }
