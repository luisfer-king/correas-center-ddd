import { urlImagen } from '../../../shared/imagenes/url-imagen'
export function imagenPublica(valor: string | null) {
  return urlImagen(valor) || undefined
}
