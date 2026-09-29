import { useEffect, useId, useRef, useState } from 'react';
import { solicitarApi } from '../../../shared/api/cliente-http';

export function SelectorLogoEmpresa({ valor, actualizar, bloqueado, actividad }: {
    valor: string; actualizar: (url: string) => void; bloqueado: boolean; actividad: (ocupado: boolean) => void
}) {
    const id = useId()
    const [previa, setPrevia] = useState('')
    const [error, setError] = useState('')
    const [subiendo, setSubiendo] = useState(false)
    const vigente = useRef(true)
    useEffect(() => { vigente.current = true; return () => { vigente.current = false } }, [])
    useEffect(() => () => { if (previa) URL.revokeObjectURL(previa) }, [previa])
    async function seleccionar(archivo?: File) {
        if (!archivo || subiendo || bloqueado) return
        setError('')
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type) || archivo.size > 2 * 1024 * 1024 || !archivo.size) {
            setError('Selecciona una imagen PNG, JPG o WebP de hasta 2 MB.'); return
        }
        setPrevia(URL.createObjectURL(archivo))
        setSubiendo(true); actividad(true)
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const lector = new FileReader()
                lector.onerror = () => reject(new Error('No se pudo leer la imagen.'))
                lector.onload = () => resolve(String(lector.result).split(',')[1])
                lector.readAsDataURL(archivo)
            })
            const resultado = await solicitarApi<{ url: string }>('/api/portal/crm/empresas/logo', {
                metodo: 'POST', cuerpo: { base64 },
            })
            if (vigente.current) { actualizar(new URL(resultado.url, window.location.origin).href); setPrevia('') }
        } catch (fallo) {
            if (vigente.current) { setPrevia(''); setError(fallo instanceof Error ? fallo.message : 'No se pudo subir la imagen.') }
        } finally {
            if (vigente.current) { setSubiendo(false); actividad(false) }
        }
    }
    return <div className="sm:col-span-2 grid gap-2">
        <label htmlFor={id} className="text-sm font-medium">Logo de la empresa</label>
        <input id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={bloqueado || subiendo}
            onChange={(e) => { void seleccionar(e.target.files?.[0]); e.target.value = '' }} />
        {(previa || valor) && <img key={previa || valor} src={previa || valor} alt="Vista previa del logo de la empresa"
            className="h-40 w-full rounded border bg-white p-3 object-contain" />}
        <label className="text-sm">URL del logo
            <input value={valor} readOnly className="mt-1 w-full rounded border bg-neutral-100 p-2" />
        </label>
        <small>PNG, JPG o WebP. Máximo 2 MB.</small>
        {subiendo && <p role="status">Subiendo imagen…</p>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
    </div>
}
