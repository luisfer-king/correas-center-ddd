import { PrismaPg } from '@prisma/adapter-pg'
import { argon2id, hash } from 'argon2'
import 'dotenv/config'
import { CodigoPermiso, HashArgon2id } from '../src/backend/contexts/identity-access-management/domain/iam-values.js'
import { Prisma, PrismaClient } from '../src/backend/generated/prisma/client.js'
import { Email, Slug } from '../src/backend/shared/domain/value-objects.js'

// Solo se ejecuta explícitamente con pnpm exec prisma db seed.
// Nunca apuntar este proceso a un proyecto Supabase con auth.users administrada.
const databaseUrl = process.env.DATABASE_URL
const adminEmailInput = process.env.SEED_ADMIN_EMAIL
const adminPassword = process.env.SEED_ADMIN_PASSWORD
if (!databaseUrl || !adminEmailInput || !adminPassword || adminPassword.length < 6) {
    throw new Error('Configura DATABASE_URL local, SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD (mínimo 6 caracteres)')
}
const adminEmail = Email.create(adminEmailInput).value
const roleSlug = Slug.create('super_admin').value
const roleName = 'Superadministrador'

const etiquetas = {
    read: 'Ver', create: 'Crear', update: 'Editar', delete: 'Desactivar',
    manage: 'Gestionar', assign: 'Asignar', revoke: 'Revocar',
} as const
type Accion = keyof typeof etiquetas
type Grupo = 'iam' | 'catalog' | 'cms' | 'crm'
type Definicion = { slug: string; nombre: string; grupo: Grupo }
const recursos: ReadonlyArray<{
    grupo: Grupo; clave: string; nombre: string; acciones: readonly Accion[]
}> = [
        { grupo: 'iam', clave: 'roles', nombre: 'roles', acciones: ['read', 'create', 'update', 'delete'] },
        { grupo: 'iam', clave: 'permisos', nombre: 'permisos', acciones: ['read', 'create', 'update', 'delete'] },
        { grupo: 'iam', clave: 'usuarios', nombre: 'usuarios', acciones: ['read', 'create', 'update', 'delete'] },
        { grupo: 'iam', clave: 'sesiones', nombre: 'sesiones', acciones: ['read', 'revoke'] },
        { grupo: 'iam', clave: 'auditoria', nombre: 'auditoría', acciones: ['read'] },
        { grupo: 'catalog', clave: 'productos', nombre: 'productos', acciones: ['read', 'manage'] },
        { grupo: 'catalog', clave: 'categorias', nombre: 'categorías', acciones: ['read', 'manage'] },
        { grupo: 'catalog', clave: 'marcas', nombre: 'marcas', acciones: ['read', 'manage'] },
        { grupo: 'catalog', clave: 'atributos', nombre: 'atributos técnicos', acciones: ['read', 'manage'] },
        { grupo: 'catalog', clave: 'industrias', nombre: 'industrias', acciones: ['read', 'manage'] },
        { grupo: 'catalog', clave: 'servicios', nombre: 'servicios', acciones: ['read', 'manage'] },
        { grupo: 'cms', clave: 'menus', nombre: 'menús', acciones: ['read', 'manage'] },
        { grupo: 'cms', clave: 'footers', nombre: 'footers', acciones: ['read', 'manage'] },
        { grupo: 'cms', clave: 'secciones', nombre: 'secciones', acciones: ['read', 'manage'] },
        { grupo: 'cms', clave: 'registros', nombre: 'registros', acciones: ['read', 'manage'] },
        { grupo: 'cms', clave: 'wizard', nombre: 'pasos del wizard', acciones: ['read', 'manage'] },
        { grupo: 'cms', clave: 'configuracion', nombre: 'configuración', acciones: ['read', 'manage'] },
        { grupo: 'crm', clave: 'empresas', nombre: 'empresas', acciones: ['read', 'manage'] },
        { grupo: 'crm', clave: 'sucursales', nombre: 'sucursales', acciones: ['read', 'manage'] },
        { grupo: 'crm', clave: 'contactos', nombre: 'contactos', acciones: ['read', 'manage'] },
        { grupo: 'crm', clave: 'suscriptores', nombre: 'suscriptores', acciones: ['read', 'manage'] },
        { grupo: 'crm', clave: 'leads', nombre: 'leads', acciones: ['read', 'manage'] },
    ]
