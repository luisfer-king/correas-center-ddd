export interface HuellaToken {
    calcular(token: string): string
    coincide(token: string, huella: string): boolean
}