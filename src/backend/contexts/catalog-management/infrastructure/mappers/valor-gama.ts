import type { Prisma } from '../../../../generated/prisma/client.js'
import { ValorGama } from '../../domain/valor-gama.js'
import { ValorTecnico } from '../../domain/valor-tecnico.js'
export type FilaValorGama = Prisma.ValorGamaGetPayload<{}>
export function datosValorTecnico(v: ValorTecnico) {
  const d = v.datos
  return { tipoDato: d.tipo, valorTexto: d.tipo === 'texto' ? d.valor : null,
    valorNumero: d.tipo === 'numero' ? d.valor : null, valorBooleano: d.tipo === 'booleano' ? d.valor : null }
}
export function aValorGama(f: FilaValorGama): ValorGama {
  if ([f.valorTexto, f.valorNumero, f.valorBooleano].filter(v => v !== null).length !== 1) throw new Error('Celda corrupta')
  const valor = f.tipoDato === 'texto' && f.valorTexto !== null ? ValorTecnico.crear({ tipo: 'texto', valor: f.valorTexto })
    : f.tipoDato === 'numero' && f.valorNumero !== null ? ValorTecnico.crear({ tipo: 'numero', valor: f.valorNumero.toFixed() })
    : f.tipoDato === 'booleano' && f.valorBooleano !== null ? ValorTecnico.crear({ tipo: 'booleano', valor: f.valorBooleano }) : null
  if (valor === null) throw new Error('Celda incompatible con su tipo')
  return new ValorGama({ ...f, valor })
}
