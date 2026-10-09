// CMS: integración explícita y navegación central v2
import { PortalCms } from '../features/cms/presentation/portal-cms'
import { InicioCms } from '../features/cms/presentation/inicio-cms'
import { ListadoTipoSeccion } from '../features/cms/presentation/listado-tipos-seccion'
import { ListadoContenidoSeccion } from '../features/cms/presentation/listado-contenidos-seccion'
import { ListadoMenu } from '../features/cms/presentation/listado-menus'
import { ListadoMenuItem } from '../features/cms/presentation/listado-items-menu'
import { ListadoFooterElemento } from '../features/cms/presentation/listado-elementos-footer'
import { ListadoConfiguracionSitio } from '../features/cms/presentation/listado-configuracion-sitio'
import { ListadoPasoWizard } from '../features/cms/presentation/listado-pasos-wizard'
import { ListadoRegistroCMS } from '../features/cms/presentation/listado-registros-cms'
import { ListadoContenidoRegistro } from '../features/cms/presentation/listado-contenidos-registro'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { VistaAsignacionesAtributo } from '../features/catalog/presentation/vista-asignaciones-atributo'
import { VistaAsignacionesIndustria } from '../features/catalog/presentation/vista-asignaciones-industria'
import { VistaAsignacionesMarca } from '../features/catalog/presentation/vista-asignaciones-marca'
import { VistaAtributosTecnicos } from '../features/catalog/presentation/vista-atributos-tecnicos'
import { VistaCategorias } from '../features/catalog/presentation/vista-categorias'
import { VistaIndustrias } from '../features/catalog/presentation/vista-industrias'
import { VistaMarcas } from '../features/catalog/presentation/vista-marcas'
import { VistaProductos } from '../features/catalog/presentation/vista-productos'
import { VistaServicios } from '../features/catalog/presentation/vista-servicios'
import { VistaTiposAtributo } from '../features/catalog/presentation/vista-tipos-atributo'
import { VistaContactos } from '../features/commercial/presentation/vista-contactos'
import { VistaEmpresas } from '../features/commercial/presentation/vista-empresas'
import { VistaLeads } from '../features/commercial/presentation/vista-leads'
import { VistaSucursales } from '../features/commercial/presentation/vista-sucursales'
import { VistaSuscriptores } from '../features/commercial/presentation/vista-suscriptores'
import { AccesoPortal } from '../features/iam/presentation/acceso-portal'
import { ListadoAuditoria } from '../features/iam/presentation/listado-auditoria'
import { ListadoRoles } from '../features/iam/presentation/listado-roles'
import { ListadoUsuarios } from '../features/iam/presentation/listado-usuarios'
import { MarcoPortal } from '../features/iam/presentation/marco-portal'
import { PortalBase } from '../features/iam/presentation/portal-base'
import { PortalProtegido } from '../features/iam/presentation/portal-protegido'
import { ProveedorSesion } from '../features/iam/presentation/sesion-portal'
import { TemaPortal } from '../features/iam/presentation/tema-portal'
import { VistaMiPerfil } from '../features/iam/presentation/vista-mi-perfil'
import { PortadaTemporal } from './portada-temporal'

export function Rutas() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<PortadaTemporal />} />
    <Route path="/portal" element={<TemaPortal><ProveedorSesion><Outlet /></ProveedorSesion></TemaPortal>}>
      <Route path="acceso" element={<AccesoPortal />} />
      <Route element={<PortalProtegido />}>
        <Route element={<MarcoPortal />}>
          <Route index element={<PortalBase />} />
          <Route element={<PortalCms />}>
            <Route path="cms" element={<InicioCms />} />
            <Route path="cms/tipos-seccion" element={<ListadoTipoSeccion />} />
            <Route path="cms/contenidos-seccion" element={<ListadoContenidoSeccion />} />
            <Route path="cms/menus" element={<ListadoMenu />} />
            <Route path="cms/items-menu" element={<ListadoMenuItem />} />
            <Route path="cms/elementos-footer" element={<ListadoFooterElemento />} />
            <Route path="cms/configuracion-sitio" element={<ListadoConfiguracionSitio />} />
            <Route path="cms/pasos-wizard" element={<ListadoPasoWizard />} />
            <Route path="cms/registros-cms" element={<ListadoRegistroCMS />} />
            <Route path="cms/contenidos-registro" element={<ListadoContenidoRegistro />} />
          </Route>
          <Route path="roles" element={<ListadoRoles />} />
          <Route path="roles/:id" element={<ListadoRoles />} />
          <Route path="usuarios" element={<ListadoUsuarios />} />
          <Route path="usuarios/:id" element={<ListadoUsuarios />} />
          <Route path="auditoria" element={<ListadoAuditoria />} />
          <Route path="mi-perfil" element={<VistaMiPerfil />} />
          <Route path="crm/empresas" element={<VistaEmpresas />} />
          <Route path="crm/empresas/:id" element={<VistaEmpresas />} />
          <Route path="crm/sucursales" element={<VistaSucursales />} />
          <Route path="crm/sucursales/:id" element={<VistaSucursales />} />
          <Route path="crm/contactos" element={<VistaContactos />} />
          <Route path="crm/contactos/:id" element={<VistaContactos />} />
          <Route path="crm/suscriptores" element={<VistaSuscriptores />} />
          <Route path="crm/suscriptores/:id" element={<VistaSuscriptores />} />
          <Route path="crm/leads" element={<VistaLeads />} />
          <Route path="crm/leads/:id" element={<VistaLeads />} />
          <Route path="catalogo/productos" element={<VistaProductos />} />
          <Route path="catalogo/productos/:id" element={<VistaProductos />} />
          <Route path="catalogo/categorias" element={<VistaCategorias />} />
          <Route path="catalogo/categorias/:id" element={<VistaCategorias />} />
          <Route path="catalogo/marcas" element={<VistaMarcas />} />
          <Route path="catalogo/marcas/:id" element={<VistaMarcas />} />
          <Route path="catalogo/tipos-atributo" element={<VistaTiposAtributo />} />
          <Route path="catalogo/tipos-atributo/:id" element={<VistaTiposAtributo />} />
          <Route path="catalogo/atributos-tecnicos" element={<VistaAtributosTecnicos />} />
          <Route path="catalogo/atributos-tecnicos/:id" element={<VistaAtributosTecnicos />} />
          <Route path="catalogo/industrias" element={<VistaIndustrias />} />
          <Route path="catalogo/industrias/:id" element={<VistaIndustrias />} />
          <Route path="catalogo/servicios" element={<VistaServicios />} />
          <Route path="catalogo/servicios/:id" element={<VistaServicios />} />
          <Route path="catalogo/asignaciones-marca" element={<VistaAsignacionesMarca />} />
          <Route path="catalogo/asignaciones-marca/:id" element={<VistaAsignacionesMarca />} />
          <Route path="catalogo/asignaciones-atributo" element={<VistaAsignacionesAtributo />} />
          <Route path="catalogo/asignaciones-atributo/:id" element={<VistaAsignacionesAtributo />} />
          <Route path="catalogo/asignaciones-industria" element={<VistaAsignacionesIndustria />} />
          <Route path="catalogo/asignaciones-industria/:id" element={<VistaAsignacionesIndustria />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}
