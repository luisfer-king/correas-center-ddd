import { useState } from 'react'
import { ModalPortal } from '../../../iam/presentation/modal-portal'
import { CampoImagen } from '../../../../shared/imagenes/campo-imagen'
import type { Gama } from '../../api/tipos-gamas'
import { gamasApi } from '../../api/gamas'
import { Campo,entrada,boton,primario,opcional,type EjecutarGama } from './controles-gamas'
export function FormularioGama({categoriaId,nombre,gama,cerrar,ejecutar,bloqueado,ocupado,error}:{categoriaId:string;nombre:string;gama:Gama|null;cerrar:()=>void;ejecutar:EjecutarGama;bloqueado:boolean;ocupado:boolean;error:string}) {
 const [titulo,setTitulo]=useState(gama?.titulo??nombre),[descripcion,setDescripcion]=useState(gama?.descripcion??''),[imagen,setImagen]=useState(gama?.imagen??''),[subiendo,setSubiendo]=useState(false)
 async function guardar(){const d={titulo:titulo.trim(),descripcion:opcional(descripcion),imagen:opcional(imagen)};if(await ejecutar(()=>gama?gamasApi.editar(gama.id,gama.version,d):gamasApi.crear(categoriaId,d),'Gama guardada.'))cerrar()}
 return <ModalPortal titulo={gama?'Editar gama':'Crear gama'} cerrar={cerrar} bloqueado={ocupado||subiendo}><form className="space-y-4" onSubmit={e=>{e.preventDefault();if(!subiendo)void guardar()}}><fieldset disabled={bloqueado} className="space-y-4"><Campo nombre="Título"><input required maxLength={255} className={entrada} value={titulo} onChange={e=>setTitulo(e.target.value)}/></Campo><Campo nombre="Descripción (opcional)"><textarea className={entrada} value={descripcion} onChange={e=>setDescripcion(e.target.value)}/></Campo><CampoImagen etiqueta="Imagen de la gama (opcional)" valor={imagen} actualizar={setImagen} endpoint="/api/portal/catalogo/imagenes/categorias" actividad={setSubiendo} bloqueado={bloqueado}/></fieldset>{error&&<p role="alert" className="text-red-700">{error}</p>}<div className="flex justify-end gap-2"><button type="button" disabled={ocupado||subiendo} className={boton} onClick={cerrar}>Cancelar</button><button disabled={bloqueado||subiendo||!titulo.trim()} className={primario}>Guardar</button></div></form></ModalPortal>
}
