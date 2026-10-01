export type RecursoCatalogo = 'productos' | 'categorias' | 'marcas' | 'tipos-atributo' | 'atributos-tecnicos' |
  'industrias' | 'servicios' | 'asignaciones-marca' | 'asignaciones-atributo' | 'asignaciones-industria'
export type EstadoCatalogo = 'activo' | 'inactivo' | 'eliminado'
export interface BaseCatalogo {
  id: string; estado: EstadoCatalogo; creadoEn: string; actualizadoEn: string; eliminadoEn?: string | null
}
export interface ProductoCatalogo extends BaseCatalogo { empresaId: string; nombre: string; slug: string; imagen: string | null; orden: number }
export interface CategoriaCatalogo extends BaseCatalogo { productoId: string; nombre: string; slug: string; imagen: string | null;
  descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: number }
export interface MarcaCatalogo extends BaseCatalogo { nombre: string; slug: string; logo: string | null; orden: number }
export interface TipoAtributoCatalogo extends BaseCatalogo { nombre: string; slug: string; descripcion: string | null;
  icono: string | null; capacidades: { descripcion: boolean; numero: boolean; unidad: boolean }; orden: number }
export interface AtributoTecnicoCatalogo extends BaseCatalogo { tipoAtributoId: string; nombre: string;
  valores: { descripcion: string | null; valorNumerico: string | null; unidadMedida: string | null }; orden: number }
export interface IndustriaCatalogo extends BaseCatalogo { empresaId: string; nombre: string; slug: string; imagen: string | null; orden: number }
export interface ServicioCatalogo extends BaseCatalogo { empresaId: string; nombre: string; descripcion: string | null; imagen: string | null; orden: number }
export interface AsignacionMarcaCatalogo extends BaseCatalogo { productoId: string; marcaId: string; orden: number | null }
export interface AsignacionAtributoCatalogo extends BaseCatalogo { categoriaId: string; atributoId: string; valorPersonalizado: string | null; orden: number }
export interface AsignacionIndustriaCatalogo extends BaseCatalogo { industriaId: string; destino: { tipo: 'categoria' | 'servicio'; id: string }; orden: number }
export type RegistroCatalogo = ProductoCatalogo | CategoriaCatalogo | MarcaCatalogo | TipoAtributoCatalogo |
  AtributoTecnicoCatalogo | IndustriaCatalogo | ServicioCatalogo | AsignacionMarcaCatalogo | AsignacionAtributoCatalogo | AsignacionIndustriaCatalogo
export interface MapaCatalogo {
  productos: ProductoCatalogo; categorias: CategoriaCatalogo; marcas: MarcaCatalogo; 'tipos-atributo': TipoAtributoCatalogo;
  'atributos-tecnicos': AtributoTecnicoCatalogo; industrias: IndustriaCatalogo; servicios: ServicioCatalogo;
  'asignaciones-marca': AsignacionMarcaCatalogo; 'asignaciones-atributo': AsignacionAtributoCatalogo;
  'asignaciones-industria': AsignacionIndustriaCatalogo
}
export type FiltroCatalogo = Partial<Record<'empresaId' | 'productoId' | 'tipoAtributoId' | 'categoriaId' | 'industriaId', string>>
export interface CapacidadesCatalogo { verEliminados: boolean; recursos: Record<RecursoCatalogo, { leer: boolean; gestionar: boolean }> }
