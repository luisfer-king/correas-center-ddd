import { useState } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { RolIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

export function ModalBajaRol({ rol, cerrar, eliminado }: {
    rol: RolIam; cerrar: () => void; eliminado: () => void
}) {
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')
    async function confirmar() {
        if (enviando) return
        setEnviando(true)
        setError('')
        try {
            await iamApi.cambiarEstadoRol(rol.id, 'eliminar')
            eliminado()
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 403 ? 'No tienes permiso para dar de baja este rol.'
                : fallo instanceof ErrorApi && fallo.estado === 409 ? 'El rol cambió o está protegido. Actualiza el listado.'
                    : 'No se pudo dar de baja el rol.')
        } finally { setEnviando(false) }
    }
    return <ModalPortal titulo="Confirmar baja lógica" cerrar={cerrar} bloqueado={enviando}>
        <p>¿Dar de baja el rol <strong>{rol.nombre}</strong>? Su estado cambiará a «eliminado» y dejará de otorgar permisos.</p>
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={cerrar} disabled={enviando} className="rounded-md border border-neutral-300 px-4 py-2">Cancelar</button>
            <button type="button" onClick={() => void confirmar()} disabled={enviando}
                className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
                {enviando ? 'Guardando…' : 'Dar de baja'}
            </button>
        </div>
    </ModalPortal>
}