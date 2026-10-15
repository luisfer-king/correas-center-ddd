import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-configuracion.js'
// Lista explícita: jamás devolver configuraciones arbitrarias, claves privadas o credenciales.
export const clavesConfiguracionPublica = ['whatsapp_numero', 'whatsapp_mensaje', 'whatsapp_activo', 'google_analytics_id', 'google_analytics_activo', 'tawk_property_id', 'tawk_widget_id', 'tawk_activo', 'marcas_presentacion']
export class PrismaPublicoConfiguracion implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint) {
  const filas = await this.db.configuracionSitio.findMany({ where: { activo: true, clave: { in: clavesConfiguracionPublica }, OR: [{ empresaId: null }, { empresaId }] }, select: { id: true, empresaId: true, clave: true, valor: true }, orderBy: { id: 'asc' } })
  const valores = new Map<string, string>()
  for (const alcance of [null, empresaId]) for (const fila of filas.filter(f => f.empresaId === alcance)) valores.set(fila.clave, fila.valor ?? '')
  const texto = (clave: string) => valores.get(clave) ?? ''
  const activo = (clave: string) => texto(clave).trim().toLowerCase() === 'true'
  return { marcas: { presentacion: texto('marcas_presentacion') === 'todas' ? 'todas' as const : 'carrusel' as const }, whatsapp: { numero: texto('whatsapp_numero'), mensaje: texto('whatsapp_mensaje'), activo: activo('whatsapp_activo') }, analytics: { id: texto('google_analytics_id'), activo: activo('google_analytics_activo') }, chat: { propertyId: texto('tawk_property_id'), widgetId: texto('tawk_widget_id'), activo: activo('tawk_activo') } }
 }
}
