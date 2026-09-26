import { useEffect, useState } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { CapacidadesRoles, PermisoIam, RolIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

type Filtro = 'todos' | 'asignados' | 'disponibles' | 'inactivos'

export function ModalPermisosRol({ rol, capacidades, cerrar, actualizado }: {
    rol: RolIam; capacidades: CapacidadesRoles; cerrar: () => void; actualizado: (rol: RolIam) => void
}) {
    const [actual, setActual] = useState(rol)
    const [catalogo, setCatalogo] = useState<PermisoIam[] | null>(null)
    const [cargando, setCargando] = useState(capacidades.leerPermisos)
    const [recargando, setRecargando] = useState(false)
    const [datosPendientes, setDatosPendientes] = useState(false)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [guardandoId, setGuardandoId] = useState<string | null>(null)
    const [busqueda, setBusqueda] = useState('')
    const [grupo, setGrupo] = useState('todos')
    const [filtro, setFiltro] = useState<Filtro>('todos')

    useEffect(() => {
        if (!capacidades.leerPermisos) return
        const controlador = new AbortController()
        void iamApi.listarPermisos({ signal: controlador.signal }).then((datos) => {
            if (!controlador.signal.aborted) setCatalogo(datos)
        }).catch((fallo: unknown) => {
            if (!controlador.signal.aborted) setError(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'No tienes permiso para consultar el catálogo.' : 'No se pudo cargar el catálogo. Usa «Actualizar datos» para reintentar.')
        }).finally(() => { if (!controlador.signal.aborted) setCargando(false) })
        return () => controlador.abort()
    }, [capacidades.leerPermisos])

    async function actualizarDatos() {
        setRecargando(true)
        try {
            const nuevo = await iamApi.obtenerRol(actual.id)
            setActual(nuevo)
            actualizado(nuevo)
            if (capacidades.leerPermisos) {
                try {
                    setCatalogo(await iamApi.listarPermisos())
                } catch (fallo) {
                    setCatalogo(null)
                    throw fallo
                }
            }
            setDatosPendientes(false)
            return true
        } catch (fallo) {
            setDatosPendientes(true)
            setError(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'Tu cuenta ya no puede consultar estos datos.'
                : fallo instanceof ErrorApi && fallo.estado === 404
                    ? 'El rol ya no está disponible. Cierra el modal y actualiza el listado.'
                    : 'No se pudieron actualizar los datos. Comprueba la conexión y vuelve a intentarlo.')
            return false
        } finally { setRecargando(false) }
    }

    async function cambiar(permisoId: string, asignado: boolean) {
        if (guardandoId || recargando || datosPendientes) return
        setError('')
        setMensaje('')
        setGuardandoId(permisoId)
        try {
            if (asignado) await iamApi.retirarPermiso(actual.id, permisoId)
            else await iamApi.asignarPermiso(actual.id, permisoId)
            const actualizadoCorrectamente = await actualizarDatos()
            if (actualizadoCorrectamente) setMensaje(asignado ? 'Permiso retirado.' : 'Permiso asignado.')
            else setError('La operación se guardó, pero no se pudo confirmar el estado actualizado. Usa «Actualizar datos» antes de continuar.')
        } catch (fallo) {
            if (fallo instanceof ErrorApi && fallo.estado === 409) {
                const recuperado = await actualizarDatos()
                if (recuperado) setError('El rol o el permiso cambió durante la operación. Los datos están actualizados; revisa el estado y vuelve a intentarlo.')
            } else {
                setError(fallo instanceof ErrorApi && fallo.estado === 403
                    ? 'Ya no tienes permiso para cambiar esta asignación.'
                    : fallo instanceof ErrorApi && fallo.estado === 404
                        ? 'El rol o el permiso ya no está disponible. Actualiza los datos.'
                        : 'No se pudo guardar la asignación. Comprueba la conexión.')
            }
            return
        } finally { setGuardandoId(null) }
    }

    const relaciones = new Map(actual.permisos.map((p) => [p.permisoId, p.estado]))
    const grupos = [...new Set(catalogo?.map((p) => p.grupo) ?? [])].sort((a, b) => a.localeCompare(b, 'es'))
    const termino = busqueda.trim().toLocaleLowerCase()
    const visibles = catalogo?.filter((p) => {
        const asignado = relaciones.get(p.id) === 'activo'
        const coincide = !termino || [p.nombre, p.slug, p.grupo, p.id].some((v) => v.toLocaleLowerCase().includes(termino))
        return coincide && (grupo === 'todos' || p.grupo === grupo) && (
            filtro === 'todos' || (filtro === 'asignados' && asignado) ||
            (filtro === 'disponibles' && !asignado && p.estado === 'activo') ||
            (filtro === 'inactivos' && (p.estado !== 'activo' || relaciones.get(p.id) === 'inactivo'))
        )
    }) ?? []
    const conocidos = new Set(catalogo?.map((p) => p.id) ?? [])
    const otros = actual.permisos.filter((p) => !conocidos.has(p.permisoId))
    const ocupado = guardandoId !== null || recargando
    const accionesDeshabilitadas = ocupado || datosPendientes
    const activos = actual.permisos.filter((p) => p.estado === 'activo').length

    return <ModalPortal titulo={`Permisos: ${actual.nombre}`} cerrar={cerrar} bloqueado={ocupado}>
        <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-600">{activos} vínculos activos · {actual.permisos.length - activos} inactivos · rol {actual.estado}.</p>
            <button type="button" disabled={ocupado || cargando} onClick={() => {
                setError(''); setMensaje(''); void actualizarDatos()
            }} className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-60">
                {recargando ? 'Actualizando…' : 'Actualizar datos'}
            </button>
        </div>
        {datosPendientes && <p className="mt-3 text-sm text-neutral-600">Actualiza los datos antes de realizar otra asignación.</p>}
        {actual.estado !== 'activo' && <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            Este rol {actual.estado === 'eliminado' ? 'fue eliminado' : 'está inactivo'}; sus vínculos no otorgan acceso mientras no esté activo.
        </p>}
        {actual.esSistema && <p className="mt-3 text-sm text-neutral-600">Los vínculos activos del rol de sistema están protegidos contra el retiro.</p>}
        {cargando && <p role="status" className="mt-4">Cargando catálogo…</p>}
        {!capacidades.leerPermisos && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            Se muestran los identificadores vinculados. Para consultar nombres y códigos se requiere iam.permisos.read.
        </p>}
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {mensaje && <p role="status" className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{mensaje}</p>}
        {catalogo && <>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium">Buscar permiso
                    <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Nombre, código o ID"
                        className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                </label>
                <label className="text-sm font-medium">Grupo
                    <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2">
                        <option value="todos">Todos</option>{grupos.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>
                <label className="text-sm font-medium">Vínculo
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2">
                        <option value="todos">Todos</option><option value="asignados">Asignados activos</option>
                        <option value="disponibles">Disponibles</option><option value="inactivos">Inactivos</option>
                    </select>
                </label>
            </div>
            <p role="status" className="mt-4 text-sm text-neutral-600">{visibles.length} de {catalogo.length} permisos del catálogo.</p>
            {visibles.length === 0 ? <p className="mt-3 text-sm">No hay permisos que coincidan con los filtros.</p> :
                <ul className="mt-2 divide-y divide-neutral-200">{visibles.map((p) => {
                    const asignado = relaciones.get(p.id) === 'activo'
                    return <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div className="min-w-0"><p className="font-medium">{p.nombre}</p>
                            <p className="break-all text-sm text-neutral-600">{p.slug} · {p.grupo} · ID {p.id}</p>
                            {p.descripcion && <p className="text-sm text-neutral-600">{p.descripcion}</p>}
                            <p className="text-sm">{asignado ? 'Asignado (activo)' : relaciones.get(p.id) === 'inactivo' ? 'Vínculo inactivo' : 'Sin asignar'}
                                {p.estado !== 'activo' && ` · Permiso ${p.estado}`}</p>
                        </div>
                        {capacidades.gestionarPermisos && (asignado ? !actual.esSistema && actual.estado !== 'eliminado' : actual.estado === 'activo' && p.estado === 'activo') &&
                            <button type="button" disabled={accionesDeshabilitadas} onClick={() => void cambiar(p.id, asignado)}
                                className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-60">
                                {guardandoId === p.id ? 'Guardando…' : asignado ? 'Retirar' : 'Asignar'}
                            </button>}
                    </li>
                })}</ul>}
        </>}
        {otros.length > 0 && <div className="mt-5"><h3 className="font-semibold">Vínculos sin datos en el catálogo</h3>
            <ul className="mt-2 divide-y divide-neutral-200">{otros.map((p) => <li key={p.permisoId} className="flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
                <span>Permiso ID {p.permisoId} · vínculo {p.estado}</span>
                {capacidades.gestionarPermisos && p.estado === 'activo' && !actual.esSistema && actual.estado !== 'eliminado' &&
                    <button type="button" disabled={accionesDeshabilitadas} onClick={() => void cambiar(p.permisoId, true)}
                        className="rounded-md border border-neutral-300 px-3 py-2 font-semibold disabled:opacity-60">
                        {guardandoId === p.permisoId ? 'Guardando…' : 'Retirar'}
                    </button>}
            </li>)}</ul>
        </div>}
    </ModalPortal>
}