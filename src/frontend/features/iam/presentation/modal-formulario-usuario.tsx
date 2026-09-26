import { useState, type FormEvent } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { UsuarioIam } from '../api/tipos-iam'
import { ModalPortal } from './modal-portal'

export function ModalFormularioUsuario({ usuario, cerrar, guardado }: {
    usuario?: UsuarioIam; cerrar: () => void; guardado: (usuario: UsuarioIam) => void
}) {
    const [nombreCompleto, setNombre] = useState(usuario?.nombreCompleto ?? '')
    const [email, setEmail] = useState(usuario?.email ?? '')
    const [telefono, setTelefono] = useState(usuario?.telefono ?? '')
    const [password, setPassword] = useState('')
    const [ocupado, setOcupado] = useState(false)
    const [error, setError] = useState('')

    async function guardar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        if (ocupado) return
        setOcupado(true)
        setError('')
        try {
            const datos = { nombreCompleto: nombreCompleto.trim(), email: email.trim(), telefono: telefono.trim() || null }
            const resultado = usuario ? await iamApi.editarUsuario(usuario.id, datos)
                : await iamApi.crearUsuario({ ...datos, password })
            guardado(resultado)
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 409
                ? 'El correo ya está registrado o el usuario cambió. Actualiza el listado e inténtalo otra vez.'
                : fallo instanceof ErrorApi && fallo.estado === 403 ? 'No tienes permiso para guardar usuarios.'
                    : 'No se pudo guardar el usuario. Comprueba los campos y vuelve a intentarlo.')
        } finally { setOcupado(false) }
    }

    return <ModalPortal titulo={usuario ? `Editar: ${usuario.nombreCompleto}` : 'Crear usuario'} cerrar={cerrar} bloqueado={ocupado}>
        <form onSubmit={(e) => void guardar(e)} className="space-y-4">
            <label className="block text-sm font-medium">Nombre completo
                <input required maxLength={160} autoComplete="name" value={nombreCompleto} onChange={(e) => setNombre(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
            </label>
            <label className="block text-sm font-medium">Correo de acceso
                <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
            </label>
            <label className="block text-sm font-medium">Teléfono (opcional)
                <input maxLength={40} type="tel" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
            </label>
            {!usuario && <label className="block text-sm font-medium">Contraseña inicial (mínimo 12 caracteres)
                <input required type="password" minLength={12} maxLength={256} autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
            </label>}
            {!usuario && <p className="text-sm text-neutral-600">El correo se considera validado por quien crea la cuenta. Asigna los roles después de guardarla.</p>}
            {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div className="flex justify-end gap-3">
                <button type="button" disabled={ocupado} onClick={cerrar} className="rounded-md border border-neutral-300 px-4 py-2">Cancelar</button>
                <button type="submit" disabled={ocupado} className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
                    {ocupado ? 'Guardando…' : 'Guardar usuario'}
                </button>
            </div>
        </form>
    </ModalPortal>
}
