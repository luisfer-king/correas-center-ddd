import { solicitarApi } from '../../../shared/api/cliente-http'
import type { CapacidadesCms } from './modelos-cms'
export const capacidadesCmsApi = (signal?: AbortSignal) => solicitarApi<CapacidadesCms>('/api/portal/cms/capacidades', { signal })
