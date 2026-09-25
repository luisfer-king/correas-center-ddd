import { randomUUID } from 'node:crypto'
import type { GeneradorIds } from '../application/ports/generador-ids.js'
export class UuidSeguro implements GeneradorIds { nuevo(): string { return randomUUID() } }