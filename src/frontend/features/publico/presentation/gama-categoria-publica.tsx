import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import type { GamaPublica, ColumnaGamaPublica } from '../../../../shared/publico/gamas'
import { enlacePublico } from '../../../../shared/publico/rutas'
import { consultarGamaPublica } from '../../catalog/api/publico/cliente-gama'
import { cargarPublico } from '../api/cache-publica'
import { useRecursoPublico } from './use-recurso-publico'
import { normalizarBusqueda } from './datos-catalogo-publico'
import { HtmlCms } from './html-cms'
import { imagenPublica } from './imagen-publica'
import './gama-publica.css'

export function cabecerasGama(g:GamaPublica) {
 const grupos:{id:string|null;nombre:string;columnas:ColumnaGamaPublica[]}[]=[]
 for(const c of g.columnas){const nombre=g.gruposColumnas.find(x=>x.id===c.grupoId)?.nombre??'Características',ultimo=grupos.at(-1);if(ultimo?.id===c.grupoId)ultimo.columnas.push(c);else grupos.push({id:c.grupoId,nombre,columnas:[c]})}
 return grupos
}
export function TablaGamaPublica({gama:g}:{gama:GamaPublica}) {
 const [q,setQ]=useState(''),[limite,setLimite]=useState(50),texto=normalizarBusqueda(q)
 const filas=g.filas.filter(f=>!texto||normalizarBusqueda(f.codigo+' '+f.nombre+' '+(g.gruposFilas.find(x=>x.id===f.grupoId)?.nombre??'')).includes(texto))
 const valores=new Map(g.valores.map(v=>[v.filaId+':'+v.columnaId,v.valor])),cabeceras=cabecerasGama(g),agrupadas=g.columnas.some(c=>c.grupoId!==null)
 return <section className="gama-publica"><h2>{g.titulo}</h2>{g.descripcion&&<HtmlCms html={g.descripcion}/>} {imagenPublica(g.imagen)&&<img className="gama-ilustracion" src={imagenPublica(g.imagen)} alt={'Esquema de '+g.titulo} width={600} height={300} loading="lazy" decoding="async"/>}
  {g.filas.length>0&&g.columnas.length>0?<><label className="gama-buscar">Buscar sección<input type="search" value={q} maxLength={100} placeholder="Código, nombre o grupo" onChange={e=>{setQ(e.target.value);setLimite(50)}}/></label><p role="status">{filas.length} secciones disponibles{filas.length>limite?' · Mostrando '+limite:''}</p><div className="gama-tabla-scroll" tabIndex={0} role="region" aria-label="Tabla de especificaciones; desplaza horizontalmente para ver todas las columnas"><table><caption>{g.titulo} · Especificaciones técnicas</caption><thead>{agrupadas&&<tr><th rowSpan={2} scope="col">Sección</th>{cabeceras.map((grupo,i)=><th key={i} scope="colgroup" colSpan={grupo.columnas.length}>{grupo.nombre}</th>)}</tr>}<tr>{!agrupadas&&<th scope="col">Sección</th>}{g.columnas.map(c=><th key={c.id} scope="col">{c.nombre}{c.unidadMedida&&<span className="gama-unidad">{c.unidadMedida}</span>}</th>)}</tr></thead><tbody>{filas.slice(0,limite).flatMap((f,i)=>{
   const grupo=f.grupoId?g.gruposFilas.find(x=>x.id===f.grupoId):null,previo=filas[i-1],enlace=enlacePublico(f.enlaceDetalle,true)
   return [grupo&&previo?.grupoId!==f.grupoId?<tr className="gama-grupo-filas" key={'grupo-'+f.id}><th colSpan={g.columnas.length+1} scope="rowgroup">{grupo.nombre}</th></tr>:null,<tr key={f.id}><th scope="row"><strong>{f.codigo}</strong>{f.nombre!==f.codigo&&<span>{f.nombre}</span>}{f.descripcion&&<details><summary>Descripción</summary><p>{f.descripcion}</p></details>}{enlace&&(enlace.startsWith('/')?<Link to={enlace}>Ver información →</Link>:<a href={enlace} target="_blank" rel="noopener noreferrer">Ver información →</a>)}</th>{g.columnas.map(c=>{const v=valores.get(f.id+':'+c.id);return <td key={c.id}>{v===null||v===undefined?'—':typeof v==='boolean'?v?'Sí':'No':v}</td>})}</tr>]
  })}</tbody></table></div>{!filas.length&&<p>No hay secciones para esta búsqueda.</p>}{filas.length>limite&&<button type="button" onClick={()=>setLimite(l=>l+50)}>Mostrar más secciones</button>}</>:<p>No hay especificaciones publicadas en esta gama.</p>}
 </section>
}
export function GamaCategoriaPublica({categoriaId}:{categoriaId:string}) {
 const leer=useCallback((signal?:AbortSignal)=>cargarPublico('gama:'+categoriaId,()=>consultarGamaPublica(categoriaId),signal),[categoriaId])
 const {datos,cargando,error,elemento,reintentar}=useRecursoPublico(leer,null as GamaPublica|null)
 return <div ref={elemento as React.RefObject<HTMLDivElement>}>{cargando?<p role="status">Cargando gama técnica…</p>:error?<section role="alert"><p>No se pudo cargar la gama técnica.</p><button onClick={reintentar}>Reintentar</button></section>:datos?<TablaGamaPublica gama={datos}/>:<section className="gama-publica"><h2>Gama técnica</h2><p>No hay una gama técnica publicada para esta categoría.</p></section>}</div>
}
