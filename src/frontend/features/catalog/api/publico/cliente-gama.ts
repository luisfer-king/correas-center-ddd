import { solicitarApi, ErrorApi } from '../../../../shared/api/cliente-http'
import type { GamaPublica } from '../../../../../shared/publico/gamas'
export async function consultarGamaPublica(categoriaId:string,signal?:AbortSignal):Promise<GamaPublica|null> {
 try{return await solicitarApi('/api/publico/catalogo/categorias/'+encodeURIComponent(categoriaId)+'/gama',{signal})}
 catch(e){if(e instanceof ErrorApi&&e.estado===404)return null;throw e}
}
