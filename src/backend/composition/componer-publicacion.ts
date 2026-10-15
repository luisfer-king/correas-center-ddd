import { RecibirContactoPublico } from '../contexts/commercial/application/use-cases/publico/recibir-contacto.js'
import { RecibirSuscripcionPublica } from '../contexts/commercial/application/use-cases/publico/recibir-suscripcion.js'
import { PrismaRecepcionContactosPublicos } from '../contexts/commercial/infrastructure/prisma-recepcion-contactos-publicos.js'
import { PrismaRecepcionSuscripcionesPublicas } from '../contexts/commercial/infrastructure/prisma-recepcion-suscripciones-publicas.js'
import { registrarCaptacionPublica } from '../contexts/commercial/presentation/rutas-captacion-publica.js'
import { PrismaPublicoSoluciones } from '../contexts/catalog-management/infrastructure/prisma-publico-soluciones.js'
import { LeerIndustria, LeerServicio } from '../contexts/catalog-management/application/use-cases/publico/leer-soluciones.js'
import { registrarLecturaPublica } from '../shared/presentation/lecturas-publicas-http.js'
import type { PrismaClient } from '../generated/prisma/client.js'
import type { FastifyInstance } from 'fastify'
import { PrismaPublicoDestinos } from '../contexts/catalog-management/infrastructure/prisma-publico-destinos.js'
import { PrismaPublicoEmpresa } from '../contexts/commercial/infrastructure/prisma-publico-empresa.js'
import { LeerEmpresa } from '../contexts/commercial/application/use-cases/publico/leer-empresa.js'
import { registrarEmpresaPublico } from '../contexts/commercial/presentation/rutas-publicas-empresa.js'
import { PrismaPublicoSucursales } from '../contexts/commercial/infrastructure/prisma-publico-sucursales.js'
import { LeerSucursales } from '../contexts/commercial/application/use-cases/publico/leer-sucursales.js'
import { registrarSucursalesPublico } from '../contexts/commercial/presentation/rutas-publicas-sucursales.js'
import { PrismaPublicoProductos } from '../contexts/catalog-management/infrastructure/prisma-publico-productos.js'
import { LeerProductos } from '../contexts/catalog-management/application/use-cases/publico/leer-productos.js'
import { registrarProductosPublico } from '../contexts/catalog-management/presentation/rutas-publicas-productos.js'
import { PrismaPublicoMarcas } from '../contexts/catalog-management/infrastructure/prisma-publico-marcas.js'
import { LeerMarcas } from '../contexts/catalog-management/application/use-cases/publico/leer-marcas.js'
import { registrarMarcasPublico } from '../contexts/catalog-management/presentation/rutas-publicas-marcas.js'
import { PrismaPublicoIndustrias } from '../contexts/catalog-management/infrastructure/prisma-publico-industrias.js'
import { LeerIndustrias } from '../contexts/catalog-management/application/use-cases/publico/leer-industrias.js'
import { registrarIndustriasPublico } from '../contexts/catalog-management/presentation/rutas-publicas-industrias.js'
import { PrismaPublicoServicios } from '../contexts/catalog-management/infrastructure/prisma-publico-servicios.js'
import { LeerServicios } from '../contexts/catalog-management/application/use-cases/publico/leer-servicios.js'
import { registrarServiciosPublico } from '../contexts/catalog-management/presentation/rutas-publicas-servicios.js'
import { PrismaPublicoSecciones } from '../contexts/content-management-system/infrastructure/prisma-publico-secciones.js'
import { LeerSecciones } from '../contexts/content-management-system/application/use-cases/publico/leer-secciones.js'
import { registrarSeccionesPublico } from '../contexts/content-management-system/presentation/rutas-publicas-secciones.js'
import { PrismaPublicoFooter } from '../contexts/content-management-system/infrastructure/prisma-publico-footer.js'
import { LeerFooter } from '../contexts/content-management-system/application/use-cases/publico/leer-footer.js'
import { registrarFooterPublico } from '../contexts/content-management-system/presentation/rutas-publicas-footer.js'
import { PrismaPublicoPasosWizard } from '../contexts/content-management-system/infrastructure/prisma-publico-pasos-wizard.js'
import { LeerPasosWizard } from '../contexts/content-management-system/application/use-cases/publico/leer-pasos-wizard.js'
import { registrarPasosWizardPublico } from '../contexts/content-management-system/presentation/rutas-publicas-pasos-wizard.js'
import { PrismaPublicoRegistros } from '../contexts/content-management-system/infrastructure/prisma-publico-registros.js'
import { LeerRegistros } from '../contexts/content-management-system/application/use-cases/publico/leer-registros.js'
import { registrarRegistrosPublico } from '../contexts/content-management-system/presentation/rutas-publicas-registros.js'
import { PrismaPublicoDetalleProducto } from '../contexts/catalog-management/infrastructure/prisma-publico-detalle-producto.js'
import { LeerDetalleProducto } from '../contexts/catalog-management/application/use-cases/publico/leer-detalle-producto.js'
import { registrarDetalleProductoPublico } from '../contexts/catalog-management/presentation/rutas-publicas-detalle-producto.js'
import { PrismaPublicoCategorias } from '../contexts/catalog-management/infrastructure/prisma-publico-categorias.js'
import { LeerCategorias } from '../contexts/catalog-management/application/use-cases/publico/leer-categorias.js'
import { registrarCategoriasPublico } from '../contexts/catalog-management/presentation/rutas-publicas-categorias.js'
import { PrismaPublicoMenus } from '../contexts/content-management-system/infrastructure/prisma-publico-menus.js'
import { LeerMenus } from '../contexts/content-management-system/application/use-cases/publico/leer-menus.js'
import { registrarMenusPublico } from '../contexts/content-management-system/presentation/rutas-publicas-menus.js'
import { PrismaPublicoConfiguracion } from '../contexts/content-management-system/infrastructure/prisma-publico-configuracion.js'
import { LeerConfiguracion } from '../contexts/content-management-system/application/use-cases/publico/leer-configuracion.js'
import { registrarConfiguracionPublico } from '../contexts/content-management-system/presentation/rutas-publicas-configuracion.js'
import { PrismaPublicoAccesoDetalle } from '../contexts/content-management-system/infrastructure/prisma-publico-acceso-detalle.js'
import { PrismaPublicoGamas } from '../contexts/catalog-management/infrastructure/prisma-publico-gamas.js'
import { LeerGamaCategoria } from '../contexts/catalog-management/application/use-cases/publico/leer-gama-categoria.js'
import { registrarGamaPublico } from '../contexts/catalog-management/presentation/rutas-publicas-gamas.js'
export function componerPublicacion(db: PrismaClient) {
 const empresas = new PrismaPublicoEmpresa(db)
 const destinos = new PrismaPublicoDestinos(db)
 const acceso=new PrismaPublicoAccesoDetalle(db)
 return {
  recibir_contacto:new RecibirContactoPublico(empresas,new PrismaRecepcionContactosPublicos(db)),
  recibir_suscripcion:new RecibirSuscripcionPublica(empresas,new PrismaRecepcionSuscripcionesPublicas(db)),
  detalle_industria: new LeerIndustria(empresas,new PrismaPublicoSoluciones(db)),
  detalle_servicio: new LeerServicio(empresas,new PrismaPublicoSoluciones(db)),
  gama: new LeerGamaCategoria(empresas,new PrismaPublicoGamas(db),acceso),
  empresa: new LeerEmpresa(empresas, new PrismaPublicoEmpresa(db)),
  sucursales: new LeerSucursales(empresas, new PrismaPublicoSucursales(db)),
  productos: new LeerProductos(empresas, new PrismaPublicoProductos(db)),
  marcas: new LeerMarcas(empresas, new PrismaPublicoMarcas(db)),
  industrias: new LeerIndustrias(empresas, new PrismaPublicoIndustrias(db)),
  servicios: new LeerServicios(empresas, new PrismaPublicoServicios(db)),
  secciones: new LeerSecciones(empresas, new PrismaPublicoSecciones(db)),
  footer: new LeerFooter(empresas, new PrismaPublicoFooter(db), destinos),
  pasos_wizard: new LeerPasosWizard(empresas, new PrismaPublicoPasosWizard(db)),
  registros: new LeerRegistros(empresas, new PrismaPublicoRegistros(db)),
  detalle_producto: new LeerDetalleProducto(empresas, new PrismaPublicoDetalleProducto(db),acceso),
  categorias: new LeerCategorias(empresas, new PrismaPublicoCategorias(db),acceso),
  menus: new LeerMenus(empresas, new PrismaPublicoMenus(db), destinos),
  configuracion: new LeerConfiguracion(empresas, new PrismaPublicoConfiguracion(db)),
 }
}
export type CasosPublicacion = ReturnType<typeof componerPublicacion>
export function registrarPublicacion(app: FastifyInstance, casos: CasosPublicacion, empresaId: bigint, origen = 'http://localhost:5173') {
 registrarCaptacionPublica(app,casos.recibir_contacto,casos.recibir_suscripcion,empresaId,origen)
 registrarLecturaPublica(app,'/api/publico/catalogo/industrias/:slug',casos.detalle_industria,empresaId,'slug','CATALOGO público')
 registrarLecturaPublica(app,'/api/publico/catalogo/servicios/:slug',casos.detalle_servicio,empresaId,'slug','CATALOGO público')
 registrarGamaPublico(app,casos.gama,empresaId)
 registrarEmpresaPublico(app, casos.empresa, empresaId)
 registrarSucursalesPublico(app, casos.sucursales, empresaId)
 registrarProductosPublico(app, casos.productos, empresaId)
 registrarMarcasPublico(app, casos.marcas, empresaId)
 registrarIndustriasPublico(app, casos.industrias, empresaId)
 registrarServiciosPublico(app, casos.servicios, empresaId)
 registrarSeccionesPublico(app, casos.secciones, empresaId)
 registrarFooterPublico(app, casos.footer, empresaId)
 registrarPasosWizardPublico(app, casos.pasos_wizard, empresaId)
 registrarRegistrosPublico(app, casos.registros, empresaId)
 registrarDetalleProductoPublico(app, casos.detalle_producto, empresaId)
 registrarCategoriasPublico(app, casos.categorias, empresaId)
 registrarMenusPublico(app, casos.menus, empresaId)
 registrarConfiguracionPublico(app, casos.configuracion, empresaId)
}
