import {test} from 'node:test'
import assert from 'node:assert/strict'
import {fuentesWizardCmsDesdeEntorno} from '../configuracion-cms.js'
test('wizard: sin variable admite las tres fuentes públicas y solo el filtro de categoría',()=>{
 const anterior=process.env.CMS_FUENTES_WIZARD_JSON
 delete process.env.CMS_FUENTES_WIZARD_JSON
 try {
  const fuentes=fuentesWizardCmsDesdeEntorno()
  fuentes.validar('industrias',null);fuentes.validar('productos',null);fuentes.validar('categorias',null);fuentes.validar('categorias','producto_id')
  assert.throws(()=>fuentes.validar('productos','producto_id'))
  assert.throws(()=>fuentes.validar('arbitraria',null))
 }finally{if(anterior!==undefined)process.env.CMS_FUENTES_WIZARD_JSON=anterior}
})
test('wizard: configuración explícita conserva restricciones, incluso catálogo vacío',()=>{
 const fuentes=fuentesWizardCmsDesdeEntorno('{"texto":[]}')
 fuentes.validar('texto',null)
 assert.throws(()=>fuentes.validar('industrias',null))
 assert.throws(()=>fuentesWizardCmsDesdeEntorno('{}').validar('productos',null))
 assert.throws(()=>fuentesWizardCmsDesdeEntorno('incorrecto'),/JSON/)
})
