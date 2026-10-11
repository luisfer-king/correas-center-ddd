// El nombre y el orden del grupo pueden ajustarse sin cambiar las rutas ni los permisos.
export const grupoCatalogo = { titulo: 'Catálogo', enlaces: [
  { etiqueta: 'Productos', ruta: '/portal/catalogo/productos', recurso: 'productos' },
  { etiqueta: 'Categorías', ruta: '/portal/catalogo/categorias', recurso: 'categorias' },
  { etiqueta: 'Marcas', ruta: '/portal/catalogo/marcas', recurso: 'marcas' },
  { etiqueta: 'Tipos de atributo', ruta: '/portal/catalogo/tipos-atributo', recurso: 'tipos-atributo' },
  { etiqueta: 'Atributos técnicos', ruta: '/portal/catalogo/atributos-tecnicos', recurso: 'atributos-tecnicos' },
  { etiqueta: 'Industrias', ruta: '/portal/catalogo/industrias', recurso: 'industrias' },
  { etiqueta: 'Servicios', ruta: '/portal/catalogo/servicios', recurso: 'servicios' },
  { etiqueta: 'Aplicaciones por industria', ruta: '/portal/catalogo/asignaciones-industria', recurso: 'asignaciones-industria' },
] } as const
