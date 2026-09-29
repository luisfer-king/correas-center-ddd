import { useEffect, useState, type FormEvent } from 'react'
import { iamApi } from '../../iam/api/cliente-iam'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { cargarPaginasCrm } from '../api/cargar-paginas-crm'
import { contactosApi } from '../api/contactos'
import { empresasApi } from '../api/empresas'
import { leadsApi } from '../api/leads'
import type { ContactoCrm, LeadCrm } from '../api/tipos-crm'
import { SelectorRegistroCrm, type OpcionRegistroCrm } from './selector-registro-crm'

type Catalogo = { opciones: OpcionRegistroCrm[]; cargando: boolean; error: string }
const inicial: Catalogo = { opciones: [], cargando: true, error: '' }
export function FormularioLead({ registro, cerrar, guardado }: {
    registro: LeadCrm | null; cerrar: () => void; guardado: () => void
}) {
    const [empresaId, setEmpresaId] = useState(registro?.empresaId ?? '')
    const [contactoId, setContactoId] = useState(registro?.contactoId ?? '')
    const [responsableId, setResponsableId] = useState(registro?.responsableId ?? '')
    const [empresas, setEmpresas] = useState<Catalogo>(inicial)
    const [responsables, setResponsables] = useState<Catalogo>(inicial)
    const [contactos, setContactos] = useState<ContactoCrm[]>([])
    const [cargandoContactos, setCargandoContactos] = useState(true)
    const [errorContactos, setErrorContactos] = useState('')
    const [ocupado, setOcupado] = useState(false)
    const [error, setError] = useState('')
    useEffect(() => {
        const control = new AbortController(), signal = control.signal
        void cargarPaginasCrm(empresasApi.listar, signal).then((filas) => {
            if (!signal.aborted) setEmpresas({
                opciones: filas.filter((e) => !e.eliminadoEn && (e.estado === 'activo' || e.id === registro?.empresaId))
                    .map((e) => ({ id: e.id, etiqueta: e.nombre })), cargando: false, error: ''
            })
        }).catch(() => { if (!signal.aborted) setEmpresas({ opciones: [], cargando: false, error: 'No se pudieron cargar las empresas. Revisa el permiso de lectura de Empresas.' }) })
        void cargarPaginasCrm(contactosApi.listar, signal).then((filas) => {
            if (!signal.aborted) { setContactos(filas.filter((c) => !c.eliminadoEn)); setCargandoContactos(false) }
        }).catch(() => { if (!signal.aborted) { setCargandoContactos(false); setErrorContactos('No se pudieron cargar los contactos. Revisa el permiso de lectura de Contactos.') } })
        void iamApi.listarUsuarios({ signal }).then((filas) => {
            if (!signal.aborted) setResponsables({
                opciones: filas.filter((u) => u.estado === 'activo' && !u.eliminadoEn)
                    .map((u) => ({ id: u.id, etiqueta: [u.nombreCompleto, u.email].filter(Boolean).join(' · ') })), cargando: false, error: ''
            })
        }).catch(() => {
            if (!signal.aborted) setResponsables({
                opciones: [], cargando: false,
                error: 'No se pudieron cargar los responsables. Revisa el permiso de lectura de Usuarios en IAM.'
            })
        })
        return () => control.abort()
    }, [registro])
    async function enviar(e: FormEvent) {
        e.preventDefault()
        if (ocupado) return
        setError('')
        if (!registro && !empresas.opciones.some((e) => e.id === empresaId)) { setError('Selecciona una empresa disponible.'); return }
        if (!registro && contactoId && !contactos.some((c) => c.id === contactoId && c.empresaId === empresaId)) {
            setError('Selecciona un contacto de la empresa elegida.'); return
        }
        if (responsableId && responsableId !== registro?.responsableId && !responsables.opciones.some((r) => r.id === responsableId)) {
            setError('Selecciona un responsable disponible.'); return
        }
        setOcupado(true)
        try {
            if (registro) await leadsApi.asignarResponsable(registro.id, responsableId || null)
            else await leadsApi.crear({ empresaId, contactoId: contactoId || null, responsableId: responsableId || null })
            guardado()
        } catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo guardar el lead.') }
        finally { setOcupado(false) }
    }
    return <ModalPortal titulo={registro ? 'Asignar responsable del lead' : 'Crear lead'} cerrar={cerrar} bloqueado={ocupado}>
        <form onSubmit={(e) => void enviar(e)} className="grid gap-4">
            <SelectorRegistroCrm etiqueta="Empresa" valor={empresaId} cambiar={(id) => { setEmpresaId(id); setContactoId('') }}
                opciones={empresas.opciones} obligatorio bloqueado={ocupado || !!registro} cargando={empresas.cargando}
                error={empresas.error} vacio="Selecciona una empresa" />
            <SelectorRegistroCrm etiqueta="Contacto" valor={contactoId} cambiar={setContactoId}
                opciones={contactos.filter((c) => c.empresaId === empresaId).map((c) => ({ id: c.id, etiqueta: `${c.nombre} · ${c.email}` }))}
                bloqueado={ocupado || !!registro || !empresaId} cargando={cargandoContactos} error={errorContactos} />
            <SelectorRegistroCrm etiqueta="Responsable" valor={responsableId} cambiar={setResponsableId}
                opciones={responsables.opciones} bloqueado={ocupado} cargando={responsables.cargando} error={responsables.error} />
            {registro && <small>La empresa y el contacto se conservan. Puedes cambiar o retirar al responsable.</small>}
            {error && <p role="alert" className="text-red-700">{error}</p>}
            <div className="flex justify-end gap-3">
                <button type="button" disabled={ocupado} onClick={cerrar} className="rounded border px-4 py-2">Cancelar</button>
                <button type="submit" disabled={ocupado || responsables.cargando || (!registro && (empresas.cargando || !!empresas.error || !empresaId || cargandoContactos))}
                    className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{ocupado ? 'Guardando…' : 'Guardar'}</button>
            </div>
        </form>
    </ModalPortal>
}
