import { useState } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { RolIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

export function ModalEstadoRol({ rol, accion, cerrar, confirmado }: {
    rol: RolIam
    accion: 'activar' | 'inactivar'
    cerrar: () => void
    confirmado: () => void
}) {
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')
    const esInactivar = accion === 'inactivar'

    async function ejecutar() {
        if (enviando) return
        setEnviando(true)
        setError('')
        try {
            await iamApi.cambiarEstadoRol(rol.id, accion)
            confirmado()
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 409
                ? 'El rol cambió o no admite esta transición. Actualiza el listado y vuelve a intentarlo.'
                : fallo instanceof ErrorApi && fallo.estado === 403
                    ? 'Tu cuenta no tiene permiso para cambiar el estado de este rol.'
                    : 'No se pudo cambiar el estado. Comprueba la conexión y vuelve a intentarlo.')
        } finally {
            setEnviando(false)
        }
    }

    return <ModalPortal titulo={esInactivar ? 'Inactivar rol' : 'Reactivar rol'} cerrar={cerrar} bloqueado={enviando}>
        <p>¿{esInactivar ? 'Inactivar' : 'Reactivar'} el rol <strong>{rol.nombre}</strong>?</p>
        <p className="mt-3 text-sm text-neutral-600">
            {esInactivar
                ? 'Mientras esté inactivo, este rol no otorgará permisos. Sus asignaciones permanecerán registradas para una posible reactivación.'
                : 'Volverá a otorgar los permisos activos que tiene asignados a los usuarios con vínculo vigente.'}
        </p>
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={cerrar} disabled={enviando} className="rounded-md border border-neutral-300 px-4 py-2">Cancelar</button>
            <button type="button" onClick={() => void ejecutar()} disabled={enviando}
                className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
                {enviando ? 'Guardando…' : esInactivar ? 'Inactivar' : 'Reactivar'}
            </button>
        </div>
    </ModalPortal>
}