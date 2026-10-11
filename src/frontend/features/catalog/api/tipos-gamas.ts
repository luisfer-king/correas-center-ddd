import type { BaseCatalogo } from './tipos-catalogo'
export type TipoDato = 'texto'|'numero'|'booleano'
export type ValorTecnico = {tipo:'texto'|'numero';valor:string}|{tipo:'booleano';valor:boolean}
export interface CabeceraGama extends BaseCatalogo {categoriaId:string;productoId:string;gamaOrigenId:string|null;titulo:string;descripcion:string|null;imagen:string|null;version:string}
export interface GrupoGama extends BaseCatalogo {gamaId:string;codigo:string;nombre:string;orden:number}
export interface ColumnaGama extends BaseCatalogo {gamaId:string;atributoId:string;tipoDato:TipoDato;grupoId:string|null;etiqueta:string|null;unidadMedida:string|null;orden:number}
export interface FilaGama extends BaseCatalogo {gamaId:string;codigo:string;grupoId:string|null;nombre:string;descripcion:string|null;enlaceDetalle:string|null;orden:number}
export interface CeldaGama {filaId:string;columnaId:string;valor:ValorTecnico;creadoEn:string;actualizadoEn:string}
export interface Gama extends CabeceraGama {gruposColumnas:GrupoGama[];gruposFilas:GrupoGama[];columnas:ColumnaGama[];filas:FilaGama[];valores:CeldaGama[]}
export interface PlantillaGama {productoId:string;gamaId:string;version:string;creadoEn:string}
export type RecursoGama='grupos-columnas'|'grupos-filas'|'columnas'|'filas'
export type EstadoGama='activar'|'inactivar'|'eliminar'
export interface EscrituraGama {gamaId:string;version:string;resultado:unknown}
export interface CopiaGama {categoriaId:string;titulo?:string;copiarFilas:boolean;copiarValores:boolean;copiarEnlaces:boolean}
export interface CambioCelda {filaId:string;columnaId:string;valor:ValorTecnico|null}
