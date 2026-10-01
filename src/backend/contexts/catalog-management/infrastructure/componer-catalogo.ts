import type { PrismaClient } from '../../../generated/prisma/client.js'
import { ExigirPermiso } from '../../identity-access-management/application/use-cases/autorizacion/exigir-permiso.js'
import { PrismaAuditoria } from '../../identity-access-management/infrastructure/prisma-auditoria.js'
import { PrismaAutorizacion } from '../../identity-access-management/infrastructure/prisma-autorizacion.js'
import { RelojSistema } from '../../identity-access-management/infrastructure/reloj-sistema.js'
import { ActivarAsignacionAtributo } from '../application/use-cases/asignaciones-atributo/activar-asignacion-atributo.js'
import { CrearAsignacionAtributo } from '../application/use-cases/asignaciones-atributo/crear-asignacion-atributo.js'
import { EditarAsignacionAtributo } from '../application/use-cases/asignaciones-atributo/editar-asignacion-atributo.js'
import { EliminarAsignacionAtributo } from '../application/use-cases/asignaciones-atributo/eliminar-asignacion-atributo.js'
import { InactivarAsignacionAtributo } from '../application/use-cases/asignaciones-atributo/inactivar-asignacion-atributo.js'
import { ListarAsignacionesAtributo } from '../application/use-cases/asignaciones-atributo/listar-asignaciones-atributo.js'
import { ObtenerAsignacionAtributo } from '../application/use-cases/asignaciones-atributo/obtener-asignacion-atributo.js'
import { ActivarAsignacionIndustria } from '../application/use-cases/asignaciones-industria/activar-asignacion-industria.js'
import { CrearAsignacionIndustria } from '../application/use-cases/asignaciones-industria/crear-asignacion-industria.js'
import { EditarAsignacionIndustria } from '../application/use-cases/asignaciones-industria/editar-asignacion-industria.js'
import { EliminarAsignacionIndustria } from '../application/use-cases/asignaciones-industria/eliminar-asignacion-industria.js'
import { InactivarAsignacionIndustria } from '../application/use-cases/asignaciones-industria/inactivar-asignacion-industria.js'
import { ListarAsignacionesIndustria } from '../application/use-cases/asignaciones-industria/listar-asignaciones-industria.js'
import { ObtenerAsignacionIndustria } from '../application/use-cases/asignaciones-industria/obtener-asignacion-industria.js'
import { ActivarAsignacionMarca } from '../application/use-cases/asignaciones-marca/activar-asignacion-marca.js'
import { CrearAsignacionMarca } from '../application/use-cases/asignaciones-marca/crear-asignacion-marca.js'
import { EditarAsignacionMarca } from '../application/use-cases/asignaciones-marca/editar-asignacion-marca.js'
import { EliminarAsignacionMarca } from '../application/use-cases/asignaciones-marca/eliminar-asignacion-marca.js'
import { InactivarAsignacionMarca } from '../application/use-cases/asignaciones-marca/inactivar-asignacion-marca.js'
import { ListarAsignacionesMarca } from '../application/use-cases/asignaciones-marca/listar-asignaciones-marca.js'
import { ObtenerAsignacionMarca } from '../application/use-cases/asignaciones-marca/obtener-asignacion-marca.js'
import { ActivarAtributoTecnico } from '../application/use-cases/atributos-tecnicos/activar-atributo-tecnico.js'
import { CrearAtributoTecnico } from '../application/use-cases/atributos-tecnicos/crear-atributo-tecnico.js'
import { EditarAtributoTecnico } from '../application/use-cases/atributos-tecnicos/editar-atributo-tecnico.js'
import { EliminarAtributoTecnico } from '../application/use-cases/atributos-tecnicos/eliminar-atributo-tecnico.js'
import { InactivarAtributoTecnico } from '../application/use-cases/atributos-tecnicos/inactivar-atributo-tecnico.js'
import { ListarAtributosTecnicos } from '../application/use-cases/atributos-tecnicos/listar-atributos-tecnicos.js'
import { ObtenerAtributoTecnico } from '../application/use-cases/atributos-tecnicos/obtener-atributo-tecnico.js'
import { ReordenarAtributoTecnico } from '../application/use-cases/atributos-tecnicos/reordenar-atributo-tecnico.js'
import { RegistrarLecturaCatalogo } from '../application/use-cases/auditoria/registrar-lectura-catalogo.js'
import { ObtenerCapacidadesCatalogo } from '../application/use-cases/autorizacion/obtener-capacidades-catalogo.js'
import { ActivarCategoria } from '../application/use-cases/categorias/activar-categoria.js'
import { CrearCategoria } from '../application/use-cases/categorias/crear-categoria.js'
import { EditarCategoria } from '../application/use-cases/categorias/editar-categoria.js'
import { EliminarCategoria } from '../application/use-cases/categorias/eliminar-categoria.js'
import { InactivarCategoria } from '../application/use-cases/categorias/inactivar-categoria.js'
import { ListarCategorias } from '../application/use-cases/categorias/listar-categorias.js'
import { ObtenerCategoria } from '../application/use-cases/categorias/obtener-categoria.js'
import { ReordenarCategoria } from '../application/use-cases/categorias/reordenar-categoria.js'
import { ActivarIndustria } from '../application/use-cases/industrias/activar-industria.js'
import { CrearIndustria } from '../application/use-cases/industrias/crear-industria.js'
import { EditarIndustria } from '../application/use-cases/industrias/editar-industria.js'
import { EliminarIndustria } from '../application/use-cases/industrias/eliminar-industria.js'
import { InactivarIndustria } from '../application/use-cases/industrias/inactivar-industria.js'
import { ListarIndustrias } from '../application/use-cases/industrias/listar-industrias.js'
import { ObtenerIndustria } from '../application/use-cases/industrias/obtener-industria.js'
import { ReordenarIndustria } from '../application/use-cases/industrias/reordenar-industria.js'
import { ActivarMarca } from '../application/use-cases/marcas/activar-marca.js'
import { CrearMarca } from '../application/use-cases/marcas/crear-marca.js'
import { EditarMarca } from '../application/use-cases/marcas/editar-marca.js'
import { EliminarMarca } from '../application/use-cases/marcas/eliminar-marca.js'
import { InactivarMarca } from '../application/use-cases/marcas/inactivar-marca.js'
import { ListarMarcas } from '../application/use-cases/marcas/listar-marcas.js'
import { ObtenerMarca } from '../application/use-cases/marcas/obtener-marca.js'
import { ReordenarMarca } from '../application/use-cases/marcas/reordenar-marca.js'
import { ActivarProducto } from '../application/use-cases/productos/activar-producto.js'
import { CrearProducto } from '../application/use-cases/productos/crear-producto.js'
import { EditarProducto } from '../application/use-cases/productos/editar-producto.js'
import { EliminarProducto } from '../application/use-cases/productos/eliminar-producto.js'
import { GestionarMarcasProducto } from '../application/use-cases/productos/gestionar-marcas-producto.js'
import { InactivarProducto } from '../application/use-cases/productos/inactivar-producto.js'
import { ListarProductos } from '../application/use-cases/productos/listar-productos.js'
import { ObtenerProducto } from '../application/use-cases/productos/obtener-producto.js'
import { ReordenarProducto } from '../application/use-cases/productos/reordenar-producto.js'
import { ActivarServicio } from '../application/use-cases/servicios/activar-servicio.js'
import { CrearServicio } from '../application/use-cases/servicios/crear-servicio.js'
import { EditarServicio } from '../application/use-cases/servicios/editar-servicio.js'
import { EliminarServicio } from '../application/use-cases/servicios/eliminar-servicio.js'
import { InactivarServicio } from '../application/use-cases/servicios/inactivar-servicio.js'
import { ListarServicios } from '../application/use-cases/servicios/listar-servicios.js'
import { ObtenerServicio } from '../application/use-cases/servicios/obtener-servicio.js'
import { ReordenarServicio } from '../application/use-cases/servicios/reordenar-servicio.js'
import { ActivarTipoAtributo } from '../application/use-cases/tipos-atributo/activar-tipo-atributo.js'
import { CrearTipoAtributo } from '../application/use-cases/tipos-atributo/crear-tipo-atributo.js'
import { EditarTipoAtributo } from '../application/use-cases/tipos-atributo/editar-tipo-atributo.js'
import { EliminarTipoAtributo } from '../application/use-cases/tipos-atributo/eliminar-tipo-atributo.js'
import { InactivarTipoAtributo } from '../application/use-cases/tipos-atributo/inactivar-tipo-atributo.js'
import { ListarTiposAtributo } from '../application/use-cases/tipos-atributo/listar-tipos-atributo.js'
import { ObtenerTipoAtributo } from '../application/use-cases/tipos-atributo/obtener-tipo-atributo.js'
import { ReordenarTipoAtributo } from '../application/use-cases/tipos-atributo/reordenar-tipo-atributo.js'
import { PrismaAsignacionesAtributo } from './prisma-asignaciones-atributo.js'
import { PrismaAsignacionesIndustria } from './prisma-asignaciones-industria.js'
import { PrismaAsignacionesMarca } from './prisma-asignaciones-marca.js'
import { PrismaAtributosTecnicos } from './prisma-atributos-tecnicos.js'
import { PrismaCategorias } from './prisma-categorias.js'
import { PrismaIndustrias } from './prisma-industrias.js'
import { PrismaMarcasProducto } from './prisma-marcas-producto.js'
import { PrismaMarcas } from './prisma-marcas.js'
import { PrismaProductos } from './prisma-productos.js'
import { PrismaServicios } from './prisma-servicios.js'
import { PrismaTiposAtributo } from './prisma-tipos-atributo.js'
export function componerCatalogo(db: PrismaClient) {
    const autorizar = new ExigirPermiso(new PrismaAutorizacion(db))
    const reloj = new RelojSistema()
    const productos = new PrismaProductos(db)
    const categorias = new PrismaCategorias(db)
    const marcas = new PrismaMarcas(db)
    const tipos_atributo = new PrismaTiposAtributo(db)
    const atributos_tecnicos = new PrismaAtributosTecnicos(db)
    const industrias = new PrismaIndustrias(db)
    const servicios = new PrismaServicios(db)
    const asignaciones_marca = new PrismaAsignacionesMarca(db)
    const asignaciones_atributo = new PrismaAsignacionesAtributo(db)
    const asignaciones_industria = new PrismaAsignacionesIndustria(db)
    return {
        marcasProducto: new GestionarMarcasProducto(new PrismaMarcasProducto(db), autorizar),
        capacidades: new ObtenerCapacidadesCatalogo(autorizar),
        registrarLectura: new RegistrarLecturaCatalogo(new PrismaAuditoria(db), reloj),
        'productos': { listar: new ListarProductos(productos, autorizar), obtener: new ObtenerProducto(productos, autorizar), crear: new CrearProducto(productos, autorizar), editar: new EditarProducto(productos, autorizar, reloj), activar: new ActivarProducto(productos, autorizar, reloj), inactivar: new InactivarProducto(productos, autorizar, reloj), eliminar: new EliminarProducto(productos, autorizar, reloj), reordenar: new ReordenarProducto(productos, autorizar, reloj) },
        'categorias': { listar: new ListarCategorias(categorias, autorizar), obtener: new ObtenerCategoria(categorias, autorizar), crear: new CrearCategoria(categorias, autorizar, productos), editar: new EditarCategoria(categorias, autorizar, reloj), activar: new ActivarCategoria(categorias, autorizar, reloj), inactivar: new InactivarCategoria(categorias, autorizar, reloj), eliminar: new EliminarCategoria(categorias, autorizar, reloj), reordenar: new ReordenarCategoria(categorias, autorizar, reloj) },
        'marcas': { listar: new ListarMarcas(marcas, autorizar), obtener: new ObtenerMarca(marcas, autorizar), crear: new CrearMarca(marcas, autorizar), editar: new EditarMarca(marcas, autorizar, reloj), activar: new ActivarMarca(marcas, autorizar, reloj), inactivar: new InactivarMarca(marcas, autorizar, reloj), eliminar: new EliminarMarca(marcas, autorizar, reloj), reordenar: new ReordenarMarca(marcas, autorizar, reloj) },
        'tipos-atributo': { listar: new ListarTiposAtributo(tipos_atributo, autorizar), obtener: new ObtenerTipoAtributo(tipos_atributo, autorizar), crear: new CrearTipoAtributo(tipos_atributo, autorizar), editar: new EditarTipoAtributo(tipos_atributo, autorizar, reloj), activar: new ActivarTipoAtributo(tipos_atributo, autorizar, reloj), inactivar: new InactivarTipoAtributo(tipos_atributo, autorizar, reloj), eliminar: new EliminarTipoAtributo(tipos_atributo, autorizar, reloj), reordenar: new ReordenarTipoAtributo(tipos_atributo, autorizar, reloj) },
        'atributos-tecnicos': { listar: new ListarAtributosTecnicos(atributos_tecnicos, autorizar), obtener: new ObtenerAtributoTecnico(atributos_tecnicos, autorizar), crear: new CrearAtributoTecnico(atributos_tecnicos, autorizar), editar: new EditarAtributoTecnico(atributos_tecnicos, autorizar, reloj), activar: new ActivarAtributoTecnico(atributos_tecnicos, autorizar, reloj), inactivar: new InactivarAtributoTecnico(atributos_tecnicos, autorizar, reloj), eliminar: new EliminarAtributoTecnico(atributos_tecnicos, autorizar, reloj), reordenar: new ReordenarAtributoTecnico(atributos_tecnicos, autorizar, reloj) },
        'industrias': { listar: new ListarIndustrias(industrias, autorizar), obtener: new ObtenerIndustria(industrias, autorizar), crear: new CrearIndustria(industrias, autorizar), editar: new EditarIndustria(industrias, autorizar, reloj), activar: new ActivarIndustria(industrias, autorizar, reloj), inactivar: new InactivarIndustria(industrias, autorizar, reloj), eliminar: new EliminarIndustria(industrias, autorizar, reloj), reordenar: new ReordenarIndustria(industrias, autorizar, reloj) },
        'servicios': { listar: new ListarServicios(servicios, autorizar), obtener: new ObtenerServicio(servicios, autorizar), crear: new CrearServicio(servicios, autorizar), editar: new EditarServicio(servicios, autorizar, reloj), activar: new ActivarServicio(servicios, autorizar, reloj), inactivar: new InactivarServicio(servicios, autorizar, reloj), eliminar: new EliminarServicio(servicios, autorizar, reloj), reordenar: new ReordenarServicio(servicios, autorizar, reloj) },
        'asignaciones-marca': { listar: new ListarAsignacionesMarca(asignaciones_marca, autorizar), obtener: new ObtenerAsignacionMarca(asignaciones_marca, autorizar), crear: new CrearAsignacionMarca(asignaciones_marca, autorizar), editar: new EditarAsignacionMarca(asignaciones_marca, autorizar, reloj), activar: new ActivarAsignacionMarca(asignaciones_marca, autorizar, reloj), inactivar: new InactivarAsignacionMarca(asignaciones_marca, autorizar, reloj), eliminar: new EliminarAsignacionMarca(asignaciones_marca, autorizar, reloj) },
        'asignaciones-atributo': { listar: new ListarAsignacionesAtributo(asignaciones_atributo, autorizar), obtener: new ObtenerAsignacionAtributo(asignaciones_atributo, autorizar), crear: new CrearAsignacionAtributo(asignaciones_atributo, autorizar), editar: new EditarAsignacionAtributo(asignaciones_atributo, autorizar, reloj), activar: new ActivarAsignacionAtributo(asignaciones_atributo, autorizar, reloj), inactivar: new InactivarAsignacionAtributo(asignaciones_atributo, autorizar, reloj), eliminar: new EliminarAsignacionAtributo(asignaciones_atributo, autorizar, reloj) },
        'asignaciones-industria': { listar: new ListarAsignacionesIndustria(asignaciones_industria, autorizar), obtener: new ObtenerAsignacionIndustria(asignaciones_industria, autorizar), crear: new CrearAsignacionIndustria(asignaciones_industria, autorizar), editar: new EditarAsignacionIndustria(asignaciones_industria, autorizar, reloj), activar: new ActivarAsignacionIndustria(asignaciones_industria, autorizar, reloj), inactivar: new InactivarAsignacionIndustria(asignaciones_industria, autorizar, reloj), eliminar: new EliminarAsignacionIndustria(asignaciones_industria, autorizar, reloj) }
    }
}
export type CasosCatalogo = ReturnType<typeof componerCatalogo>
