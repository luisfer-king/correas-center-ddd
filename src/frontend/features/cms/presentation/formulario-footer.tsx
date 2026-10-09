import { useCallback, useState, type FormEvent } from 'react'
import { empresasApi } from '../../commercial/api/empresas'
import { clienteRecurso } from '../../catalog/api/cliente-catalogo'
import { SelectorSeccion } from './selector-seccion'
import type { DatosFormularioCms } from './campos-cms'
import type { TipoFooterFormulario } from '../api/tipos-elementos-footer'
const tipos:TipoFooterFormulario[]=['producto','industria','servicio','red_social']
const nombres:Record<TipoFooterFormulario,string>={producto:'Producto',industria:'Industria',servicio:'Servicio',red_social:'Red social'}
async function cargarEmpresas(pagina:number,signal:AbortSignal){
 const lote=await empresasApi.listar(pagina,{signal})
 return {opciones:lote.filter(e=>e.estado==='activo').map(e=>({id:e.id,nombre:e.nombre})),mas:lote.length===100}
}
export function FormularioFooter({datos={},editar=false,guardar,ocupado,cancelar}:{datos?:DatosFormularioCms;editar?:boolean;guardar:(d:DatosFormularioCms)=>Promise<void>;ocupado:boolean;cancelar:()=>void}){
 const destino=datos.destino as {tipo?:string;id?:string}|null|undefined
 const [empresa,setEmpresa]=useState(String(datos.empresaId??'')),[tipo,setTipo]=useState<TipoFooterFormulario>(tipos.includes(datos.tipo as TipoFooterFormulario)?datos.tipo as TipoFooterFormulario:'producto')
 const [vincular,setVincular]=useState(!!destino?.id),[registro,setRegistro]=useState(String(destino?.id??''))
 const [titulo,setTitulo]=useState(String(datos.titulo??'')),[url,setUrl]=useState(String(datos.enlace??'')),[icono,setIcono]=useState(String(datos.icono??'')),[mostrar,setMostrar]=useState(datos.mostrar!==false),[error,setError]=useState('')
 const cargarRegistros=useCallback(async(pagina:number,signal:AbortSignal)=>{
  if(!empresa||tipo==='red_social')return {opciones:[],mas:false}
  const recurso=tipo==='producto'?'productos':tipo==='industria'?'industrias':'servicios'
  const lote=await clienteRecurso(recurso).listar(pagina,{empresaId:empresa},{signal})
  return {opciones:lote.filter(r=>r.estado==='activo').map(r=>({id:r.id,nombre:r.nombre})),mas:lote.length===100}
 },[empresa,tipo])
 async function enviar(e:FormEvent){e.preventDefault();if(ocupado)return;setError('');try{
  if(!empresa)throw new Error('Selecciona una empresa')
  if(vincular&&tipo!=='red_social'&&!registro)throw new Error('Selecciona un registro o desmarca su vinculación')
  const cuerpo={destino:vincular&&tipo!=='red_social'?{tipo,id:registro}:null,titulo:titulo.trim()||null,enlace:url.trim()||null,icono:icono.trim()||null,mostrar}
  await guardar(editar?cuerpo:{...cuerpo,empresaId:empresa,tipo})
 }catch(e){setError(e instanceof Error?e.message:'No se pudo guardar')}}
 return <form className="cms-form" onSubmit={e=>void enviar(e)}><fieldset disabled={ocupado}>
  <SelectorSeccion etiqueta="Empresa" valor={empresa} cargar={cargarEmpresas} cambiar={v=>{setEmpresa(v);setRegistro('')}} bloqueado={editar||ocupado}/>
  <label>Tipo *<select value={tipo} disabled={editar} onChange={e=>{setTipo(e.target.value as TipoFooterFormulario);setRegistro('');setVincular(false)}}>{tipos.map(t=><option key={t} value={t}>{nombres[t]}</option>)}</select></label>
  {tipo!=='red_social'&&<><label><input type="checkbox" checked={vincular} onChange={e=>{setVincular(e.target.checked);if(!e.target.checked)setRegistro('')}}/>Vincular un registro del catálogo (opcional)</label>
   {vincular&&<><label>Tipo de registro<input readOnly value={tipo}/></label><SelectorSeccion key={`${empresa}-${tipo}`} etiqueta={`${nombres[tipo]} de destino`} valor={registro} cargar={cargarRegistros} cambiar={setRegistro} bloqueado={!empresa||ocupado}/><small>Se guarda el ID real del registro seleccionado.</small></>}
  </>}
  <label>Título (opcional)<input value={titulo} onChange={e=>setTitulo(e.target.value)}/></label>
  <label>URL (opcional)<input value={url} placeholder="https://… o /contact/" onChange={e=>setUrl(e.target.value)}/></label>
  <label>Icono de Font Awesome (opcional)<input value={icono} placeholder="fa-brands fa-facebook-f" onChange={e=>setIcono(e.target.value)}/><small>Clases de Font Awesome, por ejemplo: fab fa-whatsapp o fa-brands fa-facebook-f.</small></label>
  <label>Visible<select value={String(mostrar)} onChange={e=>setMostrar(e.target.value==='true')}><option value="true">Sí</option><option value="false">No</option></select></label>
  <p>Orden: {editar?String(datos.orden??''):'automático desde 1 por empresa y tipo'}</p>
  <small>Los campos opcionales vacíos se guardan sin valor.</small>
 </fieldset>{error&&<p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" className="cms-primary" disabled={ocupado}>{ocupado?'Guardando…':'Guardar'}</button></div></form>
}
