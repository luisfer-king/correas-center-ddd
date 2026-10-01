import { empresasApi } from '../../commercial/api/empresas'
import { clienteRecurso } from '../api/cliente-catalogo'
import type { Referencia } from './configuracion-catalogo'
export interface OpcionReferencia { id: string; nombre: string }
export async function cargarReferencias(recurso: Referencia, pagina: number, signal?: AbortSignal): Promise<{ opciones: OpcionReferencia[]; mas: boolean }> {
  if (recurso === 'empresas') {
    const filas = await empresasApi.listar(pagina, { signal })
    return { opciones: filas.filter(r => r.estado === 'activo').map(r => ({ id: r.id, nombre: r.nombre })), mas: filas.length === 100 }
  }
  if (recurso === 'destinos') return { opciones: [], mas: false }
  if (recurso.startsWith('asignaciones-')) return { opciones: [], mas: false }
  const lista = await clienteRecurso(recurso).listar(pagina, {}, { signal })
  return { opciones: lista.filter(r => r.estado === 'activo').map(r => ({ id: r.id, nombre: 'nombre' in r ? r.nombre : r.id })), mas: lista.length === 100 }
}
