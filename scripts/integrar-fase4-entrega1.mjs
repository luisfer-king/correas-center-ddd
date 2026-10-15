import { readFile, writeFile, copyFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
export function integrarTextoPublicacion(texto) {
 const marca = '// Fase 4, entrega 1: consultas públicas por contexto, sin sesión IAM.'
 if (texto.includes(marca)) {
  if (!texto.includes("from './composition/componer-publicacion.js'") || !texto.includes('publico?: CasosPublicacion')) throw Error('Integración parcial detectada: revisar app.ts antes de continuar')
  return texto
 }
 if (texto.includes('componerPublicacion') || texto.includes('registrarPublicacion')) throw Error('Ya hay una composición pública diferente. No se modificó app.ts')
 if (!texto.includes('empresaPublicaDesdeEntorno') || !texto.includes('  return app;')) throw Error('No se reconoce la base pública de app.ts. No se modificó el archivo')
 const firma = /export async function createApp\(pruebas\?: \{[^\n]+\}\)/
 const actual = texto.match(firma)?.[0]
 if (!actual || !actual.includes('CasosIam') || !actual.includes('CasosGamas')) throw Error('No se reconoce la firma actual de createApp. No se modificó app.ts')
 const nueva = actual.replace(/ \}\)$/, '; publico?: CasosPublicacion; empresaPublicaId?: bigint })')
 if (nueva === actual) throw Error('Firma incompatible. No se modificó app.ts')
 return "import { componerPublicacion, registrarPublicacion, type CasosPublicacion } from './composition/componer-publicacion.js'\n" + texto.replace(actual, nueva).replace('  return app;',
  marca + "\n  if (db || pruebas?.publico) await app.register(async scope => registrarPublicacion(scope,\n    pruebas?.publico ?? componerPublicacion(db!), pruebas?.empresaPublicaId ?? empresaPublicaDesdeEntorno()));\n  return app;")
}
async function ejecutar() {
 const comprobar = process.argv.includes('--check')
 const ruta = resolve('src/backend/app.ts')
 const original = await readFile(ruta, 'utf8')
 const nuevo = integrarTextoPublicacion(original)
 if (nuevo === original) { console.log('La entrega 1 ya está integrada.'); return }
 if (comprobar) { console.log('app.ts compatible. Ejecuta el mismo comando sin --check para integrar.'); return }
 const respaldo = ruta + '.fase4-entrega1-' + Date.now() + '.bak'
 await copyFile(ruta, respaldo)
 const temporal = ruta + '.fase4-entrega1.tmp'
 await writeFile(temporal, nuevo)
 await rename(temporal, ruta)
 console.log('Entrega 1 integrada. Copia de respaldo: ' + respaldo)
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) ejecutar().catch(error => { console.error(error.message); process.exitCode = 1 })
