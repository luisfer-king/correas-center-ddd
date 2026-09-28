import type { PrismaClient } from '../../../generated/prisma/client.js'
import { ExigirPermiso } from '../../identity-access-management/application/use-cases/autorizacion/exigir-permiso.js'
import { PrismaAuditoria } from '../../identity-access-management/infrastructure/prisma-auditoria.js'
import { PrismaAutorizacion } from '../../identity-access-management/infrastructure/prisma-autorizacion.js'
import { RelojSistema } from '../../identity-access-management/infrastructure/reloj-sistema.js'
import { ObtenerCapacidadesCrm } from '../application/use-cases/autorizacion/obtener-capacidades-crm.js'
import { ArchivarContacto } from '../application/use-cases/contactos/archivar-contacto.js'
import { CrearContacto } from '../application/use-cases/contactos/crear-contacto.js'
import { EliminarContacto } from '../application/use-cases/contactos/eliminar-contacto.js'
import { ListarContactosEntrantes } from '../application/use-cases/contactos/listar-contactos.js'
import { MarcarContactoRespondido } from '../application/use-cases/contactos/marcar-contacto-respondido.js'
import { ObtenerContacto } from '../application/use-cases/contactos/obtener-contacto.js'
import { ActivarEmpresa } from '../application/use-cases/empresas/activar-empresa.js'
import { CrearEmpresa } from '../application/use-cases/empresas/crear-empresa.js'
import { EditarEmpresa } from '../application/use-cases/empresas/editar-empresa.js'
import { EliminarEmpresa } from '../application/use-cases/empresas/eliminar-empresa.js'
import { InactivarEmpresa } from '../application/use-cases/empresas/inactivar-empresa.js'
import { ListarEmpresas } from '../application/use-cases/empresas/listar-empresas.js'
import { ObtenerEmpresa } from '../application/use-cases/empresas/obtener-empresa.js'
import { AsignarResponsableLead } from '../application/use-cases/leads/asignar-responsable-lead.js'
import { CalificarLead } from '../application/use-cases/leads/calificar-lead.js'
import { CrearLead } from '../application/use-cases/leads/crear-lead.js'
import { DescartarLead } from '../application/use-cases/leads/descartar-lead.js'
import { EliminarLead } from '../application/use-cases/leads/eliminar-lead.js'
import { ListarLeads } from '../application/use-cases/leads/listar-leads.js'
import { ObtenerLead } from '../application/use-cases/leads/obtener-lead.js'
import { ActivarSucursal } from '../application/use-cases/sucursales/activar-sucursal.js'
import { CrearSucursal } from '../application/use-cases/sucursales/crear-sucursal.js'
import { EditarSucursal } from '../application/use-cases/sucursales/editar-sucursal.js'
import { EliminarSucursal } from '../application/use-cases/sucursales/eliminar-sucursal.js'
import { InactivarSucursal } from '../application/use-cases/sucursales/inactivar-sucursal.js'
import { ListarSucursales } from '../application/use-cases/sucursales/listar-sucursales.js'
import { ObtenerSucursal } from '../application/use-cases/sucursales/obtener-sucursal.js'
import { ActivarSuscriptor } from '../application/use-cases/suscriptores/activar-suscriptor.js'
import { CrearSuscriptor } from '../application/use-cases/suscriptores/crear-suscriptor.js'
import { DesuscribirSuscriptor } from '../application/use-cases/suscriptores/desuscribir-suscriptor.js'
import { EditarSuscriptor } from '../application/use-cases/suscriptores/editar-suscriptor.js'
import { EliminarSuscriptor } from '../application/use-cases/suscriptores/eliminar-suscriptor.js'
import { InactivarSuscriptor } from '../application/use-cases/suscriptores/inactivar-suscriptor.js'
import { ListarSuscriptores } from '../application/use-cases/suscriptores/listar-suscriptores.js'
import { ObtenerSuscriptor } from '../application/use-cases/suscriptores/obtener-suscriptor.js'
import { RegistrarLecturaCrm } from '../presentation/registrar-lectura-crm.js'
import { PrismaContactosEntrantes } from './prisma-contactos-entrantes.js'
import { PrismaEmpresas } from './prisma-empresas.js'
import { PrismaLeads } from './prisma-leads.js'
import { PrismaSucursales } from './prisma-sucursales.js'
import { PrismaSuscriptores } from './prisma-suscriptores.js'

export function componerCrm(db: PrismaClient) {
    const autorizar = new ExigirPermiso(new PrismaAutorizacion(db))
    const reloj = new RelojSistema()
    const empresas = new PrismaEmpresas(db)
    const sucursales = new PrismaSucursales(db)
    const contactos = new PrismaContactosEntrantes(db)
    const suscriptores = new PrismaSuscriptores(db)
    const leads = new PrismaLeads(db)
    return {
        capacidades: new ObtenerCapacidadesCrm(autorizar),
        registrarLectura: new RegistrarLecturaCrm(new PrismaAuditoria(db), reloj),
        empresas: {
            listar: new ListarEmpresas(empresas, autorizar),
            obtener: new ObtenerEmpresa(empresas, autorizar),
            crear: new CrearEmpresa(empresas, autorizar),
            editar: new EditarEmpresa(empresas, autorizar, reloj),
            activar: new ActivarEmpresa(empresas, autorizar, reloj),
            inactivar: new InactivarEmpresa(empresas, autorizar, reloj),
            eliminar: new EliminarEmpresa(empresas, autorizar, reloj),
        },
        sucursales: {
            listar: new ListarSucursales(sucursales, autorizar),
            obtener: new ObtenerSucursal(sucursales, autorizar),
            crear: new CrearSucursal(sucursales, empresas, autorizar),
            editar: new EditarSucursal(sucursales, autorizar, reloj),
            activar: new ActivarSucursal(sucursales, autorizar, reloj),
            inactivar: new InactivarSucursal(sucursales, autorizar, reloj),
            eliminar: new EliminarSucursal(sucursales, autorizar, reloj),
        },
        contactos: {
            listar: new ListarContactosEntrantes(contactos, autorizar),
            obtener: new ObtenerContacto(contactos, autorizar),
            crear: new CrearContacto(contactos, empresas, autorizar),
            respondido: new MarcarContactoRespondido(contactos, autorizar, reloj),
            archivar: new ArchivarContacto(contactos, autorizar, reloj),
            eliminar: new EliminarContacto(contactos, autorizar, reloj),
        },
        suscriptores: {
            listar: new ListarSuscriptores(suscriptores, autorizar),
            obtener: new ObtenerSuscriptor(suscriptores, autorizar),
            crear: new CrearSuscriptor(suscriptores, empresas, autorizar),
            editar: new EditarSuscriptor(suscriptores, autorizar, reloj),
            activar: new ActivarSuscriptor(suscriptores, autorizar, reloj),
            inactivar: new InactivarSuscriptor(suscriptores, autorizar, reloj),
            desuscribir: new DesuscribirSuscriptor(suscriptores, autorizar, reloj),
            eliminar: new EliminarSuscriptor(suscriptores, autorizar, reloj),
        },
        leads: {
            listar: new ListarLeads(leads, autorizar),
            obtener: new ObtenerLead(leads, autorizar),
            crear: new CrearLead(leads, empresas, contactos, autorizar),
            asignarResponsable: new AsignarResponsableLead(leads, autorizar, reloj),
            calificar: new CalificarLead(leads, autorizar, reloj),
            descartar: new DescartarLead(leads, autorizar, reloj),
            eliminar: new EliminarLead(leads, autorizar, reloj),
        },
    }
}

export type CasosCrm = ReturnType<typeof componerCrm>
