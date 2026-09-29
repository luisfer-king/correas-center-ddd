import type { Marca } from '../../domain/marca.js'
export const dtoMarca = (r: Marca) => ({ id: r.id.toString(), nombre: r.nombre, slug: r.slug .value, logo: r.logo, orden: r.orden.value, estado: r.estado, creadoEn: r.creadoEn.toISOString(), actualizadoEn: r.actualizadoEn.toISOString(), eliminadoEn: r.eliminadoEn?.toISOString() ?? null })
