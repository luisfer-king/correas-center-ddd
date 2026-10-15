import type { DatosNuevoContactoEntrante } from './repositorio-contactos-entrantes.js'
export interface RecepcionContactosPublicos { recibir(datos:DatosNuevoContactoEntrante):Promise<void> }
