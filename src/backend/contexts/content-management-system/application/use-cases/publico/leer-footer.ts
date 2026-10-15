import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { ConsultaPublica } from '../../ports/consulta-publica-footer.js'
import type { ResolverDestinosPublicos } from '../../ports/resolver-destinos-publicos.js'
import type { FooterPublicado } from '../../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerFooter extends LeerPublico<PaginaPublica<FooterPublicado>, ConsultaPaginaPublica> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica, resolver: ResolverDestinosPublicos) {
  super(empresas, async (id, p) => {
   const pagina = await consulta.obtener(id, p)
   const refs = pagina.items.flatMap(f => f.tipoRegistro && f.registroId ? [{ tipo: f.tipoRegistro, id: f.registroId }] : [])
   const destinos = new Map((await resolver.resolver(id, refs)).map(d => [d.tipo + ':' + d.id, d]))
   return { ...pagina, items: pagina.items.flatMap(f => {
    if (f.tipoRegistro && f.registroId) {
     const destino = destinos.get(f.tipoRegistro + ':' + f.registroId)
     if (!destino) return []
     return [{ ...f, titulo: f.titulo || destino.nombre, url: f.url || (destino.tipo === 'industria' ? '/applications/' + encodeURIComponent(destino.slug) : destino.tipo === 'servicio' ? '/services/' + encodeURIComponent(destino.slug) : null) }]
    }
    return [f]
   }) }
  })
 }
}
