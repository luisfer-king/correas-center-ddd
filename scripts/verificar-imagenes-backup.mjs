/** Comprueba URLs del respaldo contra los archivos y rutas HTTP reales, sin conectar a PostgreSQL. */
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import Fastify from 'fastify'
import {urlImagen} from '../src/frontend/shared/imagenes/url-imagen.ts'
import {registrarRutasImagenes} from '../src/backend/shared/imagenes/registrar-rutas-imagenes.ts'
import {rutasLogoEmpresa} from '../src/backend/contexts/commercial/presentation/rutas-logo-empresa.ts'
const archivo=process.argv[2]
if(!archivo)throw new Error('Uso: node --import tsx scripts/verificar-imagenes-backup.mjs respaldo.sql')
const texto=await readFile(archivo,'utf8')
const urls=[...new Set(texto.match(/https?:\/\/[^\s\\]+/g)||[])].filter(u=>u.includes('/api/public/'))
const app=Fastify()
for(const contexto of ['catalogo','cms'])registrarRutasImagenes(app,{
 rutaCarga:`/api/portal/${contexto}/imagenes`,rutaPublica:`/api/public/${contexto}/imagenes`,
 directorio:resolve(contexto==='catalogo'?(process.env.CATALOGO_IMAGENES_DIR||'storage/catalogo'):(process.env.CMS_IMAGENES_DIR||'storage/cms')),
 recursos:contexto==='catalogo'?['productos','categorias','marcas','industrias','servicios']:['contenidos-seccion'],
 origen:async()=>{},autorizar:async()=>false,
})
rutasLogoEmpresa(app,{}, {}, {})
try{
 assert.ok(urls.length,'El respaldo no contiene URLs de imágenes propias')
 for(const url of urls){
  const ruta=urlImagen(url);assert.ok(ruta.startsWith('/api/public/'))
  const respuesta=await app.inject({method:'GET',url:ruta})
  assert.equal(respuesta.statusCode,200,`No se pudo leer ${ruta}`)
  assert.match(respuesta.headers['content-type'],/^image\//)
  assert.ok(respuesta.rawPayload.length>8)
 }
 console.log(`OK: ${urls.length} imágenes referenciadas responden HTTP 200 con contenido de imagen.`)
}finally{await app.close()}
