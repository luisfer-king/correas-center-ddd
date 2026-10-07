import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
const marca = '// CMS: registro integrado por entrega 4'
const imports = [
  "import { componerCms, type CasosCms } from './contexts/content-management-system/infrastructure/componer-cms.js';",
  "import { registrarRutasCms } from './contexts/content-management-system/presentation/registrar-rutas-cms.js';",
].join('\n')
export function integrarCmsEnTexto(original) {
  if (original.includes(marca)) {
    if (!original.includes('cms?: CasosCms') || !imports.split('\n').every(x => original.includes(x)) || !original.includes('registrarRutasCms(scope, pruebas?.cms ?? componerCms(db!), casos, config)')) throw new Error('Integración CMS incompleta; revisa app.ts')
    return original
  }
  if (/\b(registrarRutasCms|componerCms)\b/.test(original)) throw new Error('app.ts ya contiene una integración CMS distinta; revisa las instrucciones manuales')
  for (const nombre of ['db', 'casos', 'config']) if (!new RegExp(`\\bconst ${nombre}\\b`).test(original)) throw new Error(`No se reconoce la variable ${nombre} de app.ts; aplica la integración manual`)
  const firma = /export\s+async\s+function\s+createApp\(pruebas\?:\s*\{([^{}]*)\}\)/
  if (!firma.test(original)) throw new Error('Firma createApp no reconocida; aplica la integración manual')
  const salud = /^[ \t]*app\.get\(["']\/api\/health["']/m
  if (!salud.test(original)) throw new Error('No se encontró el punto de registro anterior a /api/health; aplica la integración manual')
  let nuevo = original.replace(firma, (_texto, campos) => {
    const actuales = campos.trim().replace(/;$/, '')
    return `export async function createApp(pruebas?: { ${actuales}; cms?: CasosCms })`
  })
  const registro = `  ${marca}\n  if (db || pruebas?.cms) await app.register(async (scope) =>\n    registrarRutasCms(scope, pruebas?.cms ?? componerCms(db!), casos, config));\n\n`
  nuevo = nuevo.replace(salud, match => registro + match)
  return imports + '\n' + nuevo
}
async function ejecutar() {
  const archivo = resolve('src/backend/app.ts')
  const original = await readFile(archivo, 'utf8')
  const nuevo = integrarCmsEnTexto(original)
  if (nuevo === original) { process.stdout.write('CMS ya integrado en app.ts.\n'); return }
  if (process.argv.includes('--check')) { process.stdout.write('app.ts admite la integración CMS.\n'); return }
  try { await writeFile(archivo + '.antes-cms', original, { flag: 'wx' }) }
  catch (error) { if (error.code !== 'EEXIST') throw error }
  await writeFile(archivo + '.cms-tmp', nuevo)
  await rename(archivo + '.cms-tmp', archivo)
  process.stdout.write('CMS integrado en app.ts; copia anterior en app.ts.antes-cms.\n')
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  ejecutar().catch(error => { process.stderr.write(error.message + '\n'); process.exitCode = 1 })
}
