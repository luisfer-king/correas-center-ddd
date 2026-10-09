import {test} from 'node:test'
import assert from 'node:assert/strict'
import {CatalogoFuentesWizardCms} from '../../application/validaciones-cms.js'
import {fuentesWizardCmsDesdeEntorno} from '../../infrastructure/configuracion-cms.js'
import {servidorCms,escritura} from './soporte-http-cms.js'
const payload={empresaId:'1',identificador:'industria',titulo:'¿En qué industria trabajas?',descripcion:'Selecciona tu sector para recomendarte los mejores productos',fuenteDatos:'industrias',campoFiltro:null}
test('wizard: formulario de la captura guarda usando configuración por defecto',async t=>{
 const anterior=process.env.CMS_FUENTES_WIZARD_JSON
 delete process.env.CMS_FUENTES_WIZARD_JSON
 let fuentes
 try{fuentes=fuentesWizardCmsDesdeEntorno()}finally{if(anterior!==undefined)process.env.CMS_FUENTES_WIZARD_JSON=anterior}
 const {app}=await servidorCms('pasoWizard',fuentes);t.after(()=>app.close())
 const r=await app.inject({method:'POST',url:'/api/portal/cms/pasos-wizard',headers:escritura,payload})
 assert.equal(r.statusCode,201,r.body);assert.equal(r.json().campoFiltro,null);assert.equal(r.json().orden,1)
})
test('wizard: fuente no habilitada muestra causa sin exponer error interno',async t=>{
 const {app}=await servidorCms('pasoWizard',new CatalogoFuentesWizardCms({}));t.after(()=>app.close())
 const r=await app.inject({method:'POST',url:'/api/portal/cms/pasos-wizard',headers:escritura,payload})
 assert.equal(r.statusCode,400);assert.match(r.json().error,/no está habilitado para el wizard/)
})
