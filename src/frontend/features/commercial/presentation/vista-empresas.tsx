import { empresasApi } from '../api/empresas'
import type { EmpresaCrm, EntradaEmpresa } from '../api/tipos-crm'
import { type ConfiguracionCrm } from './campos-crm'
import { ListadoRecursoCrm } from './listado-recurso-crm'

type Accion = 'activar' | 'inactivar' | 'eliminar'
const config: ConfiguracionCrm<EmpresaCrm, Accion> = {
  recurso: 'empresas', titulo: 'Empresas', descripcion: 'Administra los datos de las empresas.',
  columnas: [{ clave: 'nombre', titulo: 'Nombre' }, { clave: 'logo', titulo: 'Logo' }],
  campos: [{ clave: 'nombre', etiqueta: 'Nombre', obligatorio: true }, { clave: 'logo', etiqueta: 'URL del logo' }],
  acciones: [{ valor: 'activar', etiqueta: 'Activar', estados: ['inactivo'] },
    { valor: 'inactivar', etiqueta: 'Inactivar', estados: ['activo'] },
    { valor: 'eliminar', etiqueta: 'Dar de baja', estados: ['activo', 'inactivo'] }],
  ...empresasApi,
  crear: (datos) => empresasApi.crear(datos as EntradaEmpresa),
  editar: (id, datos) => empresasApi.editar(id, datos as EntradaEmpresa),
}
export function VistaEmpresas() { return <ListadoRecursoCrm config={config} /> }
