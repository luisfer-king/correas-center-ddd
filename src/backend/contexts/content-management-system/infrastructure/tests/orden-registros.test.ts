import assert from 'node:assert/strict'
import {test} from 'node:test'
import {PrismaRegistrosCMS} from '../prisma-registro-cms.js'
import {PrismaContenidosRegistro} from '../prisma-contenido-registro.js'
import {Orden} from '../../../../shared/domain/value-objects.js'
import {entorno,contexto,antes} from './soporte-pruebas-cms.js'
const campos={titulo:'Planta',subtitulo:null,descripcion:null,icono:'fa-building'}
const registro={identificador:'infrastructure',nombre:'Infraestructura',descripcion:null}
test('registro: comienza en 1 y el servidor ignora un orden de creación manual',async()=>{
 const env=entorno('registroCMS');env.tablas.registroCMS=[]
 const nuevo=await new PrismaRegistrosCMS(env.db).crear({...registro,orden:Orden.create(900)},contexto)
 assert.equal(nuevo.orden.value,1)
})
test('registro: continúa el mayor orden vigente, incluyendo inactivos',async()=>{
 const env=entorno('registroCMS'),fila=env.fila()
 env.tablas.registroCMS=[{...fila,orden:3},{...fila,id:3n,orden:7,estado:'inactivo'},{...fila,id:4n,orden:100,estado:'eliminado',eliminadoEn:antes}]
 assert.equal((await new PrismaRegistrosCMS(env.db).crear(registro,contexto)).orden.value,8)
})
test('contenido: contador por registro padre, independiente de otros registros',async()=>{
 const env=entorno('contenidoRegistro'),fila=env.fila()
 env.tablas.contenidoRegistro=[{...fila,orden:2},{...fila,id:3n,orden:8,empresaId:2n,estado:'inactivo'},{...fila,id:4n,orden:99,estado:'eliminado',eliminadoEn:antes},{...fila,id:5n,registroId:2n,orden:900}]
 const nuevo=await new PrismaContenidosRegistro(env.db).crear({empresaId:1n,registroId:1n,campos},contexto)
 assert.equal(nuevo.orden.value,9);assert.equal(nuevo.registroId,1n)
 const where=env.consultas.find(x=>x.metodo==='aggregate')!.args.where
 assert.equal(where.registroId,1n);assert.ok(!('empresaId' in where))
})
test('contenido: primer hijo comienza en 1',async()=>{
 const env=entorno('contenidoRegistro');env.tablas.contenidoRegistro=[]
 assert.equal((await new PrismaContenidosRegistro(env.db).crear({empresaId:1n,registroId:1n,campos},contexto)).orden.value,1)
})
for(const tipo of ['padre','hijo'])test(`registros: permiso denegado impide consultar orden del ${tipo}`,async()=>{
 const env=entorno(tipo==='padre'?'registroCMS':'contenidoRegistro');env.opciones.permiso=false
 const tarea=tipo==='padre'?new PrismaRegistrosCMS(env.db).crear(registro,contexto):new PrismaContenidosRegistro(env.db).crear({empresaId:1n,registroId:1n,campos},contexto)
 await assert.rejects(tarea,/Acceso denegado/);assert.ok(!env.consultas.some(x=>x.metodo==='aggregate'))
})
test('contenido: auditoría fallida revierte la creación automática',async()=>{
 const env=entorno('contenidoRegistro');env.opciones.fallarAuditoria=true
 await assert.rejects(new PrismaContenidosRegistro(env.db).crear({empresaId:1n,registroId:1n,campos},contexto),/Fallo auditoría/)
 assert.equal(env.tablas.contenidoRegistro.length,1)
})
test('registros: límite integer impide desbordamiento del contador',async()=>{
 const env=entorno('registroCMS');env.tablas.registroCMS[0].orden=2147483647
 await assert.rejects(new PrismaRegistrosCMS(env.db).crear(registro,contexto),/inválido/)
})
