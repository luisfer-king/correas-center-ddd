// Puerto de integración: CMS decide publicación; Catálogo consume el resultado.
export interface AccesoDetallePublico { permitidos(empresaId:bigint, productos:string[]):Promise<ReadonlySet<string>> }
export const sinDetallePublico:AccesoDetallePublico={permitidos:async()=>new Set<string>()}
