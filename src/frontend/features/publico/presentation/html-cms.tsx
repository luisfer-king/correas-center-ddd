import createDOMPurify from 'dompurify'
import { useMemo } from 'react'
let purificador:ReturnType<typeof createDOMPurify>|null=null
let ventana:Window|null=null
export function sanearHtmlCms(html:string):string {
 if(typeof window==='undefined'||!window.document)return ''
 if(ventana!==window||!purificador){purificador=createDOMPurify(window);ventana=window}
 return purificador.sanitize(html,{ALLOWED_TAGS:['p','br','strong','b','em','i','u','ul','ol','li','h2','h3','h4','blockquote','span'],ALLOWED_ATTR:['class'],ALLOW_DATA_ATTR:false})
}
export function HtmlCms({html}:{html:string|null}) {
 const limpio=useMemo(()=>sanearHtmlCms(html||''),[html])
 return html?<div className="publico-html" dangerouslySetInnerHTML={{__html:limpio}} />:null
}
