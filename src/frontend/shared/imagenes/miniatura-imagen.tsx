import { useState } from 'react';
export function MiniaturaImagen({ url, nombre = 'Imagen', grande = false }: { url: unknown; nombre?: string; grande?: boolean }) {
    const [fallo, setFallo] = useState<string | null>(null)
    const valor = typeof url === 'string' ? url.trim() : ''
    if (!valor || !/^(https?:\/\/|\/(?!\/))/.test(valor)) return <span className="text-sm text-neutral-500">Sin imagen</span>
    if (fallo === valor) return <span className="text-sm text-neutral-500">Imagen no disponible</span>
    return <a href={valor} target="_blank" rel="noopener noreferrer" title="Abrir imagen">
        <img src={valor} alt={nombre} loading="lazy" onError={() => setFallo(valor)}
            className={grande ? 'h-36 w-36 rounded border bg-white object-contain' : 'h-14 w-14 rounded border bg-white object-contain'} />
    </a>
}
