import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-sucursales.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoSucursales implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.sucursal.findMany({ where: { empresaId, ...publicable }, select: { id: true, nombre: true, direccion: true, telefono: true, email: true, horarios: true, mapaIncrustado: true, latitud: true, longitud: true, esPrincipal: true, orden: true }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), nombre: f.nombre, direccion: f.direccion, telefono: f.telefono, email: f.email, horarios: f.horarios, mapaIncrustado: f.mapaIncrustado, latitud: f.latitud?.toString() ?? null, longitud: f.longitud?.toString() ?? null, esPrincipal: f.esPrincipal, orden: f.orden })), entrada)
 }
}
