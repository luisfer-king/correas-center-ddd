import { useCallback,useEffect,useRef,useState } from 'react'
import { Link,useParams } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { catalogoApi } from '../api/cliente-catalogo'
import { categoriasApi } from '../api/categorias'
import { atributos_tecnicosApi } from '../api/atributos-tecnicos'
import { gamasApi } from '../api/gamas'
import type { Gama,PlantillaGama,EstadoGama } from '../api/tipos-gamas'
import type { CategoriaCatalogo,CapacidadesCatalogo,AtributoTecnicoCatalogo } from '../api/tipos-catalogo'
import { EstructuraGama } from './gamas/estructura-gama'
import { TablaValoresGama } from './gamas/tabla-valores-gama'
import { PanelPlantillasGama } from './gamas/panel-plantillas-gama'
import { FormularioGama } from './gamas/formulario-gama'
import { boton,primario } from './gamas/controles-gamas'
export function VistaGamaCategoria(){const {categoriaId=''}=useParams();return <AdministracionGama key={categoriaId} categoriaId={categoriaId}/>}
export function AdministracionGama({categoriaId}:{categoriaId:string}) {
 const [categoria,setCategoria]=useState<CategoriaCatalogo|null>(null),[capacidades,setCapacidades]=useState<CapacidadesCatalogo|null>(null),[gama,setGama]=useState<Gama|null>(null),[plantilla,setPlantilla]=useState<PlantillaGama|null>(null),[atributos,setAtributos]=useState<AtributoTecnicoCatalogo[]>([])
 const [cargando,setCargando]=useState(true),[ocupado,setOcupado]=useState(false),[error,setError]=useState(''),[aviso,setAviso]=useState(''),[mensaje,setMensaje]=useState(''),[conflicto,setConflicto]=useState(false),[pendientes,setPendientes]=useState(false),[revision,setRevision]=useState(0),[tab,setTab]=useState('tabla'),[form,setForm]=useState(false)
 const cerrojo=useRef(false),montado=useRef(true)
 const cargar=useCallback(async(signal?:AbortSignal)=>{
  const [cat,cap]=await Promise.all([categoriasApi.obtener(categoriaId,{signal}),catalogoApi.capacidades({signal})]);if(!cap.recursos.categorias.leer)throw new ErrorApi(403,'No tienes permiso para consultar gamas.')
  const [g,ref]=await Promise.all([gamasApi.porCategoria(categoriaId,signal),gamasApi.plantilla(cat.productoId,signal)])
  let lista:AtributoTecnicoCatalogo[]=[],advertencia=''
  if(cap.recursos['atributos-tecnicos'].leer){try{for(let pagina=1;pagina<=10000;pagina++){const parte=await atributos_tecnicosApi.listar(pagina,{}, {signal});lista.push(...parte);if(parte.length<100)break}}catch(e){if(signal?.aborted)throw e;advertencia='No se pudieron cargar las definiciones de atributos. Actualiza para reintentar.'}}else advertencia='Sin permiso de lectura de atributos: se muestran sus IDs y no podrás agregar columnas.'
  if(signal?.aborted||!montado.current)return
  setCategoria(cat);setCapacidades(cap);setGama(g);setPlantilla(ref);setAtributos(lista);setAviso(advertencia)
 },[categoriaId])
 useEffect(()=>{montado.current=true;const c=new AbortController();setCargando(true);void cargar(c.signal).catch(e=>{if(!c.signal.aborted)setError(e.message)}).finally(()=>{if(!c.signal.aborted)setCargando(false)});return()=>{montado.current=false;c.abort()}},[cargar])
 useEffect(()=>{if(!pendientes)return;const salir=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=''};const enlace=(e:MouseEvent)=>{if((e.target as HTMLElement).closest('a[href]')&&!window.confirm('Hay valores sin guardar. ¿Salir y descartarlos?')){e.preventDefault();e.stopPropagation()}};window.addEventListener('beforeunload',salir);document.addEventListener('click',enlace,true);return()=>{window.removeEventListener('beforeunload',salir);document.removeEventListener('click',enlace,true)}},[pendientes])
 async function recargar(){if(cerrojo.current)return;if(pendientes&&!window.confirm('¿Descartar los valores pendientes y cargar la versión actual?'))return;cerrojo.current=true;setOcupado(true);setError('');try{await cargar();setPendientes(false);setConflicto(false);setRevision(n=>n+1);setForm(false)}catch(e){setConflicto(true);setError((e as Error).message)}finally{cerrojo.current=false;setOcupado(false)}}
 async function ejecutar(accion:()=>Promise<unknown>,texto:string){if(cerrojo.current||conflicto)return false;cerrojo.current=true;setOcupado(true);setError('');setMensaje('');let guardado=false
  try{await accion();guardado=true;await cargar();setMensaje(texto);return true}catch(e){if(!montado.current)return guardado;const detalle=e instanceof Error?e.message:'No se pudo completar la operación.';if(guardado){setConflicto(true);setError('El cambio se guardó, pero no se pudo actualizar la vista. Recarga antes de continuar.');return true}if(e instanceof ErrorApi&&e.estado===409){setConflicto(true);setError(`${detalle}. Recarga la gama antes de continuar; los valores pendientes todavía no se han descartado.`)}else setError(detalle);return false}finally{cerrojo.current=false;if(montado.current)setOcupado(false)}
 }
 const gestionar=capacidades?.recursos.categorias.gestionar===true&&categoria?.estado==='activo',editable=gestionar&&gama?.estado!=='eliminado',bloqueado=ocupado||conflicto
 async function cambiarEstado(accion:EstadoGama){if(gama&&window.confirm(`¿Confirmas ${accion} la gama «${gama.titulo}»?`))await ejecutar(()=>gamasApi.estado(gama.id,gama.version,accion),'Estado actualizado.')}
 return <main className="w-full space-y-6 px-6 py-8 text-neutral-900 dark:text-neutral-100"><Link to="/portal/catalogo/categorias" className="text-sm text-red-700 underline dark:text-red-400">← Volver a categorías</Link><header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-red-700">Catálogo · Gamas</p><h1 className="mt-2 text-3xl font-semibold">{categoria?.nombre??'Gama de categoría'}</h1>{gama&&<p className="mt-2">{gama.titulo} · <span className="capitalize">{gama.estado}</span>{plantilla?.gamaId===gama.id?' · Plantilla del producto':''}</p>}</div><div className="flex flex-wrap gap-2"><button className={boton} disabled={ocupado||cargando} onClick={()=>void recargar()}>Recargar</button>{!cargando&&editable&&<button className={primario} disabled={bloqueado||pendientes} onClick={()=>setForm(true)}>{gama?'Editar gama':'Crear gama vacía'}</button>}{gama&&editable&&([gama.estado==='activo'?'inactivar':'activar','eliminar'] as EstadoGama[]).map(accion=><button key={accion} className={boton} disabled={bloqueado||pendientes} onClick={()=>void cambiarEstado(accion)}>{accion==='activar'?'Activar gama':accion==='inactivar'?'Inactivar gama':'Eliminar gama'}</button>)}</div></header>
 {error&&<div role="alert" className="rounded border border-red-300 bg-red-50 p-4 text-red-900 dark:bg-red-950 dark:text-red-100">{error}</div>}{mensaje&&<p role="status" className="rounded border border-green-300 p-3 text-green-700 dark:text-green-300">{mensaje}</p>}{aviso&&<p className="text-sm text-amber-700 dark:text-amber-300">{aviso}</p>}
 {cargando?<p role="status">Cargando gama…</p>:categoria&&<>{!gestionar&&<p className="text-sm">Vista de consulta. La edición requiere permiso de gestión y una categoría activa.</p>}{!gama&&<p>Esta categoría todavía no tiene gama. Puedes crearla vacía o copiar una gama del mismo producto en «Plantillas».</p>}{gama?.estado==='eliminado'&&<p>Registro eliminado: solo consulta del historial. No se puede reemplazar con una copia.</p>}
 <nav aria-label="Apartados de gama" className="flex flex-wrap gap-2 border-b pb-3">{[['tabla','Tabla técnica'],['estructura','Estructura'],['plantillas','Plantillas']].map(([valor,nombre])=><button key={valor} aria-pressed={tab===valor} disabled={ocupado||(pendientes&&tab!==valor)} onClick={()=>setTab(valor!)} className={tab===valor?primario:boton}>{nombre}</button>)}</nav>
 {pendientes&&<p role="status" className="text-sm">Hay valores pendientes: guárdalos o descártalos antes de cambiar de apartado.</p>}
 {tab==='tabla'&&gama&&<TablaValoresGama key={`${gama.id}:${revision}`} gama={gama} atributos={atributos} editable={!!editable} bloqueado={bloqueado} ejecutar={ejecutar} pendientes={setPendientes}/>}
 {tab==='estructura'&&gama&&<EstructuraGama key={revision} gama={gama} atributos={atributos} editable={!!editable} bloqueado={bloqueado} ocupado={ocupado} ejecutar={ejecutar} error={error}/>}
 {tab==='plantillas'&&<PanelPlantillasGama key={revision} productoId={categoria.productoId} categoriaId={categoriaId} gama={gama} plantilla={plantilla} editable={!!gestionar} bloqueado={bloqueado} ejecutar={ejecutar}/>}
 </>}{form&&categoria&&<FormularioGama categoriaId={categoriaId} nombre={categoria.nombre} gama={gama} cerrar={()=>setForm(false)} ejecutar={ejecutar} bloqueado={bloqueado} ocupado={ocupado} error={error}/>}</main>
}
