import { solicitarApi } from '../../../shared/api/cliente-http'
import type { CapacidadesCatalogo, FiltroCatalogo, MapaCatalogo, RecursoCatalogo } from './tipos-catalogo'
export type { RecursoCatalogo, CapacidadesCatalogo } from './tipos-catalogo'
const base = '/api/portal/catalogo'
export function idCatalogo(valor: string): string {
  if (!/^[1-9][0-9]{0,18}$/.test(valor) || BigInt(valor) > 9223372036854775807n) throw new Error('ID de catálogo inválido')
  return encodeURIComponent(valor)
}
export function paginaCatalogo(valor: number): number {
  if (!Number.isSafeInteger(valor) || valor < 1 || valor > 10000) throw new Error('Página inválida')
  return valor
}
export const catalogoApi = { capacidades: (opciones?: { signal?: AbortSignal }) =>
  solicitarApi<CapacidadesCatalogo>(`${base}/capacidades`, opciones) }
export function clienteRecurso<K extends RecursoCatalogo>(recurso: K) {
  const ruta = `${base}/${recurso}`
  return {
    listar: (pagina = 1, filtros: FiltroCatalogo = {}, opciones?: { signal?: AbortSignal }) => {
      const q = new URLSearchParams({ pagina: String(paginaCatalogo(pagina)) })
      for (const [clave, valor] of Object.entries(filtros)) if (valor !== undefined && valor !== '') q.set(clave, idCatalogo(valor))
      if (recurso.startsWith('asignaciones-')) {
        const filtro = recurso === 'asignaciones-marca' ? 'productoId' : recurso === 'asignaciones-atributo' ? 'categoriaId' : 'industriaId'
        if (!q.has(filtro)) throw new Error(`Selecciona ${filtro} para consultar las asignaciones.`)
      }
      return solicitarApi<MapaCatalogo[K][]>(`${ruta}?${q.toString()}`, opciones)
    },
    obtener: (id: string, opciones?: { signal?: AbortSignal }) => solicitarApi<MapaCatalogo[K]>(`${ruta}/${idCatalogo(id)}`, opciones),
    crear: (datos: unknown) => solicitarApi<MapaCatalogo[K]>(ruta, { metodo: 'POST', cuerpo: datos }),
    editar: (id: string, datos: unknown) => solicitarApi<MapaCatalogo[K]>(`${ruta}/${idCatalogo(id)}`, { metodo: 'PATCH', cuerpo: datos }),
    reordenar: (id: string, orden: number) => solicitarApi<MapaCatalogo[K]>(`${ruta}/${idCatalogo(id)}/orden`, { metodo: 'PATCH', cuerpo: { orden } }),
    cambiar: (id: string, accion: 'activar' | 'inactivar' | 'eliminar') =>
      solicitarApi<{ ok: boolean }>(`${ruta}/${idCatalogo(id)}/${accion}`, { metodo: 'PATCH' }),
  }
}
