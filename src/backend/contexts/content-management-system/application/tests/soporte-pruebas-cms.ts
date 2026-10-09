import { Orden, Slug } from '../../../../shared/domain/value-objects.js'
import { RutaInterna, destinoCMS, enlaceCMS } from '../../domain/cms-values.js'
import { CatalogoFuentesWizardCms } from '../validaciones-cms.js'
import { TipoSeccion } from '../../domain/tipo-seccion.js'
import { ContenidoSeccion } from '../../domain/contenido-seccion.js'
import { Menu } from '../../domain/menu.js'
import { MenuItem } from '../../domain/menu-item.js'
import { FooterElemento } from '../../domain/footer-elemento.js'
import { ConfiguracionSitio } from '../../domain/configuracion-sitio.js'
import { PasoWizard } from '../../domain/paso-wizard.js'
import { RegistroCMS } from '../../domain/registro-cms.js'
import { ContenidoRegistro } from '../../domain/contenido-registro.js'

export const actor = '11111111-1111-4111-8111-111111111111'
export const antes = new Date('2026-10-05T12:00:00Z')
export const despues = new Date('2026-10-05T12:00:01Z')
export const contexto = { actorId: actor, ipAddress: '127.0.0.1', userAgent: 'pruebas-app-cms' }
const fechas = () => ({ creadoEn: antes, actualizadoEn: antes, eliminadoEn: null })
// any se limita al doble de repositorio y sus registros heterogéneos de prueba.
export function entrada(cls: string): any {
  const datos: Record<string, any> = {
    TipoSeccion: { nombre: 'Hero', slug: 'hero', descripcion: null, camposMetadata: ['cta'], icono: null, orden: 0 },
    ContenidoSeccion: { empresaId: 1n, tipoSeccionId: 2n, campos: { titulo: 'Hero', subtitulo: null, descripcion: null, icono: null, imagen: null }, metadata: { cta: 'Cotizar' }, orden: 0, mostrar: true },
    Menu: { empresaId: 1n, grupo: 'Producto', destino: { tipo: 'producto', id: 1n }, ruta: '/productos', icono: null, mostrar: true, orden: 0, cargarSubmenu: 'activo' },
    MenuItem: { menuId: 2n,nombre:'Correas en V',categoriaId:1n, ruta: '/correas', orden: 1 },
    FooterElemento: { empresaId: 1n, tipo: 'producto', destino: { tipo: 'producto', id: 1n }, titulo: 'Productos', enlace: '/productos', icono: null, orden: 0, mostrar: true },
    ConfiguracionSitio: { empresaId: null, clave: 'titulo', valor: 'Correas Center', tipo: 'texto', descripcion: null, grupo: null, activo: null },
    PasoWizard: { empresaId: 1n, identificador: 'producto', titulo: 'Producto', descripcion: 'Selecciona', fuenteDatos: 'productos', campoFiltro: 'nombre', orden: 0 },
    RegistroCMS: { identificador: 'about', nombre: 'Nosotros', descripcion: null, orden: 0 },
    ContenidoRegistro: { empresaId: 1n, registroId: 2n, campos: { titulo: 'Nosotros', subtitulo: null, descripcion: null, icono: null }, orden: 0 },
  }
  return structuredClone(datos[cls])
}
export function entidad(cls: string): any {
  const d = entrada(cls), comun = { id: 2n, estado: 'activo' as const, fechas: fechas() }
  switch (cls) {
    case 'TipoSeccion': return new TipoSeccion({ ...d, ...comun, slug: Slug.create(d.slug), orden: Orden.create(d.orden) })
    case 'ContenidoSeccion': return new ContenidoSeccion({ ...d, ...comun, orden: Orden.create(d.orden) })
    case 'Menu': return new Menu({ ...d, ...comun, destino: destinoCMS(d.destino.tipo, d.destino.id), ruta: RutaInterna.create(d.ruta), orden: Orden.create(d.orden), items: [] })
    case 'MenuItem': return new MenuItem({ ...d, ...comun, ruta: RutaInterna.create(d.ruta), orden: Orden.create(d.orden) })
    case 'FooterElemento': return new FooterElemento({ ...d, ...comun, destino: destinoCMS(d.destino.tipo, d.destino.id), enlace: enlaceCMS(d.enlace), orden: Orden.create(d.orden) })
    case 'ConfiguracionSitio': return new ConfiguracionSitio({ ...d, id: 2, creadoEn: antes, actualizadoEn: antes })
    case 'PasoWizard': return new PasoWizard({ ...d, ...comun, orden: Orden.create(d.orden) })
    case 'RegistroCMS': return new RegistroCMS({ ...d, ...comun, orden: Orden.create(d.orden) })
    case 'ContenidoRegistro': return new ContenidoRegistro({ ...d, ...comun, orden: Orden.create(d.orden) })
    default: throw new Error('Fixture desconocida')
  }
}
function clonar(e: any): any {
  const comun = e instanceof ConfiguracionSitio ? { id: e.id, creadoEn: e.creadoEn, actualizadoEn: e.actualizadoEn } :
    { id: e.id, estado: e.estado, fechas: { creadoEn: e.creadoEn, actualizadoEn: e.actualizadoEn, eliminadoEn: e.eliminadoEn } }
  if (e instanceof TipoSeccion) return new TipoSeccion({ ...comun, nombre: e.nombre, slug: e.slug, descripcion: e.descripcion, icono: e.icono, orden: e.orden, camposMetadata: e.clavesMetadata } as ConstructorParameters<typeof TipoSeccion>[0])
  if (e instanceof ContenidoSeccion) return new ContenidoSeccion({ ...comun, empresaId: e.empresaId, tipoSeccionId: e.tipoSeccionId, campos: e.campos, metadata: e.metadata, orden: e.orden, mostrar: e.mostrar } as ConstructorParameters<typeof ContenidoSeccion>[0])
  if (e instanceof Menu) return new Menu({ ...comun, empresaId: e.empresaId, grupo: e.grupo, destino: e.destino, ruta: e.ruta, icono: e.icono, mostrar: e.mostrar, orden: e.orden, cargarSubmenu: e.cargarSubmenu, items: e.itemsOrdenados.map(clonar) } as ConstructorParameters<typeof Menu>[0])
  if (e instanceof MenuItem) return new MenuItem({ ...comun, menuId: e.menuId, nombre:e.nombre,categoriaId:e.categoriaId,ruta: e.ruta, orden: e.orden } as ConstructorParameters<typeof MenuItem>[0])
  if (e instanceof FooterElemento) return new FooterElemento({ ...comun, empresaId: e.empresaId, tipo: e.tipo, destino: e.destino, titulo: e.titulo, enlace: e.enlace, icono: e.icono, orden: e.orden, mostrar: e.mostrar } as ConstructorParameters<typeof FooterElemento>[0])
  if (e instanceof ConfiguracionSitio) return new ConfiguracionSitio({ ...comun, empresaId: e.empresaId, clave: e.clave, valor: e.valor, tipo: e.tipo, descripcion: e.descripcion, grupo: e.grupo, activo: e.activo } as ConstructorParameters<typeof ConfiguracionSitio>[0])
  if (e instanceof PasoWizard) return new PasoWizard({ ...comun, empresaId: e.empresaId, identificador: e.identificador, titulo: e.titulo, descripcion: e.descripcion, fuenteDatos: e.fuenteDatos, campoFiltro: e.campoFiltro, orden: e.orden } as ConstructorParameters<typeof PasoWizard>[0])
  if (e instanceof RegistroCMS) return new RegistroCMS({ ...comun, identificador: e.identificador, nombre: e.nombre, descripcion: e.descripcion, orden: e.orden } as ConstructorParameters<typeof RegistroCMS>[0])
  if (e instanceof ContenidoRegistro) return new ContenidoRegistro({ ...comun, empresaId: e.empresaId, registroId: e.registroId, campos: e.campos, orden: e.orden } as ConstructorParameters<typeof ContenidoRegistro>[0])
  throw new Error('Entidad desconocida')
}
export function entorno(cls: string) {
  let actual = cls === 'MetadataSeccion' ? entidad('ContenidoSeccion') : entidad(cls)
  const llamadas: { operacion: string; args: any[] }[] = []
  const permisos: string[] = []
  const opciones = { permitir: true, superAdmin: false, inexistente: false, falloGuardar: false }
  const auth = {
    ejecutar: async (_actor: string, codigo: string) => { permisos.push(codigo); if (!opciones.permitir) throw new Error('Acceso denegado') },
    tieneRolActivo: async () => opciones.superAdmin,
  }
  const reloj = { ahora: () => new Date(antes) }
  const tipo = entidad('TipoSeccion'), menu = entidad('Menu')
  const tipos = { obtener: async () => { llamadas.push({ operacion: 'tipo', args: [] }); return clonar(tipo) } }
  const menus = { obtener: async () => { llamadas.push({ operacion: 'menu', args: [] }); return clonar(menu) } }
  const secciones = { obtener: async () => opciones.inexistente ? null : clonar(actual) }
  const fuentes = new CatalogoFuentesWizardCms({ productos: ['nombre'] })
  const repo = {
    listar: async (consulta: any) => { llamadas.push({ operacion: 'listar', args: [consulta] }); return [clonar(actual)] },
    obtener: async (id: any) => { llamadas.push({ operacion: 'obtener', args: [id] }); return opciones.inexistente ? null : cls === 'MetadataSeccion' ? { contenidoSeccionId: actual.id, empresaId: actual.empresaId, tipoSeccionId: actual.tipoSeccionId, metadata: actual.metadata, actualizadoEn: actual.actualizadoEn } : clonar(actual) },
    crear: async (datos: any, escritura: any) => {
      llamadas.push({ operacion: 'crear', args: [datos, escritura] })
      const Ctor = actual.constructor
      actual = cls === 'ConfiguracionSitio' ? new Ctor({ ...datos, id: 99, creadoEn: escritura.cuando, actualizadoEn: escritura.cuando }) :
        new Ctor({ ...datos, ...(cls === 'ContenidoSeccion' ? { orden: Orden.create(1) } : {}), ...(cls === 'Menu' || cls === 'FooterElemento' || cls === 'RegistroCMS' || cls === 'ContenidoRegistro' || cls === 'PasoWizard' ? { orden: Orden.create(1) } : {}), ...(cls === 'MenuItem' ? {orden:Orden.create(1),ruta:RutaInterna.create('/products/correas-industriales/correas-en-v/')} : {}), id: 99n, estado: 'activo', fechas: { creadoEn: escritura.cuando, actualizadoEn: escritura.cuando, eliminadoEn: null }, ...(cls==='Menu' ? { items: [] } : {}) })
      return clonar(actual)
    },
    guardar: async (e: any, version: any, escritura: any) => {
      llamadas.push({ operacion: 'guardar', args: [e, version, escritura] })
      if (opciones.falloGuardar) throw new Error('Conflicto persistencia')
      actual = clonar(e)
    },
    reemplazar: async (id: bigint, metadata: any, version: Date, escritura: any) => {
      llamadas.push({ operacion: 'reemplazar', args: [id, metadata, version, escritura] })
      actual.editar(actual.campos, metadata, tipo, escritura.cuando)
      return clonar(actual)
    },
  }
  return { repo, auth, reloj, tipos, menus, secciones, fuentes, llamadas, permisos, opciones,
    get actual() { return actual }, tipo, menu }
}
