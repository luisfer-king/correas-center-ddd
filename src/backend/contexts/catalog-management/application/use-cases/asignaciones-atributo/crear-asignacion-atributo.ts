import type { RepositorioAsignacionesAtributo } from '../../ports/repositorio-asignaciones-atributo.js'
import { exigirGestion, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
import { idCatalogo } from '../../../domain/catalog-values.js'
import { Orden } from '../../../../../shared/domain/value-objects.js'
import { valorAsignacion, type DatosValorAsignacion } from '../../valor-asignacion-aplicacion.js'
export class CrearAsignacionAtributo {
  constructor(private readonly repositorio: RepositorioAsignacionesAtributo, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, datos: DatosValorAsignacion & { categoriaId: bigint; atributoId: bigint; orden: number }) {
    await exigirGestion(this.autorizar, actor, 'asignaciones-atributo')
    const valor=valorAsignacion(datos).valor?.datos
    return this.repositorio.crear({ categoriaId:idCatalogo(datos.categoriaId),atributoId:idCatalogo(datos.atributoId),orden:Orden.create(datos.orden),
      ...(valor?{tipoDato:valor.tipo}:{}),valorPersonalizado:valor?.tipo==='numero'?valor.valor:null,
      valorTexto:valor?.tipo==='texto'?valor.valor:null,valorBooleano:valor?.tipo==='booleano'?valor.valor:null },actor)
  }
}
