import { useRef,useState } from 'react'
import { Link } from 'react-router-dom'
import { Send,CheckCircle2 } from 'lucide-react'
import { enviarContactoPublico } from '../../commercial/api/publico/cliente-captacion'
export function FormularioContactoPublico({mensajeInicial=''}:{mensajeInicial?:string}){
 const [datos,setDatos]=useState({nombre:'',empresaDeclarada:'',telefono:'',email:'',mensaje:mensajeInicial,sitioWeb:'',consentimiento:false})
 const [ocupado,setOcupado]=useState(false),[error,setError]=useState(''),[exito,setExito]=useState(false),enviando=useRef(false)
 return <form className="captacion-formulario" onSubmit={async e=>{e.preventDefault();if(enviando.current)return;enviando.current=true;setOcupado(true);setError('');setExito(false);try{await enviarContactoPublico(datos);setExito(true);setDatos({nombre:'',empresaDeclarada:'',telefono:'',email:'',mensaje:'',sitioWeb:'',consentimiento:false})}catch(e){setError(e instanceof Error?e.message:'No se pudo enviar la consulta')}finally{enviando.current=false;setOcupado(false)}}}>
  <h2>Envíanos un mensaje</h2><p>Completa tus datos y cuéntanos qué necesitas.</p>
  <fieldset disabled={ocupado}><div className="captacion-campos">{([{clave:'nombre',titulo:'Nombre completo',tipo:'text',max:120,min:2,auto:'name'},{clave:'empresaDeclarada',titulo:'Empresa (opcional)',tipo:'text',max:160,min:0,auto:'organization'},{clave:'telefono',titulo:'Teléfono',tipo:'tel',max:40,min:5,auto:'tel'},{clave:'email',titulo:'Correo electrónico',tipo:'email',max:254,min:3,auto:'email'}] as const).map(c=><label key={c.clave}>{c.titulo}<input name={c.clave} type={c.tipo} autoComplete={c.auto} required={c.min>0} minLength={c.min} maxLength={c.max} value={datos[c.clave]} onChange={e=>setDatos(d=>({...d,[c.clave]:e.target.value}))}/></label>)}</div>
   <label>Mensaje<textarea name="mensaje" required minLength={10} maxLength={5000} rows={6} value={datos.mensaje} onChange={e=>setDatos(d=>({...d,mensaje:e.target.value}))}/></label>
   <label className="captacion-trampa" aria-hidden="true">Sitio web<input tabIndex={-1} autoComplete="off" name="sitioWeb" value={datos.sitioWeb} onChange={e=>setDatos(d=>({...d,sitioWeb:e.target.value}))}/></label>
   <label className="captacion-consentimiento"><input type="checkbox" required checked={datos.consentimiento} onChange={e=>setDatos(d=>({...d,consentimiento:e.target.checked}))}/><span>Acepto la <Link to="/privacy">política de privacidad</Link> para que atiendan mi consulta.</span></label>
   <button className="captacion-boton" type="submit" disabled={ocupado}><Send size={18}/>{ocupado?'Enviando…':'Enviar mensaje'}</button>
  </fieldset>
  {error&&<p role="alert" className="captacion-error">{error} Tus datos se conservan para reintentar.</p>}{exito&&<p role="status" className="captacion-exito"><CheckCircle2 size={20}/>Recibimos tu consulta. Nuestro equipo podrá atenderla.</p>}
 </form>
}
