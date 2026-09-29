import { solicitarApi } from '../../../shared/api/cliente-http'
import type { CapacidadesCrm, RecursoCrm } from './tipos-crm'
export type { CapacidadesCrm, RecursoCrm } from './tipos-crm'

export const baseCrm = '/api/portal/crm'
export const idCrm = (valor: string) => {
  if (!/^[1-9]\d*$/.test(valor)) throw new Error('ID de CRM inválido')
  return encodeURIComponent(valor)
}
export const idLeadCrm = (valor: string) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor))
    throw new Error('ID de lead inválido')
  return encodeURIComponent(valor)
}
export const paginaCrm = (valor: number) => {
  if (!Number.isInteger(valor) || valor < 1 || valor > 10000) throw new Error('Página inválida')
  return valor
}
export type ConsultaCrm = { signal?: AbortSignal }
export const crmApi = {
  capacidades: (opciones?: ConsultaCrm) => solicitarApi<CapacidadesCrm>(`${baseCrm}/capacidades`, opciones),
}
export const rutaCrm = (recurso: RecursoCrm) => `${baseCrm}/${recurso}`
