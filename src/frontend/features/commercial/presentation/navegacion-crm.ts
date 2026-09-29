// Los grupos y su orden se pueden adaptar sin mover vistas ni alterar permisos.
export const grupoComercial = { titulo: 'Comercial / CRM', enlaces: [
  { etiqueta: 'Empresas', ruta: '/portal/crm/empresas', recurso: 'empresas' },
  { etiqueta: 'Sucursales', ruta: '/portal/crm/sucursales', recurso: 'sucursales' },
  { etiqueta: 'Contactos', ruta: '/portal/crm/contactos', recurso: 'contactos' },
  { etiqueta: 'Suscriptores', ruta: '/portal/crm/suscriptores', recurso: 'suscriptores' },
  { etiqueta: 'Leads', ruta: '/portal/crm/leads', recurso: 'leads' },
] } as const
