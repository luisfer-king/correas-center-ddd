import { useEffect, useId, useRef, useState } from 'react'
import { solicitarApi } from '../api/cliente-http'
import { quitarFondoConectado, rectanguloRecorte } from './operaciones-imagen'

const limite = 8 * 1024 * 1024
const recorteInicial = { x: 0, y: 0, ancho: 100, alto: 100 }
export function CampoImagen({ etiqueta, valor, endpoint, actualizar, actividad, bloqueado = false }: {
  etiqueta: string; valor: string; endpoint: string; actualizar: (url: string) => void
  actividad: (pendiente: boolean) => void; bloqueado?: boolean
}) {
  const id = useId(), canvas = useRef<HTMLCanvasElement>(null)
  const historial = useRef<ImageData[]>([]), original = useRef<ImageData | null>(null)
  const vivo = useRef(true), informar = useRef(actividad)
  informar.current = actividad
  const [editor, setEditor] = useState(false), [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState(''), [modoFondo, setModoFondo] = useState(false)
  const [tolerancia, setTolerancia] = useState(35), [recorte, setRecorte] = useState(recorteInicial)
  const [pasos, setPasos] = useState(0)
  useEffect(() => { vivo.current = true; return () => { vivo.current = false } }, [])
  useEffect(() => { informar.current(editor || ocupado) }, [editor, ocupado])
  function contexto() {
    const nodo = canvas.current, ctx = nodo?.getContext('2d', { willReadFrequently: true })
    if (!nodo || !ctx) throw new Error('El navegador no permite editar imágenes.')
    return { nodo, ctx }
  }
  function recordar() {
    const { nodo, ctx } = contexto()
    historial.current = [...historial.current.slice(-2), ctx.getImageData(0, 0, nodo.width, nodo.height)]
    setPasos(historial.current.length)
  }
  function dibujar(datos: ImageData) {
    const { nodo, ctx } = contexto(); nodo.width = datos.width; nodo.height = datos.height
    ctx.putImageData(datos, 0, 0); setRecorte(recorteInicial); setModoFondo(false)
  }
  async function cargar(archivo: Blob) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type) || archivo.size > limite || !archivo.size)
      throw new Error('Selecciona una imagen PNG, JPG o WebP de hasta 8 MB.')
    const bitmap = await createImageBitmap(archivo)
    try {
      if (!vivo.current) return
      if (bitmap.width * bitmap.height > 24000000) throw new Error('Utiliza una imagen de hasta 24 megapíxeles.')
      const { nodo, ctx } = contexto()
      const escala = Math.min(1, 2048 / Math.max(bitmap.width, bitmap.height))
      nodo.width = Math.max(1, Math.round(bitmap.width * escala)); nodo.height = Math.max(1, Math.round(bitmap.height * escala))
      ctx.drawImage(bitmap, 0, 0, nodo.width, nodo.height)
      original.current = ctx.getImageData(0, 0, nodo.width, nodo.height)
      historial.current = []; setPasos(0); setEditor(true); setRecorte(recorteInicial); setModoFondo(false)
    } finally { bitmap.close() }
  }
  async function seleccionar(archivo?: File) {
    if (!archivo) return
    setError(''); setOcupado(true)
    try { await cargar(archivo) }
    catch (fallo) { if (vivo.current) setError(fallo instanceof Error ? fallo.message : 'No se pudo abrir la imagen.') }
    finally { if (vivo.current) setOcupado(false) }
  }
  async function editarActual() {
    setError(''); setOcupado(true)
    try {
      const url = new URL(valor, window.location.origin)
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('URL de imagen no válida.')
      const respuesta = await fetch(url, { credentials: 'same-origin' })
      if (!respuesta.ok) throw new Error('No se pudo cargar la imagen actual.')
      await cargar(await respuesta.blob())
    } catch { if (vivo.current) setError('No se pudo abrir la imagen. Si la URL externa no permite edición (CORS), descarga el archivo y selecciónalo aquí.') }
    finally { if (vivo.current) setOcupado(false) }
  }
  async function subir() {
    if (ocupado || !editor) return
    setError(''); setOcupado(true)
    try {
      const { nodo } = contexto()
      const base64 = nodo.toDataURL('image/png').split(',')[1]
      if (base64.length > Math.ceil(limite / 3) * 4) throw new Error('El resultado supera 8 MB. Recorta la imagen o utiliza una de menor resolución.')
      const salida = await solicitarApi<{ url: string }>(endpoint, { metodo: 'POST', cuerpo: { base64 } })
      if (vivo.current) {
        actualizar(new URL(salida.url, window.location.origin).href)
        setEditor(false); original.current = null; historial.current = []; setPasos(0)
      }
    } catch (fallo) { if (vivo.current) setError(fallo instanceof Error ? fallo.message : 'No se pudo subir la imagen.') }
    finally { if (vivo.current) setOcupado(false) }
  }
  const deshabilitado = ocupado || bloqueado
  return <div className="grid gap-3 sm:col-span-2 rounded border border-neutral-300 p-3">
    <label htmlFor={id} className="text-sm font-medium">{etiqueta}</label>
    <input id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={deshabilitado}
      onChange={e => { void seleccionar(e.target.files?.[0]); e.target.value = '' }} />
    {!editor && valor && <img src={valor} alt={`Vista previa: ${etiqueta}`} className="h-48 w-full rounded border bg-white object-contain" />}
    {!editor && valor && <button type="button" disabled={deshabilitado} onClick={() => void editarActual()} className="justify-self-start rounded border px-3 py-2">Editar imagen actual</button>}
    <div hidden={!editor}>
      <div className="relative mx-auto w-fit max-w-full" style={{ backgroundColor: '#eee', backgroundImage: 'conic-gradient(#ccc 25%, transparent 0 50%, #ccc 0 75%, transparent 0)', backgroundSize: '20px 20px' }}>
        <canvas ref={canvas} aria-label="Vista previa de edición. Activa quitar fondo y pulsa el área a eliminar."
          className="block h-auto max-h-[420px] max-w-full" style={{ cursor: modoFondo ? 'crosshair' : 'default' }}
          onClick={e => {
            if (!modoFondo || deshabilitado) return
            try {
              const { nodo, ctx } = contexto(), caja = nodo.getBoundingClientRect()
              const x = Math.min(nodo.width - 1, Math.max(0, Math.floor((e.clientX - caja.left) * nodo.width / caja.width)))
              const y = Math.min(nodo.height - 1, Math.max(0, Math.floor((e.clientY - caja.top) * nodo.height / caja.height)))
              recordar(); const datos = ctx.getImageData(0, 0, nodo.width, nodo.height)
              quitarFondoConectado(datos, x, y, tolerancia); ctx.putImageData(datos, 0, 0)
            } catch (fallo) { setError((fallo as Error).message) }
          }} />
        {!modoFondo && <div className="pointer-events-none absolute border-2 border-red-600" style={{ left: `${recorte.x}%`, top: `${recorte.y}%`, width: `${recorte.ancho}%`, height: `${recorte.alto}%` }} />}
      </div>
      <fieldset disabled={deshabilitado} className="mt-3 grid gap-2 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-medium">Recorte (porcentajes)</legend>
        {(['x', 'y', 'ancho', 'alto'] as const).map(clave => <label key={clave} className="text-sm">
          {{ x: 'Desde la izquierda', y: 'Desde arriba', ancho: 'Ancho', alto: 'Alto' }[clave]}
          <input type="range" min={clave === 'x' || clave === 'y' ? 0 : 1} max={clave === 'x' || clave === 'y' ? 99 : 100}
            value={recorte[clave]} onChange={e => setRecorte(actual => {
              const siguiente = { ...actual, [clave]: Number(e.target.value) }
              siguiente.ancho = Math.min(siguiente.ancho, 100 - siguiente.x)
              siguiente.alto = Math.min(siguiente.alto, 100 - siguiente.y)
              return siguiente
            })} className="block w-full" />{recorte[clave]}%
        </label>)}
        <button type="button" className="rounded border px-3 py-2" onClick={() => {
          try {
            const { nodo, ctx } = contexto(), r = rectanguloRecorte(nodo.width, nodo.height, recorte.x, recorte.y, recorte.ancho, recorte.alto)
            const datos = ctx.getImageData(r.x, r.y, r.ancho, r.alto); recordar(); dibujar(datos)
          } catch (fallo) { setError((fallo as Error).message) }
        }}>Aplicar recorte</button>
        <button type="button" aria-pressed={modoFondo} onClick={() => setModoFondo(v => !v)} className="rounded border px-3 py-2">
          {modoFondo ? 'Terminar quitar fondo' : 'Quitar fondo por color'}</button>
        {modoFondo && <label className="sm:col-span-2 text-sm">Tolerancia: {tolerancia}
          <input type="range" min={0} max={160} value={tolerancia} onChange={e => setTolerancia(Number(e.target.value))} className="block w-full" />
          Pulsa sobre el fondo en la vista previa. Elimina el área conectada de color similar; puedes repetir en otras zonas. Funciona mejor con fondos uniformes.
        </label>}
        <button type="button" disabled={!pasos} onClick={() => { const anterior = historial.current.pop(); if (anterior) dibujar(anterior); setPasos(historial.current.length) }} className="rounded border px-3 py-2">Deshacer</button>
        <button type="button" onClick={() => { if (original.current) { recordar(); dibujar(original.current) } }} className="rounded border px-3 py-2">Restaurar original</button>
      </fieldset>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={deshabilitado} onClick={() => void subir()} className="rounded bg-red-700 px-3 py-2 text-white">Usar y subir esta imagen</button>
        <button type="button" disabled={deshabilitado} onClick={() => { setEditor(false); setError(''); original.current = null; historial.current = [] }} className="rounded border px-3 py-2">Cancelar edición</button>
      </div>
      <p className="mt-2 text-sm">Confirma la imagen para habilitar Guardar. Los cambios no sustituyen la imagen del registro hasta guardar el formulario.</p>
    </div>
    <label className="text-sm">URL
      <input value={valor} disabled={deshabilitado || editor} onChange={e => actualizar(e.target.value)} className="mt-1 block w-full rounded border bg-white p-2" />
    </label>
    <small>PNG, JPG o WebP · Hasta 8 MB. El editor trabaja a un máximo de 2048 px y conserva la transparencia en PNG.</small>
    {ocupado && <p role="status">Procesando imagen…</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
  </div>
}
