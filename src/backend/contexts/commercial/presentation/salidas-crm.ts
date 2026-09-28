import type { Empresa } from '../domain/empresa.js'
import type { Sucursal } from '../domain/sucursal.js'
import type { ContactoEntrante } from '../domain/contacto-entrante.js'
import type { Suscriptor } from '../domain/suscriptor.js'
import type { Lead } from '../domain/lead.js'

const fecha = (valor: Date | null) => valor?.toISOString() ?? null
export function empresaDto(empresa: Empresa) {
  return { id: empresa.id.toString(), nombre: empresa.nombre, logo: empresa.logo,
    estado: empresa.estado, creadoEn: fecha(empresa.creadoEn), actualizadoEn: fecha(empresa.actualizadoEn),
    eliminadoEn: fecha(empresa.eliminadoEn) }
}
export function sucursalDto(sucursal: Sucursal) {
  return { id: sucursal.id.toString(), empresaId: sucursal.empresaId.toString(),
    nombre: sucursal.datos.nombre, direccion: sucursal.datos.direccion, telefono: sucursal.datos.telefono,
    email: sucursal.datos.email?.value ?? null, horarios: sucursal.datos.horarios,
    mapaIncrustado: sucursal.datos.mapaIncrustado,
    latitud: sucursal.datos.ubicacion.latitud, longitud: sucursal.datos.ubicacion.longitud,
    esPrincipal: sucursal.esPrincipal, orden: sucursal.orden.value, estado: sucursal.estado,
    creadoEn: fecha(sucursal.creadoEn), actualizadoEn: fecha(sucursal.actualizadoEn),
    eliminadoEn: fecha(sucursal.eliminadoEn) }
}
export function contactoDto(contacto: ContactoEntrante) {
  return { id: contacto.id.toString(), empresaId: contacto.empresaId.toString(), nombre: contacto.nombre,
    empresaDeclarada: contacto.empresaDeclarada, telefono: contacto.telefono, email: contacto.email.value,
    mensaje: contacto.mensaje, estado: contacto.estado,
    creadoEn: fecha(contacto.creadoEn), actualizadoEn: fecha(contacto.actualizadoEn),
    eliminadoEn: fecha(contacto.eliminadoEn) }
}
export function suscriptorDto(suscriptor: Suscriptor) {
  return { id: suscriptor.id.toString(), empresaId: suscriptor.empresaId.toString(),
    email: suscriptor.email.value, nombre: suscriptor.nombre, estado: suscriptor.estado,
    emailVerificadoEn: fecha(suscriptor.emailVerificadoEn),
    creadoEn: fecha(suscriptor.creadoEn), actualizadoEn: fecha(suscriptor.actualizadoEn),
    eliminadoEn: fecha(suscriptor.eliminadoEn) }
}
export function leadDto(lead: Lead) {
  return { id: lead.id, empresaId: lead.empresaId.toString(),
    contactoId: lead.contactoId?.toString() ?? null, responsableId: lead.responsableId,
    estado: lead.estado, creadoEn: fecha(lead.creadoEn), actualizadoEn: fecha(lead.actualizadoEn),
    eliminadoEn: fecha(lead.eliminadoEn) }
}
