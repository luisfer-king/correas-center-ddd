import type { PrismaClient } from '../../../../generated/prisma/client.js'
export const actor = '11111111-1111-4111-8111-111111111111'
export const antes = new Date('2026-10-05T12:00:00Z')
export const despues = new Date('2026-10-05T12:00:01Z')
export const contexto = { actorId: actor, cuando: despues, ipAddress: '127.0.0.1', userAgent: 'prueba-cms' }
// El doble interpreta los filtros de estas pruebas. No sustituye PostgreSQL ni prueba su aislamiento.
type Fila = Record<string, any>
export function entorno(recurso: string) {
  const fixtures: Record<string, Fila> = {
    tipoSeccion: { id: 2n, nombre: 'texto', slug: 'texto', descripcion: null, camposMetadata: ['cta'], icono: null, orden: 0, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
    contenidoSeccion: { id: 2n, empresaId: 1n, tipoSeccionId: 1n, titulo: null, subtitulo: null, descripcion: null, icono: null, imagen: null, metadata: { cta: 'Cotizar' }, orden: 0, mostrar: true, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
    menu: { id: 2n, empresaId: 1n, grupo: 'Producto', tipoRegistro: 'producto', registroId: 1n, ruta: '/productos', icono: null, mostrar: true, orden: 0, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes, cargarSubmenu: null },
    menuItem: { id: 2n, menuId: 1n, nombre:'Correas en V', categoriaId:1n, ruta: '/productos', orden: 1, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
    footerElemento: { id: 2n, empresaId: 1n, tipo: 'producto', tipoRegistro: null, registroId: null, titulo: null, url: null, icono: null, orden: 0, mostrar: true, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
    configuracionSitio: { id: 2, empresaId: null, clave: 'texto', valor: null, tipo: null, descripcion: null, grupo: null, activo: null, creadoEn: antes, actualizadoEn: antes },
    pasoWizard: { id: 2n, empresaId: 1n, identificador: 'texto', titulo: 'texto', descripcion: 'texto', fuenteDatos: 'texto', campoFiltro: null, orden: 0, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
    registroCMS: { id: 2n, identificador: 'texto', nombre: 'texto', descripcion: null, orden: 0, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
    contenidoRegistro: { id: 2n, empresaId: 1n, registroId: 1n, titulo: null, subtitulo: null, descripcion: null, icono: null, stats: null, orden: 0, estado: 'activo', eliminadoEn: null, creadoEn: antes, actualizadoEn: antes },
  }
  let tablas: Record<string, Fila[]> = Object.fromEntries(Object.entries(fixtures).map(([key, value]) => [key, [structuredClone(value)]]))
  tablas.categoria=[{id:1n,productoId:1n,nombre:'Correas en V',slug:'correas-en-v',estado:'activo',eliminadoEn:null}]
  tablas.empresa = [{ id: 1n, estado: 'activo', eliminadoEn: null }]
  for (const key of ['producto', 'industria', 'servicio']) tablas[key] = [{ id: 1n, empresaId: 1n, nombre:'Correas Industriales',slug:'correas-industriales',estado: 'activo', eliminadoEn: null }]
  for (const key of ['tipoSeccion', 'registroCMS', 'menu']) tablas[key].push({ ...structuredClone(fixtures[key]), id: 1n })
  let auditorias: unknown[][] = []
  const consultas: { modelo: string; metodo: string; args: any }[] = []
  const opciones = { permiso: true, fallarAuditoria: false, fallarCambio: false }
  function coincide(fila: Fila, where: Fila = {}): boolean {
    return Object.entries(where).every(([key, value]) => value === undefined || (value !== null && typeof value === 'object' && 'not' in value ? fila[key] !== value.not : value !== null && typeof value === 'object' && 'in' in value ? value.in.includes(fila[key]) : fila[key] instanceof Date && value instanceof Date
      ? fila[key].getTime() === value.getTime() : fila[key] === value))
  }
  function resultado(key: string, fila: Fila | undefined, args: any): Fila | null {
    if (!fila) return null
    const copia = structuredClone(fila)
    if (key === 'menu' && args.include?.relMenuItem) copia.relMenuItem = tablas.menuItem.filter(x => x.menuId === fila.id).map(x => structuredClone(x))
    return copia
  }
  const tx: Record<string, any> = { perfil: { findFirst: async (args: any) => {
    consultas.push({ modelo: 'perfil', metodo: 'findFirst', args }); return opciones.permiso ? { id: actor } : null
  } }, $executeRaw: async (_sql: unknown, ...valores: unknown[]) => {
    if (opciones.fallarAuditoria) throw new Error('Fallo auditoría')
    auditorias.push(valores); return 1
  } }
  for (const key of Object.keys(tablas)) {
    tx[key] = {
      findUnique: async (args: any) => { consultas.push({ modelo: key, metodo: 'findUnique', args }); return resultado(key, tablas[key].find(x => coincide(x, args.where)), args) },
      findFirst: async (args: any) => { consultas.push({ modelo: key, metodo: 'findFirst', args }); return resultado(key, tablas[key].find(x => coincide(x, args.where)), args) },
      findMany: async (args: any) => {
        consultas.push({ modelo: key, metodo: 'findMany', args })
        let filas = tablas[key].filter(x => coincide(x, args.where)).sort((a,b) => (a.orden??0)-(b.orden??0) || (a.id<b.id?-1:1))
        filas = filas.slice(args.skip??0, args.take===undefined?undefined:(args.skip??0)+args.take)
        return filas.map(x => resultado(key,x,args))
      },
      aggregate: async (args: any) => { consultas.push({ modelo: key, metodo: 'aggregate', args }); const filas = tablas[key].filter(x => coincide(x, args.where)); return { _max: Object.fromEntries(Object.keys(args._max).map(c => [c, filas.length ? filas.map(x => x[c]).reduce((a,b) => a > b ? a : b) : null])) } },
      create: async (args: any) => { consultas.push({ modelo: key, metodo: 'create', args }); const fila = { ...structuredClone(args.data), id: key==='configuracionSitio'?99:99n }; tablas[key].push(fila); return resultado(key,fila,args) },
      updateMany: async (args: any) => { consultas.push({ modelo: key, metodo: 'updateMany', args }); if (opciones.fallarCambio) return { count: 0 }; const filas = tablas[key].filter(x => coincide(x,args.where)); for (const fila of filas) Object.assign(fila,structuredClone(args.data)); return { count: filas.length } },
    }
  }
  const db = { ...tx, $transaction: async (fn: (t: unknown) => Promise<unknown>, opcionesTx: unknown) => {
    consultas.push({ modelo: '$transaction', metodo: 'begin', args: opcionesTx })
    const anteriores = structuredClone(tablas), prevAuditoria = [...auditorias]
    try { return await fn(tx) } catch (error) { tablas=anteriores; auditorias=prevAuditoria; throw error }
  } } as unknown as PrismaClient
  return { db, opciones, consultas, get auditorias() { return auditorias }, get tablas() { return tablas }, fila: () => structuredClone(tablas[recurso].find(x => x.id === fixtures[recurso].id)!) }
}
