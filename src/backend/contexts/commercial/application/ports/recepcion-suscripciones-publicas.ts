import type { Email } from '../../../../shared/domain/value-objects.js'
export interface RecepcionSuscripcionesPublicas { recibir(empresaId:bigint,email:Email):Promise<void> }
