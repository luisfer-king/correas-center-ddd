import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RecepcionContactosPublicos } from '../application/ports/recepcion-contactos-publicos.js'
import type { DatosNuevoContactoEntrante } from '../application/ports/repositorio-contactos-entrantes.js'
import { EmpresaNoPublicada } from '../../../shared/application/lectura-publica.js'
export class PrismaRecepcionContactosPublicos implements RecepcionContactosPublicos {
 constructor(private readonly db:PrismaClient){}
 async recibir(d:DatosNuevoContactoEntrante){await this.db.$transaction(async tx=>{
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${String(d.empresaId)+':contacto:'+d.email.value},0))::text`
  if(!await tx.empresa.findFirst({where:{id:d.empresaId,estado:'activo',eliminadoEn:null},select:{id:true}}))throw new EmpresaNoPublicada()
  const datos={...d,email:d.email.value}
  const repetido=await tx.contactoEntrante.findFirst({where:{...datos,eliminadoEn:null,creadoEn:{gte:new Date(Date.now()-120000)}},select:{id:true}})
  if(repetido)return
  const contacto=await tx.contactoEntrante.create({data:datos,select:{id:true}})
  await tx.lead.create({data:{empresaId:d.empresaId,contactoId:contacto.id,estado:'nuevo'}})
 })}
}
