import { ValorTecnico, type DatoTecnico } from '../domain/valor-tecnico.js'
export type DatosValorAsignacion = {valor:DatoTecnico|null;valorPersonalizado?:never} | {valorPersonalizado:string|null;valor?:never}
export function valorAsignacion(d:DatosValorAsignacion): {tipado:boolean;valor:ValorTecnico|null} {
  if ('valor' in d) {
    if ('valorPersonalizado' in d || d.valor===undefined) throw new Error('Valor de asignación ambiguo')
    return {tipado:true,valor:d.valor===null?null:ValorTecnico.crear(d.valor)}
  }
  if (d.valorPersonalizado===undefined) throw new Error('Valor de asignación obligatorio')
  return {tipado:false,valor:d.valorPersonalizado===null?null:ValorTecnico.crear({tipo:'numero',valor:d.valorPersonalizado})}
}
