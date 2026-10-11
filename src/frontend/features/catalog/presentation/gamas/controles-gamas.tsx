import type { ReactNode } from 'react'
export const entrada='w-full rounded border border-neutral-300 bg-white p-2 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100'
export const boton='rounded border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40 dark:border-neutral-600'
export const primario=boton+' bg-red-700 text-white'
export function Campo({nombre,children}:{nombre:string;children:ReactNode}) {return <label className="block space-y-1 text-sm"><span className="font-medium">{nombre}</span>{children}</label>}
export const opcional=(valor:unknown)=>typeof valor==='string'&&valor.trim()?valor.trim():null
export type EjecutarGama=(accion:()=>Promise<unknown>,mensaje:string)=>Promise<boolean>
