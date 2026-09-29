export interface RelojCatalogo { ahora(): Date }
export function fechaCambioCatalogo(reloj: RelojCatalogo, anterior: Date): Date {
  const ahora = reloj.ahora()
  if (!Number.isFinite(ahora.getTime())) throw new Error('Fecha inválida')
  return ahora > anterior ? ahora : new Date(anterior.getTime() + 1)
}
