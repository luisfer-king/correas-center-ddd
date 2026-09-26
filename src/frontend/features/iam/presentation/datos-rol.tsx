import type { EstadoRol } from '../api/tipos-iam'

const clases: Record<EstadoRol, string> = {
    activo: 'bg-green-50 text-green-800',
    inactivo: 'bg-amber-50 text-amber-800',
    eliminado: 'bg-neutral-200 text-neutral-700',
}

export function EstadoRolEtiqueta({ estado }: { estado: EstadoRol }) {
    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${clases[estado]}`}>{estado}</span>
}

export function fechaRol(valor: string | null) {
    if (!valor) return '—'
    const fecha = new Date(valor)
    return Number.isNaN(fecha.getTime()) ? '—' : new Intl.DateTimeFormat('es-BO', {
        dateStyle: 'medium', timeStyle: 'short',
    }).format(fecha)
}