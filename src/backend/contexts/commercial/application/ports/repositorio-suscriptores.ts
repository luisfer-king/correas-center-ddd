import type { Email } from '../../../../shared/domain/value-objects.js';
import type { Suscriptor } from '../../domain/suscriptor.js';

export type DatosNuevoSuscriptor = { empresaId: bigint; email: Email; nombre: string | null }

export interface RepositorioSuscriptores {
    buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Suscriptor | null>
    buscarPorEmail(email: Email, incluirEliminados: boolean): Promise<Suscriptor | null>
    listar(pagina: number, incluirEliminados: boolean): Promise<readonly Suscriptor[]>
    crear(datos: DatosNuevoSuscriptor, actorId: string): Promise<Suscriptor>
    /** La verificación del email requiere un caso de uso que compruebe su token. */
    guardar(suscriptor: Suscriptor, versionAnterior: Date, actorId: string): Promise<void>
}
