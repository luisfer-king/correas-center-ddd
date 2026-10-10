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
export interface EnlacePortal { etiqueta: string; ruta: string; acceso?: AccesoPortal }
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
            { etiqueta: 'Empresas', ruta: '/portal/crm/empresas', acceso: { contexto: 'crm', recurso: 'empresas' } },
            { etiqueta: 'Sucursales', ruta: '/portal/crm/sucursales', acceso: { contexto: 'crm', recurso: 'sucursales' } },
            { etiqueta: 'Contactos', ruta: '/portal/crm/contactos', acceso: { contexto: 'crm', recurso: 'contactos' } },
            { etiqueta: 'Suscriptores', ruta: '/portal/crm/suscriptores', acceso: { contexto: 'crm', recurso: 'suscriptores' } },
            { etiqueta: 'Leads', ruta: '/portal/crm/leads', acceso: { contexto: 'crm', recurso: 'leads' } },
        ]
    },
    {
        id: 'catalogo', titulo: 'Catálogo', enlaces: [
            { etiqueta: 'Productos', ruta: '/portal/catalogo/productos', acceso: { contexto: 'catalogo', recurso: 'productos' } },
            { etiqueta: 'Categorías', ruta: '/portal/catalogo/categorias', acceso: { contexto: 'catalogo', recurso: 'categorias' } },
            { etiqueta: 'Marcas', ruta: '/portal/catalogo/marcas', acceso: { contexto: 'catalogo', recurso: 'marcas' } },
            { etiqueta: 'Industrias', ruta: '/portal/catalogo/industrias', acceso: { contexto: 'catalogo', recurso: 'industrias' } },
            { etiqueta: 'Servicios', ruta: '/portal/catalogo/servicios', acceso: { contexto: 'catalogo', recurso: 'servicios' } },
            { etiqueta: 'Tipos de atributo', ruta: '/portal/catalogo/tipos-atributo', acceso: { contexto: 'catalogo', recurso: 'tipos-atributo' } },
            { etiqueta: 'Atributos técnicos', ruta: '/portal/catalogo/atributos-tecnicos', acceso: { contexto: 'catalogo', recurso: 'atributos-tecnicos' } },
            { etiqueta: 'Marcas de productos', ruta: '/portal/catalogo/asignaciones-marca', acceso: { contexto: 'catalogo', recurso: 'asignaciones-marca' } },
            { etiqueta: 'Atributos de categorías', ruta: '/portal/catalogo/asignaciones-atributo', acceso: { contexto: 'catalogo', recurso: 'asignaciones-atributo' } },
            { etiqueta: 'Industrias de categorías y servicios', ruta: '/portal/catalogo/asignaciones-industria', acceso: { contexto: 'catalogo', recurso: 'asignaciones-industria' } },
        ]
    },
    {
        id: 'cms', titulo: 'CMS', enlaces: [
            { etiqueta: 'Tipos de sección', ruta: '/portal/cms/tipos-seccion', acceso: { contexto: 'cms', recurso: 'tipos_seccion' } },
            { etiqueta: 'Secciones', ruta: '/portal/cms/contenidos-seccion', acceso: { contexto: 'cms', recurso: 'contenidos_seccion' } },
            { etiqueta: 'Menús', ruta: '/portal/cms/menus', acceso: { contexto: 'cms', recurso: 'menus' } },
            
            { etiqueta: 'Wizard', ruta: '/portal/cms/pasos-wizard', acceso: { contexto: 'cms', recurso: 'pasos_wizard' } },
            { etiqueta: 'Registros', ruta: '/portal/cms/registros-cms', acceso: { contexto: 'cms', recurso: 'registros_cms' } },
            { etiqueta: 'Footer', ruta: '/portal/cms/elementos-footer', acceso: { contexto: 'cms', recurso: 'elementos_footer' } },
            { etiqueta: 'Configuración', ruta: '/portal/cms/configuracion-sitio', acceso: { contexto: 'cms', recurso: 'configuracion_sitio' } },
            
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
