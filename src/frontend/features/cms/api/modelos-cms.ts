export type IdCms = string
export type VersionCms = string | null
export type DestinoCms = { tipo: 'producto' | 'industria' | 'servicio'; id: IdCms }
export type CamposCms = { titulo: string | null; subtitulo: string | null; descripcion: string | null; icono: string | null }
export type RecursoCms = 'tipos_seccion' | 'contenidos_seccion' | 'metadata_seccion' | 'menus' | 'items_menu' | 'elementos_footer' | 'configuracion_sitio' | 'pasos_wizard' | 'registros_cms' | 'contenidos_registro'
export type CapacidadesCms = { verEliminados: boolean; recursos: Record<RecursoCms, { leer: boolean; gestionar: boolean }> }
export type RegistroBaseCms = { id: string | number; actualizadoEn: VersionCms; creadoEn: VersionCms; estado?: 'activo' | 'inactivo' | 'eliminado'; eliminadoEn?: string | null; orden?: number; mostrar?: boolean; activo?: boolean | null }
export type ConsultaCms = { limite?: number; desplazamiento?: number; estado?: string; incluirEliminados?: boolean; empresaId?: string; tipoSeccionId?: string; menuId?: string; registroId?: string; clave?: string; grupo?: string; activo?: boolean | 'sin-definir' }
