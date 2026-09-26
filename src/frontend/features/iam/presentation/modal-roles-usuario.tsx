import { useEffect, useState } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { CapacidadesRoles, RolIam, UsuarioIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

const fecha = (valor: string | null) => valor ? new Date(valor).toLocaleString('es-BO') : 'Sin registro'

export function ModalRolesUsuario({ usuario, capacidades, cerrar, actualizado }: {
    usuario: UsuarioIam
    capacidades: CapacidadesRoles | null
    cerrar: () => void
    actualizado: (usuario: UsuarioIam) => void
}) {
    const [actual, setActual] = useState(usuario)
    const [roles, setRoles] = useState<RolIam[] | null>(null)
    const [cargando, setCargando] = useState(Boolean(capacidades?.leerRoles))
    const [recargando, setRecargando] = useState(false)
    const [guardandoId, setGuardandoId] = useState<string | null>(null)
    const [confirmandoId, setConfirmandoId] = useState<string | null>(null)
    const [datosPendientes, setDatosPendientes] = useState(false)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState<'todos' | 'asignados' | 'disponibles' | 'inactivos'>('todos')

    useEffect(() => {
        if (!capacidades?.leerRoles) return
        const controlador = new AbortController()
        void iamApi.listarRoles({ signal: controlador.signal }).then((datos) => {
            if (!controlador.signal.aborted) setRoles(datos)
        }).catch((fallo: unknown) => {
            if (!controlador.signal.aborted) setError(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'No tienes permiso para consultar el catálogo de roles.' : 'No se pudo cargar el catálogo de roles. Pulsa «Actualizar datos» para reintentar.')
        }).finally(() => { if (!controlador.signal.aborted) setCargando(false) })
        return () => controlador.abort()
    }, [capacidades?.leerRoles])

    async function actualizarDatos() {
        setRecargando(true)
        setConfirmandoId(null)
        try {
            const nuevo = await iamApi.obtenerUsuario(actual.id)
            setActual(nuevo)
            actualizado(nuevo)
            if (capacidades?.leerRoles) {
                try { setRoles(await iamApi.listarRoles()) }
                catch (fallo) { setRoles(null); throw fallo }
            }
            setDatosPendientes(false)
            return true
        } catch (fallo) {
            setDatosPendientes(true)
            setError(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'Ya no tienes permiso para consultar estos datos.'
                : fallo instanceof ErrorApi && fallo.estado === 404
                    ? 'El usuario ya no está disponible. Cierra el modal y actualiza el listado.'
                    : 'No se pudieron actualizar los datos. Comprueba la conexión y vuelve a intentarlo.')
            return false
        } finally { setRecargando(false) }
    }

    async function cambiar(rolId: string, asignado: boolean) {
        if (guardandoId || recargando || datosPendientes) return
        setConfirmandoId(null)
        setError('')
        setMensaje('')
        setGuardandoId(rolId)
        try {
            if (asignado) await iamApi.retirarRol(actual.id, rolId)
            else await iamApi.asignarRol(actual.id, rolId)
        } catch (fallo) {
            if (fallo instanceof ErrorApi && fallo.estado === 409) {
                const recuperado = await actualizarDatos()
                if (recuperado) setError('La asignación cambió o está protegida (por ejemplo, el último superadministrador). Revisa los datos actualizados antes de reintentar.')
            } else {
                setError(fallo instanceof ErrorApi && fallo.estado === 403
                    ? 'Ya no tienes permiso para cambiar los roles de este usuario.'
                    : fallo instanceof ErrorApi && fallo.estado === 404
                        ? 'El usuario o el rol ya no está disponible. Actualiza los datos.'
                        : 'No se pudo guardar la asignación. Comprueba la conexión.')
            }
            setGuardandoId(null)
            return
        }
        // La respuesta de mutación confirma la escritura; luego se consulta el estado real del perfil.
        const confirmado = await actualizarDatos()
        if (confirmado) setMensaje(asignado ? 'Rol retirado.' : 'Rol asignado.')
        else setError('El cambio se guardó, pero no se pudo confirmar el estado actualizado. Pulsa «Actualizar datos» antes de continuar.')
        setGuardandoId(null)
    }

    const relaciones = new Map(actual.roles.map((r) => [r.rolId, r.estado]))
    const termino = busqueda.trim().toLocaleLowerCase('es')
    const visibles = roles?.filter((rol) => {
        const asignado = relaciones.get(rol.id) === 'activo'
        return (!termino || [rol.nombre, rol.slug, rol.id].some((v) => v.toLocaleLowerCase('es').includes(termino))) &&
            (filtro === 'todos' || (filtro === 'asignados' && asignado) ||
                (filtro === 'disponibles' && !asignado && rol.estado === 'activo') ||
                (filtro === 'inactivos' && (rol.estado !== 'activo' || relaciones.get(rol.id) === 'inactivo')))
    }) ?? []
    const conocidos = new Set(roles?.map((r) => r.id) ?? [])
    const otros = actual.roles.filter((r) => !conocidos.has(r.rolId))
    const ocupado = guardandoId !== null || recargando
    const accionesDeshabilitadas = ocupado || datosPendientes
    const gestionar = Boolean(capacidades?.gestionarRolesUsuarios)
    const activos = actual.roles.filter((r) => r.estado === 'activo').length

    function accion(rolId: string, asignado: boolean) {
        if (asignado && confirmandoId !== rolId) { setConfirmandoId(rolId); return }
        void cambiar(rolId, asignado)
    }

    return <ModalPortal titulo={`Usuario: ${actual.nombreCompleto}`} cerrar={cerrar} bloqueado={ocupado}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-neutral-600">Identificación</dt><dd className="break-all">{actual.id}</dd></div>
            <div><dt className="text-neutral-600">Estado</dt><dd>{actual.estado}</dd></div>
            <div><dt className="text-neutral-600">Correo</dt><dd className="break-all">{actual.email ?? 'Sin correo'}</dd></div>
            <div><dt className="text-neutral-600">Teléfono</dt><dd>{actual.telefono ?? 'Sin teléfono'}</dd></div>
            <div><dt className="text-neutral-600">Correo verificado</dt><dd>{fecha(actual.emailVerifiedAt)}</dd></div>
            <div><dt className="text-neutral-600">Creado</dt><dd>{fecha(actual.creadoEn)}</dd></div>
            <div><dt className="text-neutral-600">Actualizado</dt><dd>{fecha(actual.actualizadoEn)}</dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-5">
            <div><h3 className="font-semibold">Roles del usuario</h3>
                <p className="text-sm text-neutral-600">{activos} vínculos activos · {actual.roles.length - activos} inactivos.</p></div>
            <button type="button" disabled={ocupado || cargando} onClick={() => { setError(''); setMensaje(''); void actualizarDatos() }}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-60">
                {recargando ? 'Actualizando…' : 'Actualizar datos'}
            </button>
        </div>
        {actual.estado !== 'activo' && <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">El perfil está {actual.estado}; no puede recibir roles ni ejercer los asignados.</p>}
        {!capacidades?.leerRoles && <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">Para ver los nombres y códigos de los roles se requiere iam.roles.read; aquí se muestran solo los IDs vinculados.</p>}
        {datosPendientes && <p className="mt-3 text-sm text-neutral-600">Actualiza los datos antes de otra asignación.</p>}
        {cargando && <p role="status" className="mt-3">Cargando roles…</p>}
        {error && <p role="alert" className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {mensaje && <p role="status" className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-800">{mensaje}</p>}
        {roles && <>
            <div className="mt-4 flex flex-wrap gap-3">
                <label className="min-w-48 flex-1 text-sm font-medium">Buscar rol
                    <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Nombre, código o ID"
                        className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                </label>
                <label className="text-sm font-medium">Vínculo
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value as typeof filtro)}
                        className="mt-1 block rounded-md border border-neutral-300 bg-white px-3 py-2">
                        <option value="todos">Todos</option><option value="asignados">Asignados activos</option>
                        <option value="disponibles">Disponibles</option><option value="inactivos">Inactivos</option>
                    </select>
                </label>
            </div>
            <p role="status" className="mt-3 text-sm text-neutral-600">{visibles.length} de {roles.length} roles del catálogo.</p>
            {visibles.length === 0 ? <p className="mt-3 text-sm">No hay roles que coincidan con los filtros.</p> :
                <ul className="mt-2 divide-y divide-neutral-200">{visibles.map((rol) => {
                    const asignado = relaciones.get(rol.id) === 'activo'
                    return <li key={rol.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div className="min-w-0"><p className="font-medium">{rol.nombre}</p>
                            <p className="break-all text-sm text-neutral-600">{rol.slug} · ID {rol.id} · rol {rol.estado}</p>
                            <p className="text-sm">{asignado ? 'Vínculo activo' : relaciones.get(rol.id) === 'inactivo' ? 'Vínculo inactivo' : 'Sin asignar'}</p>
                        </div>
                        {gestionar && (asignado ? actual.estado !== 'eliminado' : actual.estado === 'activo' && rol.estado === 'activo') &&
                            <div className="flex items-center gap-2">
                                {confirmandoId === rol.id && <button type="button" disabled={ocupado} onClick={() => setConfirmandoId(null)} className="text-sm underline">Cancelar</button>}
                                <button type="button" disabled={accionesDeshabilitadas} onClick={() => accion(rol.id, asignado)}
                                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-60">
                                    {guardandoId === rol.id ? 'Guardando…' : asignado ? confirmandoId === rol.id ? 'Confirmar retiro' : 'Retirar' : 'Asignar'}
                                </button>
                            </div>}
                    </li>
                })}</ul>}
        </>}
        {otros.length > 0 && <div className="mt-5"><h3 className="font-semibold">Otros vínculos registrados</h3>
            <ul className="mt-2 divide-y divide-neutral-200">{otros.map((r) => <li key={r.rolId} className="flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
                <span>Rol ID {r.rolId} · vínculo {r.estado}</span>
                {gestionar && r.estado === 'activo' && actual.estado !== 'eliminado' && <div className="flex items-center gap-2">
                    {confirmandoId === r.rolId && <button type="button" disabled={ocupado} onClick={() => setConfirmandoId(null)} className="underline">Cancelar</button>}
                    <button type="button" disabled={accionesDeshabilitadas} onClick={() => accion(r.rolId, true)}
                        className="rounded-md border border-neutral-300 px-3 py-2 font-semibold disabled:opacity-60">
                        {guardandoId === r.rolId ? 'Guardando…' : confirmandoId === r.rolId ? 'Confirmar retiro' : 'Retirar'}
                    </button></div>}
            </li>)}</ul>
        </div>}
        {confirmandoId && <p className="mt-3 text-sm text-amber-900">Confirma el retiro. Si es el último superadministrador activo, el servidor rechazará la operación.</p>}
    </ModalPortal>
}