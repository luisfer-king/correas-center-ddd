/** Una única normalización para la vista previa y la creación en el servidor. */
export function slugNombre(nombre: string): string {
    return nombre.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120).replace(/-+$/g, '')
}
