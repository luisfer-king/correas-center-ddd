import { idCatalogo } from '../../../domain/catalog-values.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import type { RepositorioMarcasProducto } from '../../ports/repositorio-marcas-producto.js'
export class GestionarMarcasProducto {
    constructor(private readonly repositorio: RepositorioMarcasProducto, private readonly autorizar: AutorizacionCatalogo) { }
    async ejecutar(actor: string, productoId: bigint, asignar: readonly bigint[], desasignar: readonly bigint[]) {
        await exigirGestion(this.autorizar, actor, 'asignaciones-marca')
        if (asignar.length + desasignar.length > 1000) throw new Error('Solicitud inválida')
        const altas = [...new Set(asignar.map(idCatalogo))], bajas = [...new Set(desasignar.map(idCatalogo))]
        if (altas.some(id => bajas.includes(id))) throw new Error('Solicitud inválida')
        await this.repositorio.actualizar(idCatalogo(productoId), altas, bajas, actor)
    }
}
