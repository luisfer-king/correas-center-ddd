import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioMarcasProducto } from '../application/ports/repositorio-marcas-producto.js'
import { auditarCatalogo, permitirCatalogo, referenciaActiva, transaccionCatalogo } from './operaciones-catalogo.js'
export class PrismaMarcasProducto implements RepositorioMarcasProducto {
    constructor(private readonly db: PrismaClient) { }
    async actualizar(productoId: bigint, asignar: readonly bigint[], desasignar: readonly bigint[], actor: string) {
        await transaccionCatalogo(this.db, async tx => {
            await permitirCatalogo(tx, actor, 'asignaciones-marca')
            await tx.$queryRaw`SELECT id FROM public.productos WHERE id = ${productoId} FOR UPDATE`
            await referenciaActiva(tx, 'producto', productoId)
            // Validar todo antes de escribir; el lote completo es atómico.
            for (const marcaId of asignar) await referenciaActiva(tx, 'marca', marcaId)
            const ahora = new Date()
            for (const marcaId of asignar) {
                const anterior = await tx.productoMarca.findFirst({ where: { productoId, marcaId }, orderBy: { id: 'asc' } })
                if (anterior?.estado === 'activo') continue
                const fila = anterior ? await tx.productoMarca.update({ where: { id: anterior.id }, data: { estado: 'activo', actualizadoEn: ahora } }) :
                    await tx.productoMarca.create({ data: { productoId, marcaId, estado: 'activo', orden: null, creadoEn: ahora, actualizadoEn: ahora } })
                await auditarCatalogo(tx, actor, 'asignaciones-marca', fila.id, anterior?.estado ?? null, 'activo')
            }
            for (const marcaId of desasignar) {
                const anterior = await tx.productoMarca.findFirst({ where: { productoId, marcaId }, orderBy: { id: 'asc' } })
                if (!anterior || anterior.estado !== 'activo') continue
                await tx.productoMarca.update({ where: { id: anterior.id }, data: { estado: 'inactivo', actualizadoEn: ahora } })
                await auditarCatalogo(tx, actor, 'asignaciones-marca', anterior.id, anterior.estado, 'inactivo')
            }
        })
    }
}
