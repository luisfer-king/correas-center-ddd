import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { EstadoRol, RolIam } from '../api/tipos-iam'
import { EstadoRolEtiqueta } from './datos-rol'

type Consulta =
    | { tipo: 'cargando' }
    | { tipo: 'lista'; roles: RolIam[] }
    | { tipo: 'sin-permiso' }
    | { tipo: 'error' }

export function ListadoRoles() {
    const [consulta, setConsulta] = useState<Consulta>({ tipo: 'cargando' })
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState<EstadoRol | 'todos'>('todos')
    const [revision, setRevision] = useState(0)

    useEffect(() => {
        const controlador = new AbortController()
        setConsulta({ tipo: 'cargando' })
        void iamApi.listarRoles({ signal: controlador.signal }).then((roles) => {
            if (!controlador.signal.aborted) setConsulta({ tipo: 'lista', roles })
        }).catch((error: unknown) => {
            if (!controlador.signal.aborted) setConsulta(
                error instanceof ErrorApi && error.estado === 403 ? { tipo: 'sin-permiso' } : { tipo: 'error' },
            )
        })
        return () => controlador.abort()
    }, [revision])

    const texto = busqueda.trim().toLocaleLowerCase('es')
    const visibles = consulta.tipo === 'lista' ? consulta.roles.filter((rol) =>
        (filtro === 'todos' || rol.estado === filtro) &&
        (!texto || [rol.nombre, rol.slug, rol.id].some((valor) => valor.toLocaleLowerCase('es').includes(texto))),
    ) : []

    return <main className="w-full px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Identidad y acceso</p>
                <h1 className="mt-2 text-3xl font-semibold">Roles</h1>
                <p className="mt-2 text-neutral-600">Consulta los roles registrados y sus estados.</p>
            </div>
            <button type="button" onClick={() => setRevision((n) => n + 1)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Actualizar listado</button>
        </div>

        {consulta.tipo === 'cargando' && <p role="status" className="mt-8">Cargando roles…</p>}
        {consulta.tipo === 'sin-permiso' && <p role="alert" className="mt-8 rounded-md bg-amber-50 p-5 text-amber-900">Tu cuenta no tiene permiso para consultar roles.</p>}
        {consulta.tipo === 'error' && <p role="alert" className="mt-8 rounded-md bg-red-50 p-5 text-red-800">No se pudieron cargar los roles. Revisa la conexión y pulsa «Actualizar listado».</p>}
        {consulta.tipo === 'lista' && <>
            <div className="mt-8 flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-white p-5">
                <label className="min-w-52 flex-1 text-sm font-medium" htmlFor="buscar-rol">Buscar por nombre, código o ID
                    <input id="buscar-rol" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-red-700" />
                </label>
                <label className="text-sm font-medium" htmlFor="filtrar-rol">Estado
                    <select id="filtrar-rol" value={filtro} onChange={(e) => setFiltro(e.target.value as EstadoRol | 'todos')}
                        className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-red-700">
                        <option value="todos">Todos</option><option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option><option value="eliminado">Eliminado</option>
                    </select>
                </label>
            </div>
            <p role="status" className="mt-4 text-sm text-neutral-600">{visibles.length} de {consulta.roles.length} roles</p>
            {visibles.length === 0 ? <p className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">No hay roles que coincidan con los filtros.</p> :
                <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                    <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                        <caption className="sr-only">Roles registrados</caption>
                        <thead className="bg-neutral-50 text-neutral-700"><tr>
                            <th scope="col" className="px-5 py-4">Rol</th><th scope="col" className="px-5 py-4">Código</th>
                            <th scope="col" className="px-5 py-4">Estado</th><th scope="col" className="px-5 py-4">Permisos activos</th>
                            <th scope="col" className="px-5 py-4">Acción</th>
                        </tr></thead>
                        <tbody>{visibles.map((rol) => <tr key={rol.id} className="border-t border-neutral-200">
                            <th scope="row" className="px-5 py-4 font-semibold">{rol.nombre}{rol.esSistema && <span className="ml-2 text-xs font-normal text-neutral-600">Sistema</span>}</th>
                            <td className="px-5 py-4 font-mono text-xs">{rol.slug}</td>
                            <td className="px-5 py-4"><EstadoRolEtiqueta estado={rol.estado} /></td>
                            <td className="px-5 py-4">{rol.permisos.filter((p) => p.estado === 'activo').length}</td>
                            <td className="px-5 py-4"><Link to={`/portal/roles/${rol.id}`} className="font-semibold text-red-700 underline">Ver detalle de {rol.nombre}</Link></td>
                        </tr>)}</tbody>
                    </table>
                </div>}
        </>}
    </main>
}