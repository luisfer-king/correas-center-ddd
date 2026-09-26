import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { CapacidadesRoles, UsuarioIam } from '../api/tipos-iam'
import { ModalRolesUsuario } from './modal-roles-usuario'

type Consulta = { tipo: 'cargando' } | { tipo: 'lista'; usuarios: UsuarioIam[] } | { tipo: 'sin-permiso' | 'error' }

export function ListadoUsuarios() {
    const [consulta, setConsulta] = useState<Consulta>({ tipo: 'cargando' })
    const [capacidades, setCapacidades] = useState<CapacidadesRoles | null>(null)
    const [detalle, setDetalle] = useState<UsuarioIam | null>(null)
    const [errorDetalle, setErrorDetalle] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState<'todos' | 'activo' | 'inactivo' | 'eliminado'>('todos')
    const [revision, setRevision] = useState(0)
    const { id } = useParams<{ id: string }>()
    const navegar = useNavigate()

    useEffect(() => {
        const controlador = new AbortController()
        setConsulta({ tipo: 'cargando' })
        void iamApi.listarUsuarios({ signal: controlador.signal }).then((usuarios) => {
            if (!controlador.signal.aborted) setConsulta({ tipo: 'lista', usuarios })
        }).catch((fallo: unknown) => {
            if (!controlador.signal.aborted) setConsulta(fallo instanceof ErrorApi && fallo.estado === 403
                ? { tipo: 'sin-permiso' } : { tipo: 'error' })
        })
        return () => controlador.abort()
    }, [revision])

    useEffect(() => {
        const controlador = new AbortController()
        void iamApi.capacidadesRoles({ signal: controlador.signal }).then((valor) => {
            if (!controlador.signal.aborted) setCapacidades(valor)
        }).catch(() => { if (!controlador.signal.aborted) setCapacidades(null) })
        return () => controlador.abort()
    }, [revision])

    useEffect(() => {
        if (!id) { setDetalle(null); setErrorDetalle(''); return }
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            setErrorDetalle('Identificador de usuario inválido.')
            return
        }
        const controlador = new AbortController()
        setErrorDetalle('')
        void iamApi.obtenerUsuario(id, { signal: controlador.signal }).then((usuario) => {
            if (!controlador.signal.aborted) setDetalle(usuario)
        }).catch((fallo: unknown) => {
            if (!controlador.signal.aborted) setErrorDetalle(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'Tu cuenta no tiene permiso para consultar usuarios.'
                : fallo instanceof ErrorApi && fallo.estado === 404
                    ? 'El usuario no está disponible para tu cuenta.' : 'No se pudo cargar el detalle del usuario.')
        })
        return () => controlador.abort()
    }, [id, revision])

    function actualizarFila(usuario: UsuarioIam) {
        setConsulta((previo) => previo.tipo !== 'lista' ? previo : {
            tipo: 'lista', usuarios: previo.usuarios.map((item) => item.id === usuario.id ? usuario : item),
        })
    }
    function cerrarModal() { setDetalle(null); navegar('/portal/usuarios', { replace: true }) }
    const texto = busqueda.trim().toLocaleLowerCase('es')
    const visibles = consulta.tipo === 'lista' ? consulta.usuarios.filter((usuario) =>
        (filtro === 'todos' || usuario.estado === filtro) &&
        (!texto || [usuario.nombreCompleto, usuario.email ?? '', usuario.id].some((v) => v.toLocaleLowerCase('es').includes(texto))),
    ) : []

    return <main className="w-full px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-widest text-red-700">Identidad y acceso</p>
                <h1 className="mt-2 text-3xl font-semibold">Usuarios</h1>
                <p className="mt-2 text-neutral-600">Consulta perfiles y administra sus roles según tus permisos.</p></div>
            <button type="button" onClick={() => setRevision((n) => n + 1)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold">Actualizar listado</button>
        </div>
        {errorDetalle && <p role="alert" className="mt-6 rounded-md bg-red-50 p-4 text-red-800">{errorDetalle}</p>}
        {consulta.tipo === 'cargando' && <p role="status" className="mt-8">Cargando usuarios…</p>}
        {consulta.tipo === 'sin-permiso' && <p role="alert" className="mt-8 rounded-md bg-amber-50 p-5 text-amber-900">Tu cuenta no tiene permiso para consultar usuarios.</p>}
        {consulta.tipo === 'error' && <p role="alert" className="mt-8 rounded-md bg-red-50 p-5 text-red-800">No se pudieron cargar los usuarios. Comprueba la conexión y pulsa «Actualizar listado».</p>}
        {consulta.tipo === 'lista' && <>
            <div className="mt-8 flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-white p-5">
                <label className="min-w-52 flex-1 text-sm font-medium">Buscar por nombre, correo o ID
                    <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <label className="text-sm font-medium">Estado
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value as typeof filtro)}
                        className="mt-2 block rounded-md border border-neutral-300 bg-white px-3 py-2">
                        <option value="todos">Todos</option><option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        {capacidades?.verUsuariosEliminados && <option value="eliminado">Eliminado</option>}
                    </select>
                </label>
            </div>
            <p role="status" className="mt-4 text-sm text-neutral-600">{visibles.length} de {consulta.usuarios.length} usuarios</p>
            {visibles.length === 0 ? <p className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">No hay usuarios que coincidan con los filtros.</p> :
                <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                    <table className="w-full min-w-[740px] border-collapse text-left text-sm">
                        <caption className="sr-only">Perfiles de usuarios</caption>
                        <thead className="bg-neutral-50"><tr>
                            <th scope="col" className="px-5 py-4">Usuario</th><th scope="col" className="px-5 py-4">Correo</th>
                            <th scope="col" className="px-5 py-4">Estado</th><th scope="col" className="px-5 py-4">Roles activos</th>
                            <th scope="col" className="px-5 py-4">Acciones</th>
                        </tr></thead>
                        <tbody>{visibles.map((usuario) => <tr key={usuario.id} className="border-t border-neutral-200">
                            <th scope="row" className="px-5 py-4 font-semibold">{usuario.nombreCompleto}</th>
                            <td className="break-all px-5 py-4">{usuario.email ?? 'Sin correo'}</td>
                            <td className="px-5 py-4">{usuario.estado}</td>
                            <td className="px-5 py-4">{usuario.roles.filter((r) => r.estado === 'activo').length}</td>
                            <td className="px-5 py-4"><button type="button" onClick={() => navegar(`/portal/usuarios/${usuario.id}`)}
                                className="font-semibold text-red-700 underline">Ver detalle y roles</button></td>
                        </tr>)}</tbody>
                    </table>
                </div>}
        </>}
        {id && detalle?.id === id && <ModalRolesUsuario key={id} usuario={detalle} capacidades={capacidades}
            cerrar={cerrarModal} actualizado={actualizarFila} />}
    </main>
}