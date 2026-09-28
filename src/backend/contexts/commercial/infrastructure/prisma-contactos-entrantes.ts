import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevoContactoEntrante, RepositorioContactosEntrantes } from '../application/ports/repositorio-contactos-entrantes.js'
import { idCRM } from '../domain/commercial-values.js'
import type { ContactoEntrante } from '../domain/contacto-entrante.js'
import { aContactoEntrante } from './mappers/contacto-entrante.js'
import {
    auditarCambio, empresaActiva, paginaCrm, permitirGestion,
    sinEliminados, transaccionCrm, versionCrm
} from './operaciones-crm.js'

export class PrismaContactosEntrantes implements RepositorioContactosEntrantes {
    constructor(private readonly db: PrismaClient) { }

    async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<ContactoEntrante | null> {
        const fila = await this.db.contactoEntrante.findFirst({
            where: {
                id: idCRM(id), ...sinEliminados(incluirEliminados)
            }
        })
        return fila === null ? null : aContactoEntrante(fila)
    }

    async listar(pagina: number, incluirEliminados: boolean): Promise<readonly ContactoEntrante[]> {
        const filas = await this.db.contactoEntrante.findMany({
            where: sinEliminados(incluirEliminados),
            orderBy: [{ creadoEn: 'desc' }, { id: 'desc' }],
            skip: paginaCrm(pagina), take: 100
        })
        return filas.map(aContactoEntrante)
    }

    async crear(datos: DatosNuevoContactoEntrante, actorId: string): Promise<ContactoEntrante> {
        return transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'contactos')
            await empresaActiva(tx, datos.empresaId)
            const ahora = new Date()
            const fila = await tx.contactoEntrante.create({
                data: {
                    empresaId: datos.empresaId, nombre: datos.nombre,
                    empresaDeclarada: datos.empresaDeclarada, telefono: datos.telefono,
                    email: datos.email.value, mensaje: datos.mensaje,
                    estado: 'nuevo', creadoEn: ahora, actualizadoEn: ahora,
                }
            })
            const contacto = aContactoEntrante(fila)
            await auditarCambio(tx, actorId, 'contactos', fila.id.toString(), null, contacto.estado)
            return contacto
        })
    }

    async guardar(contacto: ContactoEntrante, versionAnterior: Date, actorId: string): Promise<void> {
        await transaccionCrm(this.db, async (tx) => {
            await permitirGestion(tx, actorId, 'contactos')
            const anterior = await tx.contactoEntrante.findUnique({
                where: { id: contacto.id },
                select: { empresaId: true, estado: true, eliminadoEn: true }
            })
            if (!anterior || anterior.empresaId !== contacto.empresaId || anterior.eliminadoEn !== null) {
                throw new Error('Contacto no disponible')
            }
            // Nunca persistir campos del mensaje original al cambiar el estado.
            const resultado = await tx.contactoEntrante.updateMany({
                where: {
                    id: contacto.id, empresaId: contacto.empresaId,
                    actualizadoEn: versionCrm(versionAnterior), eliminadoEn: null,
                }, data: {
                    estado: contacto.estado, eliminadoEn: contacto.eliminadoEn,
                    actualizadoEn: contacto.actualizadoEn
                }
            })
            if (resultado.count !== 1) throw new Error('Contacto modificado por otra operación')
            await auditarCambio(tx, actorId, 'contactos', contacto.id.toString(),
                anterior.estado, contacto.estado, contacto.eliminadoEn)
        })
    }
}
