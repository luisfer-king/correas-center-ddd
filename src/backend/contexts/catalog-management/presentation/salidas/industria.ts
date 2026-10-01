import type { Industria } from '../../domain/industria.js'
export const dtoIndustria = (r: Industria) => ({ id: r.id.toString(), empresaId: r.empresaId.toString(), nombre: r.nombre, slug: r.slug .value, imagen: r.imagen, orden: r.orden.value, estado: r.estado, creadoEn: r.creadoEn.toISOString(), actualizadoEn: r.actualizadoEn.toISOString(), eliminadoEn: r.eliminadoEn?.toISOString() ?? null })
