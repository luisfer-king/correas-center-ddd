import { slugServicio } from '../../../../shared/publico/rutas.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-servicios.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoServicios implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.servicio.findMany({ where: { empresaId, ...publicable, ...nombreBuscado(entrada.q) }, select: { id: true, nombre: true, descripcion: true, imagen: true, orden: true }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), nombre: f.nombre, slug: slugServicio(f.nombre), descripcion: f.descripcion, imagen: f.imagen, orden: f.orden })), entrada)
 }
}
