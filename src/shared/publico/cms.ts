export type PresentacionMarcas = 'carrusel' | 'todas'
export interface ConfiguracionPublica { marcas?: { presentacion: PresentacionMarcas }; whatsapp: { numero: string; mensaje: string; activo: boolean }; analytics: { id: string; activo: boolean }; chat: { propertyId: string; widgetId: string; activo: boolean } }
export interface MenuBasePublico { id: string; grupo: string; tipoRegistro: string; registroId: string; ruta: string; icono: string | null; orden: number; cargarSubmenu: boolean; items: { id: string; nombre: string; categoriaId: string | null; ruta: string; orden: number }[] }
export interface MenuPublicado extends MenuBasePublico { nombre: string }
export interface SeccionPublicada { id: string; tipo: string; titulo: string | null; subtitulo: string | null; descripcion: string | null; imagen: string | null; icono: string | null; metadata: Record<string, unknown>; orden: number }
export interface FooterPublicado { id: string; tipo: string; tipoRegistro: string | null; registroId: string | null; titulo: string | null; url: string | null; icono: string | null; orden: number }
export interface RegistroPublicado { id: string; identificador: string; nombre: string; descripcion: string | null; orden: number; contenidos: { id: string; titulo: string | null; subtitulo: string | null; descripcion: string | null; icono: string | null; orden: number }[] }
export interface PasoPublicado { id: string; identificador: string; titulo: string; descripcion: string; fuenteDatos: string; campoFiltro: string | null; orden: number }
