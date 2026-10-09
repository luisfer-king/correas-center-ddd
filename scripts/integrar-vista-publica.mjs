import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
export function integrar(app, rutas) {
 const marca = '// CMS público: vista inicial v1'
 if (!app.includes(marca)) {
  if (!/return app\s*;/.test(app)) throw new Error('No se encontró return app en app.ts; integra manualmente según README')
  app = "import { componerCmsPublico, empresaPublicaDesdeEntorno } from './contexts/content-management-system/infrastructure/componer-cms-publico.js'\nimport { registrarRutasPublicasCms } from './contexts/content-management-system/presentation/registrar-rutas-publicas-cms.js'\n" + app.replace(/return app\s*;/, `${marca}\n  if (db) registrarRutasPublicasCms(app, componerCmsPublico(db), empresaPublicaDesdeEntorno());\n  return app;`)
 }
 if (!rutas.includes(marca)) {
  const raiz = /<Route\s+path=["']\/["']\s+element=\{<PortadaTemporal\s*\/?>\}\s*\/\s*>/
  if (!raiz.test(rutas)) throw new Error('No se encontró la portada temporal; integra manualmente según README')
  const paths = ['/', '/products', '/products/:slug', '/products/:slug/:categoria', '/applications', '/applications/:slug', '/services', '/services/:slug', '/contact', '/about']
  for (const path of paths.slice(1)) if (rutas.includes(`path="${path}"`) || rutas.includes(`path='${path}'`)) throw new Error(`La ruta ${path} ya existe; integra manualmente para conservarla`)
  rutas = rutas.replace(/import\s+\{\s*PortadaTemporal\s*\}\s+from\s+['"][^'"]+['"];?\s*\n/, '')
  rutas = "import { VistaPublica } from '../features/publico/presentation/entrada-publica'\n" + rutas.replace(raiz, `{/* ${marca} */}\n    ` + paths.map(path => `<Route path="${path}" element={<VistaPublica />} />`).join('\n    '))
 }
 return { app, rutas }
}
async function main() {
 const archivos = ['src/backend/app.ts', 'src/frontend/app/rutas.tsx'].map(p => resolve(p))
 const originales = await Promise.all(archivos.map(p => readFile(p, 'utf8')))
 const resultado = integrar(...originales)
 const nuevos = [resultado.app, resultado.rutas]
 if (process.argv.includes('--check')) { console.log('Integración válida; no se modificaron archivos.'); return }
 for (let i = 0; i < archivos.length; i++) if (nuevos[i] !== originales[i]) {
  await writeFile(archivos[i] + '.publico-' + Date.now() + '.bak', originales[i], { flag: 'wx' })
  await writeFile(archivos[i], nuevos[i])
 }
 console.log('Vista pública integrada; configura PUBLIC_EMPRESA_ID y reinicia ambos servicios.')
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(e => { console.error(e.message); process.exitCode = 1 })
