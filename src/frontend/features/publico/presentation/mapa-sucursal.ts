// Las cadenas iframe de la BD se leen como datos; nunca se insertan como HTML.
export function mapaSucursal(valor:string|null):string|null {
 if(!valor)return null
 const fuente=valor.trim().startsWith('<')?valor.match(/src\s*=\s*["']([^"']+)["']/i)?.[1]:valor.trim()
 if(!fuente)return null
 try{const u=new URL(fuente.replace(/&amp;/g,'&'));if(u.protocol!=='https:'||u.username||u.password)return null
  return (['www.google.com','google.com','maps.google.com'].includes(u.hostname)&&u.pathname.startsWith('/maps/embed'))||(['www.openstreetmap.org','openstreetmap.org'].includes(u.hostname)&&u.pathname==='/export/embed.html')?u.href:null
 }catch{return null}
}
