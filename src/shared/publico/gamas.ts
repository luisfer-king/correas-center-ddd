export interface GrupoGamaPublica {id:string;codigo:string;nombre:string;orden:number}
export interface ColumnaGamaPublica {id:string;grupoId:string|null;nombre:string;unidadMedida:string|null;tipoDato:'numero'|'texto'|'booleano';orden:number}
export interface FilaGamaPublica {id:string;grupoId:string|null;codigo:string;nombre:string;descripcion:string|null;enlaceDetalle:string|null;orden:number}
export interface CeldaGamaPublica {filaId:string;columnaId:string;valor:string|boolean|null}
export interface GamaPublica {id:string;categoriaId:string;productoId:string;titulo:string;descripcion:string|null;imagen:string|null;gruposColumnas:GrupoGamaPublica[];gruposFilas:GrupoGamaPublica[];columnas:ColumnaGamaPublica[];filas:FilaGamaPublica[];valores:CeldaGamaPublica[]}
