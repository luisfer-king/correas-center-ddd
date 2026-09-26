import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { RolIam } from '../api/tipos-iam'
import { EstadoRolEtiqueta, fechaRol } from './datos-rol'

type Consulta =
    | { tipo: 'cargando' }
    | { tipo: 'rol'; rol: RolIam }
    | { tipo: 'invalido' | 'ausente' | 'sin-permiso' | 'error' }

export function DetalleRol() {
    const { id } = useParams<{ id: string }>()
    const [consulta, setConsulta] = useState<Consulta>({ tipo: 'cargando' })
    const [revision, setRevision] = useState(0)

    useEffect(() => {
        if (!id || !/^[1-9]\d*$/.test(id)) {
            setConsulta({ tipo: 'invalido' })
            return
        }
        const controlador = new AbortController()
        setConsulta({ tipo: 'cargando' })
        void iamApi.obtenerRol(id, { signal: controlador.signal }).then((rol) => {
            if (!controlador.signal.aborted) setConsulta({ tipo: 'rol', rol })
        }).catch((error: unknown) => {
            if (!controlador.signal.aborted) setConsulta({
                tipo:
                    error instanceof ErrorApi && error.estado === 404 ? 'ausente'
                        : error instanceof ErrorApi && error.estado === 403 ? 'sin-permiso' : 'error',
            })
        })
        return () => controlador.abort()
    }, [id, revision])

    const rol = consulta.tipo === 'rol' ? consulta.rol : null
    return <main className="w-full px-6 py-10 sm:px-10">
        <Link to="/portal/roles" className="text-sm font-semibold text-red-700 underline">← Volver a roles</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-widest text-red-700">Detalle del rol</p>
                <h1 className="mt-2 text-3xl font-semibold">{rol?.nombre ?? 'Rol'}</h1></div>
            <button type="button" onClick={() => setRevision((n) => n + 1)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50">Actualizar detalle</button>
        </div>
        {consulta.tipo === 'cargando' && <p role="status" className="mt-8">Cargando rol…</p>}
        {consulta.tipo !== 'cargando' && consulta.tipo !== 'rol' && <p role="alert" className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
            {consulta.tipo === 'invalido' ? 'Identificador de rol inválido.'
                : consulta.tipo === 'ausente' ? 'El rol solicitado no existe.'
                    : consulta.tipo === 'sin-permiso' ? 'Tu cuenta no tiene permiso para consultar este rol.'
                        : 'No se pudo cargar el rol. Revisa la conexión y pulsa «Actualizar detalle».'}
        </p>}
        {rol && <>
            <dl className="mt-8 grid gap-5 rounded-lg border border-neutral-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-sm text-neutral-600">ID</dt><dd className="mt-1 font-mono text-sm">{rol.id}</dd></div>
                <div><dt className="text-sm text-neutral-600">Código</dt><dd className="mt-1 font-medium">{rol.slug}</dd></div>
                <div><dt className="text-sm text-neutral-600">Estado</dt><dd className="mt-1"><EstadoRolEtiqueta estado={rol.estado} /></dd></div>
                <div><dt className="text-sm text-neutral-600">Tipo</dt><dd className="mt-1">{rol.esSistema ? 'Rol del sistema' : 'Rol personalizado'}</dd></div>
                <div><dt className="text-sm text-neutral-600">Creado</dt><dd className="mt-1">{fechaRol(rol.creadoEn)}</dd></div>
                <div><dt className="text-sm text-neutral-600">Actualizado</dt><dd className="mt-1">{fechaRol(rol.actualizadoEn)}</dd></div>
                {rol.eliminadoEn && <div><dt className="text-sm text-neutral-600">Baja</dt><dd className="mt-1">{fechaRol(rol.eliminadoEn)}</dd></div>}
                <div className="sm:col-span-2 lg:col-span-3"><dt className="text-sm text-neutral-600">Descripción</dt>
                    <dd className="mt-1 whitespace-pre-wrap">{rol.descripcion || 'Sin descripción'}</dd></div>
            </dl>
            <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-6" aria-labelledby="permisos-rol">
                <h2 id="permisos-rol" className="text-xl font-semibold">Permisos asignados</h2>
                <p className="mt-2 text-sm text-neutral-600">{rol.permisos.filter((p) => p.estado === 'activo').length} activos de {rol.permisos.length} vínculos. Los nombres y la gestión de permisos se incorporarán en la entrega 6.</p>
                {rol.permisos.length === 0 ? <p className="mt-5">Este rol no tiene permisos asignados.</p> :
                    <ul className="mt-5 divide-y divide-neutral-200">{rol.permisos.map((p) => <li key={p.permisoId} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                        <span>Permiso ID {p.permisoId}</span><span className={p.estado === 'activo' ? 'font-semibold text-green-800' : 'text-neutral-600'}>{p.estado}</span>
                    </li>)}</ul>}
            </section>
        </>}
    </main>
}