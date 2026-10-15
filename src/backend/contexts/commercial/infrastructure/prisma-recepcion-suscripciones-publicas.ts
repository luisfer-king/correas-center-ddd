import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { Email } from '../../../shared/domain/value-objects.js'
import type { RecepcionSuscripcionesPublicas } from '../application/ports/recepcion-suscripciones-publicas.js'
import { EmpresaNoPublicada } from '../../../shared/application/lectura-publica.js'
export class PrismaRecepcionSuscripcionesPublicas implements RecepcionSuscripcionesPublicas {
 constructor(private readonly db:PrismaClient){}
 async recibir(empresaId:bigint,email:Email){await this.db.$transaction(async tx=>{
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${'suscripcion:'+email.value},0))::text`
  if(!await tx.empresa.findFirst({where:{id:empresaId,estado:'activo',eliminadoEn:null},select:{id:true}}))throw new EmpresaNoPublicada()
  const existente=await tx.suscriptor.findFirst({where:{email:{equals:email.value,mode:'insensitive'}},select:{id:true}})
  // El email es único globalmente. No revelar, transferir ni reactivar registros existentes.
  if(!existente)await tx.suscriptor.createMany({data:[{empresaId,email:email.value,estado:'inactivo',emailVerificadoEn:null}],skipDuplicates:true})
 })}
}
