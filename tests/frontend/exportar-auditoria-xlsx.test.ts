import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { EventoAuditoriaIam } from '../../src/frontend/features/iam/api/tipos-iam.js'
import { xlsxAuditoria } from '../../src/frontend/features/iam/presentation/exportar-auditoria-xlsx.js'
import { nombreExportacionAuditoria } from '../../src/frontend/features/iam/presentation/nombre-exportacion-auditoria.js'

const evento: EventoAuditoriaIam = {
    id: '9007199254740993', creadoEn: '2026-09-26T13:00:00.000Z', accion: 'Edición',
    tablaAfectada: 'rol', registroId: '=SUM(1,2)', usuarioId: null,
    ipAddress: null, userAgent: 'agente <X> & prueba',
    datosAnteriores: null, datosNuevos: { nombre: 'Prueba' }, metadata: { operacion: 'iam.roles.update' },
}

test('XLSX genera un paquete Excel sin fórmulas a partir de las filas seleccionadas', () => {
    const archivo = xlsxAuditoria([evento])
    assert.equal(new TextDecoder().decode(archivo.subarray(0, 4)), 'PK\u0003\u0004')
    const contenido = new TextDecoder().decode(archivo)
    assert.match(contenido, /<sheet name="Auditoría IAM"/)
    assert.match(contenido, /<dimension ref="A1:L2"/)
    assert.match(contenido, /9007199254740993/)
    assert.match(contenido, /<t xml:space="preserve">=SUM\(1,2\)<\/t>/)
    assert.doesNotMatch(contenido, /<f>/)
    assert.match(contenido, /agente &lt;X&gt; &amp; prueba/)
})

test('ambos formatos usan el rango aplicado o la fecha de hoy, acción o general y número de página', () => {
    const hoy = new Date(2026, 8, 26, 10)
    assert.equal(nombreExportacionAuditoria({ desde: '2026-09-01', hasta: '2026-09-26' },
        'Edición', 1, 'xlsx', hoy), 'auditoria-iam-2026-09-01_a_2026-09-26-edicion-pagina-2.xlsx')
    assert.equal(nombreExportacionAuditoria({ desde: '', hasta: '' }, 'todas', 0, 'csv', hoy),
        'auditoria-iam-2026-09-26-general-pagina-1.csv')
    assert.equal(nombreExportacionAuditoria({ desde: '2026-09-01', hasta: '' }, 'Lectura', 0, 'csv', hoy),
        'auditoria-iam-desde_2026-09-01-lectura-pagina-1.csv')
    assert.equal(nombreExportacionAuditoria({ desde: '', hasta: '2026-09-26' }, 'Creación', 0, 'xlsx', hoy),
        'auditoria-iam-hasta_2026-09-26-creacion-pagina-1.xlsx')
})