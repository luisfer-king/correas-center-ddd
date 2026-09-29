import { useState, type FormEvent } from 'react'
import { CampoImagen } from '../../../shared/imagenes/campo-imagen'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import type { BaseCatalogo } from '../api/tipos-catalogo'
import { cuerpoFormulario, valorCampo, type ConfiguracionCatalogo } from './configuracion-catalogo'
import { SelectorCatalogo } from './selector-catalogo'
export function FormularioCatalogo<T extends BaseCatalogo>({ config, registro, cerrar, guardado }: {
  config: ConfiguracionCatalogo<T>; registro: T | null; cerrar: () => void; guardado: () => void
}) {
  const [datos, setDatos] = useState<Record<string, unknown>>(() => Object.fromEntries(config.campos.map(c =>
    [c.clave, registro ? valorCampo(registro, c.clave) : c.tipo === 'checkbox' ? false : c.tipo === 'number' || c.tipo === 'number-nullable' ? 0 : ''])))
  const [ocupado, setOcupado] = useState(false)
  const [imagenPendiente, setImagenPendiente] = useState(false)
  const [error, setError] = useState('')
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (ocupado || imagenPendiente) return
    setError(''); setOcupado(true)
    try {
      const cuerpo = cuerpoFormulario(config.campos, datos, registro !== null)
      if (registro) await config.editar(registro.id, cuerpo)
      else await config.crear(cuerpo)
      guardado()
    } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar.') }
    finally { setOcupado(false) }
  }
  const campos = config.campos.filter(c => !registro || !c.soloCrear)
  return <ModalPortal titulo={`${registro ? 'Editar' : 'Crear'} · ${config.titulo}`} cerrar={cerrar} bloqueado={ocupado}>
    <form onSubmit={e => void enviar(e)} className="grid gap-4 sm:grid-cols-2">
      {campos.map(c => {
        const actualizar = (valor: unknown) => setDatos(actual => ({
          ...actual, [c.clave]: valor,
          ...(c.clave === 'destino.tipo' ? { 'destino.id': '' } : {})
        }))
        const valor = datos[c.clave]
        const referencia = c.referencia === 'destinos' && !['categoria', 'servicio'].includes(String(datos['destino.tipo'] ?? '')) ? undefined : c.referencia === 'destinos' ?
          (datos['destino.tipo'] === 'servicio' ? 'servicios' : 'categorias') : c.referencia
        if (['productos', 'categorias', 'marcas', 'industrias', 'servicios'].includes(config.recurso) && ['imagen', 'logo'].includes(c.clave))
          return <CampoImagen key={c.clave} etiqueta={c.etiqueta} valor={String(valor ?? '')} actualizar={actualizar}
            endpoint={`/api/portal/catalogo/imagenes/${config.recurso}`} actividad={setImagenPendiente} bloqueado={ocupado} />
        return <label key={c.clave} className={c.tipo === 'textarea' ? 'sm:col-span-2' : ''}>
          <span className="mb-1 block text-sm font-medium">{c.etiqueta}</span>
          {c.referencia === 'destinos' && !referencia ? <p className="rounded border p-2 text-sm text-neutral-500">Selecciona primero el tipo de destino.</p> : referencia ? <SelectorCatalogo referencia={referencia} valor={String(valor ?? '')} actualizar={actualizar}
            obligatorio={c.obligatorio} bloqueado={ocupado} /> : c.tipo === 'checkbox' ?
            <input type="checkbox" checked={Boolean(valor)} onChange={e => actualizar(e.target.checked)} disabled={ocupado} /> :
            c.opciones ? <select required={c.obligatorio} value={String(valor ?? '')} onChange={e => actualizar(e.target.value)}
              className="w-full rounded border border-neutral-300 bg-white p-2">
              <option value="">Seleccionar…</option>{c.opciones.map(o => <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}
            </select> : c.tipo === 'textarea' ? <textarea value={String(valor ?? '')} rows={3} required={c.obligatorio}
              onChange={e => actualizar(e.target.value)} className="w-full rounded border border-neutral-300 bg-white p-2" /> :
              <input type={c.tipo === 'number' || c.tipo === 'number-nullable' ? 'number' : 'text'} inputMode={c.tipo === 'decimal' ? 'decimal' : undefined}
                min={c.tipo === 'number' || c.tipo === 'number-nullable' ? 0 : undefined} step={c.tipo === 'number' || c.tipo === 'number-nullable' ? 1 : undefined}
                required={c.obligatorio} value={String(valor ?? '')} onChange={e => actualizar(e.target.value)}
                className="w-full rounded border border-neutral-300 bg-white p-2" />}
          {c.ayuda && <small className="block text-neutral-500">{c.ayuda}</small>}
        </label>
      })}
      {error && <p role="alert" className="text-red-700 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={cerrar} disabled={ocupado} className="rounded border px-4 py-2">Cancelar</button>
        <button type="submit" disabled={ocupado || imagenPendiente} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{ocupado ? 'Guardando…' : 'Guardar'}</button></div>
    </form>
  </ModalPortal>
}
