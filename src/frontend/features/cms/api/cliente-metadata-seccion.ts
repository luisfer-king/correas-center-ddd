import { solicitarApi } from '../../../shared/api/cliente-http'
import { idRutaCms, validarVersionCms } from './operaciones-cms'
import type { ContenidoSeccionDto } from './tipos-contenidos-seccion'
export type MetadataSeccionDto = { contenidoSeccionId: string; empresaId: string; tipoSeccionId: string; metadata: Record<string, unknown>; actualizadoEn: string }
export const metadataSeccionApi = {
 obtener: (id: string, signal?: AbortSignal) => solicitarApi<MetadataSeccionDto>(`/api/portal/cms/contenidos-seccion/${idRutaCms(id)}/metadata`, { signal }),
 reemplazar: (id: string, version: string, metadata: Record<string, unknown>) => solicitarApi<ContenidoSeccionDto>(`/api/portal/cms/contenidos-seccion/${idRutaCms(id)}/metadata`, { metodo: 'PUT', cuerpo: { version: validarVersionCms(version), metadata } }),
}
