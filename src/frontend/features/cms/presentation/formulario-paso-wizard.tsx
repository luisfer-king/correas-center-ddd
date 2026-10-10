import { useState, type FormEvent } from 'react'
import { empresasApi } from '../../commercial/api/empresas'
import { SelectorSeccion } from './selector-seccion'
import type { DatosFormularioCms } from './campos-cms'

async function cargarEmpresas(pagina: number, signal: AbortSignal) {
  const lote = await empresasApi.listar(pagina, { signal })
  return { opciones: lote.filter(e => e.estado === 'activo').map(e => ({ id: e.id, nombre: e.nombre })), mas: lote.length === 100 }
}

export function FormularioPasoWizard({ datos = {}, editar = false, guardar, ocupado, cancelar }: {
  datos?: DatosFormularioCms; editar?: boolean; guardar: (d: DatosFormularioCms) => Promise<void>; ocupado: boolean; cancelar: () => void
}) {
  const [empresa, setEmpresa] = useState(String(datos.empresaId ?? ''))
  const [identificador, setIdentificador] = useState(String(datos.identificador ?? ''))
  const [titulo, setTitulo] = useState(String(datos.titulo ?? ''))
  const [descripcion, setDescripcion] = useState(String(datos.descripcion ?? ''))
  const [fuente, setFuente] = useState(String(datos.fuenteDatos ?? 'industrias'))
  const [filtro, setFiltro] = useState(String(datos.campoFiltro ?? ''))
  const [error, setError] = useState('')
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (ocupado) return
    setError('')
    try {
      if (!empresa) throw new Error('Selecciona una empresa')
      if (!titulo.trim() || !descripcion.trim() || !fuente.trim() || !identificador.trim()) throw new Error('Completa los campos obligatorios')
      const cuerpo = { titulo: titulo.trim(), descripcion: descripcion.trim(), fuenteDatos: fuente.trim(), campoFiltro: filtro.trim() || null }
      await guardar(editar ? cuerpo : { ...cuerpo, empresaId: empresa, identificador: identificador.trim() })
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar') }
  }
  return <form className="cms-form" onSubmit={e => void enviar(e)}><fieldset disabled={ocupado}>
    <SelectorSeccion etiqueta="Empresa" valor={empresa} cargar={cargarEmpresas} cambiar={setEmpresa} bloqueado={editar || ocupado}/>
    <label>Identificador *<input required readOnly={editar} value={identificador} placeholder="industria, producto o categoria" onChange={e => setIdentificador(e.target.value)}/><small>Código utilizado para guardar la selección de este paso.</small></label>
    <label>Título *<input required value={titulo} onChange={e => setTitulo(e.target.value)}/></label>
    <label>Descripción *<textarea required value={descripcion} onChange={e => setDescripcion(e.target.value)}/></label>
    <label>Fuente de datos *<input required list="wizard-fuentes" value={fuente} onChange={e => {setFuente(e.target.value);setFiltro('')}}/><datalist id="wizard-fuentes"><option value="industrias"/><option value="productos"/><option value="categorias"/></datalist></label>
    <label>Campo de filtro (opcional)<input list="wizard-filtros" value={filtro} placeholder="Sin filtro" onChange={e => setFiltro(e.target.value)}/><datalist id="wizard-filtros">{fuente === 'categorias' && <option value="producto_id"/>}</datalist></label>
    <small>Para categorías, producto_id utiliza el producto elegido en un paso anterior con identificador producto. Deja el filtro vacío en los pasos de industria y producto.</small>
    <p>Orden: {editar ? String(datos.orden ?? '') : 'automático desde 1 por empresa'}</p>
  </fieldset>{error && <p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" className="cms-primary" disabled={ocupado}>{ocupado ? 'Guardando…' : 'Guardar'}</button></div></form>
}
