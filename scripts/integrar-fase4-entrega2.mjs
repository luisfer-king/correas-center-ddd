import { readFile, writeFile, copyFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
export function integrarRutasPublicas(texto) {
 const marca = '// Fase 4, entrega 2: marco público y rutas institucionales'
 if (texto.includes(marca)) return texto
 if (!texto.includes("from '../features/publico/presentation/entrada-publica'") || !texto.includes('<Route path="/portal"')) throw Error('No se reconoce la base de rutas. No se modificó el archivo.')
 const anterior = '<Route path="*" element={<Navigate to="/" replace />} />'
 if (!texto.includes(anterior)) throw Error('La ruta final tiene otra implementación. No se modificó el archivo.')
 let nuevo = texto.replace(anterior, '<Route path="*" element={<VistaPublica />} />')
 const paginas = ['branches','privacy','terms','search'].filter(p => !nuevo.includes('path="/' + p + '"')).map(p => `    <Route path="/${p}" element={<VistaPublica />} />`).join('\n')
 nuevo = nuevo.replace('    <Route path="/portal"', '    ' + marca + '\n' + paginas + '\n    <Route path="/portal"')
 if (!nuevo.includes('<Navigate')) nuevo = nuevo.replace('BrowserRouter, Navigate, Outlet', 'BrowserRouter, Outlet')
 return nuevo
}
async function ejecutar() {
 const ruta = resolve('src/frontend/app/rutas.tsx'), original = await readFile(ruta,'utf8'), nuevo = integrarRutasPublicas(original)
 if (original === nuevo) { console.log('La entrega 2 ya está integrada.');return }
 if (process.argv.includes('--check')) { console.log('Rutas compatibles. Ejecuta sin --check para integrar.');return }
 const respaldo = ruta + '.fase4-entrega2-' + Date.now() + '.bak'
 await copyFile(ruta,respaldo);await writeFile(ruta+'.fase4-entrega2.tmp',nuevo);await rename(ruta+'.fase4-entrega2.tmp',ruta)
 console.log('Rutas públicas integradas. Copia de respaldo: '+respaldo)
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) ejecutar().catch(e=>{console.error(e.message);process.exitCode=1})
