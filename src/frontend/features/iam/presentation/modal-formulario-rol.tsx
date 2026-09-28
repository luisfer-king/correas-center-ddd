import { useState, type FormEvent } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { RolIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

export function ModalFormularioRol({ rol, cerrar, guardado }: {
    rol?: RolIam; cerrar: () => void; guardado: (rol: RolIam) => void
}) {
    const [nombre, setNombre] = useState(rol?.nombre ?? '')
    const [slug, setSlug] = useState('')
    const [descripcion, setDescripcion] = useState(rol?.descripcion ?? '')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')

    async function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (enviando) return
        setError('')
        setEnviando(true)
        try {
            const datos = { nombre: nombre.trim(), descripcion: descripcion.trim() || null }
            const resultado = rol ? await iamApi.editarRol(rol.id, datos)
                : await iamApi.crearRol({ ...datos, slug: slug.trim().toLowerCase() })
            guardado(resultado)
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 409
                ? 'El código ya existe o el rol cambió. Actualiza el listado antes de volver a intentar.'
                : fallo instanceof ErrorApi && fallo.estado === 403 ? 'No tienes permiso para guardar este rol.'
                    : 'No se pudo guardar el rol. Verifica los datos e inténtalo de nuevo.')
        } finally { setEnviando(false) }
    }

    return <ModalPortal titulo={rol ? `Editar: ${rol.nombre}` : 'Crear rol'} cerrar={cerrar} bloqueado={enviando}>
        <form onSubmit={(e) => void enviar(e)} className="space-y-5">
            <label className="block text-sm font-medium">Nombre
                <input required maxLength={120} value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2" />
            </label>
            {rol ? <p className="text-sm text-neutral-600">Código: <span className="font-mono">{rol.slug}</span> (no editable)</p> :
                <label className="block text-sm font-medium">Código
                    <input required maxLength={120} pattern="[a-z0-9]+([_-][a-z0-9]+)*" title="Usa letras minúsculas, números, guiones y guiones bajos"
                        value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} placeholder="ventas-industriales"
                        className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2 font-mono" />
                </label>}
            <label className="block text-sm font-medium">Descripción
                <textarea rows={4} maxLength={2000} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-neutral-300 px-3 py-2" />
            </label>
            {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div className="flex justify-end gap-3">
                <button type="button" onClick={cerrar} disabled={enviando} className="rounded-md border border-neutral-300 px-4 py-2">Cancelar</button>
                <button type="submit" disabled={enviando} className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
                    {enviando ? 'Guardando…' : 'Guardar rol'}
                </button>
            </div>
        </form>
    </ModalPortal>
}