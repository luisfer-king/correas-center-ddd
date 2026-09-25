import { Orden } from '../../../shared/domain/value-objects.js'
import type { DestinoCMS, EstadoCMS, FechasCMS } from './cms-values.js'
import { EntidadCMS, RutaInterna, destinoCMS, idCMS, textoCMS } from './cms-values.js'
import { MenuItem } from './menu-item.js'

export type CargarSubmenu = 'activo' | 'inactivo' | null
export class Menu extends EntidadCMS {
    readonly id: bigint
    readonly empresaId: bigint
    readonly destino: DestinoCMS
    private _grupo: string
    private _ruta: RutaInterna
    private _icono: string | null
    private _mostrar: boolean
    private _orden: Orden
    private _cargarSubmenu: CargarSubmenu
    private readonly items = new Map<bigint, MenuItem>()
    constructor(d: { id: bigint; empresaId: bigint; grupo: string; destino: DestinoCMS; ruta: RutaInterna; icono: string | null; mostrar: boolean; orden: Orden; cargarSubmenu: CargarSubmenu; estado: EstadoCMS; fechas: FechasCMS; items: readonly MenuItem[] }) {
        super(d.estado, d.fechas)
        if (typeof d.mostrar !== 'boolean') throw new Error('Visibilidad inválida')
        this.id = idCMS(d.id); this.empresaId = idCMS(d.empresaId)
        this._grupo = textoCMS(d.grupo, 'Grupo'); this.destino = destinoCMS(d.destino.tipo, d.destino.id)
        this._ruta = d.ruta; this._icono = d.icono; this._mostrar = d.mostrar; this._orden = d.orden
        if (d.cargarSubmenu !== null && !['activo', 'inactivo'].includes(d.cargarSubmenu)) throw new Error('Submenú inválido')
        this._cargarSubmenu = d.cargarSubmenu
        for (const item of d.items) this.agregarExistente(item)
    }
    private agregarExistente(item: MenuItem): void {
        if (item.menuId !== this.id || this.items.has(item.id)) throw new Error('Item duplicado o de otro menú')
        this.items.set(item.id, item)
    }
    get grupo(): string { return this._grupo }
    get ruta(): RutaInterna { return this._ruta }
    get icono(): string | null { return this._icono }
    get mostrar(): boolean { return this._mostrar }
    get orden(): Orden { return this._orden }
    get cargarSubmenu(): CargarSubmenu { return this._cargarSubmenu }
    get itemsOrdenados(): readonly MenuItem[] { return [...this.items.values()].sort((a, b) => a.orden.value - b.orden.value || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)) }
    editar(d: { grupo: string; ruta: RutaInterna; icono: string | null; mostrar: boolean; cargarSubmenu: CargarSubmenu }, cuando: Date): void {
        const grupo = textoCMS(d.grupo, 'Grupo')
        if (typeof d.mostrar !== 'boolean' || (d.cargarSubmenu !== null && !['activo', 'inactivo'].includes(d.cargarSubmenu))) throw new Error('Visibilidad o submenú inválido')
        this.tocar(cuando); this._grupo = grupo; this._ruta = d.ruta; this._icono = d.icono
        this._mostrar = d.mostrar; this._cargarSubmenu = d.cargarSubmenu
    }
    agregarItem(item: MenuItem, cuando: Date): void {
        if (this.estado !== 'activo') throw new Error('Menú no activo')
        if (item.menuId !== this.id || this.items.has(item.id)) throw new Error('Item duplicado o de otro menú')
        this.tocar(cuando); this.items.set(item.id, item)
    }
    eliminarItem(id: bigint, cuando: Date): void {
        const item = this.items.get(id)
        if (!item || item.estado === 'eliminado') throw new Error('Item no disponible')
        if (!(cuando instanceof Date) || !Number.isFinite(cuando.getTime()) || cuando < item.actualizadoEn) throw new Error('Fecha de eliminación inválida')
        this.tocar(cuando); item.eliminar(cuando)
    }
    reordenar(orden: Orden, cuando: Date): void { this._orden = this.cambiarOrden(orden, cuando) }
    itemsPublicos(): readonly MenuItem[] { return this.estado === 'activo' && this._mostrar && this._cargarSubmenu === 'activo' ? this.itemsOrdenados.filter((i) => i.estado === 'activo') : [] }
}