import type { PrismaClient } from '../../../generated/prisma/client.js'
import { EventoAuditoria } from '../../identity-access-management/domain/evento-auditoria.js'
import { exigirPermisoEnTransaccion } from '../../identity-access-management/infrastructure/exigir-permiso-en-transaccion.js'
import { insertarAuditoria } from '../../identity-access-management/infrastructure/insertar-auditoria.js'
import { actorCms } from '../application/seguridad-cms.js'
import type { ContextoAccionCms, RecursoCms } from '../application/seguridad-cms.js'
import type { RelojCms } from '../application/operaciones-cms.js'
import { recursosCms } from '../application/use-cases/autorizacion/obtener-capacidades-cms.js'
import { transaccionCms } from './operaciones-cms.js'

const tablas: Record<RecursoCms, string> = { tipos_seccion: 'tipo_seccion', contenidos_seccion: 'contenido_seccion',
  metadata_seccion: 'contenido_seccion', menus: 'menus', items_menu: 'menu_item', elementos_footer: 'footers',
  configuracion_sitio: 'configuracion_sitio', pasos_wizard: 'pasos_wizard', registros_cms: 'registros', contenidos_registro: 'registro_contenido' }
export class PrismaLecturasCms {
  constructor(private readonly db: PrismaClient, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, recurso: RecursoCms | 'portal', registroId: string | null = null): Promise<void> {
    await transaccionCms(this.db, async tx => {
      const actorId = actorCms(contexto.actorId)
      if (recurso !== 'portal') await exigirPermisoEnTransaccion(tx, actorId, `cms.${recurso}.read`)
      else {
        const cuenta = await tx.perfil.findFirst({ where: { id: actorId, estado: 'activo', eliminadoEn: null,
          relUsuarioRol: { some: { estado: 'activo', rol: { estado: 'activo', eliminadoEn: null,
            relRolPermiso: { some: { estado: 'activo', permiso: { estado: 'activo', eliminadoEn: null,
              slug: { in: recursosCms.flatMap(r => [`cms.${r}.read`, `cms.${r}.manage`]) } } } } } } } }, select: { id: true } })
        if (!cuenta) throw new Error('Acceso denegado')
      }
      await insertarAuditoria(tx, EventoAuditoria.registrar({ usuarioId: actorId, accion: 'Lectura',
        tablaAfectada: recurso === 'portal' ? 'portal_cms' : tablas[recurso], registroId,
        datosAnteriores: null, datosNuevos: null, ipAddress: contexto.ipAddress ?? null, userAgent: contexto.userAgent ?? null,
        metadata: { operacion: `cms.${recurso}.read` }, creadoEn: this.reloj.ahora() }))
    })
  }
}
