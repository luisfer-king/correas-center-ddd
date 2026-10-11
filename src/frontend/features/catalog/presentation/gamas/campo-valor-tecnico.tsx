import type { TipoDato,ValorTecnico } from '../../api/tipos-gamas'
import { entrada } from './controles-gamas'
export function CampoValorTecnico({tipo,valor,cambiar,nombre,bloqueado=false}:{tipo:TipoDato;valor:ValorTecnico|null;cambiar:(v:ValorTecnico|null)=>void;nombre:string;bloqueado?:boolean}) {
 return <div className="flex min-w-44 flex-col gap-1">
  <label className="flex gap-2 text-xs"><input type="checkbox" checked={valor===null} disabled={bloqueado} onChange={e=>cambiar(e.target.checked?null:tipo==='booleano'?{tipo,valor:false}:{tipo,valor:tipo==='numero'?'0':''})}/>Sin valor · {nombre}</label>
  {tipo==='booleano'?<select aria-label={nombre} className={entrada} disabled={bloqueado||valor===null} value={valor===null?'':String(valor.valor)} onChange={e=>cambiar({tipo,valor:e.target.value==='true'})}><option value="" disabled>Sin valor</option><option value="true">Sí</option><option value="false">No</option></select>:
   <input aria-label={nombre} className={entrada} disabled={bloqueado||valor===null} inputMode={tipo==='numero'?'decimal':undefined} value={valor===null?'':String(valor.valor)} onChange={e=>cambiar({tipo,valor:e.target.value})} />}
 </div>
}
export function validarValor(v:ValorTecnico|null):void {
 if(v?.tipo==='numero'&&!/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(v.valor))throw new Error('Usa un decimal con punto, sin separador de miles ni notación exponencial.')
}
