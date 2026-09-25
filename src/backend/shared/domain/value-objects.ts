export class Email {
    private constructor(readonly value: string) { }
    static create(input: string): Email {
        const value = input.trim().toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Email inválido')
        return new Email(value)
    }
    equals(other: Email): boolean { return this.value === other.value }
}

export class Slug {
    private constructor(readonly value: string) { }
    static create(input: string): Slug {
        const value = input.trim().toLowerCase()
        if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(value)) throw new Error('Slug inválido')
        return new Slug(value)
    }
    equals(other: Slug): boolean { return this.value === other.value }
}

export class Orden {
    private constructor(readonly value: number) { }
    static create(value: number): Orden {
        if (!Number.isSafeInteger(value) || value < 0) throw new Error('Orden inválido')
        return new Orden(value)
    }
    equals(other: Orden): boolean { return this.value === other.value }
}

export type CamposAuditoria = Readonly<{
    creadoEn: Date
    actualizadoEn: Date
    eliminadoEn: Date | null
}>
