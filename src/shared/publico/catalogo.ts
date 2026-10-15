export interface ProductoPublico { id: string; nombre: string; slug: string; imagen: string | null; orden: number; categorias?: { id: string; nombre: string; slug: string; uso: string | null }[]; marcas?: MarcaPublica[] }
export interface MarcaPublica { id: string; nombre: string; slug: string; logo: string | null; orden: number }
export interface CategoriaPublica { detalleDisponible?: boolean; id: string; nombre: string; slug: string; imagen: string | null; descripcion: string | null; descripcionCorta: string | null; uso: string | null; orden: number; producto: ProductoPublico; atributos: AtributoPublico[] }
export interface AtributoPublico { id: string; nombre: string; descripcion: string | null; tipoDato: 'numero' | 'texto' | 'booleano'; valor: string | boolean | null; unidadMedida: string | null; orden: number; tipo: { nombre: string; slug: string; icono: string | null } }
export interface DetalleProductoPublico extends ProductoPublico { detalleCategoriasDisponible?: boolean; categorias: Omit<CategoriaPublica, 'atributos' | 'producto'>[]; marcas: MarcaPublica[] }
export interface IndustriaPublica { id: string; nombre: string; slug: string; imagen: string | null; orden: number }
export interface ServicioPublico { id: string; nombre: string; slug: string; descripcion: string | null; imagen: string | null; orden: number }
export interface ReferenciaPublica { tipo: string; id: string }
export interface DestinoPublico { tipo: string; id: string; nombre: string; slug: string; productoId?: string }

export interface DetalleIndustriaPublica extends IndustriaPublica { categorias: Omit<CategoriaPublica, 'atributos' | 'detalleDisponible'>[]; servicios: ServicioPublico[] }
export interface DetalleServicioPublico extends ServicioPublico { industrias: IndustriaPublica[] }
