import { useState } from 'react'
import { ModalPortal } from '../../../iam/presentation/modal-portal'
import type { Gama,RecursoGama,GrupoGama,ColumnaGama,FilaGama } from '../../api/tipos-gamas'
import type { AtributoTecnicoCatalogo } from '../../api/tipos-catalogo'
import { gamasApi } from '../../api/gamas'
import { Campo,entrada,boton,primario,opcional,type EjecutarGama } from './controles-gamas'
type Elemento=GrupoGama|ColumnaGama|FilaGama
export function FormularioElementoGama({gama,recurso,elemento,atributos,cerrar,ejecutar,bloqueado,ocupado,error}:{gama:Gama;recurso:RecursoGama;elemento:Elemento|null;atributos:AtributoTecnicoCatalogo[];cerrar:()=>void;ejecutar:EjecutarGama;bloqueado:boolean;ocupado:boolean;error:string}) {
 const [datos,setDatos]=useState<Record<string,string>>(()=>Object.fromEntries(Object.entries(elemento??{}).map(([k,v])=>[k,v===null?'':String(v)]))),[buscar,setBuscar]=useState('')
 const campo=(k:string,v:string)=>setDatos(d=>({...d,[k]:v})),columna=recurso==='columnas',fila=recurso==='filas',grupo=!columna&&!fila
 const opciones=atributos.filter(a=>a.estado==='activo'&&!gama.columnas.some(c=>c.atributoId===a.id&&c.estado!=='eliminado')&&(a.nombre.toLowerCase().includes(buscar.toLowerCase())||a.id===datos.atributoId))
 const grupos=columna?gama.gruposColumnas:gama.gruposFilas
 async function guardar(){
  let payload:Record<string,unknown>
  if(grupo)payload={nombre:datos.nombre,...(!elemento?{codigo:datos.codigo}:{})}
  else if(fila)payload={nombre:datos.nombre,grupoId:opcional(datos.grupoId),descripcion:opcional(datos.descripcion),enlaceDetalle:opcional(datos.enlaceDetalle),...(!elemento?{codigo:datos.codigo}:{})}
  else {const atributo=atributos.find(a=>a.id===datos.atributoId);if(!elemento&&!atributo)return;payload={grupoId:opcional(datos.grupoId),etiqueta:opcional(datos.etiqueta),unidadMedida:opcional(datos.unidadMedida),...(!elemento?{atributoId:atributo!.id,tipoDato:atributo!.tipoDato}:{})}}
  if(await ejecutar(()=>elemento?gamasApi.editarElemento(gama.id,gama.version,recurso,elemento.id,payload):gamasApi.crearElemento(gama.id,gama.version,recurso,payload),'Estructura guardada.'))cerrar()
 }
 const input=(k:string,nombre:string,required=false,maxLength=255)=><Campo nombre={nombre}><input className={entrada} required={required} maxLength={maxLength} value={datos[k]??''} onChange={e=>campo(k,e.target.value)} pattern={k==='codigo'?'[a-z0-9][a-z0-9_-]{0,79}':undefined}/></Campo>
 return <ModalPortal titulo={`${elemento?'Editar':'Crear'} · ${recurso.replaceAll('-',' ')}`} cerrar={cerrar} bloqueado={ocupado}>
 <form className="space-y-4" onSubmit={e=>{e.preventDefault();void guardar()}}><fieldset disabled={bloqueado} className="space-y-4">
 {!columna&&!elemento&&input('codigo','Código (minúsculas, números, guion)',true,80)}
 {!columna&&input('nombre','Nombre',true)}
 {columna&&!elemento&&<><Campo nombre="Buscar atributo"><input className={entrada} type="search" value={buscar} onChange={e=>setBuscar(e.target.value)}/></Campo><Campo nombre="Atributo técnico"><select required className={entrada} value={datos.atributoId??''} onChange={e=>campo('atributoId',e.target.value)}><option value="">Seleccionar…</option>{opciones.map(a=><option key={a.id} value={a.id}>{a.nombre} · {a.tipoDato}</option>)}</select></Campo><p className="text-sm">Si falta un atributo, créalo en Catálogo → Atributos técnicos y actualiza esta vista.</p></>}
 {!grupo&&<Campo nombre="Grupo"><select className={entrada} value={datos.grupoId??''} onChange={e=>campo('grupoId',e.target.value)}><option value="">Sin grupo</option>{grupos.filter(g=>g.estado!=='eliminado').map(g=><option key={g.id} value={g.id}>{g.nombre}{g.estado==='inactivo'?' (inactivo)':''}</option>)}</select></Campo>}
 {columna&&<>{input('etiqueta','Etiqueta personalizada (opcional)')}{input('unidadMedida','Unidad personalizada (opcional)',false,80)}</>}
 {fila&&<><Campo nombre="Descripción (opcional)"><textarea className={entrada} value={datos.descripcion??''} onChange={e=>campo('descripcion',e.target.value)}/></Campo>{input('enlaceDetalle','Enlace de detalle (ruta /… o HTTPS)',false,2048)}</>}
 {!elemento&&<p className="text-sm text-neutral-500">El orden se asigna automáticamente al final.</p>}
 </fieldset>{error&&<p role="alert" className="text-red-700">{error}</p>}<div className="flex justify-end gap-2"><button type="button" className={boton} disabled={ocupado} onClick={cerrar}>Cancelar</button><button className={primario} disabled={bloqueado}>Guardar</button></div></form></ModalPortal>
}
