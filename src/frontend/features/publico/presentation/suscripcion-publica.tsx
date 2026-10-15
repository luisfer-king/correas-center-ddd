import { useRef,useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { solicitarSuscripcionPublica } from '../../commercial/api/publico/cliente-captacion'
export function SuscripcionPublica(){
 const [email,setEmail]=useState(''),[acepta,setAcepta]=useState(false),[trampa,setTrampa]=useState(''),[ocupado,setOcupado]=useState(false),[error,setError]=useState(''),[exito,setExito]=useState(false),enviando=useRef(false)
 return <form className="suscripcion-publica" onSubmit={async e=>{e.preventDefault();if(enviando.current)return;enviando.current=true;setOcupado(true);setError('');setExito(false);try{await solicitarSuscripcionPublica({email,consentimiento:acepta,sitioWeb:trampa});setExito(true);setEmail('');setAcepta(false)}catch(e){setError(e instanceof Error?e.message:'No se pudo registrar la solicitud')}finally{enviando.current=false;setOcupado(false)}}}>
  <div><label className="sr-only" htmlFor="correo-suscripcion">Correo para novedades</label><input id="correo-suscripcion" type="email" required maxLength={254} autoComplete="email" placeholder="Tu correo electrónico" value={email} onChange={e=>setEmail(e.target.value)} disabled={ocupado}/><button type="submit" disabled={ocupado}>{ocupado?'Enviando…':'Suscribirme'}<ArrowRight size={18}/></button></div>
  <label className="captacion-trampa" aria-hidden="true">Sitio web<input tabIndex={-1} autoComplete="off" value={trampa} onChange={e=>setTrampa(e.target.value)}/></label>
  <label className="captacion-consentimiento"><input type="checkbox" required checked={acepta} onChange={e=>setAcepta(e.target.checked)} disabled={ocupado}/><span>Deseo recibir novedades y acepto la <Link to="/privacy">política de privacidad</Link>.</span></label>
  {error&&<p role="alert">{error}</p>}{exito&&<p role="status">Recibimos tu solicitud de suscripción.</p>}
 </form>
}
