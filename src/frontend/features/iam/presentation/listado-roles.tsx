import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { CapacidadesRoles, EstadoRol, RolIam } from '../api/tipos-iam'
import { EstadoRolEtiqueta } from './datos-rol'
import { ModalBajaRol } from './modal-baja-rol'
import { ModalDetalleRol } from './modal-detalle-rol'
import { ModalEstadoRol } from './modal-estado-rol'
import { ModalFormularioRol } from './modal-formulario-rol'
import { ModalPermisosRol } from './modal-permisos-rol'

type Consulta = { tipo: 'cargando' } | { tipo: 'lista'; roles: RolIam[] } | { tipo: 'sin-permiso' | 'error' }
type Modal = { tipo: 'crear' } | { tipo: 'detalle' | 'editar' | 'permisos' | 'baja' | 'activar' | 'inactivar'; rol: RolIam }

export function ListadoRoles() {
    const [consulta, setConsulta] = useState<Consulta>({ tipo: 'cargando' })
    const [capacidades, setCapacidades] = useState<CapacidadesRoles | null>(null)
    const [modal, setModal] = useState<Modal | null>(null)
    const [errorDetalle, setErrorDetalle] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState<EstadoRol | 'todos'>('todos')
    const [revision, setRevision] = useState(0)
    const { id } = useParams<{ id: string }>()
    const navegar = useNavigate()

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

    useEffect(() => {
        const controlador = new AbortController()
        void iamApi.capacidadesRoles({ signal: controlador.signal }).then((valor) => {
            if (!controlador.signal.aborted) setCapacidades(valor)
        }).catch(() => { if (!controlador.signal.aborted) setCapacidades(null) })
        return () => controlador.abort()
    }, [revision])

    useEffect(() => {
        if (!id) { setErrorDetalle(''); setModal((actual) => actual?.tipo === 'detalle' ? null : actual); return }
        if (!/^[1-9]\d*$/.test(id)) { setErrorDetalle('Identificador de rol inválido.'); return }
        const controlador = new AbortController()
        setErrorDetalle('')
        void iamApi.obtenerRol(id, { signal: controlador.signal }).then((rol) => {
            if (!controlador.signal.aborted) setModal({ tipo: 'detalle', rol })
        }).catch((error: unknown) => {
            if (!controlador.signal.aborted) setErrorDetalle(error instanceof ErrorApi && error.estado === 404
                ? 'El rol no está disponible para tu cuenta.' : 'No se pudo cargar el detalle del rol.')
        })
        return () => controlador.abort()
    }, [id])

    const texto = busqueda.trim().toLocaleLowerCase('es')
    const visibles = consulta.tipo === 'lista' ? consulta.roles.filter((rol) =>
        (filtro === 'todos' || rol.estado === filtro) &&
        (!texto || [rol.nombre, rol.slug, rol.id].some((v) => v.toLocaleLowerCase('es').includes(texto))),
    ) : []

    function cerrarModal() {
        setModal(null)
        if (id) navegar('/portal/roles', { replace: true })
    }
    function guardado(rol: RolIam) {
        setModal(null)
        actualizarFila(rol)
    }
    function actualizarFila(rol: RolIam) {
        setConsulta((actual) => actual.tipo !== 'lista' ? actual : {
            tipo: 'lista', roles: actual.roles.some((r) => r.id === rol.id)
                ? actual.roles.map((r) => r.id === rol.id ? rol : r) : [...actual.roles, rol],
        })
    }
    function confirmadoEstado(accion: 'activar' | 'inactivar' | 'eliminar') {
        cerrarModal()
        setMensaje(accion === 'activar' ? 'Rol reactivado.' : accion === 'inactivar' ? 'Rol inactivado.' : 'Rol dado de baja.')
        setRevision((n) => n + 1)
    }

    return <main className="w-full px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-widest text-red-700">Identidad y acceso</p>
                <h1 className="mt-2 text-3xl font-semibold">Roles</h1>
                <p className="mt-2 text-neutral-600">Consulta y administra los roles según tus permisos.</p></div>
            <div className="flex flex-wrap gap-3">
                {capacidades?.crearRol && <button type="button" onClick={() => setModal({ tipo: 'crear' })}
                    className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white">Crear rol</button>}
                <button type="button" onClick={() => setRevision((n) => n + 1)}
                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold">Actualizar listado</button>
            </div>
        </div>
        {errorDetalle && <p role="alert" className="mt-6 rounded-md bg-red-50 p-4 text-red-800">{errorDetalle}</p>}
        {mensaje && <p role="status" className="mt-6 rounded-md bg-green-50 p-4 text-green-800">{mensaje}</p>}
        {consulta.tipo === 'cargando' && <p role="status" className="mt-8">Cargando roles…</p>}
        {consulta.tipo === 'sin-permiso' && <p role="alert" className="mt-8 rounded-md bg-amber-50 p-5 text-amber-900">Tu cuenta no tiene permiso para consultar roles.</p>}
        {consulta.tipo === 'error' && <p role="alert" className="mt-8 rounded-md bg-red-50 p-5 text-red-800">No se pudieron cargar los roles. Revisa la conexión y pulsa «Actualizar listado».</p>}
        {consulta.tipo === 'lista' && <>
            <div className="mt-8 flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-white p-5">
                <label className="min-w-52 flex-1 text-sm font-medium" htmlFor="buscar-rol">Buscar por nombre, código o ID
                    <input id="buscar-rol" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <label className="text-sm font-medium" htmlFor="filtrar-rol">Estado
                    <select id="filtrar-rol" value={filtro} onChange={(e) => setFiltro(e.target.value as EstadoRol | 'todos')}
                        className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2">
                        <option value="todos">Todos</option><option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        {capacidades?.verEliminados && <option value="eliminado">Eliminado</option>}
                    </select>
                </label>
            </div>
            <p role="status" className="mt-4 text-sm text-neutral-600">{visibles.length} de {consulta.roles.length} roles</p>
            {visibles.length === 0 ? <p className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">No hay roles que coincidan con los filtros.</p> :
                <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                    <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                        <caption className="sr-only">Roles registrados</caption>
                        <thead className="bg-neutral-50"><tr>
                            <th scope="col" className="px-5 py-4">Rol</th><th scope="col" className="px-5 py-4">Código</th>
                            <th scope="col" className="px-5 py-4">Estado</th><th scope="col" className="px-5 py-4">Permisos activos</th>
                            <th scope="col" className="px-5 py-4">Acciones</th>
                        </tr></thead>
                        <tbody>{visibles.map((rol) => <tr key={rol.id} className="border-t border-neutral-200">
                            <th scope="row" className="px-5 py-4 font-semibold">{rol.nombre}{rol.esSistema && <span className="ml-2 text-xs font-normal text-neutral-600">Sistema</span>}</th>
                            <td className="px-5 py-4 font-mono text-xs">{rol.slug}</td>
                            <td className="px-5 py-4"><EstadoRolEtiqueta estado={rol.estado} /></td>
                            <td className="px-5 py-4"><span className="mr-2">{rol.permisos.filter((p) => p.estado === 'activo').length}</span>
                                <button type="button" disabled={!capacidades} onClick={() => setModal({ tipo: 'permisos', rol })} aria-label={`Ver y gestionar permisos de ${rol.nombre}`}
                                    title="Ver y gestionar permisos" className="rounded-md border border-neutral-300 px-2 py-1 text-lg">⚙</button></td>
                            <td className="px-5 py-4"><div className="flex flex-wrap items-center gap-3">
                                <button type="button" onClick={() => navegar(`/portal/roles/${rol.id}`)} className="font-semibold text-red-700 underline">Ver detalle</button>
                                {capacidades?.editarRol && !rol.esSistema && rol.estado !== 'eliminado' &&
                                    <button type="button" onClick={() => setModal({ tipo: 'editar', rol })} className="font-semibold text-red-700 underline">Editar</button>}
                                {capacidades?.editarRol && !rol.esSistema && rol.estado === 'activo' &&
                                    <button type="button" onClick={() => setModal({ tipo: 'inactivar', rol })} className="font-semibold text-red-700 underline">Inactivar</button>}
                                {capacidades?.editarRol && !rol.esSistema && rol.estado === 'inactivo' &&
                                    <button type="button" onClick={() => setModal({ tipo: 'activar', rol })} className="font-semibold text-red-700 underline">Reactivar</button>}
                                {capacidades?.eliminarRol && !rol.esSistema && rol.estado !== 'eliminado' &&
                                    <button type="button" onClick={() => setModal({ tipo: 'baja', rol })} className="font-semibold text-red-700 underline">Dar de baja</button>}
                            </div></td>
                        </tr>)}</tbody>
                    </table>
                </div>}
        </>}
        {modal?.tipo === 'detalle' && <ModalDetalleRol rol={modal.rol} cerrar={cerrarModal} />}
        {modal?.tipo === 'crear' && <ModalFormularioRol cerrar={cerrarModal} guardado={guardado} />}
        {modal?.tipo === 'editar' && <ModalFormularioRol rol={modal.rol} cerrar={cerrarModal} guardado={guardado} />}
        {modal?.tipo === 'permisos' && capacidades && <ModalPermisosRol rol={modal.rol} capacidades={capacidades}
            actualizado={actualizarFila} cerrar={cerrarModal} />}
        {modal?.tipo === 'baja' && <ModalBajaRol rol={modal.rol} cerrar={cerrarModal}
            eliminado={() => confirmadoEstado('eliminar')} />}
        {(modal?.tipo === 'activar' || modal?.tipo === 'inactivar') && <ModalEstadoRol rol={modal.rol} accion={modal.tipo}
            cerrar={cerrarModal} confirmado={() => confirmadoEstado(modal.tipo as 'activar' | 'inactivar')} />}
    </main>
}