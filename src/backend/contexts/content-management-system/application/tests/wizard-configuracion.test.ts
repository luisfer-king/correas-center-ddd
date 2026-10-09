import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizarCrearPasoWizard, normalizarEditarPasoWizard } from '../use-cases/pasos-wizard/datos-paso-wizard.js'
import { fuentesWizardCmsDesdeEntorno } from '../../infrastructure/configuracion-cms.js'
const base={empresaId:1n,identificador:'industria',titulo:'¿En qué industria trabajas?',descripcion:'Selecciona tu sector',fuenteDatos:'industrias'}
test('wizard: filtros vacíos, nulos y omitidos se guardan como null al crear y editar',()=>{
 for(const campoFiltro of ['', '   ',null,undefined]){
  const datos=normalizarCrearPasoWizard({...base,campoFiltro})
  assert.equal(datos.campoFiltro,null)
  assert.ok(!('orden' in datos))
  assert.equal(normalizarEditarPasoWizard({...base,campoFiltro}).campoFiltro,null)
 }
})
test('wizard: configuración permite las fuentes públicas y valida los filtros',()=>{
 const fuentes=fuentesWizardCmsDesdeEntorno('{"industrias":[],"productos":[],"categorias":["producto_id"]}')
 for(const fuente of ['industrias','productos','categorias'])fuentes.validar(fuente,null)
 fuentes.validar('categorias','producto_id')
 assert.throws(()=>fuentes.validar('productos','producto_id'))
 assert.throws(()=>fuentes.validar('desconocida',null))
})
