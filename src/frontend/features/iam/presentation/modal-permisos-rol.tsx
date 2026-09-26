import { useEffect, useState } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { CapacidadesRoles, PermisoIam, RolIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

export function ModalPermisosRol({ rol, capacidades, cerrar, actualizado }: {
    rol: RolIam; capacidades: CapacidadesRoles; cerrar: () => void; actualizado: (rol: RolIam) => void
}) {
    const [actual, setActual] = useState(rol)
    const [catalogo, setCatalogo] = useState<PermisoIam[] | null>(null)
    const [cargando, setCargando] = useState(capacidades.leerPermisos)
    const [error, setError] = useState('')
    const [guardandoId, setGuardandoId] = useState<string | null>(null)

    useEffect(() => {
        if (!capacidades.leerPermisos) return
        const controlador = new AbortController()
        void iamApi.listarPermisos({ signal: controlador.signal }).then((datos) => {
            if (!controlador.signal.aborted) setCatalogo(datos)
        }).catch((fallo: unknown) => {
            if (!controlador.signal.aborted) setError(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'No tienes permiso para consultar el catálogo de permisos.' : 'No se pudo cargar el catálogo de permisos.')
        }).finally(() => { if (!controlador.signal.aborted) setCargando(false) })
        return () => controlador.abort()
    }, [capacidades.leerPermisos])

    const relaciones = new Map(actual.permisos.map((p) => [p.permisoId, p.estado]))
    const disponibles = catalogo?.filter((p) => p.estado === 'activo') ?? []
    const noCatalogados = actual.permisos.filter((p) => !disponibles.some((item) => item.id === p.permisoId))

    async function cambiar(permisoId: string, asignado: boolean) {
        if (guardandoId) return
        setError('')
        setGuardandoId(permisoId)
        try {
            if (asignado) await iamApi.retirarPermiso(actual.id, permisoId)
            else await iamApi.asignarPermiso(actual.id, permisoId)
            const nuevo = await iamApi.obtenerRol(actual.id)
            setActual(nuevo)
            actualizado(nuevo)
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 409
                ? 'El rol cambió mientras gestionabas los permisos. Cierra el modal y actualiza el listado.'
                : fallo instanceof ErrorApi && fallo.estado === 403 ? 'No tienes permiso para cambiar esta asignación.'
                    : 'No se pudo guardar la asignación. Comprueba la conexión.')
        } finally { setGuardandoId(null) }
    }

    return <ModalPortal titulo={`Permisos: ${actual.nombre}`} cerrar={cerrar} bloqueado={guardandoId !== null}>
        <p className="text-sm text-neutral-600">{actual.permisos.filter((p) => p.estado === 'activo').length} permisos activos. Los vínculos inactivos siguen registrados.</p>
        {cargando && <p role="status" className="mt-4">Cargando catálogo…</p>}
        {!capacidades.leerPermisos && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">Puedes ver los IDs asignados; para consultar nombres y códigos se necesita `iam.permisos.read`.</p>}
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {catalogo && <ul className="mt-4 divide-y divide-neutral-200">
            {disponibles.map((p) => {
                const asignado = relaciones.get(p.id) === 'activo'
                return <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div><p className="font-medium">{p.nombre}</p><p className="text-sm text-neutral-600">{p.slug} · {p.grupo} · {asignado ? 'Asignado' : 'Sin asignar'}</p></div>
                    {capacidades.gestionarPermisos && actual.estado === 'activo' && (!actual.esSistema || !asignado) &&
                        <button type="button" disabled={guardandoId !== null} onClick={() => void cambiar(p.id, asignado)}
                            className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold disabled:opacity-60">
                            {guardandoId === p.id ? 'Guardando…' : asignado ? 'Retirar' : 'Asignar'}
                        </button>}
                </li>
            })}
        </ul>}
        {noCatalogados.length > 0 && <div className="mt-5"><h3 className="font-semibold">Otros vínculos registrados</h3>
            <ul className="mt-2 divide-y divide-neutral-200">{noCatalogados.map((p) => <li key={p.permisoId} className="py-2 text-sm">
                Permiso ID {p.permisoId} · {p.estado}
            </li>)}</ul>
        </div>}
    </ModalPortal>
}