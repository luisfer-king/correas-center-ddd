import type { RolIam } from '../api/tipos-iam';
import { EstadoRolEtiqueta, fechaRol } from './datos-rol';
import { ModalPortal } from './modal-portal';

export function ModalDetalleRol({ rol, cerrar }: { rol: RolIam; cerrar: () => void }) {
    return <ModalPortal titulo={`Detalle: ${rol.nombre}`} cerrar={cerrar}>
        <dl className="grid gap-5 sm:grid-cols-2">
            <div><dt className="text-sm text-neutral-600">Identificación</dt><dd className="mt-1 font-mono">{rol.id}</dd></div>
            <div><dt className="text-sm text-neutral-600">Código</dt><dd className="mt-1 font-mono">{rol.slug}</dd></div>
            <div><dt className="text-sm text-neutral-600">Estado</dt><dd className="mt-1"><EstadoRolEtiqueta estado={rol.estado} /></dd></div>
            <div><dt className="text-sm text-neutral-600">Tipo</dt><dd className="mt-1">{rol.esSistema ? 'Sistema' : 'Personalizado'}</dd></div>
            <div className="sm:col-span-2"><dt className="text-sm text-neutral-600">Descripción</dt><dd className="mt-1 whitespace-pre-wrap">{rol.descripcion || 'Sin descripción'}</dd></div>
            <div><dt className="text-sm text-neutral-600">Creado</dt><dd className="mt-1">{fechaRol(rol.creadoEn)}</dd></div>
            <div><dt className="text-sm text-neutral-600">Actualizado</dt><dd className="mt-1">{fechaRol(rol.actualizadoEn)}</dd></div>
        </dl>
    </ModalPortal>
}