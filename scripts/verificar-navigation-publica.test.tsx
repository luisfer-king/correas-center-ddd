import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import * as React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { Navigation } from '../src/frontend/features/publico/presentation/navigation'
import type { VistaPublica } from '../src/shared/vista-publica'
import { imagenPublica } from '../src/frontend/features/publico/presentation/imagen-publica'
const vista: VistaPublica = { empresa: { id: '42', nombre: 'Correas Center', logo: null }, menus: { Producto: [{ id: '1', nombre: 'Correas', grupo: 'Producto', ruta: '/products/correas/', icono: null, orden: 1, items: [{ id: '2', nombre: 'Correas en V', ruta: '/products/correas/correas-en-v/', orden: 1 }] }, { id: '3', nombre: 'Rodamientos', grupo: 'Producto', ruta: '/products/rodamientos/', icono: null, orden: 2, items: [] }], Aplicacion: [], Servicio: [] }, secciones: [] }
function Destino() { return <output id="destino">{useLocation().pathname}</output> }
async function montar() {
 const dom = new JSDOM('<div id="raiz"></div>', { url: 'http://localhost:3000/' })
 Object.assign(globalThis, { React, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true })
 const raiz = createRoot(document.getElementById('raiz')!)
 await act(async () => raiz.render(<MemoryRouter><Navigation vista={vista} /><Destino /></MemoryRouter>))
 return { dom, cerrar: async () => { await act(async () => raiz.unmount()); dom.window.close() } }
}
async function click(el: Element) { await act(async () => { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })) }) }
test('abre grupo por clic y Escape lo cierra', async () => {
 const m = await montar(); try {
  const boton = document.querySelector('[aria-controls="grupo-Producto"]')!
  assert.equal(boton.getAttribute('aria-expanded'), 'false'); await click(boton)
  assert.equal(boton.getAttribute('aria-expanded'), 'true'); assert.equal(document.getElementById('grupo-Producto')!.hidden, false)
  await act(async () => { boton.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })) })
  assert.equal(boton.getAttribute('aria-expanded'), 'false')
 } finally { await m.cerrar() }
})
test('enlace hijo cambia la ruta y cierra menú móvil', async () => {
 const m = await montar(); try {
  const boton = document.querySelector('[aria-controls="navegacion-publica"]')!
  await click(boton); assert.equal(boton.getAttribute('aria-expanded'), 'true')
  await click(document.querySelector('[aria-controls="grupo-Producto"]')!)
  await click([...document.querySelectorAll('a')].find(a => a.textContent === 'Correas en V')!)
  assert.equal(document.getElementById('destino')!.textContent, '/products/correas/correas-en-v/')
  assert.equal(boton.getAttribute('aria-expanded'), 'false')
 } finally { await m.cerrar() }
})
test('padre sin hijos tiene enlace y grupos vacíos se omiten', async () => {
 const m = await montar(); try {
  assert.ok(!document.querySelector('[aria-controls="grupo-Servicio"]'))
  await click([...document.querySelectorAll('a')].find(a => a.textContent === 'Rodamientos')!)
  assert.equal(document.getElementById('destino')!.textContent, '/products/rodamientos/')
 } finally { await m.cerrar() }
})
test('imágenes opcionales y protocolos rechazados', () => {
 assert.equal(imagenPublica(null), undefined); assert.equal(imagenPublica('javascript:alert(1)'), undefined)
 assert.equal(imagenPublica('bucket/archivo.png'), undefined); assert.equal(imagenPublica('/imagenes/logo.png'), '/imagenes/logo.png')
})
