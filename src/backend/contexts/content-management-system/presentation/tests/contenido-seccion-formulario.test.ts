import assert from 'node:assert/strict'
import { test } from 'node:test'
import sharp from 'sharp'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { servidorCms, escritura } from './soporte-http-cms.js'
const base = '/api/portal/cms/contenidos-seccion'
test('secciones HTTP: creación sin orden ni campos opcionales persiste null y orden 1', async () => {
  const {app,env} = await servidorCms('contenidoSeccion')
  try {
    const r = await app.inject({ method: 'POST', url: base, headers: escritura, payload: { empresaId: '1', tipoSeccionId: '1', campos: { titulo: 'Hero', icono: null }, metadata: { cta: 'Cotizar' }, mostrar: true } })
    assert.equal(r.statusCode,201,r.body)
    assert.equal(r.json().orden,1)
    assert.equal(r.json().campos.subtitulo,null); assert.equal(r.json().campos.descripcion,null); assert.equal(r.json().campos.imagen,null)
    assert.deepEqual(env.tablas.contenidoSeccion.at(-1)!.metadata,{ cta: 'Cotizar' })
  } finally { await app.close() }
})
test('secciones HTTP: edición de opcionales vacíos guarda null y conserva orden', async () => {
  const {app} = await servidorCms('contenidoSeccion')
  try {
    const version = (await app.inject({method:'GET',url:base+'/2',headers:escritura})).json().actualizadoEn
    const r = await app.inject({ method:'PATCH',url:base+'/2',headers:escritura,payload:{ version,campos:{titulo:'Hero',subtitulo:' ',descripcion:'',imagen:'',icono:null},metadata:{cta:'Nueva asesoría'} } })
    assert.equal(r.statusCode,200,r.body); assert.equal(r.json().campos.subtitulo,null); assert.equal(r.json().campos.descripcion,null); assert.equal(r.json().campos.imagen,null); assert.equal(r.json().orden,0)
  } finally { await app.close() }
})
test('imágenes CMS: origen y permiso requeridos; subida válida y lectura pública', async () => {
  const dir = await mkdtemp(join(tmpdir(),'cms-imagenes-')); const previo = process.env.CMS_IMAGENES_DIR; process.env.CMS_IMAGENES_DIR = dir
  const {app,env} = await servidorCms()
  try {
    const url = '/api/portal/cms/imagenes/contenidos-seccion'
    assert.equal((await app.inject({method:'POST',url,headers:{origin:escritura.origin,'x-portal-request':'1'},payload:{base64:'AAAA'}})).statusCode,401)
    assert.equal((await app.inject({method:'POST',url,headers:{cookie:escritura.cookie},payload:{base64:'AAAA'}})).statusCode,403)
    env.opciones.permiso = false
    assert.equal((await app.inject({method:'POST',url,headers:escritura,payload:{base64:'AAAA'}})).statusCode,403)
    env.opciones.permiso = true
    const png = await sharp({create:{width:2,height:2,channels:4,background:{r:255,g:0,b:0,alpha:0.5}}}).png().toBuffer()
    const r = await app.inject({method:'POST',url,headers:escritura,payload:{base64:png.toString('base64')}})
    assert.equal(r.statusCode,201,r.body)
    const lectura = await app.inject({method:'GET',url:r.json().url})
    assert.equal(lectura.statusCode,200); assert.match(lectura.headers['content-type']!,/image\/png/)
    assert.equal((await app.inject({method:'POST',url,headers:escritura,payload:{base64:'AAAA'}})).statusCode,400)
  } finally { await app.close(); await rm(dir,{recursive:true,force:true}); if(previo === undefined) delete process.env.CMS_IMAGENES_DIR; else process.env.CMS_IMAGENES_DIR = previo }
})
