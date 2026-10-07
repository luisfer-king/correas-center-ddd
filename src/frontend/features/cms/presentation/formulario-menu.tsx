import { useCallback, useState, type FormEvent } from 'react'
import { empresasApi } from '../../commercial/api/empresas'
import { clienteRecurso } from '../../catalog/api/cliente-catalogo'
import { SelectorSeccion, type OpcionSeccion } from './selector-seccion'
import type { DatosFormularioCms } from './campos-cms'
import { gruposFormularioMenu,grupoFormularioMenu,prefijosMenu,tiposMenu,construirRutaMenu,sufijoElementoMenu,type GrupoFormularioMenu } from './datos-menu-formulario'
export {gruposFormularioMenu,grupoFormularioMenu} from './datos-menu-formulario'
async function cargarEmpresas(pagina:number,signal:AbortSignal) {
  const lote=await empresasApi.listar(pagina,{signal})
  return {opciones:lote.filter(e=>e.estado==='activo').map(e=>({id:e.id,nombre:e.nombre})),mas:lote.length===100}
}
export function FormularioMenu({datos={},editar=false,guardar,ocupado,cancelar}:{datos?:DatosFormularioCms;editar?:boolean;guardar:(datos:DatosFormularioCms)=>Promise<void>;ocupado:boolean;cancelar:()=>void}) {
  const inicial=grupoFormularioMenu(datos.grupo)||'Producto', rutaInicial=String(datos.ruta??'')
  const [empresa,setEmpresa]=useState(String(datos.empresaId??'')),[grupo,setGrupo]=useState<GrupoFormularioMenu>(inicial)
  const [registro,setRegistro]=useState(String((datos.destino as {id?:string}|undefined)?.id??datos.registroId??''))
  const [usarPrefijo,setUsarPrefijo]=useState(!editar||rutaInicial.startsWith(prefijosMenu[inicial]))
  const [suffix,setSuffix]=useState(rutaInicial.startsWith(prefijosMenu[inicial])?rutaInicial.slice(prefijosMenu[inicial].length):rutaInicial)
  const [icono,setIcono]=useState(String(datos.icono??'')),[mostrar,setMostrar]=useState(datos.mostrar!==false),[submenu,setSubmenu]=useState(String(datos.cargarSubmenu??'')),[error,setError]=useState('')
  const cargarRegistros=useCallback(async(pagina:number,signal:AbortSignal)=>{
    if(!empresa)return {opciones:[],mas:false}
    const recurso=({Producto:'productos',Aplicacion:'industrias',Servicio:'servicios'} as const)[grupo]
    const lote=await clienteRecurso(recurso).listar(pagina,{empresaId:empresa},{signal})
    return {opciones:lote.filter(e=>e.estado==='activo').map(e=>({id:e.id,nombre:e.nombre,...('slug' in e ? {slug:e.slug} : {})})),mas:lote.length===100}
  },[grupo,empresa])
  function seleccionarRegistro(id:string,opcion?:OpcionSeccion){
    setError('');setRegistro(id)
    if(!id){setSuffix('');return}
    try {
      if(!opcion)throw new Error('Carga las opciones y vuelve a seleccionar el registro')
      setSuffix(sufijoElementoMenu(grupo,opcion));setUsarPrefijo(true)
    }catch(e){setRegistro('');setSuffix('');setError(e instanceof Error?e.message:'No se pudo cargar el sufijo')}
  }
  let ruta='';try{ruta=usarPrefijo?construirRutaMenu(grupo,suffix):suffix}catch{ruta=prefijosMenu[grupo]}
  async function enviar(e:FormEvent){
    e.preventDefault();if(ocupado)return;setError('')
    try {
      if(!empresa||!registro)throw new Error('Selecciona empresa y registro del catálogo')
      const cuerpo={grupo,destino:{tipo:tiposMenu[grupo],id:registro},ruta:usarPrefijo?construirRutaMenu(grupo,suffix):suffix,icono:icono.trim()||null,mostrar,cargarSubmenu:submenu||null}
      await guardar(editar?cuerpo:{...cuerpo,empresaId:empresa})
    }catch(e){setError(e instanceof Error?e.message:'No se pudo guardar')}
  }
  return <form className="cms-form" onSubmit={e=>void enviar(e)}><fieldset disabled={ocupado}>
    <SelectorSeccion etiqueta="Empresa" valor={empresa} cargar={cargarEmpresas} cambiar={v=>{setEmpresa(v);setRegistro('');setSuffix('')}} bloqueado={editar||ocupado}/>
    <label>Grupo *<select value={grupo} onChange={e=>{setGrupo(e.target.value as GrupoFormularioMenu);setRegistro('');setUsarPrefijo(true);setSuffix('')}}>{gruposFormularioMenu.map(g=><option key={g} value={g}>{g}</option>)}</select></label>
    <SelectorSeccion key={`${empresa}-${grupo}`} etiqueta={grupo==='Producto'?'Producto':grupo==='Aplicacion'?'Industria':'Servicio'} valor={registro} cargar={cargarRegistros} cambiar={seleccionarRegistro} bloqueado={!empresa||ocupado}/>
    {editar&&<label><input type="checkbox" checked={usarPrefijo} onChange={e=>{setUsarPrefijo(e.target.checked);setSuffix(e.target.checked?'':ruta)}}/>Construir ruta con el prefijo del grupo</label>}
    <label>{usarPrefijo?'Sufijo de ruta *':'Ruta completa *'}<input required value={suffix} placeholder={usarPrefijo?'correas-industriales':'/products/correas-industriales/'} onChange={e=>setSuffix(e.target.value)}/><small>{usarPrefijo?`Prefijo: ${prefijosMenu[grupo]}. El sufijo se carga al seleccionar el registro y puedes ajustarlo.`:'Se conserva el formato de la ruta histórica.'}</small></label>
    <label>Ruta resultante<input readOnly value={ruta}/></label>
    <label>Icono de Lucide (opcional)<input value={icono} placeholder="Package, Wrench o LayoutGrid" onChange={e=>setIcono(e.target.value)}/><small>Nombre Lucide, sin clases Font Awesome. <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">Consultar iconos</a></small></label>
    <label>Visible<select value={String(mostrar)} onChange={e=>setMostrar(e.target.value==='true')}><option value="true">Sí</option><option value="false">No</option></select></label>
    <label>Cargar submenú<select value={submenu} onChange={e=>setSubmenu(e.target.value)}><option value="">Sin definir</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select><small>Activo: cada subenlace usa su ruta. Inactivo o sin definir: usa la ruta del padre.</small></label>
    <small>Registro ID será el ID real del elemento seleccionado. Solo el orden es automático por grupo; cambiar de grupo asigna un orden nuevo.</small>
  </fieldset>{error&&<p role="alert" className="cms-error">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" className="cms-primary" disabled={ocupado}>{ocupado?'Guardando…':'Guardar'}</button></div></form>
}
