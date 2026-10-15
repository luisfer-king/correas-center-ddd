import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { todasLasPaginas, type DatosMarcoPublico } from '../src/frontend/features/publico/api/cliente-marco-publico'
import { destinoPublico, enlaceWhatsApp, vistaParaNavigation } from '../src/frontend/features/publico/presentation/datos-marco-publico'
import { FooterPublico } from '../src/frontend/features/publico/presentation/footer-publico'
import { WhatsAppPublico } from '../src/frontend/features/publico/presentation/whatsapp-publico'
import { BreadcrumbsPublico } from '../src/frontend/features/publico/presentation/breadcrumbs-publico'
Object.assign(globalThis, { React })
const datos: DatosMarcoPublico = { empresa: { id: '42', nombre: 'Correas Center', logo: null }, configuracion: { whatsapp: { numero: '+591 77306576', mensaje: 'Hola & buen día', activo: true }, analytics: { id: '', activo: false }, chat: { propertyId: '', widgetId: '', activo: false } }, menus: [{ id: '1', nombre: 'Correas', tipoRegistro: 'producto', registroId: '80', grupo: 'Productos', ruta: '/products/correas/', icono: null, orden: 1, cargarSubmenu: true, items: [{ id: '2', nombre: 'Nombre personalizado', categoriaId: '9', ruta: '/products/correas/correas-v/', orden: 1 }] }], footer: [{ id: '10', tipo: 'producto', tipoRegistro: 'producto', registroId: '80', titulo: 'Correas', url: null, icono: null, orden: 1 }, { id: '11', tipo: 'red_social', tipoRegistro: null, registroId: null, titulo: 'Red', url: 'https://example.com', icono: null, orden: 2 }, { id: '12', tipo: 'enlace', tipoRegistro: null, registroId: null, titulo: 'Inválido', url: 'javascript:alert(1)', icono: null, orden: 3 }], secciones: [] }
test('paginación avanza aun cuando los vínculos omitidos dejan una página vacía', async () => {
 const offsets: number[] = []
 const items = await todasLasPaginas(async p => { offsets.push(p.desplazamiento!); return { items: p.desplazamiento === 100 ? ['segunda'] : [], hayMas: p.desplazamiento === 0, limite: 100, desplazamiento: p.desplazamiento! } })
 assert.deepEqual(offsets,[0,100]);assert.deepEqual(items,['segunda'])
})
test('consulta cancelada no continúa leyendo páginas', async () => {
 const c = new AbortController();c.abort();let llamadas = 0
 await assert.rejects(todasLasPaginas(async () => { llamadas++;return { items:[], hayMas:false, limite:100, desplazamiento:0 } },c.signal));assert.equal(llamadas,0)
})
test('adaptador conserva nombre y destino y normaliza grupos CMS', () => {
 const v = vistaParaNavigation(datos);assert.equal(v.menus.Producto[0].items[0].nombre,'Nombre personalizado');assert.equal(v.menus.Producto[0].items[0].ruta,'/products/correas/correas-v/')
 assert.deepEqual(destinoPublico('/products/correas/correas-v',datos),{ nombre:'Nombre personalizado',padre:{ nombre:'Correas',ruta:'/products/correas/' } })
 assert.equal(destinoPublico('/ruta-desconocida',datos),null)
})
test('WhatsApp usa configuración, codifica mensaje y omite teléfonos inválidos o desactivados', () => {
 const url = enlaceWhatsApp(datos.configuracion.whatsapp)!;assert.equal(new URL(url).searchParams.get('text'),'Hola & buen día');assert.match(url,/wa.me\/59177306576/)
 assert.equal(enlaceWhatsApp({...datos.configuracion.whatsapp,activo:false}),null);assert.equal(enlaceWhatsApp({...datos.configuracion.whatsapp,numero:'javascript:alert(1)'}),null)
 assert.equal(renderToStaticMarkup(<WhatsAppPublico configuracion={{...datos.configuracion.whatsapp,activo:false}} />),'')
})
test('footer resuelve enlaces vinculados y protege enlaces externos', () => {
 const html = renderToStaticMarkup(<MemoryRouter><FooterPublico datos={datos} actualizar={()=>{}} cargando={false} /></MemoryRouter>)
 assert.ok(html.includes('href="/products/correas/"'));assert.ok(html.includes('rel="noopener noreferrer"'));assert.ok(!html.includes('javascript:'));assert.ok(html.includes('Actualizar contenido'))
})
test('breadcrumb diferencia padre y ubicación actual', () => {
 const html = renderToStaticMarkup(<MemoryRouter><BreadcrumbsPublico nombre="Correas V" padre={{nombre:'Correas',ruta:'/products/correas'}} /></MemoryRouter>)
 assert.ok(html.includes('aria-current="page"'));assert.ok(html.includes('href="/products/correas"'))
})
