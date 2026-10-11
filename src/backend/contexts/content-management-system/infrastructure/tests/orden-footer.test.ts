import assert from 'node:assert/strict'
import {test} from 'node:test'
import {PrismaElementosFooter} from '../prisma-footer-elemento.js'
import {Orden} from '../../../../shared/domain/value-objects.js'
import {entorno,contexto,antes} from './soporte-pruebas-cms.js'
const entrada={empresaId:1n,tipo:'producto' as const,destino:null,titulo:null,enlace:null,icono:null,mostrar:true}
test('footer: orden automático por empresa y tipo incluye inactivos e ignora eliminados',async()=>{
 const env=entorno('footerElemento'),fila=env.fila()
 env.tablas.footerElemento=[{...fila,orden:3},{...fila,id:3n,orden:8,estado:'inactivo'},{...fila,id:4n,orden:99,estado:'eliminado',eliminadoEn:antes},{...fila,id:5n,tipo:'servicio',orden:500},{...fila,id:6n,empresaId:2n,orden:700}]
 const creado=await new PrismaElementosFooter(env.db).crear({...entrada,orden:Orden.create(999)},contexto)
 assert.equal(creado.orden.value,9)
 assert.equal(env.consultas[0].args.isolationLevel,'Serializable')
 assert.deepEqual(env.consultas.find(x=>x.metodo==='aggregate')!.args.where,{empresaId:1n,tipo:'producto',eliminadoEn:null,estado:{not:'eliminado'}})
})
test('footer: primer registro comienza en 1',async()=>{
 const env=entorno('footerElemento');env.tablas.footerElemento=[]
 assert.equal((await new PrismaElementosFooter(env.db).crear(entrada,contexto)).orden.value,1)
})
test('footer: permiso denegado impide consultar el orden',async()=>{
 const env=entorno('footerElemento');env.opciones.permiso=false
 await assert.rejects(new PrismaElementosFooter(env.db).crear(entrada,contexto),/Acceso denegado/)
 assert.ok(!env.consultas.some(x=>x.metodo==='aggregate'))
})
test('footer: fallo de auditoría revierte la creación automática',async()=>{
 const env=entorno('footerElemento');env.opciones.fallarAuditoria=true
 await assert.rejects(new PrismaElementosFooter(env.db).crear(entrada,contexto),/Fallo auditoría/)
 assert.equal(env.tablas.footerElemento.length,1);assert.equal(env.fila().orden,0)
})
test('footer: desbordamiento de orden no persiste',async()=>{
 const env=entorno('footerElemento');env.tablas.footerElemento[0].orden=2147483647
 await assert.rejects(new PrismaElementosFooter(env.db).crear(entrada,contexto),/inválido/)
 assert.ok(!env.consultas.some(x=>x.metodo==='create'))
})
