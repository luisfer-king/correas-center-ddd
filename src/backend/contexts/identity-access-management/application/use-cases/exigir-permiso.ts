import { CodigoPermiso, uuid } from '../../domain/iam-values.js'
import type { ConsultaAutorizacion } from '../ports/consulta-autorizacion.js'

// El actorId debe venir de la sesión verificada, nunca del cuerpo HTTP.
export class ExigirPermiso {
    constructor(private readonly consulta: ConsultaAutorizacion) { }
    async ejecutar(actorId: string, codigo: string): Promise<void> {
        uuid(actorId)
        const clave = CodigoPermiso.create(codigo)
        const vigentes = await this.consulta.permisosEfectivos(actorId)
        if (!vigentes.has(clave.value)) throw new Error('Acceso denegado')
    }
    async tieneRolActivo(actorId: string, slugs: readonly string[]): Promise<boolean> {
        uuid(actorId)
        return this.consulta.tieneRolActivo(actorId, slugs)
    }
    async tienePermiso(actorId: string, codigo: string): Promise<boolean> {
        uuid(actorId)
        const clave = CodigoPermiso.create(codigo)
        return (await this.consulta.permisosEfectivos(actorId)).has(clave.value)
    }
}