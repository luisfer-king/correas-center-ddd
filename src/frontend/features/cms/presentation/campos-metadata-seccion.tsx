import { useId } from 'react'
import { etiquetaMetadataSeccion } from './datos-formulario-seccion'
export function CamposMetadataSeccion({ nombre, claves, valores, cambiar }: {
  nombre: string; claves: readonly string[]; valores: Record<string,unknown>; cambiar: (valores: Record<string,unknown>) => void
}) {
  const id = useId()
  return <fieldset className="cms-section-metadata"><legend>Campos específicos ({nombre})</legend>{claves.length ? claves.map(k => {
    const valor = valores[k], complejo = valor !== null && typeof valor === 'object'
    return <label key={k} htmlFor={`${id}-${k}`}>{etiquetaMetadataSeccion(k)}{complejo ? <><pre>{JSON.stringify(valor,null,2)}</pre><small>Valor JSON existente conservado.</small><button type="button" onClick={() => cambiar({ ...valores, [k]: '' })}>Reemplazar por texto</button></> : <input id={`${id}-${k}`} value={String(valor ?? '')} onChange={e => cambiar({ ...valores, [k]: e.target.value })} />}<small>Campo: {k}</small></label>
  }) : <p>Este tipo no tiene campos de metadata.</p>}</fieldset>
}
