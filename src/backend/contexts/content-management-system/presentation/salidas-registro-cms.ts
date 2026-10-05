import type { RegistroCMS } from '../domain/registro-cms.js'

export function salidaRegistroCMS(e: RegistroCMS) {
  return {
    id: e.id.toString(),
    identificador: e.identificador,
    nombre: e.nombre,
    descripcion: e.descripcion,
    orden: e.orden.value,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