const permisos: Definicion[] = recursos.flatMap(({ grupo, clave, nombre, acciones }) =>
    acciones.map((accion) => ({
        slug: CodigoPermiso.create(`${grupo}.${clave}.${accion}`).value,
        nombre: `${etiquetas[accion]} ${nombre}`,
        grupo,
    })),
)
permisos.push(
    { slug: CodigoPermiso.create('iam.roles.permisos.assign').value, nombre: 'Asignar permisos a roles', grupo: 'iam' },
    { slug: CodigoPermiso.create('iam.usuarios.roles.assign').value, nombre: 'Asignar roles a usuarios', grupo: 'iam' },
)
if (new Set(permisos.map(({ slug }) => slug)).size !== permisos.length ||
    new Set(permisos.map(({ nombre }) => nombre)).size !== permisos.length) {
    throw new Error('El catálogo de permisos contiene duplicados')
}

// Argon2id m=19456 KiB, t=2, p=1. La contraseña nunca se registra ni persiste.
// Se prepara fuera de la transacción; en una repetición no modifica el hash previo.
const passwordHash = HashArgon2id.fromHash(await hash(adminPassword, {
    type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1,
})).value
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })

try {
    await prisma.$transaction(async (tx) => {
        const existingRole = await tx.rol.findUnique({ where: { slug: roleSlug } })
        if (existingRole && (existingRole.nombre !== roleName || !existingRole.esSistema ||
            existingRole.estado !== 'activo' || existingRole.eliminadoEn !== null)) {
            throw new Error('El rol reservado super_admin ya existe con datos incompatibles')
        }
        const role = existingRole ?? await tx.rol.create({
            data: { slug: roleSlug, nombre: roleName, esSistema: true, estado: 'activo' },
        })

        for (const definicion of permisos) {
            const existing = await tx.permiso.findUnique({ where: { slug: definicion.slug } })
            if (existing && (existing.nombre !== definicion.nombre || existing.grupo !== definicion.grupo ||
                existing.estado !== 'activo' || existing.eliminadoEn !== null)) {
                throw new Error(`Permiso reservado incompatible: ${definicion.slug}`)
            }
            const permiso = existing ?? await tx.permiso.create({
                data: { slug: definicion.slug, nombre: definicion.nombre, grupo: definicion.grupo, estado: 'activo' },
            })
            const asignacionPermiso = await tx.rolPermiso.findUnique({
                where: { rolId_permisoId: { rolId: role.id, permisoId: permiso.id } },
            })
            if (asignacionPermiso?.estado === 'inactivo') {
                throw new Error(`Permiso del super_admin desactivado: ${definicion.slug}`)
            }
            if (!asignacionPermiso) await tx.rolPermiso.create({
                data: { rolId: role.id, permisoId: permiso.id, estado: 'activo' },
            })
        }

        const existingUser = await tx.usuario.findUnique({ where: { email: adminEmail } })
        if (existingUser) {
            const perfil = await tx.perfil.findUnique({ where: { id: existingUser.id } })
            const asignacion = await tx.usuarioRol.findUnique({
                where: {
                    usuarioId_rolId: { usuarioId: existingUser.id, rolId: role.id },
                }
            })
            if (!perfil || perfil.estado !== 'activo' || perfil.eliminadoEn !== null ||
                perfil.email !== adminEmail || !existingUser.encryptedPassword?.startsWith('$argon2id$') ||
                asignacion?.estado !== 'activo') {
                throw new Error('El email inicial ya pertenece a una cuenta no provisionada como superadministrador')
            }
            return // Repetir no cambia contraseña, perfil, privilegios preexistentes ni fechas.
        }

        const user = await tx.usuario.create({
            data: { email: adminEmail, encryptedPassword: passwordHash },
        })
        await tx.perfil.create({
            data: {
                id: user.id, nombreCompleto: roleName, email: adminEmail,
                emailVerifiedAt: new Date(), estado: 'activo',
            },
        })
        await tx.usuarioRol.create({ data: { usuarioId: user.id, rolId: role.id, estado: 'activo' } })
    }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10_000,
        timeout: 30_000,
    })
    console.info(`IAM inicializado: rol del sistema y ${permisos.length} permisos vinculados`)
} finally {
    await prisma.$disconnect()
}