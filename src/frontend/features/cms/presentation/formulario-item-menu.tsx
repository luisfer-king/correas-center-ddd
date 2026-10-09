import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { construirRutaSubenlace } from '../../../../shared/ruta-subenlace'
import { slugNombre } from '../../../../shared/slug-nombre'
import { clienteRecurso } from '../../catalog/api/cliente-catalogo'
import type { DatosFormularioCms } from './campos-cms'
import { SelectorSeccion, type OpcionSeccion } from './selector-seccion'
export type PadreItemMenu = { empresaId: string; tipoRegistro: 'producto' | 'industria' | 'servicio'; registroId: string }
export function FormularioItemMenu({ padre, datos = {}, guardar, ocupado, cancelar }: { padre: PadreItemMenu; datos?: DatosFormularioCms; guardar: (d: DatosFormularioCms) => Promise<void>; ocupado: boolean; cancelar: () => void }) {
  const [nombre, setNombre] = useState(String(datos.nombre ?? '')), [categoria, setCategoria] = useState(String(datos.categoriaId ?? '')), [slug, setSlug] = useState('')
  const [base, setBase] = useState(''), [productos, setProductos] = useState<string[]>([]), [cargando, setCargando] = useState(true), [error, setError] = useState('')
  useEffect(() => {
    const c = new AbortController(); setCargando(true); setError('')
    void (async () => {
      const recurso = padre.tipoRegistro === 'producto' ? 'productos' : padre.tipoRegistro === 'industria' ? 'industrias' : 'servicios'
      const registro = await clienteRecurso(recurso).obtener(padre.registroId, { signal: c.signal })
      const prefijo = padre.tipoRegistro === 'producto' ? '/products/' : padre.tipoRegistro === 'industria' ? '/applications/' : '/services/'
      const sufijo = 'slug' in registro ? registro.slug : slugNombre(registro.nombre)
      const ids: string[] = []
      if (padre.tipoRegistro === 'producto') ids.push(padre.registroId)
      else for (let pagina = 1; pagina <= 10000; pagina++) {
        const lote = await clienteRecurso('productos').listar(pagina, { empresaId: padre.empresaId }, { signal: c.signal })
        ids.push(...lote.filter(p => p.estado === 'activo').map(p => p.id)); if (lote.length < 100) break
      }
      let slugInicial = ''
      if (datos.categoriaId) slugInicial = (await clienteRecurso('categorias').obtener(String(datos.categoriaId), { signal: c.signal })).slug
      if (!c.signal.aborted) { setBase(`${prefijo}${sufijo}/`); setProductos(ids); setSlug(slugInicial) }
    })().catch(e => { if (!c.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo') }).finally(() => { if (!c.signal.aborted) setCargando(false) })
    return () => c.abort()
  }, [padre.empresaId, padre.tipoRegistro, padre.registroId, datos.categoriaId])
  const cargar = useCallback(async (pagina: number, signal: AbortSignal) => {
    const lote = await clienteRecurso('categorias').listar(pagina, padre.tipoRegistro === 'producto' ? { productoId: padre.registroId } : {}, { signal })
    return { opciones: lote.filter(c => c.estado === 'activo' && productos.includes(c.productoId)).map(c => ({ id: c.id, nombre: c.nombre, slug: c.slug })), mas: lote.length === 100 }
  }, [productos, padre.tipoRegistro, padre.registroId])
  function seleccionar(id: string, opcion?: OpcionSeccion) { setCategoria(id); setSlug(opcion?.slug ?? ''); if (!nombre.trim() && opcion) setNombre(opcion.nombre) }
  async function enviar(e: FormEvent) {
    e.preventDefault(); if (ocupado || cargando) return; setError(''); try {
      if (!nombre.trim() || !categoria || !slug || !base) throw new Error('Completa el nombre y selecciona una categoría válida')
      await guardar({ nombre: nombre.trim(), categoriaId: categoria })
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') }
  }
  let ruta = String(datos.ruta ?? '')
  if (base && slug) { try { ruta = construirRutaSubenlace(base, slug) } catch { ruta = 'Slug de categoría inválido' } }
  return <form className="cms-form" onSubmit={e => void enviar(e)}><fieldset disabled={ocupado || cargando}>
    <label>Nombre *<input required maxLength={255} value={nombre} onChange={e => setNombre(e.target.value)} /></label>
    <SelectorSeccion etiqueta="Categoría de destino" valor={categoria} cargar={cargar} cambiar={seleccionar} bloqueado={ocupado || cargando} />
    <label>Ruta resultante<input readOnly value={ruta} /></label>
    <small>La ruta usa el tipo y el registro del menú padre, seguido del slug de la categoría.</small>
    <p>Estado: {String(datos.estado ?? 'activo')} · Orden: {datos.orden ? String(datos.orden) : 'automático desde 1'}</p>
  </fieldset>{cargando && <p role="status">Cargando catálogo…</p>}{error && <p role="alert" className="cms-error">{error}</p>}
    <div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" className="cms-primary" disabled={ocupado || cargando || !base}>{ocupado ? 'Guardando…' : 'Guardar'}</button></div></form>
}
