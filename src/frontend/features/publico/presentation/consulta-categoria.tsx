import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import type { ConfiguracionPublica } from '../../../../shared/publico/cms'
import { enlaceWhatsApp } from './datos-marco-publico'
export function mensajeCategoria(producto:string,categoria:string) {
 const p=producto.trim(),c=categoria.trim(),normal=p.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 const femeninos=['correas','cadenas','bandas','mangueras','poleas','cajas','abrazaderas','graseras']
 const masculinoPlural=['rodamientos','retenes','niples','pinones','cilindros','cangilones','cardanes','conectores','sellos']
 const articulo=femeninos.some(n=>normal.startsWith(n))?'las':masculinoPlural.some(n=>normal.startsWith(n))?'los':normal.endsWith('a')?'la':'el'
 const nombre=c.toLocaleLowerCase().startsWith(p.toLocaleLowerCase())?c:p+' '+c
 return 'Buenas, me interesa conocer más información sobre '+articulo+' '+nombre
}
export function ConsultaCategoria({producto,categoria,configuracion}:{producto:string;categoria:string;configuracion:ConfiguracionPublica['whatsapp']}) {
 const url=enlaceWhatsApp({...configuracion,mensaje:mensajeCategoria(producto,categoria)})
 return url?<a className="catalogo-consultar-categoria" href={url} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp}/>Consultar información</a>:<Link className="catalogo-consultar-categoria" to="/contact">Consultar información</Link>
}
