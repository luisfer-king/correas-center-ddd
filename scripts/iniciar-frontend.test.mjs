import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { esperarApi } from './iniciar-frontend.mjs'
async function servidor(t, handler) {
 const s=createServer(handler)
 await new Promise(resolve=>s.listen(0,'127.0.0.1',resolve))
 t.after(()=>new Promise(resolve=>s.close(resolve)))
 return `http://127.0.0.1:${s.address().port}/api/health`
}
test('arranque: espera respuestas no disponibles hasta salud ok',async t=>{
 let n=0
 const url=await servidor(t,(_q,r)=>{n++;r.writeHead(n<3?503:200,{'Content-Type':'application/json'});r.end(JSON.stringify(n<3?{status:'arrancando'}:{status:'ok'}))})
 await esperarApi(url,{timeoutMs:2000,intervaloMs:10})
 assert.equal(n,3)
})
test('arranque: una respuesta 200 ajena a salud no inicia Vite',async t=>{
 const url=await servidor(t,(_q,r)=>{r.end('{"status":"otro"}')})
 await assert.rejects(esperarApi(url,{timeoutMs:80,intervaloMs:10}),/La API no respondió/)
})
test('arranque: falla con diagnóstico cuando la API nunca responde',async t=>{
 const url=await servidor(t,(_q,r)=>{r.writeHead(503);r.end()})
 await assert.rejects(esperarApi(url,{timeoutMs:80,intervaloMs:10}),/Inicia el backend/)
})
