import type { TipoSeccion } from '../domain/tipo-seccion.js'

export function salidaTipoSeccion(e: TipoSeccion) {
  return {
    id: e.id.toString(),
    nombre: e.nombre,
    slug: e.slug.value,
    descripcion: e.descripcion,
    camposMetadata: [...e.clavesMetadata],
    icono: e.icono,
    orden: e.orden.value,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
