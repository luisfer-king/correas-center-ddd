import { FooterElemento } from '../../domain/footer-elemento.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'
import { destinoCMS, enlaceCMS } from '../../domain/cms-values.js'
import type { TipoDestinoCMS } from '../../domain/cms-values.js'
import type { TipoFooter } from '../../domain/footer-elemento.js'

/** Campos escalares del modelo Prisma FooterElemento; no requiere cliente ni conexión. */
export type FilaFooterElemento = Readonly<{
  id: bigint
  empresaId: bigint
  tipo: string
  tipoRegistro: string | null
  registroId: bigint | null
  titulo: string | null
  url: string | null
  icono: string | null
  orden: number
  mostrar: boolean
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

function tipoDestino(valor: string): TipoDestinoCMS {
  if (valor !== 'producto' && valor !== 'industria' && valor !== 'servicio') throw new Error('Tipo de destino CMS inválido')
  return valor
}

function tipoFooter(valor: string): TipoFooter {
  if (valor !== 'producto' && valor !== 'industria' && valor !== 'servicio' && valor !== 'red_social') throw new Error('Tipo de footer inválido')
  return valor
}

export function mapearFooterElemento(fila: FilaFooterElemento): FooterElemento {
  if ((fila.tipoRegistro === null) !== (fila.registroId === null)) throw new Error('Destino de footer incompleto')
  const tipo = tipoFooter(fila.tipo)
  const destino = fila.tipoRegistro === null || fila.registroId === null ? null : destinoCMS(tipoDestino(fila.tipoRegistro), fila.registroId)
  if (destino !== null && (tipo === 'red_social' || destino.tipo !== tipo)) throw new Error('Destino no corresponde al tipo de footer')
  return new FooterElemento({
    id: fila.id,
    empresaId: fila.empresaId,
    tipo: tipo,
    titulo: fila.titulo,
    icono: fila.icono,
    orden: Orden.create(fila.orden),
    mostrar: fila.mostrar,
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
    destino,
    enlace: fila.url === null ? null : enlaceCMS(fila.url),
  })
}
