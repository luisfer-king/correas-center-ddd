import type { EmpresaPublica } from '../../../shared/publico/comun.js'
export interface ConsultaEmpresaPublicable { obtener(empresaId: bigint): Promise<EmpresaPublica | null> }
export class EmpresaNoPublicada extends Error { constructor() { super('Empresa pública no disponible') } }
export class LeerPublico<T, E = void> {
 constructor(private readonly empresas: ConsultaEmpresaPublicable, private readonly leer: (empresaId: bigint, entrada: E) => Promise<T>) {}
 async ejecutar(empresaId: bigint, entrada: E): Promise<T> {
  if (!await this.empresas.obtener(empresaId)) throw new EmpresaNoPublicada()
  return this.leer(empresaId, entrada)
 }
}
