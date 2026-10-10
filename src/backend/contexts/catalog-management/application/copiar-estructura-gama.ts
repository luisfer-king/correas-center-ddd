import type { SesionGama } from './ports/unidad-trabajo-gamas.js'
export type OpcionesCopiaGama = { copiarFilas?: boolean; copiarValores?: boolean; copiarEnlaces?: boolean }
export function validarOpcionesCopia(d:OpcionesCopiaGama): Required<OpcionesCopiaGama> {
  for (const valor of [d.copiarFilas,d.copiarValores,d.copiarEnlaces]) if (valor!==undefined && typeof valor!=='boolean') throw new Error('Opciones de copia inválidas')
  const opciones={copiarFilas:d.copiarFilas??false,copiarValores:d.copiarValores??false,copiarEnlaces:d.copiarEnlaces??false}
  if (!opciones.copiarFilas && (opciones.copiarValores || opciones.copiarEnlaces)) throw new Error('Copiar valores o enlaces requiere copiar filas')
  return opciones
}
/** Copia únicamente dentro de la transacción, con el origen bloqueado y su versión comprobada. */
export async function copiarEstructuraGama(s:SesionGama,d:OpcionesCopiaGama) {
  const opciones=validarOpcionesCopia(d),origen=s.origen
  if (!origen || origen.gama.estado!=='activo') throw new Error('Origen de copia no disponible')
  s.gama.exigirOrigen(origen.gama)
  const e=origen.estructura
  if (!e.columnas.some(c=>c.estado==='activo')) throw new Error('La gama origen no tiene columnas activas')
  const gruposColumnas=new Map<bigint,bigint>(),gruposFilas=new Map<bigint,bigint>(),columnas=new Map<bigint,bigint>(),filas=new Map<bigint,bigint>()
  for (const g of e.gruposColumnas.filter(g=>g.estado!=='eliminado')) {
    const nuevo=await s.gruposColumnas.crear({codigo:g.codigo,nombre:g.nombre})
    if (g.estado==='inactivo') {nuevo.inactivar(s.cuando);await s.gruposColumnas.guardar(nuevo)}
    gruposColumnas.set(g.id,nuevo.id)
  }
  for (const g of e.gruposFilas.filter(g=>g.estado!=='eliminado')) {
    const nuevo=await s.gruposFilas.crear({codigo:g.codigo,nombre:g.nombre})
    if (g.estado==='inactivo') {nuevo.inactivar(s.cuando);await s.gruposFilas.guardar(nuevo)}
    gruposFilas.set(g.id,nuevo.id)
  }
  const grupoDestino=(mapa:Map<bigint,bigint>,id:bigint|null)=>{
    if (id===null) return null
    const destino=mapa.get(id)
    if (!destino) throw new Error('Grupo del origen no disponible para copiar')
    return destino
  }
  for (const c of e.columnas.filter(c=>c.estado!=='eliminado')) {
    const nuevo=await s.columnas.crear({atributoId:c.atributoId,tipoDato:c.tipoDato,...c.presentacion,grupoId:grupoDestino(gruposColumnas,c.presentacion.grupoId)})
    if (c.estado==='inactivo') {nuevo.inactivar(s.cuando);await s.columnas.guardar(nuevo)}
    columnas.set(c.id,nuevo.id)
  }
  if (opciones.copiarFilas) for (const f of e.filas.filter(f=>f.estado!=='eliminado')) {
    const nuevo=await s.filas.crear({codigo:f.codigo,...f.detalle,grupoId:grupoDestino(gruposFilas,f.detalle.grupoId),enlaceDetalle:opciones.copiarEnlaces?f.detalle.enlaceDetalle:null})
    if (f.estado==='inactivo') {nuevo.inactivar(s.cuando);await s.filas.guardar(nuevo)}
    filas.set(f.id,nuevo.id)
  }
  let valores=0
  if (opciones.copiarValores) for (const v of e.valores) {
    const filaId=filas.get(v.filaId),columnaId=columnas.get(v.columnaId)
    if (filaId!==undefined && columnaId!==undefined) {await s.valores.poner(filaId,columnaId,v.valor);valores++}
  }
  return {gruposColumnas:gruposColumnas.size,gruposFilas:gruposFilas.size,columnas:columnas.size,filas:filas.size,valores}
}
