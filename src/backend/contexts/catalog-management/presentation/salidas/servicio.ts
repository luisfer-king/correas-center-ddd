import type { Servicio } from '../../domain/servicio.js'
export const dtoServicio = (r: Servicio) => ({ id: r.id.toString(), empresaId: r.empresaId.toString(), nombre: r.nombre, descripcion: r.descripcion, imagen: r.imagen, orden: r.orden.value, estado: r.estado, creadoEn: r.creadoEn.toISOString(), actualizadoEn: r.actualizadoEn.toISOString(), eliminadoEn: r.eliminadoEn?.toISOString() ?? null })
