import type { Producto } from '../../domain/producto.js'
export const dtoProducto = (r: Producto) => ({ id: r.id.toString(), empresaId: r.empresaId.toString(), nombre: r.nombre, slug: r.slug .value, imagen: r.imagen, orden: r.orden.value, estado: r.estado, creadoEn: r.creadoEn.toISOString(), actualizadoEn: r.actualizadoEn.toISOString(), eliminadoEn: r.eliminadoEn?.toISOString() ?? null })
