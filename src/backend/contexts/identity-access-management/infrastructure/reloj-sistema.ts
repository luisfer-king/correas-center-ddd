import type { Reloj } from '../application/ports/reloj.js'
export class RelojSistema implements Reloj {
    ahora(): Date { return new Date() }
}