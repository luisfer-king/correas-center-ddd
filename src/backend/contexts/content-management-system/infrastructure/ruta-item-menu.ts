import { construirRutaSubenlace } from '../../../../shared/ruta-subenlace.js'
import { slugNombre } from '../../../../shared/slug-nombre.js'
import { RutaInterna } from '../domain/cms-values.js'
import type { TxCms } from './operaciones-cms.js'
export async function rutaCategoriaMenu(tx: TxCms, menuId: bigint, categoriaId: bigint): Promise<RutaInterna> {
  const menu=await tx.menu.findUnique({where:{id:menuId}})
  if(!menu || menu.eliminadoEn !== null) throw new Error('Menú no disponible')
  const categoria=await tx.categoria.findUnique({where:{id:categoriaId}})
  if(!categoria || categoria.eliminadoEn !== null || categoria.estado !== 'activo') throw new Error('Categoría no disponible')
  const producto=await tx.producto.findUnique({where:{id:categoria.productoId}})
  if(!producto || producto.eliminadoEn !== null || producto.estado !== 'activo' || producto.empresaId !== menu.empresaId) throw new Error('Categoría de otra empresa o no disponible')
  let slug: string, prefijo: string
  if(menu.tipoRegistro === 'producto') {
    if(categoria.productoId !== menu.registroId) throw new Error('Categoría no corresponde al producto del menú')
    slug=producto.slug;prefijo='/products/'
  } else if(menu.tipoRegistro === 'industria') {
    const industria=await tx.industria.findUnique({where:{id:menu.registroId}})
    if(!industria || industria.empresaId !== menu.empresaId || industria.estado !== 'activo' || industria.eliminadoEn !== null) throw new Error('Industria no disponible')
    slug=industria.slug;prefijo='/applications/'
  } else if(menu.tipoRegistro === 'servicio') {
    const servicio=await tx.servicio.findUnique({where:{id:menu.registroId}})
    if(!servicio || servicio.empresaId !== menu.empresaId || servicio.estado !== 'activo' || servicio.eliminadoEn !== null) throw new Error('Servicio no disponible')
    slug=slugNombre(servicio.nombre);prefijo='/services/'
  } else throw new Error('Tipo de registro del menú inválido')
  if(!slug || !categoria.slug) throw new Error('Slug de destino inválido')
  return RutaInterna.create(construirRutaSubenlace(prefijo+slug+'/',categoria.slug))
}
