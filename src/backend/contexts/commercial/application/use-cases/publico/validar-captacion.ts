import { Email } from '../../../../../shared/domain/value-objects.js'
export class CaptacionInvalida extends Error {}
export function textoPublico(valor:unknown,nombre:string,max:number,min=1){if(typeof valor!=='string'||valor.trim().length<min||valor.trim().length>max)throw new CaptacionInvalida(nombre+' inválido');return valor.trim()}
export function emailPublico(valor:unknown){try{return Email.create(textoPublico(valor,'Email',254))}catch{throw new CaptacionInvalida('Email inválido')}}
export function consentimientoPublico(valor:unknown){if(valor!==true)throw new CaptacionInvalida('Debes aceptar la política de privacidad')}
