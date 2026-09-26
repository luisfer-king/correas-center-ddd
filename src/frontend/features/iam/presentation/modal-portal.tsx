import { useEffect, useId, useRef, type ReactNode } from 'react';

export function ModalPortal({ titulo, children, cerrar, bloqueado = false }: {
    titulo: string; children: ReactNode; cerrar: () => void; bloqueado?: boolean
}) {
    const dialogo = useRef<HTMLDialogElement>(null)
    const tituloId = useId()
    useEffect(() => {
        const nodo = dialogo.current
        if (!nodo) return
        nodo.showModal()
        return () => { if (nodo.open) nodo.close() }
    }, [])
    return <dialog ref={dialogo} aria-labelledby={tituloId}
        onCancel={(e) => {
            e.preventDefault()
            if (!bloqueado) cerrar()
        }}
        onClick={(e) => {
            if (e.target !== dialogo.current || bloqueado) return
            const caja = dialogo.current.getBoundingClientRect()
            if (e.clientX < caja.left || e.clientX > caja.right ||
                e.clientY < caja.top || e.clientY > caja.bottom) cerrar()
        }}
        className="m-auto w-[min(94vw,720px)] max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-300 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4">
            <h2 id={tituloId} className="text-xl font-semibold">{titulo}</h2>
            <button type="button" onClick={cerrar} disabled={bloqueado} aria-label="Cerrar ventana"
                className="rounded px-3 py-2 font-semibold hover:bg-neutral-100 disabled:opacity-50">✕</button>
        </div>
        <div className="px-6 py-6">{children}</div>
    </dialog>
}
