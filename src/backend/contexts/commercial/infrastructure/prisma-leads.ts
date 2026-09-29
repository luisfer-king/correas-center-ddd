import type { PrismaClient } from '../../../generated/prisma/client.js'
import { exigirSuperAdminParaPerfil } from '../../identity-access-management/infrastructure/exigir-super-admin-para-perfil.js'
import type { DatosNuevoLead, RepositorioLeads } from '../application/ports/repositorio-leads.js'
import { idCRM } from '../domain/commercial-values.js'
import type { Lead } from '../domain/lead.js'
import { aLead } from './mappers/lead.js'
import {
    auditarCambio, empresaActiva, paginaCrm, permitirGestion,
    sinEliminados, transaccionCrm, uuidCrm, versionCrm,
    type TransaccionCrm
} from './operaciones-crm.js'

async function validarResponsable(tx: TransaccionCrm, actorId: string, responsableId: string | null): Promise<void> {
    if (responsableId === null) return
    const id = uuidCrm(responsableId)
    const existe = await tx.perfil.findFirst({
        where: { id, estado: 'activo', eliminadoEn: null },
        select: { id: true }
    })
    if (!existe) throw new Error('Responsable no disponible')
    await exigirSuperAdminParaPerfil(tx, actorId, id)
}

export class PrismaLeads implements RepositorioLeads {
    constructor(private readonly db: PrismaClient) { }

    async buscarPorId(id: string, incluirEliminados: boolean): Promise<Lead | null> {
        const fila = await this.db.lead.findFirst({
            where: {
                id: uuidCrm(id), ...sinEliminados(incluirEliminados)
            }
        })
        return fila === null ? null : aLead(fila)
    }

    async buscarPorContactoId(contactoId: bigint, incluirEliminados: boolean): Promise<Lead | null> {
        const fila = await this.db.lead.findFirst({
            where: {
                contactoId: idCRM(contactoId), ...sinEliminados(incluirEliminados)
            }
        })
        return fila === null ? null : aLead(fila)
    }

    async listar(pagina: number, incluirEliminados: boolean): Promise<readonly Lead[]> {
        const filas = await this.db.lead.findMany({
            where: sinEliminados(incluirEliminados),
            orderBy: [{ creadoEn: 'desc' }, { id: 'desc' }],
            skip: paginaCrm(pagina), take: 100
        })
        return filas.map(aLead)
    }

    async crear(datos: DatosNuevoLead, actorId: string): Promise<Lead> {
        return transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'leads')
            await empresaActiva(tx, datos.empresaId)
            if (datos.contactoId !== null) {
                const contacto = await tx.contactoEntrante.findFirst({
                    where: {
                        id: idCRM(datos.contactoId), empresaId: datos.empresaId, eliminadoEn: null,
                    }, select: { id: true }
                })
                if (!contacto) throw new Error('Contacto no disponible')
            }
            await validarResponsable(tx, actorId, datos.responsableId)
            const ahora = new Date()
            const fila = await tx.lead.create({
                data: {
                    empresaId: datos.empresaId, contactoId: datos.contactoId,
                    responsableId: datos.responsableId,
                    estado: 'nuevo', creadoEn: ahora, actualizadoEn: ahora,
                }
            })
            const lead = aLead(fila)
            await auditarCambio(tx, actorId, 'leads', fila.id, null, lead.estado)
            return lead
        })
    }

    async guardar(lead: Lead, versionAnterior: Date, actorId: string): Promise<void> {
        await transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'leads')
            const anterior = await tx.lead.findUnique({
                where: { id: uuidCrm(lead.id) },
                select: {
                    empresaId: true, contactoId: true, estado: true, responsableId: true,
                    eliminadoEn: true
                }
            })
            if (!anterior || anterior.empresaId !== lead.empresaId ||
                anterior.contactoId !== lead.contactoId || anterior.eliminadoEn !== null) {
                throw new Error('Lead no disponible')
            }
            if (lead.responsableId !== anterior.responsableId) {
                await validarResponsable(tx, actorId, lead.responsableId)
            }
            const resultado = await tx.lead.updateMany({
                where: {
                    id: lead.id, actualizadoEn: versionCrm(versionAnterior), eliminadoEn: null,
                }, data: {
                    estado: lead.estado, responsableId: lead.responsableId,
                    eliminadoEn: lead.eliminadoEn, actualizadoEn: lead.actualizadoEn
                }
            })
            if (resultado.count !== 1) throw new Error('Lead modificado por otra operación')
            await auditarCambio(tx, actorId, 'leads', lead.id, anterior.estado, lead.estado, lead.eliminadoEn)
        })
    }
}
