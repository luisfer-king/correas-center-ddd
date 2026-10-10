import type { RepositorioGamas } from './ports/repositorio-gamas.js'
import type { RepositorioPlantillasGama } from './ports/repositorio-plantillas-gama.js'
import type { RepositorioCategorias } from './ports/repositorio-categorias.js'
import type { UnidadTrabajoGamas } from './ports/unidad-trabajo-gamas.js'
import type { AutorizacionCatalogo } from './acceso-catalogo.js'
import { CrearGamaCategoria } from './use-cases/gamas/crear-gama-categoria.js'
import { EditarGamaCategoria } from './use-cases/gamas/editar-gama-categoria.js'
import { ObtenerGamaCategoria } from './use-cases/gamas/obtener-gama-categoria.js'
import { ObtenerGamaPorCategoria } from './use-cases/gamas/obtener-gama-por-categoria.js'
import { ListarGamasProducto } from './use-cases/gamas/listar-gamas-producto.js'
import { ActivarGamaCategoria } from './use-cases/gamas/activar-gama-categoria.js'
import { InactivarGamaCategoria } from './use-cases/gamas/inactivar-gama-categoria.js'
import { EliminarGamaCategoria } from './use-cases/gamas/eliminar-gama-categoria.js'
import { ObtenerPlantillaGama } from './use-cases/plantillas-gama/obtener-plantilla-gama.js'
import { SeleccionarPlantillaGama } from './use-cases/plantillas-gama/seleccionar-plantilla-gama.js'
import { QuitarPlantillaGama } from './use-cases/plantillas-gama/quitar-plantilla-gama.js'
import { CopiarGamaDesdePlantilla } from './use-cases/plantillas-gama/copiar-gama-desde-plantilla.js'
import { CopiarGamaCategoria } from './use-cases/plantillas-gama/copiar-gama-categoria.js'
import { GuardarValoresGama } from './use-cases/valores-gama/guardar-valores-gama.js'
import { CrearGrupoColumnaGama } from './use-cases/grupos-columnas-gama/crear-grupo-columna-gama.js'
import { EditarGrupoColumnaGama } from './use-cases/grupos-columnas-gama/editar-grupo-columna-gama.js'
import { ActivarGrupoColumnaGama } from './use-cases/grupos-columnas-gama/activar-grupo-columna-gama.js'
import { InactivarGrupoColumnaGama } from './use-cases/grupos-columnas-gama/inactivar-grupo-columna-gama.js'
import { EliminarGrupoColumnaGama } from './use-cases/grupos-columnas-gama/eliminar-grupo-columna-gama.js'
import { ReordenarGrupoColumnaGama } from './use-cases/grupos-columnas-gama/reordenar-grupo-columna-gama.js'
import { MoverGrupoColumnaGama } from './use-cases/grupos-columnas-gama/mover-grupo-columna-gama.js'
import { CrearGrupoFilaGama } from './use-cases/grupos-filas-gama/crear-grupo-fila-gama.js'
import { EditarGrupoFilaGama } from './use-cases/grupos-filas-gama/editar-grupo-fila-gama.js'
import { ActivarGrupoFilaGama } from './use-cases/grupos-filas-gama/activar-grupo-fila-gama.js'
import { InactivarGrupoFilaGama } from './use-cases/grupos-filas-gama/inactivar-grupo-fila-gama.js'
import { EliminarGrupoFilaGama } from './use-cases/grupos-filas-gama/eliminar-grupo-fila-gama.js'
import { ReordenarGrupoFilaGama } from './use-cases/grupos-filas-gama/reordenar-grupo-fila-gama.js'
import { MoverGrupoFilaGama } from './use-cases/grupos-filas-gama/mover-grupo-fila-gama.js'
import { CrearColumnaGama } from './use-cases/columnas-gama/crear-columna-gama.js'
import { EditarColumnaGama } from './use-cases/columnas-gama/editar-columna-gama.js'
import { ActivarColumnaGama } from './use-cases/columnas-gama/activar-columna-gama.js'
import { InactivarColumnaGama } from './use-cases/columnas-gama/inactivar-columna-gama.js'
import { EliminarColumnaGama } from './use-cases/columnas-gama/eliminar-columna-gama.js'
import { ReordenarColumnaGama } from './use-cases/columnas-gama/reordenar-columna-gama.js'
import { MoverColumnaGama } from './use-cases/columnas-gama/mover-columna-gama.js'
import { CrearFilaGama } from './use-cases/filas-gama/crear-fila-gama.js'
import { EditarFilaGama } from './use-cases/filas-gama/editar-fila-gama.js'
import { ActivarFilaGama } from './use-cases/filas-gama/activar-fila-gama.js'
import { InactivarFilaGama } from './use-cases/filas-gama/inactivar-fila-gama.js'
import { EliminarFilaGama } from './use-cases/filas-gama/eliminar-fila-gama.js'
import { ReordenarFilaGama } from './use-cases/filas-gama/reordenar-fila-gama.js'
import { MoverFilaGama } from './use-cases/filas-gama/mover-fila-gama.js'
export function componerCasosGamas(d:{gamas:RepositorioGamas;plantillas:RepositorioPlantillasGama;categorias:RepositorioCategorias;unidadTrabajo:UnidadTrabajoGamas;autorizar:AutorizacionCatalogo}) {
  return {
    gamas:{crear:new CrearGamaCategoria(d.unidadTrabajo,d.autorizar),editar:new EditarGamaCategoria(d.unidadTrabajo,d.autorizar),obtener:new ObtenerGamaCategoria(d.gamas,d.autorizar),porCategoria:new ObtenerGamaPorCategoria(d.gamas,d.autorizar),listar:new ListarGamasProducto(d.gamas,d.autorizar),activar:new ActivarGamaCategoria(d.unidadTrabajo,d.autorizar),inactivar:new InactivarGamaCategoria(d.unidadTrabajo,d.autorizar),eliminar:new EliminarGamaCategoria(d.unidadTrabajo,d.autorizar)},
    plantillas:{obtener:new ObtenerPlantillaGama(d.plantillas,d.autorizar),seleccionar:new SeleccionarPlantillaGama(d.plantillas,d.autorizar),quitar:new QuitarPlantillaGama(d.plantillas,d.autorizar),copiar:new CopiarGamaDesdePlantilla(d.categorias,d.plantillas,d.gamas,d.unidadTrabajo,d.autorizar),copiarDesdeGama:new CopiarGamaCategoria(d.gamas,d.unidadTrabajo,d.autorizar)},
    valores:{guardar:new GuardarValoresGama(d.unidadTrabajo,d.autorizar)},
    gruposColumnas:{crear:new CrearGrupoColumnaGama(d.unidadTrabajo,d.autorizar),editar:new EditarGrupoColumnaGama(d.unidadTrabajo,d.autorizar),activar:new ActivarGrupoColumnaGama(d.unidadTrabajo,d.autorizar),inactivar:new InactivarGrupoColumnaGama(d.unidadTrabajo,d.autorizar),eliminar:new EliminarGrupoColumnaGama(d.unidadTrabajo,d.autorizar),reordenar:new ReordenarGrupoColumnaGama(d.unidadTrabajo,d.autorizar),mover:new MoverGrupoColumnaGama(d.unidadTrabajo,d.autorizar)},
    gruposFilas:{crear:new CrearGrupoFilaGama(d.unidadTrabajo,d.autorizar),editar:new EditarGrupoFilaGama(d.unidadTrabajo,d.autorizar),activar:new ActivarGrupoFilaGama(d.unidadTrabajo,d.autorizar),inactivar:new InactivarGrupoFilaGama(d.unidadTrabajo,d.autorizar),eliminar:new EliminarGrupoFilaGama(d.unidadTrabajo,d.autorizar),reordenar:new ReordenarGrupoFilaGama(d.unidadTrabajo,d.autorizar),mover:new MoverGrupoFilaGama(d.unidadTrabajo,d.autorizar)},
    columnas:{crear:new CrearColumnaGama(d.unidadTrabajo,d.autorizar),editar:new EditarColumnaGama(d.unidadTrabajo,d.autorizar),activar:new ActivarColumnaGama(d.unidadTrabajo,d.autorizar),inactivar:new InactivarColumnaGama(d.unidadTrabajo,d.autorizar),eliminar:new EliminarColumnaGama(d.unidadTrabajo,d.autorizar),reordenar:new ReordenarColumnaGama(d.unidadTrabajo,d.autorizar),mover:new MoverColumnaGama(d.unidadTrabajo,d.autorizar)},
    filas:{crear:new CrearFilaGama(d.unidadTrabajo,d.autorizar),editar:new EditarFilaGama(d.unidadTrabajo,d.autorizar),activar:new ActivarFilaGama(d.unidadTrabajo,d.autorizar),inactivar:new InactivarFilaGama(d.unidadTrabajo,d.autorizar),eliminar:new EliminarFilaGama(d.unidadTrabajo,d.autorizar),reordenar:new ReordenarFilaGama(d.unidadTrabajo,d.autorizar),mover:new MoverFilaGama(d.unidadTrabajo,d.autorizar)},
  }
}
