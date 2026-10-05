import type { PrismaClient } from '../../../generated/prisma/client.js'
import { PrismaAutorizacion } from '../../identity-access-management/infrastructure/prisma-autorizacion.js'
import { ExigirPermiso } from '../../identity-access-management/application/use-cases/autorizacion/exigir-permiso.js'
import { RelojSistema } from '../../identity-access-management/infrastructure/reloj-sistema.js'
import { ObtenerCapacidadesCms } from '../application/use-cases/autorizacion/obtener-capacidades-cms.js'
import { PrismaLecturasCms } from './prisma-lecturas-cms.js'
import { fuentesWizardCmsDesdeEntorno } from './configuracion-cms.js'
import type { FuentesWizardCms } from '../application/validaciones-cms.js'
import type { AutorizacionCapacidadesCms } from '../application/use-cases/autorizacion/obtener-capacidades-cms.js'
import type { RelojCms } from '../application/operaciones-cms.js'
export type OpcionesCms = { fuentesWizard?: FuentesWizardCms; autorizacion?: AutorizacionCapacidadesCms; reloj?: RelojCms }
import { PrismaTiposSeccion } from './prisma-tipo-seccion.js'
import { PrismaContenidosSeccion } from './prisma-contenido-seccion.js'
import { PrismaMenus } from './prisma-menu.js'
import { PrismaItemsMenu } from './prisma-menu-item.js'
import { PrismaElementosFooter } from './prisma-footer-elemento.js'
import { PrismaConfiguracionesSitio } from './prisma-configuracion-sitio.js'
import { PrismaPasosWizard } from './prisma-paso-wizard.js'
import { PrismaRegistrosCMS } from './prisma-registro-cms.js'
import { PrismaContenidosRegistro } from './prisma-contenido-registro.js'
import { PrismaMetadataSeccion } from './prisma-metadata-seccion.js'
import { ActivarTipoSeccion } from '../application/use-cases/tipos-seccion/activar-tipo-seccion.js'
import { CambiarClavesTipoSeccion } from '../application/use-cases/tipos-seccion/cambiar-claves-tipo-seccion.js'
import { CrearTipoSeccion } from '../application/use-cases/tipos-seccion/crear-tipo-seccion.js'
import { EditarTipoSeccion } from '../application/use-cases/tipos-seccion/editar-tipo-seccion.js'
import { EliminarTipoSeccion } from '../application/use-cases/tipos-seccion/eliminar-tipo-seccion.js'
import { InactivarTipoSeccion } from '../application/use-cases/tipos-seccion/inactivar-tipo-seccion.js'
import { ListarTiposSeccion } from '../application/use-cases/tipos-seccion/listar-tipos-seccion.js'
import { ObtenerTipoSeccion } from '../application/use-cases/tipos-seccion/obtener-tipo-seccion.js'
import { ReordenarTipoSeccion } from '../application/use-cases/tipos-seccion/reordenar-tipo-seccion.js'
import { ActivarContenidoSeccion } from '../application/use-cases/contenidos-seccion/activar-contenido-seccion.js'
import { CrearContenidoSeccion } from '../application/use-cases/contenidos-seccion/crear-contenido-seccion.js'
import { EditarContenidoSeccion } from '../application/use-cases/contenidos-seccion/editar-contenido-seccion.js'
import { EliminarContenidoSeccion } from '../application/use-cases/contenidos-seccion/eliminar-contenido-seccion.js'
import { FijarVisibilidadContenidoSeccion } from '../application/use-cases/contenidos-seccion/fijar-visibilidad-contenido-seccion.js'
import { InactivarContenidoSeccion } from '../application/use-cases/contenidos-seccion/inactivar-contenido-seccion.js'
import { ListarContenidosSeccion } from '../application/use-cases/contenidos-seccion/listar-contenidos-seccion.js'
import { ObtenerContenidoSeccion } from '../application/use-cases/contenidos-seccion/obtener-contenido-seccion.js'
import { ReordenarContenidoSeccion } from '../application/use-cases/contenidos-seccion/reordenar-contenido-seccion.js'
import { ActivarMenu } from '../application/use-cases/menus/activar-menu.js'
import { CrearMenu } from '../application/use-cases/menus/crear-menu.js'
import { EditarMenu } from '../application/use-cases/menus/editar-menu.js'
import { EliminarMenu } from '../application/use-cases/menus/eliminar-menu.js'
import { FijarVisibilidadMenu } from '../application/use-cases/menus/fijar-visibilidad-menu.js'
import { InactivarMenu } from '../application/use-cases/menus/inactivar-menu.js'
import { ListarMenus } from '../application/use-cases/menus/listar-menus.js'
import { ObtenerMenu } from '../application/use-cases/menus/obtener-menu.js'
import { ReordenarMenu } from '../application/use-cases/menus/reordenar-menu.js'
import { ActivarMenuItem } from '../application/use-cases/items-menu/activar-menu-item.js'
import { CrearMenuItem } from '../application/use-cases/items-menu/crear-menu-item.js'
import { EditarMenuItem } from '../application/use-cases/items-menu/editar-menu-item.js'
import { EliminarMenuItem } from '../application/use-cases/items-menu/eliminar-menu-item.js'
import { InactivarMenuItem } from '../application/use-cases/items-menu/inactivar-menu-item.js'
import { ListarItemsMenu } from '../application/use-cases/items-menu/listar-items-menu.js'
import { ObtenerMenuItem } from '../application/use-cases/items-menu/obtener-menu-item.js'
import { ReordenarMenuItem } from '../application/use-cases/items-menu/reordenar-menu-item.js'
import { ActivarFooterElemento } from '../application/use-cases/elementos-footer/activar-footer-elemento.js'
import { CrearFooterElemento } from '../application/use-cases/elementos-footer/crear-footer-elemento.js'
import { EditarFooterElemento } from '../application/use-cases/elementos-footer/editar-footer-elemento.js'
import { EliminarFooterElemento } from '../application/use-cases/elementos-footer/eliminar-footer-elemento.js'
import { FijarVisibilidadFooterElemento } from '../application/use-cases/elementos-footer/fijar-visibilidad-footer-elemento.js'
import { InactivarFooterElemento } from '../application/use-cases/elementos-footer/inactivar-footer-elemento.js'
import { ListarElementosFooter } from '../application/use-cases/elementos-footer/listar-elementos-footer.js'
import { ObtenerFooterElemento } from '../application/use-cases/elementos-footer/obtener-footer-elemento.js'
import { ReordenarFooterElemento } from '../application/use-cases/elementos-footer/reordenar-footer-elemento.js'
import { CambiarActividadConfiguracionSitio } from '../application/use-cases/configuracion-sitio/cambiar-actividad-configuracion-sitio.js'
import { CrearConfiguracionSitio } from '../application/use-cases/configuracion-sitio/crear-configuracion-sitio.js'
import { EditarConfiguracionSitio } from '../application/use-cases/configuracion-sitio/editar-configuracion-sitio.js'
import { ListarConfiguracionesSitio } from '../application/use-cases/configuracion-sitio/listar-configuracion-sitio.js'
import { ObtenerConfiguracionSitio } from '../application/use-cases/configuracion-sitio/obtener-configuracion-sitio.js'
import { ActivarPasoWizard } from '../application/use-cases/pasos-wizard/activar-paso-wizard.js'
import { CrearPasoWizard } from '../application/use-cases/pasos-wizard/crear-paso-wizard.js'
import { EditarPasoWizard } from '../application/use-cases/pasos-wizard/editar-paso-wizard.js'
import { EliminarPasoWizard } from '../application/use-cases/pasos-wizard/eliminar-paso-wizard.js'
import { InactivarPasoWizard } from '../application/use-cases/pasos-wizard/inactivar-paso-wizard.js'
import { ListarPasosWizard } from '../application/use-cases/pasos-wizard/listar-pasos-wizard.js'
import { ObtenerPasoWizard } from '../application/use-cases/pasos-wizard/obtener-paso-wizard.js'
import { ReordenarPasoWizard } from '../application/use-cases/pasos-wizard/reordenar-paso-wizard.js'
import { ActivarRegistroCMS } from '../application/use-cases/registros-cms/activar-registro-cms.js'
import { CrearRegistroCMS } from '../application/use-cases/registros-cms/crear-registro-cms.js'
import { EditarRegistroCMS } from '../application/use-cases/registros-cms/editar-registro-cms.js'
import { EliminarRegistroCMS } from '../application/use-cases/registros-cms/eliminar-registro-cms.js'
import { InactivarRegistroCMS } from '../application/use-cases/registros-cms/inactivar-registro-cms.js'
import { ListarRegistrosCMS } from '../application/use-cases/registros-cms/listar-registros-cms.js'
import { ObtenerRegistroCMS } from '../application/use-cases/registros-cms/obtener-registro-cms.js'
import { ReordenarRegistroCMS } from '../application/use-cases/registros-cms/reordenar-registro-cms.js'
import { ActivarContenidoRegistro } from '../application/use-cases/contenidos-registro/activar-contenido-registro.js'
import { CrearContenidoRegistro } from '../application/use-cases/contenidos-registro/crear-contenido-registro.js'
import { EditarContenidoRegistro } from '../application/use-cases/contenidos-registro/editar-contenido-registro.js'
import { EliminarContenidoRegistro } from '../application/use-cases/contenidos-registro/eliminar-contenido-registro.js'
import { InactivarContenidoRegistro } from '../application/use-cases/contenidos-registro/inactivar-contenido-registro.js'
import { ListarContenidosRegistro } from '../application/use-cases/contenidos-registro/listar-contenidos-registro.js'
import { ObtenerContenidoRegistro } from '../application/use-cases/contenidos-registro/obtener-contenido-registro.js'
import { ReordenarContenidoRegistro } from '../application/use-cases/contenidos-registro/reordenar-contenido-registro.js'
import { ObtenerMetadataSeccion } from '../application/use-cases/metadata-seccion/obtener-metadata-seccion.js'
import { ReemplazarMetadataSeccion } from '../application/use-cases/metadata-seccion/reemplazar-metadata-seccion.js'

