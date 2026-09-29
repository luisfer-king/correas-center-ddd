import { useEffect, useId, useState, type FormEvent } from 'react'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { empresasApi } from '../api/empresas'
import type { BaseCrm, EmpresaCrm, SucursalCrm } from '../api/tipos-crm'
import type { ConfiguracionCrm } from './campos-crm'
import { FormularioSucursal } from './formulario-sucursal'
import { SelectorLogoEmpresa } from './selector-logo-empresa'

export function FormularioRecursoCrm<T extends BaseCrm, A extends string>(props: {
  config: ConfiguracionCrm<T, A>; registro: T | null; cerrar: () => void; guardado: () => void
}) {
  if (props.config.recurso === 'sucursales') return <FormularioSucursal registro={props.registro as unknown as SucursalCrm | null} cerrar={props.cerrar} guardado={props.guardado} />
  return <FormularioGeneralCrm {...props} />
}

function FormularioGeneralCrm<T extends BaseCrm, A extends string>({ config, registro, cerrar, guardado }: {
  config: ConfiguracionCrm<T, A>; registro: T | null; cerrar: () => void; guardado: () => void
}) {
  const [datos, setDatos] = useState<Record<string, unknown>>(() => Object.fromEntries(config.campos.map((campo) =>
    [campo.clave, registro ? (registro as unknown as Record<string, unknown>)[campo.clave] :
      campo.tipo === 'checkbox' ? false : campo.tipo === 'number' ? 0 : ''])))
  const [empresas, setEmpresas] = useState<EmpresaCrm[]>([])
  const listaEmpresasId = useId()
  const [subiendoLogo, setSubiendoLogo] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (config.recurso === 'empresas' || registro || !config.campos.some((c) => c.clave === 'empresaId')) return
    const controlador = new AbortController()
    void empresasApi.listar(1, { signal: controlador.signal }).then((lista) => {
      if (!controlador.signal.aborted) setEmpresas(lista.filter((empresa) => empresa.estado === 'activo'))
    }).catch(() => { if (!controlador.signal.aborted) setEmpresas([]) })
    return () => controlador.abort()
  }, [config, registro])
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (ocupado || subiendoLogo) return
    setError(''); setOcupado(true)
    const cuerpo = Object.fromEntries(config.campos.filter((campo) => !registro || !campo.soloCrear).map((campo) => {
      const valor = datos[campo.clave]
      return [campo.clave, campo.tipo === 'checkbox' || campo.tipo === 'number' ? valor :
        String(valor ?? '').trim() || (campo.obligatorio ? '' : null)]
    }))
    try {
      if (registro && config.editar) await config.editar(registro.id, cuerpo)
      else if (!registro && config.crear) await config.crear(cuerpo)
      else throw new Error('Este recurso solo admite consulta y cambios de estado.')
      guardado()
    } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar el registro.') }
    finally { setOcupado(false) }
  }
  return <ModalPortal titulo={`${registro ? 'Editar' : 'Crear'} · ${config.titulo}`} cerrar={cerrar} bloqueado={ocupado || subiendoLogo}>
    <form onSubmit={(e) => void enviar(e)} className="grid gap-4 sm:grid-cols-2">
      {config.campos.filter((campo) => !registro || !campo.soloCrear).map((campo) => {
        const valor = datos[campo.clave]
        const actualizar = (nuevo: unknown) => setDatos((actual) => ({ ...actual, [campo.clave]: nuevo }))
        if (config.recurso === 'empresas' && campo.clave === 'logo') return <SelectorLogoEmpresa
          key={campo.clave} valor={String(valor ?? '')} actualizar={actualizar}
          bloqueado={ocupado} actividad={setSubiendoLogo} />
        return <label key={campo.clave} className={campo.tipo === 'textarea' ? 'sm:col-span-2' : ''}>
          <span className="mb-1 block text-sm font-medium">{campo.etiqueta}</span>
          {campo.tipo === 'checkbox' ? <input type="checkbox" checked={Boolean(valor)}
            onChange={(e) => actualizar(e.target.checked)} /> : campo.tipo === 'textarea' ?
            <textarea rows={4} required={campo.obligatorio} value={String(valor ?? '')}
              onChange={(e) => actualizar(e.target.value)} className="w-full rounded border border-neutral-300 bg-white p-2" /> :
            campo.clave === 'empresaId' ? <><input required={campo.obligatorio} inputMode="numeric"
              pattern="[1-9][0-9]*" list={listaEmpresasId} value={String(valor ?? '')}
              onChange={(e) => actualizar(e.target.value)}
              className="w-full rounded border border-neutral-300 bg-white p-2" />
              <datalist id={listaEmpresasId}>{empresas.map((empresa) =>
                <option key={empresa.id} value={empresa.id} label={empresa.nombre} />)}</datalist></> :
              <input type={campo.tipo === 'uuid' ? 'text' : campo.tipo ?? 'text'}
                min={campo.tipo === 'number' ? 0 : undefined} step={campo.tipo === 'number' ? 1 : undefined}
                required={campo.obligatorio} value={String(valor ?? '')}
                onChange={(e) => actualizar(campo.tipo === 'number' ? Number(e.target.value) : e.target.value)}
                className="w-full rounded border border-neutral-300 bg-white p-2" />}
          {campo.ayuda && <small className="block text-neutral-500">{campo.ayuda}</small>}
        </label>
      })}
      {error && <p role="alert" className="sm:col-span-2 text-red-700">{error}</p>}
      <div className="flex justify-end gap-3 sm:col-span-2">
        <button type="button" onClick={cerrar} disabled={ocupado || subiendoLogo} className="rounded border px-4 py-2">Cancelar</button>
        <button type="submit" disabled={ocupado || subiendoLogo} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">
          {ocupado ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  </ModalPortal>
}
