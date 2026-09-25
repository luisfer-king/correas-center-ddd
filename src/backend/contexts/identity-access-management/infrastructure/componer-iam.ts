import type { PrismaClient } from '../../../generated/prisma/client.js'
import { ActivarRol } from '../application/use-cases/activar-rol.js'
import { AsignarPermisoRol } from '../application/use-cases/asignar-permiso-rol.js'
import { AsignarRolUsuario } from '../application/use-cases/asignar-rol-usuario.js'
import { CerrarSesion } from '../application/use-cases/cerrar-sesion.js'
import { ComprobarSesion } from '../application/use-cases/comprobar-sesion.js'
import { CrearRol } from '../application/use-cases/crear-rol.js'
import { EditarRol } from '../application/use-cases/editar-rol.js'
import { EliminarRol } from '../application/use-cases/eliminar-rol.js'
import { ExigirPermiso } from '../application/use-cases/exigir-permiso.js'
import { InactivarRol } from '../application/use-cases/inactivar-rol.js'
import { IniciarSesion } from '../application/use-cases/iniciar-sesion.js'
import { ListarAuditoria } from '../application/use-cases/listar-auditoria.js'
import { ListarPermisos } from '../application/use-cases/listar-permisos.js'
import { ListarRoles } from '../application/use-cases/listar-roles.js'
import { ListarUsuarios } from '../application/use-cases/listar-usuarios.js'
import { ObtenerPermiso } from '../application/use-cases/obtener-permiso.js'
import { ObtenerRol } from '../application/use-cases/obtener-rol.js'
import { ObtenerUsuario } from '../application/use-cases/obtener-usuario.js'
import { RetirarPermisoRol } from '../application/use-cases/retirar-permiso-rol.js'
import { RetirarRolUsuario } from '../application/use-cases/retirar-rol-usuario.js'
import { Argon2Verificador } from './argon2-verificador.js'
import { JoseTokens } from './jose-tokens.js'
import { PrismaAuditoria } from './prisma-auditoria.js'
import { PrismaAutorizacion } from './prisma-autorizacion.js'
import { PrismaPerfiles } from './prisma-perfiles.js'
import { PrismaPermisos } from './prisma-permisos.js'
import { PrismaRoles } from './prisma-roles.js'
import { PrismaSesiones } from './prisma-sesiones.js'
import { PrismaUsuarios } from './prisma-usuarios.js'
import { RelojSistema } from './reloj-sistema.js'
import { Sha256HuellaToken } from './sha256-huella-token.js'
import { UuidSeguro } from './uuid-seguro.js'

export function componerIam(db: PrismaClient, secret: string, issuer: string, audience: string) {
    const usuarios = new PrismaUsuarios(db)
    const perfiles = new PrismaPerfiles(db)
    const roles = new PrismaRoles(db)
    const permisos = new PrismaPermisos(db)
    const sesiones = new PrismaSesiones(db)
    const reloj = new RelojSistema()
    const autorizar = new ExigirPermiso(new PrismaAutorizacion(db))
    const comprobar = new ComprobarSesion(new JoseTokens(secret, issuer, audience), sesiones,
        perfiles, new Sha256HuellaToken(), reloj)
    return {
        iniciar: new IniciarSesion(usuarios, perfiles, sesiones, new Argon2Verificador(),
            new JoseTokens(secret, issuer, audience), new Sha256HuellaToken(), new UuidSeguro(), reloj),
        comprobar,
        cerrar: new CerrarSesion(comprobar, sesiones, reloj),
        listarRoles: new ListarRoles(roles, autorizar), obtenerRol: new ObtenerRol(roles, autorizar),
        crearRol: new CrearRol(roles, autorizar), editarRol: new EditarRol(roles, autorizar, reloj),
        inactivarRol: new InactivarRol(roles, autorizar, reloj), activarRol: new ActivarRol(roles, autorizar, reloj),
        eliminarRol: new EliminarRol(roles, autorizar, reloj),
        asignarPermiso: new AsignarPermisoRol(roles, permisos, autorizar, reloj),
        retirarPermiso: new RetirarPermisoRol(roles, autorizar, reloj),
        listarPermisos: new ListarPermisos(permisos, autorizar), obtenerPermiso: new ObtenerPermiso(permisos, autorizar),
        listarUsuarios: new ListarUsuarios(perfiles, autorizar), obtenerUsuario: new ObtenerUsuario(perfiles, autorizar),
        asignarRol: new AsignarRolUsuario(perfiles, roles, autorizar, reloj),
        retirarRol: new RetirarRolUsuario(perfiles, autorizar, reloj),
        listarAuditoria: new ListarAuditoria(new PrismaAuditoria(db), autorizar),
    }
}

export type CasosIam = ReturnType<typeof componerIam>