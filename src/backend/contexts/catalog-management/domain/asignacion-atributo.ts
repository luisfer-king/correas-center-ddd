import { ValorTecnico, tipoDatoAtributo, type TipoDatoAtributo } from './valor-tecnico.js'
import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCatalogo, FechasVinculo } from './catalog-values.js'
import { VinculoCatalogo, idCatalogo } from './catalog-values.js'

export class AsignacionAtributo extends VinculoCatalogo {
    readonly categoriaId: bigint
    readonly atributoId: bigint
    readonly tipoDato: TipoDatoAtributo
    private _valor: ValorTecnico | null
    private _orden: Orden
    constructor(d: { tipoDato?: TipoDatoAtributo; valorTexto?: string | null; valorBooleano?: boolean | null; id: bigint; categoriaId: bigint; atributoId: bigint; valorPersonalizado: string | null; orden: Orden; estado: EstadoCatalogo; fechas: FechasVinculo }) {
        super(d.id, d.estado, d.fechas)
        this.categoriaId = idCatalogo(d.categoriaId); this.atributoId = idCatalogo(d.atributoId)
        this.tipoDato = tipoDatoAtributo(d.tipoDato ?? 'numero')
        const valores = [d.valorPersonalizado, d.valorTexto ?? null, d.valorBooleano ?? null]
        if (valores.filter(v => v !== null).length > 1) throw new Error('La asignación admite un solo valor')
        this._valor = d.valorPersonalizado !== null ? ValorTecnico.crear({ tipo: 'numero', valor: d.valorPersonalizado })
          : d.valorTexto != null ? ValorTecnico.crear({ tipo: 'texto', valor: d.valorTexto })
          : d.valorBooleano != null ? ValorTecnico.crear({ tipo: 'booleano', valor: d.valorBooleano }) : null
        this._valor?.exigirTipo(this.tipoDato)
        this._orden = d.orden
    }
    get valorPersonalizado(): string | null { const d = this._valor?.datos; return d?.tipo === 'numero' ? d.valor : null }
    get valorTexto(): string | null { const d = this._valor?.datos; return d?.tipo === 'texto' ? d.valor : null }
    get valorBooleano(): boolean | null { const d = this._valor?.datos; return d?.tipo === 'booleano' ? d.valor : null }
    get valor(): ValorTecnico | null { return this._valor }
    get orden(): Orden { return this._orden }
    personalizar(valor: string | null, cuando: Date): void {
        if (this.tipoDato !== 'numero') throw new Error('Usar personalizarValor para atributos no numéricos')
        this.personalizarValor(valor === null ? null : ValorTecnico.crear({ tipo: 'numero', valor }), cuando)
    }
    personalizarValor(valor: ValorTecnico | null, cuando: Date): void {
        valor?.exigirTipo(this.tipoDato)
        this.tocar(cuando); this._valor = valor
    }
    reordenar(orden: Orden, cuando: Date): void { this.tocar(cuando); this._orden = orden }
    coincide(categoriaId: bigint, atributoId: bigint): boolean { return this.categoriaId === categoriaId && this.atributoId === atributoId }
}