export type DatosToken = Readonly<{
    usuarioId: string; sesionId: string; emitidoEn: Date; expiraEn: Date
}>

export interface ServicioTokens {
    emitir(datos: DatosToken): Promise<string>
    verificar(jwt: string): Promise<DatosToken>
}