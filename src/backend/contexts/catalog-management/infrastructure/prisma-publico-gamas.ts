import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaGamaPublica } from '../application/ports/consulta-publica-gamas.js'
import { publicable, ordenPublico } from '../../../shared/infrastructure/paginacion-publica.js'
import { enlacePublico } from '../../../../shared/publico/rutas.js'
export class PrismaPublicoGamas implements ConsultaGamaPublica {
 constructor(private readonly db:PrismaClient){}
 async obtener(empresaId:bigint,categoriaId:string) {
  const grupoVisible={OR:[{grupoId:null},{grupo:publicable}]}
  const atributoVisible={...publicable,tipoAtributo:publicable}
  const g=await this.db.gamaCategoria.findFirst({where:{categoriaId:BigInt(categoriaId),...publicable,categoria:{...publicable,producto:{empresaId,...publicable}}},select:{
   id:true,categoriaId:true,productoId:true,titulo:true,descripcion:true,imagen:true,
   gruposColumnas:{where:publicable,orderBy:ordenPublico,select:{id:true,codigo:true,nombre:true,orden:true}},
   gruposFilas:{where:publicable,orderBy:ordenPublico,select:{id:true,codigo:true,nombre:true,orden:true}},
   columnas:{where:{...publicable,...grupoVisible,atributo:atributoVisible},orderBy:ordenPublico,select:{id:true,grupoId:true,etiqueta:true,unidadMedida:true,tipoDato:true,orden:true,atributo:{select:{nombre:true,unidadMedida:true}}}},
   filas:{where:{...publicable,...grupoVisible},orderBy:ordenPublico,select:{id:true,grupoId:true,codigo:true,nombre:true,descripcion:true,enlaceDetalle:true,orden:true,valores:{select:{columnaId:true,tipoDato:true,valorTexto:true,valorNumero:true,valorBooleano:true}}}},
  }})
  if(!g)return null
  const columnas=new Map(g.columnas.map((c,i)=>[String(c.id),i]))
  return {id:String(g.id),categoriaId:String(g.categoriaId),productoId:String(g.productoId),titulo:g.titulo,descripcion:g.descripcion,imagen:g.imagen,
   gruposColumnas:g.gruposColumnas.map(c=>({...c,id:String(c.id)})),gruposFilas:g.gruposFilas.map(c=>({...c,id:String(c.id)})),
   columnas:g.columnas.map(c=>({id:String(c.id),grupoId:c.grupoId===null?null:String(c.grupoId),nombre:c.etiqueta||c.atributo.nombre,unidadMedida:c.unidadMedida??c.atributo.unidadMedida,tipoDato:c.tipoDato,orden:c.orden})),
   filas:g.filas.map(f=>({id:String(f.id),grupoId:f.grupoId===null?null:String(f.grupoId),codigo:f.codigo,nombre:f.nombre,descripcion:f.descripcion,enlaceDetalle:enlacePublico(f.enlaceDetalle,true),orden:f.orden})),
   valores:g.filas.flatMap(f=>f.valores.filter(v=>columnas.has(String(v.columnaId))).sort((a,b)=>columnas.get(String(a.columnaId))!-columnas.get(String(b.columnaId))!).map(v=>({filaId:String(f.id),columnaId:String(v.columnaId),valor:v.tipoDato==='numero'?v.valorNumero?.toFixed()??null:v.tipoDato==='booleano'?v.valorBooleano:v.valorTexto}))),
  }
 }
}
