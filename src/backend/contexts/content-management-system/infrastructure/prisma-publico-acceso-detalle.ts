import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { AccesoDetallePublico } from '../../../shared/application/acceso-detalle-publico.js'
import { publicable } from '../../../shared/infrastructure/paginacion-publica.js'
export class PrismaPublicoAccesoDetalle implements AccesoDetallePublico {
 constructor(private readonly db:PrismaClient){}
 async permitidos(empresaId:bigint, productos:string[]) {
  if(!productos.length)return new Set<string>()
  const filas=await this.db.menu.findMany({where:{empresaId,...publicable,mostrar:true,tipoRegistro:'producto',registroId:{in:[...new Set(productos)].map(BigInt)},cargarSubmenu:'activo'},select:{registroId:true}})
  return new Set(filas.map(f=>String(f.registroId)))
 }
}
