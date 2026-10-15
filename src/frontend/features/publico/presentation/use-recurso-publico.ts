import { useEffect, useRef, useState } from 'react'
export function useRecursoPublico<T>(leer:(signal?:AbortSignal)=>Promise<T>, inicial:T) {
 const [datos,setDatos]=useState(inicial),[error,setError]=useState(''),[cargando,setCargando]=useState(true),[activo,setActivo]=useState(false),[revision,setRevision]=useState(0)
 const elemento=useRef<HTMLElement>(null)
 useEffect(()=>{
  if(typeof IntersectionObserver==='undefined'){setActivo(true);return}
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setActivo(true);observer.disconnect()}},{rootMargin:'350px'})
  if(elemento.current)observer.observe(elemento.current)
  return()=>observer.disconnect()
 },[])
 useEffect(()=>{
  if(!activo)return
  const controller=new AbortController();setCargando(true);setError('')
  leer(controller.signal).then(d=>{if(!controller.signal.aborted)setDatos(d)}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'No se pudo cargar el contenido.')}).finally(()=>{if(!controller.signal.aborted)setCargando(false)})
  return()=>controller.abort()
 },[leer,activo,revision])
 return {datos,error,cargando,elemento,reintentar:()=>setRevision(n=>n+1)}
}
