import type { GamaCategoria } from '../../domain/gama-categoria.js'
import type { GrupoGama } from '../../domain/grupo-gama.js'
import type { GamaCompleta } from '../../application/ports/repositorio-gamas.js'
import type { PlantillaGamaProducto } from '../../domain/plantilla-gama-producto.js'
import type { RegistroCatalogo } from '../../domain/catalog-values.js'
const fechas=(e:RegistroCatalogo)=>({estado:e.estado,creadoEn:e.creadoEn.toISOString(),actualizadoEn:e.actualizadoEn.toISOString(),eliminadoEn:e.eliminadoEn?.toISOString()??null})
export const dtoGama=(g:GamaCategoria)=>({id:String(g.id),categoriaId:String(g.categoriaId),productoId:String(g.productoId),gamaOrigenId:g.gamaOrigenId===null?null:String(g.gamaOrigenId),titulo:g.titulo,descripcion:g.descripcion,imagen:g.imagen,...fechas(g),version:g.actualizadoEn.toISOString()})
const grupo=(g:GrupoGama)=>({id:String(g.id),gamaId:String(g.gamaId),codigo:g.codigo,nombre:g.nombre,orden:g.orden,...fechas(g)})
export const dtoGamaCompleta=(d:GamaCompleta)=>({...dtoGama(d.gama),
 gruposColumnas:d.estructura.gruposColumnas.map(grupo),gruposFilas:d.estructura.gruposFilas.map(grupo),
 columnas:d.estructura.columnas.map(c=>({id:String(c.id),gamaId:String(c.gamaId),atributoId:String(c.atributoId),tipoDato:c.tipoDato,...c.presentacion,grupoId:c.presentacion.grupoId===null?null:String(c.presentacion.grupoId),orden:c.orden,...fechas(c)})),
 filas:d.estructura.filas.map(f=>({id:String(f.id),gamaId:String(f.gamaId),codigo:f.codigo,...f.detalle,grupoId:f.detalle.grupoId===null?null:String(f.detalle.grupoId),orden:f.orden,...fechas(f)})),
 valores:d.estructura.valores.map(v=>({filaId:String(v.filaId),columnaId:String(v.columnaId),gamaId:String(v.gamaId),valor:v.valor.datos,creadoEn:v.creadoEn.toISOString(),actualizadoEn:v.actualizadoEn.toISOString()})),
})
export const dtoPlantilla=(p:PlantillaGamaProducto)=>({productoId:String(p.productoId),gamaId:String(p.gamaId),creadoEn:p.creadoEn.toISOString(),version:p.actualizadoEn.toISOString()})
/** Solo se usa con resultados de casos de escritura (IDs, contadores y versiones). */
export function dtoEscritura(d:unknown):unknown {
 if(typeof d==='bigint')return d.toString()
 if(d instanceof Date)return d.toISOString()
 if(Array.isArray(d))return d.map(dtoEscritura)
 if(d && typeof d==='object')return Object.fromEntries(Object.entries(d).map(([k,v])=>[k,dtoEscritura(v)]))
 return d
}
