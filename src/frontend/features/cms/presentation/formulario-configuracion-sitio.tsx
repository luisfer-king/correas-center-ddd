import { useState, type FormEvent } from 'react'
import { empresasApi } from '../../commercial/api/empresas'
import { SelectorSeccion } from './selector-seccion'
import type { DatosFormularioCms } from './campos-cms'

export const gruposConfiguracionSitio = ['general', 'analytics', 'whatsapp', 'chat', 'redes_sociales'] as const
async function cargarEmpresas(pagina: number, signal: AbortSignal) {
  const lote = await empresasApi.listar(pagina, { signal })
  return { opciones: lote.filter(e => e.estado === 'activo').map(e => ({ id: e.id, nombre: e.nombre })), mas: lote.length === 100 }
}
type ValoresConfiguracion = {
  empresa: string; global: boolean; clave: string; valor: string; tipo: string; descripcion: string; grupo: string; activo: string
}
export function datosConfiguracionSitio(valores: ValoresConfiguracion, editar = false) {
  const { empresa, global, clave, valor, tipo, descripcion, grupo, activo } = valores
  const cuerpo = { valor: valor === '' ? null : valor, tipo: tipo.trim() || null, descripcion: descripcion === '' ? null : descripcion, grupo: grupo || null }
  if (editar) return cuerpo
  if (!global && !/^[1-9][0-9]{0,18}$/.test(empresa)) throw new Error('Selecciona una empresa')
  if (!clave.trim()) throw new Error('La clave es obligatoria')
  if (!['', 'true', 'false'].includes(activo)) throw new Error('Actividad inválida')
  return { ...cuerpo, empresaId: global ? null : empresa, clave: clave.trim(), activo: activo === '' ? null : activo === 'true' }
}

export function FormularioConfiguracionSitio({ datos = {}, editar = false, guardar, ocupado, cancelar }: {
  datos?: DatosFormularioCms; editar?: boolean; guardar: (d: DatosFormularioCms) => Promise<void>; ocupado: boolean; cancelar: () => void
}) {
  const [empresa, setEmpresa] = useState(String(datos.empresaId ?? ''))
  const [global, setGlobal] = useState(datos.empresaId === null || datos.empresaId === 'global')
  const [clave, setClave] = useState(String(datos.clave ?? ''))
  const [valor, setValor] = useState(String(datos.valor ?? ''))
  const [tipo, setTipo] = useState(String(datos.tipo ?? ''))
  const [descripcion, setDescripcion] = useState(String(datos.descripcion ?? ''))
  const [grupo, setGrupo] = useState(String(datos.grupo ?? ''))
  const [activo, setActivo] = useState(datos.activo == null ? '' : String(datos.activo))
  const [error, setError] = useState('')
  const grupoHistorico = !!grupo && !gruposConfiguracionSitio.some(g => g === grupo)
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (ocupado) return
    setError('')
    try { await guardar(datosConfiguracionSitio({ empresa, global, clave, valor, tipo, descripcion, grupo, activo }, editar)) }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') }
  }
  return <form className="cms-form" onSubmit={e => void enviar(e)}><fieldset disabled={ocupado}>
    <label className="cms-check"><input type="checkbox" checked={global} disabled={editar} onChange={e => setGlobal(e.target.checked)}/>Configuración global (sin empresa)</label>
    {global ? <p>Empresa: configuración global</p> : <SelectorSeccion etiqueta="Empresa" valor={empresa} cargar={cargarEmpresas} cambiar={setEmpresa} bloqueado={editar || ocupado}/>}
    <label>Clave *<input required readOnly={editar} value={clave} placeholder="titulo_sitio o whatsapp_activo" onChange={e => setClave(e.target.value)}/></label>
    <label>Valor (opcional)<textarea value={valor} onChange={e => setValor(e.target.value)}/><small>Para tipo booleano escribe true o false. El valor se conserva como texto en la base de datos.</small></label>
    <label>Tipo (opcional)<input list="configuracion-tipos" value={tipo} onChange={e => setTipo(e.target.value)}/><datalist id="configuracion-tipos"><option value="texto"/><option value="booleano"/></datalist></label>
    <label>Descripción (opcional)<textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}/></label>
    <label>Grupo<select value={grupo} onChange={e => setGrupo(e.target.value)}><option value="">Sin definir</option>{grupoHistorico && <option value={grupo}>{grupo} (actual)</option>}{gruposConfiguracionSitio.map(g => <option key={g} value={g}>{g}</option>)}</select></label>
    {!editar && <label>Activo<select value={activo} onChange={e => setActivo(e.target.value)}><option value="">Sin definir</option><option value="true">Sí</option><option value="false">No</option></select></label>}
    <small>La actividad del registro se administra por separado del valor de claves como whatsapp_activo o google_analytics_activo.</small>
  </fieldset>{error && <p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" className="cms-primary" disabled={ocupado}>{ocupado ? 'Guardando…' : 'Guardar'}</button></div></form>
}
