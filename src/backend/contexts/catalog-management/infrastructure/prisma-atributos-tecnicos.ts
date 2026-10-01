import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevoAtributoTecnico, RepositorioAtributosTecnicos } from '../application/ports/repositorio-atributos-tecnicos.js'
import type { AtributoTecnico, ValoresAtributo } from '../domain/atributo-tecnico.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aAtributoTecnico } from './mappers/atributo-tecnico.js'
import type { TxCatalogo } from './operaciones-catalogo.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaAtributosTecnicos implements RepositorioAtributosTecnicos {
  constructor(private readonly db: PrismaClient) { }
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AtributoTecnico | null> {
    const fila = await this.db.atributoTecnico.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aAtributoTecnico(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, tipoAtributoId?: bigint): Promise<readonly AtributoTecnico[]> {
    const filas = await this.db.atributoTecnico.findMany({ where: { ...sinEliminados(incluirEliminados), ...(tipoAtributoId === undefined ? {} : { tipoAtributoId: idCatalogo(tipoAtributoId) }), }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aAtributoTecnico)
  }
  async crear(datos: DatosNuevoAtributoTecnico, actorId: string): Promise<AtributoTecnico> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'atributos-tecnicos')
      await referenciaActiva(tx, 'tipoAtributo', datos.tipoAtributoId)
      await validarCapacidades(tx, datos.tipoAtributoId, datos.valores)
      const ahora = new Date()
      const fila = await tx.atributoTecnico.create({ data: { nombre: datos.nombre, tipoAtributoId: datos.tipoAtributoId, orden: datos.orden.value, descripcion: datos.valores.descripcion, valorNumerico: datos.valores.valorNumerico, unidadMedida: datos.valores.unidadMedida, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aAtributoTecnico(fila)
      await auditarCatalogo(tx, actorId, 'atributos-tecnicos', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: AtributoTecnico, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'atributos-tecnicos')
      await referenciaActiva(tx, 'tipoAtributo', registro.tipoAtributoId)
      await validarCapacidades(tx, registro.tipoAtributoId, registro.valores)
      const anterior = await tx.atributoTecnico.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.atributoTecnico.updateMany({
        where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, orden: registro.orden.value, descripcion: registro.valores.descripcion, valorNumerico: registro.valores.valorNumerico, unidadMedida: registro.valores.unidadMedida, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn }
      })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'atributos-tecnicos', registro.id, anterior.estado, registro.estado)
    })
  }
}

async function validarCapacidades(tx: TxCatalogo, id: bigint, valores: Readonly<ValoresAtributo>): Promise<void> {
  const tipo = await tx.tipoAtributo.findUnique({
    where: { id }, select: {
      permiteDescripcion: true, permiteValorNumerico: true, permiteUnidadMedida: true,
    }
  })
  if (!tipo || (valores.descripcion !== null && !tipo.permiteDescripcion) ||
    (valores.valorNumerico !== null && !tipo.permiteValorNumerico) ||
    (valores.unidadMedida !== null && !tipo.permiteUnidadMedida)) {
    throw new Error('Valores incompatibles con el tipo de atributo')
  }
}
