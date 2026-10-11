import { solicitarApi,ErrorApi } from '../../../shared/api/cliente-http'
import { idCatalogo,paginaCatalogo } from './cliente-catalogo'
import type { Gama,CabeceraGama,PlantillaGama,EscrituraGama,RecursoGama,EstadoGama,CopiaGama,CambioCelda } from './tipos-gamas'
const base='/api/portal/catalogo',gamas=base+'/gamas'
const ruta=(id:string)=>`${gamas}/${idCatalogo(id)}`
const escribir=(url:string,metodo:'POST'|'PATCH'|'PUT',cuerpo:unknown)=>solicitarApi<EscrituraGama>(url,{metodo,cuerpo})
export const gamasApi={
 async porCategoria(id:string,signal?:AbortSignal):Promise<Gama|null> {try{return await solicitarApi<Gama>(`${base}/categorias/${idCatalogo(id)}/gama`,{signal})}catch(e){if(e instanceof ErrorApi && e.estado===404)return null;throw e}},
 obtener:(id:string,signal?:AbortSignal)=>solicitarApi<Gama>(ruta(id),{signal}),
 listar:(productoId:string,pagina=1,signal?:AbortSignal)=>solicitarApi<CabeceraGama[]>(`${gamas}?productoId=${idCatalogo(productoId)}&pagina=${paginaCatalogo(pagina)}`,{signal}),
 crear:(categoriaId:string,datos:{titulo:string;descripcion:string|null;imagen:string|null})=>escribir(gamas,'POST',{categoriaId,...datos}),
 editar:(id:string,version:string,datos:{titulo:string;descripcion:string|null;imagen:string|null})=>escribir(ruta(id),'PATCH',{version,...datos}),
 estado:(id:string,version:string,accion:EstadoGama)=>escribir(`${ruta(id)}/${accion}`,'PATCH',{version}),
 crearElemento:(id:string,version:string,recurso:RecursoGama,datos:Record<string,unknown>)=>escribir(`${ruta(id)}/${recurso}`,'POST',{...datos,version}),
 editarElemento:(id:string,version:string,recurso:RecursoGama,elementoId:string,datos:Record<string,unknown>)=>escribir(`${ruta(id)}/${recurso}/${idCatalogo(elementoId)}`,'PATCH',{...datos,version}),
 estadoElemento:(id:string,version:string,recurso:RecursoGama,elementoId:string,accion:EstadoGama)=>escribir(`${ruta(id)}/${recurso}/${idCatalogo(elementoId)}/${accion}`,'PATCH',{version}),
 mover:(id:string,version:string,recurso:RecursoGama,elementoId:string,posicion:number)=>escribir(`${ruta(id)}/${recurso}/${idCatalogo(elementoId)}/orden`,'PATCH',{version,posicion}),
 valores:(id:string,version:string,cambios:CambioCelda[])=>escribir(`${ruta(id)}/valores`,'PUT',{version,cambios}),
 plantilla:(productoId:string,signal?:AbortSignal)=>solicitarApi<{plantilla:PlantillaGama|null}>(`${base}/productos/${idCatalogo(productoId)}/plantilla-gama`,{signal}).then(r=>r.plantilla),
 seleccionar:(productoId:string,gamaId:string,version:string|null)=>solicitarApi<PlantillaGama>(`${base}/productos/${idCatalogo(productoId)}/plantilla-gama`,{metodo:'PUT',cuerpo:{gamaId,version}}),
 quitar:(productoId:string,version:string)=>solicitarApi<{ok:boolean}>(`${base}/productos/${idCatalogo(productoId)}/plantilla-gama`,{metodo:'DELETE',cuerpo:{version}}),
 copiar:(datos:CopiaGama)=>escribir(`${gamas}/desde-plantilla`,'POST',datos),
 copiarDesde:(datos:CopiaGama,origen:CabeceraGama)=>escribir(`${gamas}/copiar`,'POST',{...datos,origenId:origen.id,versionOrigen:origen.version}),
}
