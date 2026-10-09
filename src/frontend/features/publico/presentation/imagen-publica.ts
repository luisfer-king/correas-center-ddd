import { rutaPublica } from '../../../../shared/vista-publica'
export function imagenPublica(valor: string | null) {
 if (!valor) return undefined
 if (/^data:image\/(png|jpeg|webp);base64,/.test(valor)) return valor
 if (rutaPublica(valor)) return valor
 try { const url = new URL(valor); if (url.protocol === 'https:' || url.protocol === 'http:') return valor } catch { /* clave storage antigua */ }
 return undefined
}
