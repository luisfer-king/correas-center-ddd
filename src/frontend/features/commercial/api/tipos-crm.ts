export type RecursoCrm = 'empresas' | 'sucursales' | 'contactos' | 'suscriptores' | 'leads'
export type EstadoRegistro = 'activo' | 'inactivo' | 'eliminado'
export interface BaseCrm {
  id: string
  creadoEn: string | null
  actualizadoEn: string | null
  eliminadoEn: string | null
}
export interface EmpresaCrm extends BaseCrm { nombre: string; logo: string | null; estado: EstadoRegistro }
export interface SucursalCrm extends BaseCrm {
  empresaId: string; nombre: string; direccion: string; telefono: string; email: string | null
  horarios: string | null; mapaIncrustado: string | null; latitud: string | null; longitud: string | null
  orden: number; esPrincipal: boolean; estado: EstadoRegistro
}
export interface ContactoCrm extends BaseCrm {
  empresaId: string; nombre: string; empresaDeclarada: string | null; telefono: string
  email: string; mensaje: string; estado: 'nuevo' | 'respondido' | 'archivado'
}
export interface SuscriptorCrm extends BaseCrm {
  empresaId: string; email: string; nombre: string | null; estado: 'activo' | 'inactivo' | 'desuscrito'
  emailVerificadoEn: string | null
}
export interface LeadCrm extends BaseCrm {
  empresaId: string; contactoId: string | null; responsableId: string | null
  estado: 'nuevo' | 'calificado' | 'descartado'
}
export interface CapacidadesCrm {
  verEliminados: boolean
  recursos: Record<RecursoCrm, { leer: boolean; gestionar: boolean }>
}
export type EntradaEmpresa = Pick<EmpresaCrm, 'nombre' | 'logo'>
export type EntradaSucursal = Pick<SucursalCrm, 'nombre' | 'direccion' | 'telefono' | 'email' |
  'horarios' | 'mapaIncrustado' | 'latitud' | 'longitud' | 'orden' | 'esPrincipal'>
export type EntradaContacto = Pick<ContactoCrm, 'nombre' | 'empresaDeclarada' | 'telefono' | 'email' | 'mensaje'>
export type EntradaSuscriptor = Pick<SuscriptorCrm, 'email' | 'nombre'>
export type EntradaLead = Pick<LeadCrm, 'contactoId' | 'responsableId'>
export type OkCrm = { ok: boolean }