export function componerCms(db: PrismaClient, opciones: OpcionesCms = {}) {
  const auth = opciones.autorizacion ?? new ExigirPermiso(new PrismaAutorizacion(db))
  const reloj = opciones.reloj ?? new RelojSistema()
  const fuentes = opciones.fuentesWizard ?? fuentesWizardCmsDesdeEntorno()
  const tipos_seccion = new PrismaTiposSeccion(db)
  const contenidos_seccion = new PrismaContenidosSeccion(db)
  const menus = new PrismaMenus(db)
  const items_menu = new PrismaItemsMenu(db)
  const elementos_footer = new PrismaElementosFooter(db)
  const configuracion_sitio = new PrismaConfiguracionesSitio(db)
  const pasos_wizard = new PrismaPasosWizard(db)
  const registros_cms = new PrismaRegistrosCMS(db)
  const contenidos_registro = new PrismaContenidosRegistro(db)
  const metadata_seccion = new PrismaMetadataSeccion(db)
  return {
    capacidades: new ObtenerCapacidadesCms(auth),
    registrarLectura: new PrismaLecturasCms(db, reloj),
    'tipos-seccion': {
      activar: new ActivarTipoSeccion(tipos_seccion, auth, reloj),
      cambiarClaves: new CambiarClavesTipoSeccion(tipos_seccion, auth, reloj),
      crear: new CrearTipoSeccion(tipos_seccion, auth, reloj),
      editar: new EditarTipoSeccion(tipos_seccion, auth, reloj),
      eliminar: new EliminarTipoSeccion(tipos_seccion, auth, reloj),
      inactivar: new InactivarTipoSeccion(tipos_seccion, auth, reloj),
      listar: new ListarTiposSeccion(tipos_seccion, auth),
      obtener: new ObtenerTipoSeccion(tipos_seccion, auth),
      reordenar: new ReordenarTipoSeccion(tipos_seccion, auth, reloj),
    },
    'contenidos-seccion': {
      activar: new ActivarContenidoSeccion(contenidos_seccion, auth, reloj),
      crear: new CrearContenidoSeccion(contenidos_seccion, auth, reloj, tipos_seccion),
      editar: new EditarContenidoSeccion(contenidos_seccion, auth, reloj, tipos_seccion),
      eliminar: new EliminarContenidoSeccion(contenidos_seccion, auth, reloj),
      fijarVisibilidad: new FijarVisibilidadContenidoSeccion(contenidos_seccion, auth, reloj),
      inactivar: new InactivarContenidoSeccion(contenidos_seccion, auth, reloj),
      listar: new ListarContenidosSeccion(contenidos_seccion, auth),
      obtener: new ObtenerContenidoSeccion(contenidos_seccion, auth),
      reordenar: new ReordenarContenidoSeccion(contenidos_seccion, auth, reloj),
    },
    'menus': {
      activar: new ActivarMenu(menus, auth, reloj),
      crear: new CrearMenu(menus, auth, reloj),
      editar: new EditarMenu(menus, auth, reloj),
      eliminar: new EliminarMenu(menus, auth, reloj),
      fijarVisibilidad: new FijarVisibilidadMenu(menus, auth, reloj),
      inactivar: new InactivarMenu(menus, auth, reloj),
      listar: new ListarMenus(menus, auth),
      obtener: new ObtenerMenu(menus, auth),
      reordenar: new ReordenarMenu(menus, auth, reloj),
    },
    'items-menu': {
      activar: new ActivarMenuItem(items_menu, auth, reloj, menus),
      crear: new CrearMenuItem(items_menu, auth, reloj, menus),
      editar: new EditarMenuItem(items_menu, auth, reloj, menus),
      eliminar: new EliminarMenuItem(items_menu, auth, reloj, menus),
      inactivar: new InactivarMenuItem(items_menu, auth, reloj, menus),
      listar: new ListarItemsMenu(items_menu, auth),
      obtener: new ObtenerMenuItem(items_menu, auth),
      reordenar: new ReordenarMenuItem(items_menu, auth, reloj, menus),
    },
    'elementos-footer': {
      activar: new ActivarFooterElemento(elementos_footer, auth, reloj),
      crear: new CrearFooterElemento(elementos_footer, auth, reloj),
      editar: new EditarFooterElemento(elementos_footer, auth, reloj),
      eliminar: new EliminarFooterElemento(elementos_footer, auth, reloj),
      fijarVisibilidad: new FijarVisibilidadFooterElemento(elementos_footer, auth, reloj),
      inactivar: new InactivarFooterElemento(elementos_footer, auth, reloj),
      listar: new ListarElementosFooter(elementos_footer, auth),
      obtener: new ObtenerFooterElemento(elementos_footer, auth),
      reordenar: new ReordenarFooterElemento(elementos_footer, auth, reloj),
    },
    'configuracion-sitio': {
      cambiarActividad: new CambiarActividadConfiguracionSitio(configuracion_sitio, auth, reloj),
      crear: new CrearConfiguracionSitio(configuracion_sitio, auth, reloj),
      editar: new EditarConfiguracionSitio(configuracion_sitio, auth, reloj),
      listar: new ListarConfiguracionesSitio(configuracion_sitio, auth),
      obtener: new ObtenerConfiguracionSitio(configuracion_sitio, auth),
    },
    'pasos-wizard': {
      activar: new ActivarPasoWizard(pasos_wizard, auth, reloj, fuentes),
      crear: new CrearPasoWizard(pasos_wizard, auth, reloj, fuentes),
      editar: new EditarPasoWizard(pasos_wizard, auth, reloj, fuentes),
      eliminar: new EliminarPasoWizard(pasos_wizard, auth, reloj),
      inactivar: new InactivarPasoWizard(pasos_wizard, auth, reloj),
      listar: new ListarPasosWizard(pasos_wizard, auth),
      obtener: new ObtenerPasoWizard(pasos_wizard, auth),
      reordenar: new ReordenarPasoWizard(pasos_wizard, auth, reloj),
    },
    'registros-cms': {
      activar: new ActivarRegistroCMS(registros_cms, auth, reloj),
      crear: new CrearRegistroCMS(registros_cms, auth, reloj),
      editar: new EditarRegistroCMS(registros_cms, auth, reloj),
      eliminar: new EliminarRegistroCMS(registros_cms, auth, reloj),
      inactivar: new InactivarRegistroCMS(registros_cms, auth, reloj),
      listar: new ListarRegistrosCMS(registros_cms, auth),
      obtener: new ObtenerRegistroCMS(registros_cms, auth),
      reordenar: new ReordenarRegistroCMS(registros_cms, auth, reloj),
    },
    'contenidos-registro': {
      activar: new ActivarContenidoRegistro(contenidos_registro, auth, reloj),
      crear: new CrearContenidoRegistro(contenidos_registro, auth, reloj),
      editar: new EditarContenidoRegistro(contenidos_registro, auth, reloj),
      eliminar: new EliminarContenidoRegistro(contenidos_registro, auth, reloj),
      inactivar: new InactivarContenidoRegistro(contenidos_registro, auth, reloj),
      listar: new ListarContenidosRegistro(contenidos_registro, auth),
      obtener: new ObtenerContenidoRegistro(contenidos_registro, auth),
      reordenar: new ReordenarContenidoRegistro(contenidos_registro, auth, reloj),
    },
    'metadata-seccion': {
      obtener: new ObtenerMetadataSeccion(metadata_seccion, auth, contenidos_seccion),
      reemplazar: new ReemplazarMetadataSeccion(metadata_seccion, auth, reloj, contenidos_seccion, tipos_seccion),
    },
  }
}
export type CasosCms = ReturnType<typeof componerCms>
