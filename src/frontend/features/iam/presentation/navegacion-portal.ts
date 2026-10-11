// CMS: integración explícita y navegación central v2
import type { CapacidadesCms } from '../../cms/api/modelos-cms'
import type { CapacidadesCatalogo } from '../../catalog/api/tipos-catalogo';
import type { CapacidadesCrm } from '../../commercial/api/cliente-crm';
import type { CapacidadesRoles } from '../api/tipos-iam';

export type AccesoPortal =
    | { contexto: 'iam'; permiso: keyof CapacidadesRoles }
    | { contexto: 'crm'; recurso: keyof CapacidadesCrm['recursos'] }
    | { contexto: 'catalogo'; recurso: keyof CapacidadesCatalogo['recursos'] }
    | { contexto: 'cms'; recurso: keyof CapacidadesCms['recursos'] }
export interface EnlacePortal { etiqueta: string; ruta: string; seccion?: string; acceso?: AccesoPortal }
export interface GrupoPortal { id: string; titulo: string; enlaces: readonly EnlacePortal[] }

// Edita aquí títulos, orden, enlaces y grupos. El acceso viaja con cada enlace al moverlo.
// Una ruta nueva debe estar registrada en app/rutas.tsx; este archivo organiza la navegación.
export const gruposPortal: readonly GrupoPortal[] = [
    {
        id: 'administracion', titulo: 'Administración', enlaces: [
            { etiqueta: 'Roles', ruta: '/portal/roles', acceso: { contexto: 'iam', permiso: 'leerRoles' } },
            { etiqueta: 'Usuarios', ruta: '/portal/usuarios', acceso: { contexto: 'iam', permiso: 'leerUsuarios' } },
            { etiqueta: 'Auditoría', ruta: '/portal/auditoria', acceso: { contexto: 'iam', permiso: 'leerAuditoria' } },
        ]
    },
    {
        id: 'comercial', titulo: 'Comercial / CRM', enlaces: [
            { etiqueta: 'Leads', ruta: '/portal/crm/leads', seccion: 'Relaciones comerciales', acceso: { contexto: 'crm', recurso: 'leads' } },
            { etiqueta: 'Contactos', ruta: '/portal/crm/contactos', seccion: 'Relaciones comerciales', acceso: { contexto: 'crm', recurso: 'contactos' } },
            { etiqueta: 'Suscriptores', ruta: '/portal/crm/suscriptores', seccion: 'Relaciones comerciales', acceso: { contexto: 'crm', recurso: 'suscriptores' } },
            { etiqueta: 'Empresas', ruta: '/portal/crm/empresas', seccion: 'Organización', acceso: { contexto: 'crm', recurso: 'empresas' } },
            { etiqueta: 'Sucursales', ruta: '/portal/crm/sucursales', seccion: 'Organización', acceso: { contexto: 'crm', recurso: 'sucursales' } },
        ]
    },
    {
        id: 'catalogo', titulo: 'Catálogo', enlaces: [
            { etiqueta: 'Productos', ruta: '/portal/catalogo/productos', seccion: 'Oferta', acceso: { contexto: 'catalogo', recurso: 'productos' } },
            { etiqueta: 'Categorías', ruta: '/portal/catalogo/categorias', seccion: 'Oferta', acceso: { contexto: 'catalogo', recurso: 'categorias' } },
            { etiqueta: 'Marcas', ruta: '/portal/catalogo/marcas', seccion: 'Oferta', acceso: { contexto: 'catalogo', recurso: 'marcas' } },
            { etiqueta: 'Servicios', ruta: '/portal/catalogo/servicios', seccion: 'Oferta', acceso: { contexto: 'catalogo', recurso: 'servicios' } },
            { etiqueta: 'Industrias', ruta: '/portal/catalogo/industrias', seccion: 'Aplicaciones', acceso: { contexto: 'catalogo', recurso: 'industrias' } },
            { etiqueta: 'Aplicaciones por industria', ruta: '/portal/catalogo/asignaciones-industria', seccion: 'Aplicaciones', acceso: { contexto: 'catalogo', recurso: 'asignaciones-industria' } },
            { etiqueta: 'Tipos de atributo', ruta: '/portal/catalogo/tipos-atributo', seccion: 'Especificaciones técnicas', acceso: { contexto: 'catalogo', recurso: 'tipos-atributo' } },
            { etiqueta: 'Atributos técnicos', ruta: '/portal/catalogo/atributos-tecnicos', seccion: 'Especificaciones técnicas', acceso: { contexto: 'catalogo', recurso: 'atributos-tecnicos' } },
        ]
    },
    {
        id: 'cms', titulo: 'CMS', enlaces: [
            { etiqueta: 'Secciones', ruta: '/portal/cms/contenidos-seccion', seccion: 'Contenido', acceso: { contexto: 'cms', recurso: 'contenidos_seccion' } },
            { etiqueta: 'Registros', ruta: '/portal/cms/registros-cms', seccion: 'Contenido', acceso: { contexto: 'cms', recurso: 'registros_cms' } },
            { etiqueta: 'Tipos de sección', ruta: '/portal/cms/tipos-seccion', seccion: 'Contenido', acceso: { contexto: 'cms', recurso: 'tipos_seccion' } },
            { etiqueta: 'Menús', ruta: '/portal/cms/menus', seccion: 'Navegación pública', acceso: { contexto: 'cms', recurso: 'menus' } },
            { etiqueta: 'Footer', ruta: '/portal/cms/elementos-footer', seccion: 'Navegación pública', acceso: { contexto: 'cms', recurso: 'elementos_footer' } },
            { etiqueta: 'Wizard', ruta: '/portal/cms/pasos-wizard', seccion: 'Sitio', acceso: { contexto: 'cms', recurso: 'pasos_wizard' } },
            { etiqueta: 'Configuración', ruta: '/portal/cms/configuracion-sitio', seccion: 'Sitio', acceso: { contexto: 'cms', recurso: 'configuracion_sitio' } },
        ]
    },
    {
        id: 'cuenta', titulo: 'Mi cuenta', enlaces: [
            { etiqueta: 'Mi perfil y seguridad', ruta: '/portal/mi-perfil' },
        ]
    },
]

export function gruposPermitidos(iam: CapacidadesRoles | null, crm: CapacidadesCrm | null, catalogo: CapacidadesCatalogo | null, cms?: CapacidadesCms | null): GrupoPortal[] {
    return gruposPortal.map(grupo => ({
        ...grupo, enlaces: grupo.enlaces.filter(({ acceso }) => {
            if (!acceso) return true
            if (acceso.contexto === 'iam') return iam?.[acceso.permiso] === true
            if (acceso.contexto === 'crm') return crm?.recursos[acceso.recurso]?.leer === true
            if (acceso.contexto === 'cms') return cms?.recursos[acceso.recurso]?.leer === true
            return catalogo?.recursos[acceso.recurso]?.leer === true
        })
    })).filter(grupo => grupo.enlaces.length > 0)
}
