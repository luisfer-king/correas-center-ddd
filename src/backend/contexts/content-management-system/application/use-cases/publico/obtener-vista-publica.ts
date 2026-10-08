import type { ConsultaVistaPublica } from '../../ports/consulta-vista-publica.js'
export class ObtenerVistaPublica {
 constructor(private readonly consulta: ConsultaVistaPublica) {}
 ejecutar(empresaId: bigint) {
  if (empresaId <= 0n || empresaId > 9223372036854775807n) throw new Error('Empresa pública inválida')
  return this.consulta.obtener(empresaId)
 }
}
