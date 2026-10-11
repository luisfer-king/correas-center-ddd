import { useState } from 'react'
import type { Gama,CambioCelda,ValorTecnico } from '../../api/tipos-gamas'
import type { AtributoTecnicoCatalogo } from '../../api/tipos-catalogo'
import { gamasApi } from '../../api/gamas'
import { CampoValorTecnico,validarValor } from './campo-valor-tecnico'
import { boton,primario,type EjecutarGama } from './controles-gamas'
export function TablaValoresGama({gama,atributos,editable,bloqueado,ejecutar,pendientes}:{gama:Gama;atributos:AtributoTecnicoCatalogo[];editable:boolean;bloqueado:boolean;ejecutar:EjecutarGama;pendientes:(v:boolean)=>void}) {
 const [cambios,setCambios]=useState<Record<string,CambioCelda>>({}),[error,setError]=useState('')
 const columnas=gama.columnas.filter(c=>c.estado!=='eliminado'),filas=gama.filas.filter(f=>f.estado!=='eliminado')
 function cambiar(filaId:string,columnaId:string,valor:ValorTecnico|null) {
  const key=`${filaId}:${columnaId}`,actual=gama.valores.find(v=>v.filaId===filaId&&v.columnaId===columnaId)?.valor??null
  const nuevos={...cambios};if(JSON.stringify(actual)===JSON.stringify(valor))delete nuevos[key];else nuevos[key]={filaId,columnaId,valor}
  setCambios(nuevos);pendientes(Object.keys(nuevos).length>0)
 }
 function descartar(){setCambios({});pendientes(false);setError('')}
 async function guardar(){setError('');const lote=Object.values(cambios);try{lote.forEach(c=>validarValor(c.valor));if(lote.length>1000)throw new Error('Guarda como máximo 1000 celdas por lote.')}catch(e){setError((e as Error).message);return}
  if(await ejecutar(()=>gamasApi.valores(gama.id,gama.version,lote),'Valores guardados.'))descartar()
 }
 return <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">Tabla técnica</h2><p className="text-sm text-neutral-500">Elige «Sin valor» para quitar una celda. Cero, No y texto vacío son valores válidos.</p></div>
 {editable&&<div className="flex gap-2"><button className={boton} disabled={bloqueado||!Object.keys(cambios).length} onClick={descartar}>Descartar cambios</button><button className={primario} disabled={bloqueado||!Object.keys(cambios).length} onClick={()=>void guardar()}>Guardar valores ({Object.keys(cambios).length})</button></div>}</div>
 {error&&<p role="alert" className="text-red-700">{error}</p>}
 {!filas.length||!columnas.length?<p>Agrega columnas y filas en «Estructura» para completar la tabla.</p>:<div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><caption className="sr-only">Valores técnicos de {gama.titulo}</caption><thead><tr><th scope="col" className="p-3">Variante</th>{columnas.map(c=>{const a=atributos.find(a=>a.id===c.atributoId),grupo=gama.gruposColumnas.find(g=>g.id===c.grupoId);return <th key={c.id} scope="col" className="p-3"><small className="block text-neutral-500">{grupo?.nombre}</small>{c.etiqueta??a?.nombre??`Atributo #${c.atributoId}`} {(c.unidadMedida??a?.valores.unidadMedida)&&<span>({c.unidadMedida??a?.valores.unidadMedida})</span>}<small className="block">{c.tipoDato}{c.estado==='inactivo'?' · Inactiva':''}</small></th>})}</tr></thead><tbody>{filas.map(f=><tr key={f.id} className="border-t"><th scope="row" className="p-3 font-medium"><small className="block text-neutral-500">{gama.gruposFilas.find(g=>g.id===f.grupoId)?.nombre}</small>{f.nombre}<small className="block">{f.codigo}{f.estado==='inactivo'?' · Inactiva':''}</small></th>{columnas.map(c=>{const key=`${f.id}:${c.id}`,valor=Object.hasOwn(cambios,key)?cambios[key]!.valor:gama.valores.find(v=>v.filaId===f.id&&v.columnaId===c.id)?.valor??null;return <td className="p-3" key={c.id}>{editable?<CampoValorTecnico tipo={c.tipoDato} valor={valor} nombre={`${f.nombre} · ${c.etiqueta??atributos.find(a=>a.id===c.atributoId)?.nombre??c.atributoId}`} bloqueado={bloqueado} cambiar={v=>cambiar(f.id,c.id,v)}/>:valor===null?'—':typeof valor.valor==='boolean'?(valor.valor?'Sí':'No'):valor.valor}</td>})}</tr>)}</tbody></table></div>}
 </section>
}
