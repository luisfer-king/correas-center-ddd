import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Email } from '../../../../shared/domain/value-objects.js'
import { Perfil } from '../../domain/perfil.js'
import type { RepositorioMiPerfil } from '../ports/repositorio-mi-perfil.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import { MiPerfil } from '../use-cases/mi-perfil.js'

const id = 'a0c14443-9978-48a1-8878-f1e57a7911b1'
const fecha = new Date('2026-01-01')
const perfil = new Perfil({
    id, nombreCompleto: 'Mi nombre', telefono: null, avatarUrl: null,
    email: Email.create('me@example.com'), emailVerifiedAt: fecha, estado: 'activo',
    fechas: { creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: null }, roles: []
})

test('mi perfil usa el ID autenticado en lectura y edición', async () => {
    let consultado = ''
    let editado = ''
    const caso = new MiPerfil({ buscarPorId: async (valor: string) => { consultado = valor; return perfil } } as RepositorioPerfiles,
        { actualizar: async (valor: string) => { editado = valor; return perfil } } as unknown as RepositorioMiPerfil)
    assert.equal(await caso.obtener(id), perfil)
    await caso.editar(id, { nombreCompleto: ' Nuevo nombre ', telefono: null })
    assert.equal(consultado, id)
    assert.equal(editado, id)
})

test('mi contraseña rechaza claves iguales o cortas antes de persistir', async () => {
    let guardados = 0
    const caso = new MiPerfil({} as RepositorioPerfiles,
        { cambiarClave: async () => { guardados++ } } as unknown as RepositorioMiPerfil)
    await assert.rejects(caso.cambiarClave(id, 'clave-actual-larga', 'clave-actual-larga'), /inválida/)
    await assert.rejects(caso.cambiarClave(id, 'clave-actual-larga', 'corta'), /inválida/)
    assert.equal(guardados, 0)
})
