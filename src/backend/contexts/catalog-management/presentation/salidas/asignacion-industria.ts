import type { AsignacionIndustria } from '../../domain/asignacion-industria.js'
export const dtoAsignacionIndustria = (r: AsignacionIndustria) => ({ id: r.id.toString(), industriaId: r.industriaId.toString(), destino: { tipo: r.destino.tipo, id: r.destino.id.toString() }, orden: r.orden.value, estado: r.estado, creadoEn: r.creadoEn.toISOString(), actualizadoEn: r.actualizadoEn.toISOString() })
