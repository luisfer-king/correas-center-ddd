import type { Empresa } from '../../domain/empresa.js';

export type DatosNuevaEmpresa = { nombre: string; logo: string | null }

export interface RepositorioEmpresas {
    buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Empresa | null>
    listar(pagina: number, incluirEliminados: boolean): Promise<readonly Empresa[]>
    crear(datos: DatosNuevaEmpresa, actorId: string): Promise<Empresa>
    guardar(empresa: Empresa, versionAnterior: Date, actorId: string): Promise<void>
}
