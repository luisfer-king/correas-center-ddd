import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublicaSoluciones } from '../application/ports/consulta-publica-soluciones.js'
import { publicable, ordenPublico } from '../../../shared/infrastructure/paginacion-publica.js'
import { slugServicio } from '../../../../shared/publico/rutas.js'
const industriaSelect = { id: true, nombre: true, slug: true, imagen: true, orden: true } as const
const servicioSelect = { id: true, nombre: true, descripcion: true, imagen: true, orden: true } as const
export class PrismaPublicoSoluciones implements ConsultaPublicaSoluciones {
 constructor(private readonly db: PrismaClient) {}
 async industria(empresaId: bigint, slug: string) {
  const industria = await this.db.industria.findFirst({ where: { empresaId, slug, ...publicable }, select: industriaSelect })
  if (!industria) return null
  const asignaciones = await this.db.industriaAsignacion.findMany({ where: { industriaId: industria.id, estado: 'activo' }, select: { tipoRegistro: true, registroId: true }, orderBy: ordenPublico })
  const ids = (tipo: string) => asignaciones.filter(a => a.tipoRegistro === tipo).map(a => a.registroId)
  const [categorias, servicios] = await Promise.all([
   this.db.categoria.findMany({ where: { id: { in: ids('categoria') }, ...publicable, producto: { empresaId, ...publicable } }, select: { id:true,nombre:true,slug:true,imagen:true,descripcion:true,descripcionCorta:true,uso:true,orden:true,producto:{select:{id:true,nombre:true,slug:true,imagen:true,orden:true}} } }),
   this.db.servicio.findMany({ where: { id: { in: ids('servicio') }, empresaId, ...publicable }, select: servicioSelect }),
  ])
  const cats = new Map(categorias.map(c => [String(c.id), { ...c, id:String(c.id), producto:{...c.producto,id:String(c.producto.id)} }]))
  const serv = new Map(servicios.map(s => [String(s.id), { ...s, id:String(s.id), slug:slugServicio(s.nombre) }]))
  const vistos = new Set<string>()
  const unicas = asignaciones.filter(a => { const clave=a.tipoRegistro+':'+a.registroId; if(vistos.has(clave))return false; vistos.add(clave);return true })
  return { ...industria, id:String(industria.id), categorias:unicas.flatMap(a => a.tipoRegistro==='categoria'&&cats.has(String(a.registroId))?[cats.get(String(a.registroId))!]:[]), servicios:unicas.flatMap(a => a.tipoRegistro==='servicio'&&serv.has(String(a.registroId))?[serv.get(String(a.registroId))!]:[]) }
 }
 async servicio(empresaId: bigint, slug: string) {
  // Servicio no tiene columna slug: se conserva la URL derivada del nombre.
  const candidatos = await this.db.servicio.findMany({ where:{empresaId,...publicable}, select:{id:true,nombre:true}, orderBy:ordenPublico })
  const coincidencias=candidatos.filter(s=>slugServicio(s.nombre)===slug)
  if(coincidencias.length!==1)return null
  const servicio=await this.db.servicio.findFirst({where:{id:coincidencias[0].id,empresaId,...publicable},select:servicioSelect})
  if(!servicio)return null
  const industrias=await this.db.industria.findMany({where:{empresaId,...publicable,relIndustriaAsignacion:{some:{tipoRegistro:'servicio',registroId:servicio.id,estado:'activo'}}},select:industriaSelect,orderBy:ordenPublico})
  return {...servicio,id:String(servicio.id),slug,industrias:industrias.map(i=>({...i,id:String(i.id)}))}
 }
}
