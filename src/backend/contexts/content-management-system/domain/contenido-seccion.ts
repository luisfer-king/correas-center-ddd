import { Orden } from '../../../shared/domain/value-objects.js'
import type { EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, idCMS } from './cms-values.js'
import type { MetadataSeccion } from './metadata-seccion.js'
import { metadataSeccion } from './metadata-seccion.js'
import type { TipoSeccion } from './tipo-seccion.js'

export type CamposContenidoSeccion = {
    titulo: string | null; subtitulo: string | null; descripcion: string | null
    icono: string | null; imagen: string | null
}
export class ContenidoSeccion extends EntidadCMS {
    readonly id: bigint
    readonly empresaId: bigint
    readonly tipoSeccionId: bigint
    private _campos: CamposContenidoSeccion
    private _metadata: MetadataSeccion
    private _orden: Orden
    private _mostrar: boolean
    constructor(d: { id: bigint; empresaId: bigint; tipoSeccionId: bigint; campos: CamposContenidoSeccion; metadata: unknown; orden: Orden; mostrar: boolean; estado: EstadoCMS; fechas: FechasCMS }) {
        super(d.estado, d.fechas)
        if (typeof d.mostrar !== 'boolean') throw new Error('Visibilidad inválida')
        this.id = idCMS(d.id); this.empresaId = idCMS(d.empresaId); this.tipoSeccionId = idCMS(d.tipoSeccionId)
        this._campos = { ...d.campos }; this._metadata = metadataSeccion(d.metadata)
        this._orden = d.orden; this._mostrar = d.mostrar
    }
    static crear(d: ConstructorParameters<typeof ContenidoSeccion>[0], tipo: TipoSeccion): ContenidoSeccion {
        if (tipo.id !== d.tipoSeccionId || tipo.estado !== 'activo') throw new Error('Tipo de sección no disponible')
        return new ContenidoSeccion({ ...d, metadata: tipo.validarMetadata(d.metadata) })
    }
    get campos(): Readonly<CamposContenidoSeccion> { return { ...this._campos } }
    get metadata(): MetadataSeccion { return metadataSeccion(this._metadata) }
    get orden(): Orden { return this._orden }
    get mostrar(): boolean { return this._mostrar }
    editar(campos: CamposContenidoSeccion, metadata: unknown, tipo: TipoSeccion, cuando: Date): void {
        if (tipo.id !== this.tipoSeccionId || tipo.estado !== 'activo') throw new Error('Tipo de sección no disponible')
        const datos = tipo.validarMetadata(metadata)
        this.tocar(cuando); this._campos = { ...campos }; this._metadata = datos
    }
    fijarVisibilidad(mostrar: boolean, cuando: Date): void {
        if (typeof mostrar !== 'boolean') throw new Error('Visibilidad inválida')
        this.tocar(cuando); this._mostrar = mostrar
    }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
    esPublicable(tipo: TipoSeccion): boolean {
        return this.estado === 'activo' && this._mostrar && tipo.id === this.tipoSeccionId && tipo.estado === 'activo'
    }
}