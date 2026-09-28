import type { PrismaClient } from '../../../generated/prisma/client.js'
import { ListarAuditoria } from '../application/use-cases/auditoria/listar-auditoria.js'
import { RegistrarLecturaIam } from '../application/use-cases/auditoria/registrar-lectura-iam.js'
import { ExigirPermiso } from '../application/use-cases/autorizacion/exigir-permiso.js'
import { MiPerfil } from '../application/use-cases/perfil/mi-perfil.js'
import { ListarPermisos } from '../application/use-cases/permisos/listar-permisos.js'
import { ObtenerPermiso } from '../application/use-cases/permisos/obtener-permiso.js'
import { ActivarRol } from '../application/use-cases/roles/activar-rol.js'
import { AsignarPermisoRol } from '../application/use-cases/roles/asignar-permiso-rol.js'
import { CrearRol } from '../application/use-cases/roles/crear-rol.js'
import { EditarRol } from '../application/use-cases/roles/editar-rol.js'
import { EliminarRol } from '../application/use-cases/roles/eliminar-rol.js'
import { InactivarRol } from '../application/use-cases/roles/inactivar-rol.js'
import { ListarRoles } from '../application/use-cases/roles/listar-roles.js'
import { ObtenerCapacidadesRoles } from '../application/use-cases/roles/obtener-capacidades-roles.js'
import { ObtenerRol } from '../application/use-cases/roles/obtener-rol.js'
import { RetirarPermisoRol } from '../application/use-cases/roles/retirar-permiso-rol.js'
import { CerrarSesion } from '../application/use-cases/sesiones/cerrar-sesion.js'
import { ComprobarSesion } from '../application/use-cases/sesiones/comprobar-sesion.js'
import { IniciarSesion } from '../application/use-cases/sesiones/iniciar-sesion.js'
import { AdministrarUsuarios } from '../application/use-cases/usuarios/administrar-usuarios.js'
import { AsignarRolUsuario } from '../application/use-cases/usuarios/asignar-rol-usuario.js'
import { ListarUsuarios } from '../application/use-cases/usuarios/listar-usuarios.js'
import { ObtenerUsuario } from '../application/use-cases/usuarios/obtener-usuario.js'
import { RetirarRolUsuario } from '../application/use-cases/usuarios/retirar-rol-usuario.js'
import { Argon2Verificador } from './argon2-verificador.js'
import { JoseTokens } from './jose-tokens.js'
import { PrismaAdministracionUsuarios } from './prisma-administracion-usuarios.js'
import { PrismaAuditoria } from './prisma-auditoria.js'
import { PrismaAutorizacion } from './prisma-autorizacion.js'
import { PrismaMiPerfil } from './prisma-mi-perfil.js'
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
    const administracionUsuarios = new AdministrarUsuarios(perfiles, new PrismaAdministracionUsuarios(db),
        new ExigirPermiso(new PrismaAutorizacion(db)))
    const roles = new PrismaRoles(db)
    const permisos = new PrismaPermisos(db)
    const sesiones = new PrismaSesiones(db)
    const auditoria = new PrismaAuditoria(db)
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
        capacidadesRoles: new ObtenerCapacidadesRoles(autorizar),
        crearRol: new CrearRol(roles, autorizar), editarRol: new EditarRol(roles, autorizar, reloj),
        inactivarRol: new InactivarRol(roles, autorizar, reloj), activarRol: new ActivarRol(roles, autorizar, reloj),
        eliminarRol: new EliminarRol(roles, autorizar, reloj),
        asignarPermiso: new AsignarPermisoRol(roles, permisos, autorizar, reloj),
        retirarPermiso: new RetirarPermisoRol(roles, autorizar, reloj),
        listarPermisos: new ListarPermisos(permisos, autorizar), obtenerPermiso: new ObtenerPermiso(permisos, autorizar),
        listarUsuarios: new ListarUsuarios(perfiles, autorizar, roles), obtenerUsuario: new ObtenerUsuario(perfiles, autorizar, roles),
        administrarUsuarios: administracionUsuarios,
        miPerfil: new MiPerfil(perfiles, new PrismaMiPerfil(db)),
        asignarRol: new AsignarRolUsuario(perfiles, roles, autorizar, reloj),
        retirarRol: new RetirarRolUsuario(perfiles, autorizar, reloj, roles),
        listarAuditoria: new ListarAuditoria(auditoria, autorizar),
        registrarLectura: new RegistrarLecturaIam(auditoria, reloj),
    }
}

export type CasosIam = ReturnType<typeof componerIam>
