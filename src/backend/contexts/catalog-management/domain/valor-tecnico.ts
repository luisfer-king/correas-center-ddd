import { numeroDecimal } from './catalog-values.js'

export type TipoDatoAtributo = 'texto' | 'numero' | 'booleano'
export type DatoTecnico = Readonly<{ tipo: 'texto'; valor: string }> | Readonly<{ tipo: 'numero'; valor: string }> | Readonly<{ tipo: 'booleano'; valor: boolean }>
export function tipoDatoAtributo(tipo: TipoDatoAtributo): TipoDatoAtributo {
  if (!['texto', 'numero', 'booleano'].includes(tipo)) throw new Error('Tipo de dato inválido')
  return tipo
}
/** Decimal se conserva como string para no perder precisión. Ausencia de celda = null, nunca 0/false. */
export class ValorTecnico {
  private constructor(private readonly dato: DatoTecnico) {}
  static crear(dato: DatoTecnico): ValorTecnico {
    tipoDatoAtributo(dato.tipo)
    if (dato.tipo === 'texto' && typeof dato.valor !== 'string') throw new Error('Texto técnico inválido')
    if (dato.tipo === 'numero' && typeof dato.valor !== 'string') throw new Error('Decimal técnico requiere texto exacto')
    if (dato.tipo === 'numero') numeroDecimal(dato.valor)
    if (dato.tipo === 'booleano' && typeof dato.valor !== 'boolean') throw new Error('Booleano técnico inválido')
    return new ValorTecnico(Object.freeze({ ...dato }))
  }
  get tipo(): TipoDatoAtributo { return this.dato.tipo }
  get valor(): string | boolean { return this.dato.valor }
  get datos(): DatoTecnico { return { ...this.dato } }
  exigirTipo(tipo: TipoDatoAtributo): void {
    if (this.tipo !== tipoDatoAtributo(tipo)) throw new Error('Valor incompatible con el tipo del atributo')
  }
}
