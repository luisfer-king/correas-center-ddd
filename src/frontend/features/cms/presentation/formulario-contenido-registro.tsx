import { useState, type FormEvent } from 'react'
import { empresasApi } from '../../commercial/api/empresas'
import { SelectorSeccion } from './selector-seccion'
import type { DatosFormularioCms } from './campos-cms'
async function cargarEmpresas(pagina:number,signal:AbortSignal){
 const lote=await empresasApi.listar(pagina,{signal})
 return {opciones:lote.filter(e=>e.estado==='activo').map(e=>({id:e.id,nombre:e.nombre})),mas:lote.length===100}
}
export function FormularioContenidoRegistro({registroId,nombrePadre,datos={},editar=false,guardar,ocupado,cancelar}:{registroId:string;nombrePadre:string;datos?:DatosFormularioCms;editar?:boolean;guardar:(d:DatosFormularioCms)=>Promise<void>;ocupado:boolean;cancelar:()=>void}){
 const inicial=datos.campos as Record<string,unknown>|undefined
 const [empresa,setEmpresa]=useState(String(datos.empresaId??'')),[titulo,setTitulo]=useState(String(inicial?.titulo??'')),[subtitulo,setSubtitulo]=useState(String(inicial?.subtitulo??'')),[descripcion,setDescripcion]=useState(String(inicial?.descripcion??'')),[icono,setIcono]=useState(String(inicial?.icono??'')),[error,setError]=useState('')
 async function enviar(e:FormEvent){e.preventDefault();if(ocupado)return;setError('');try{
  if(!empresa)throw new Error('Selecciona una empresa')
  const campos={titulo:titulo.trim()||null,subtitulo:subtitulo.trim()||null,descripcion:descripcion.trim()||null,icono:icono.trim()||null}
  await guardar(editar?{campos}:{empresaId:empresa,registroId,campos})
 }catch(e){setError(e instanceof Error?e.message:'No se pudo guardar')}}
 return <form className="cms-form" onSubmit={e=>void enviar(e)}><fieldset disabled={ocupado}>
  <label>Registro padre<input readOnly value={`${nombrePadre} · #${registroId}`}/></label>
  <SelectorSeccion etiqueta="Empresa" valor={empresa} cargar={cargarEmpresas} cambiar={setEmpresa} bloqueado={editar||ocupado}/>
  <label>Título<input value={titulo} onChange={e=>setTitulo(e.target.value)}/></label>
  <label>Subtítulo (opcional)<input value={subtitulo} onChange={e=>setSubtitulo(e.target.value)}/></label>
  <label>Descripción<textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)}/></label>
  <label>Icono<input value={icono} onChange={e=>setIcono(e.target.value)} placeholder="fa-building"/></label>
  <p>Orden: {editar?String(datos.orden??''):'automático desde 1 dentro de este registro'}</p>
 </fieldset>{error&&<p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" disabled={ocupado} className="cms-primary">{ocupado?'Guardando…':'Guardar'}</button></div></form>
}
