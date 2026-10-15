import type { PasoPublicado } from '../../../../shared/publico/cms'
import type { IndustriaPublica,ProductoPublico,ServicioPublico } from '../../../../shared/publico/catalogo'
export interface OpcionAsistente {id:string;nombre:string;productoId?:string;productoNombre?:string}
export interface DatosAsistente {industrias:IndustriaPublica[];productos:ProductoPublico[];servicios:ServicioPublico[]}
export function configuracionAsistenteValida(pasos:PasoPublicado[]){
 const vistos=new Set<string>();let productos=false
 return pasos.length>0&&pasos.every(p=>{if(vistos.has(p.identificador)||!['industrias','productos','categorias','servicios'].includes(p.fuenteDatos))return false;vistos.add(p.identificador)
  if(p.campoFiltro&&!(p.fuenteDatos==='categorias'&&p.campoFiltro==='producto_id'&&productos))return false
  if(p.fuenteDatos==='productos')productos=true
  return true
 })
}
export function opcionesAsistente(paso:PasoPublicado,pasos:PasoPublicado[],selecciones:Record<string,OpcionAsistente[]>,datos:DatosAsistente):OpcionAsistente[]{
 if(paso.fuenteDatos==='industrias')return datos.industrias
 if(paso.fuenteDatos==='productos')return datos.productos
 if(paso.fuenteDatos==='servicios')return datos.servicios
 const anteriores=pasos.slice(0,pasos.findIndex(p=>p.id===paso.id))
 const ids=new Set(anteriores.filter(p=>p.fuenteDatos==='productos').flatMap(p=>selecciones[p.identificador]||[]).map(p=>p.id))
 return datos.productos.filter(p=>!paso.campoFiltro||ids.has(p.id)).flatMap(p=>(p.categorias||[]).map(c=>({id:c.id,nombre:c.nombre,productoId:p.id,productoNombre:p.nombre})))
}
export function resumenAsistente(pasos:PasoPublicado[],selecciones:Record<string,OpcionAsistente[]>){return 'Buenas, me interesa recibir información sobre esta selección:\n\n'+pasos.map(p=>p.titulo+':\n'+(selecciones[p.identificador]||[]).map(o=>'• '+(o.productoNombre?o.productoNombre+' — ':'')+o.nombre).join('\n')).join('\n\n')}
