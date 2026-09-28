import type { EventoAuditoriaIam } from '../api/tipos-iam'
import { columnasAuditoria, filasAuditoria } from './exportar-auditoria-csv'

const encoder = new TextEncoder()
const xmlBase = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const xmlRel = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

function xml(valor: string): string {
    return valor.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function hoja(eventos: readonly EventoAuditoriaIam[]): string {
    const filas = [columnasAuditoria, ...filasAuditoria(eventos)]
    const filasXml = filas.map((fila, indice) => {
        const celdas = fila.map((valor, columna) => {
            if (valor.length > 32767) throw new Error('Un campo supera el límite de Excel; exporta esta página en CSV.')
            const letra = String.fromCharCode(65 + columna)
            return `<c r="${letra}${indice + 1}" t="inlineStr"${indice === 0 ? ' s="1"' : ''}><is><t xml:space="preserve">${xml(valor)}</t></is></c>`
        }).join('')
        return `<row r="${indice + 1}">${celdas}</row>`
    }).join('')
    const anchos = [14, 27, 17, 22, 39, 39, 33, 20, 40, 48, 48, 48]
        .map((ancho, indice) => `<col min="${indice + 1}" max="${indice + 1}" width="${ancho}" customWidth="1"/>`).join('')
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<worksheet xmlns="${xmlBase}"><dimension ref="A1:L${filas.length}"/>` +
        `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
        `<cols>${anchos}</cols><sheetData>${filasXml}</sheetData><autoFilter ref="A1:L${filas.length}"/></worksheet>`
}

function crc32(datos: Uint8Array): number {
    let crc = 0xffffffff
    for (const byte of datos) {
        crc ^= byte
        for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
    return (crc ^ 0xffffffff) >>> 0
}

function u16(salida: number[], valor: number) { salida.push(valor & 255, (valor >>> 8) & 255) }
function u32(salida: number[], valor: number) {
    salida.push(valor & 255, (valor >>> 8) & 255, (valor >>> 16) & 255, (valor >>> 24) & 255)
}

// ZIP sin compresión: Office Open XML válido, con CRC y directorio central.
function zip(archivos: readonly [string, string][]): Uint8Array {
    const salida: number[] = []
    const central: number[] = []
    for (const [ruta, contenido] of archivos) {
        const nombre = encoder.encode(ruta)
        const datos = encoder.encode(contenido)
        const crc = crc32(datos)
        const desplazamiento = salida.length
        u32(salida, 0x04034b50); u16(salida, 20); u16(salida, 0x0800); u16(salida, 0)
        u16(salida, 0); u16(salida, 0); u32(salida, crc)
        u32(salida, datos.length); u32(salida, datos.length)
        u16(salida, nombre.length); u16(salida, 0)
        for (const byte of nombre) salida.push(byte)
        for (const byte of datos) salida.push(byte)
        u32(central, 0x02014b50); u16(central, 20); u16(central, 20)
        u16(central, 0x0800); u16(central, 0); u16(central, 0); u16(central, 0)
        u32(central, crc); u32(central, datos.length); u32(central, datos.length)
        u16(central, nombre.length); u16(central, 0); u16(central, 0)
        u16(central, 0); u16(central, 0); u32(central, 0); u32(central, desplazamiento)
        for (const byte of nombre) central.push(byte)
    }
    const inicioCentral = salida.length
    for (const byte of central) salida.push(byte)
    u32(salida, 0x06054b50); u16(salida, 0); u16(salida, 0)
    u16(salida, archivos.length); u16(salida, archivos.length)
    u32(salida, central.length); u32(salida, inicioCentral); u16(salida, 0)
    return new Uint8Array(salida)
}

export function xlsxAuditoria(eventos: readonly EventoAuditoriaIam[]): Uint8Array {
    const contenido = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
        `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
        `<Default Extension="xml" ContentType="application/xml"/>` +
        `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
        `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
        `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`
    const relaciones = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="${xmlRel}/officeDocument" Target="xl/workbook.xml"/></Relationships>`
    const libro = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<workbook xmlns="${xmlBase}" xmlns:r="${xmlRel}">` +
        `<sheets><sheet name="Auditoría IAM" sheetId="1" r:id="rId1"/></sheets></workbook>`
    const libroRelaciones = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="${xmlRel}/worksheet" Target="worksheets/sheet1.xml"/>` +
        `<Relationship Id="rId2" Type="${xmlRel}/styles" Target="styles.xml"/></Relationships>`
    const estilos = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<styleSheet xmlns="${xmlBase}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>` +
        `<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>` +
        `<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>` +
        `<borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
        `<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
        `<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>` +
        `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`
    return zip([
        ['[Content_Types].xml', contenido], ['_rels/.rels', relaciones],
        ['xl/workbook.xml', libro], ['xl/_rels/workbook.xml.rels', libroRelaciones],
        ['xl/styles.xml', estilos], ['xl/worksheets/sheet1.xml', hoja(eventos)],
    ])
}