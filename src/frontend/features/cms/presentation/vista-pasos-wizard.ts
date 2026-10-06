import type { CrearPasoWizard, EditarPasoWizard } from '../api/tipos-pasos-wizard'
import { pasos_wizardApi } from '../api/cliente-pasos-wizard'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaPasoWizard: ConfiguracionVistaCms = {
 recurso: 'pasos_wizard', ruta: 'pasos-wizard', titulo: 'Pasos del wizard',
 crear: [{"clave": "empresaId", "etiqueta": "Empresa (ID)", "tipo": "id", "ayuda": "ID de la empresa registrada."}, {"clave": "identificador", "etiqueta": "Identificador", "tipo": "texto"}, {"clave": "titulo", "etiqueta": "Título", "tipo": "texto"}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area"}, {"clave": "fuenteDatos", "etiqueta": "Fuente de datos", "tipo": "texto", "ayuda": "Nombre de una fuente habilitada para el wizard."}, {"clave": "campoFiltro", "etiqueta": "Campo de filtro", "tipo": "texto", "nullable": true}, {"clave": "orden", "etiqueta": "Orden", "tipo": "numero"}],
 editar: [{"clave": "titulo", "etiqueta": "Título", "tipo": "texto"}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area"}, {"clave": "fuenteDatos", "etiqueta": "Fuente de datos", "tipo": "texto", "ayuda": "Nombre de una fuente habilitada para el wizard."}, {"clave": "campoFiltro", "etiqueta": "Campo de filtro", "tipo": "texto", "nullable": true}],
 filtros: ["empresaId"],
 api: { ...pasos_wizardApi, crear: datos => pasos_wizardApi.crear(datos as CrearPasoWizard), editar: (id, version, datos) => pasos_wizardApi.editar(id, version, datos as EditarPasoWizard) },
}
