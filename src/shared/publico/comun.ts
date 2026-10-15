export interface PaginaPublica<T> { items: T[]; limite: number; desplazamiento: number; hayMas: boolean }
export interface ConsultaPaginaPublica { limite: number; desplazamiento: number; q?: string; slug?: string; productoSlug?: string }
export interface EmpresaPublica { id: string; nombre: string; logo: string | null }
export interface SucursalPublica { id: string; nombre: string; direccion: string; telefono: string; email: string | null; horarios: string | null; mapaIncrustado: string | null; latitud: string | null; longitud: string | null; esPrincipal: boolean; orden: number }
