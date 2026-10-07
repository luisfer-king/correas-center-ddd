import assert from 'node:assert/strict'
import {test} from 'node:test'
import {sufijoElementoMenu,construirRutaMenu} from '../src/frontend/features/cms/presentation/datos-menu-formulario'
test('producto: usa el slug registrado aunque el nombre produzca otro slug',()=>{
  const s=sufijoElementoMenu('Producto',{nombre:'Correas nuevas',slug:'correas-industriales'})
  assert.equal(s,'correas-industriales');assert.equal(construirRutaMenu('Producto',s),'/products/correas-industriales/')
})
test('industria: conserva el slug del elemento seleccionado',()=>{
  const s=sufijoElementoMenu('Aplicacion',{nombre:'Industria minera',slug:'mineria'})
  assert.equal(s,'mineria');assert.equal(construirRutaMenu('Aplicacion',s),'/applications/mineria/')
})
test('servicio: genera slug desde el nombre con acentos y signos',()=>{
  const s=sufijoElementoMenu('Servicio',{nombre:'Reparación de Cilindros Hidráulicos'})
  assert.equal(s,'reparacion-de-cilindros-hidraulicos');assert.equal(construirRutaMenu('Servicio',s),'/services/reparacion-de-cilindros-hidraulicos/')
})
test('producto o industria sin slug no inventan uno desde su nombre',()=>{
  assert.throws(()=>sufijoElementoMenu('Producto',{nombre:'Correas'}),/slug válido/)
  assert.throws(()=>sufijoElementoMenu('Aplicacion',{nombre:'Minería',slug:''}),/slug válido/)
})
