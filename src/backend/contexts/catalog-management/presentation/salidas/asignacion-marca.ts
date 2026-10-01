import type { AsignacionMarca } from '../../domain/asignacion-marca.js'
export const dtoAsignacionMarca = (r: AsignacionMarca) => ({ id: r.id.toString(), productoId: r.productoId.toString(), marcaId: r.marcaId.toString(), orden: r.orden?.value ?? null, estado: r.estado, creadoEn: r.creadoEn.toISOString(), actualizadoEn: r.actualizadoEn.toISOString() })
