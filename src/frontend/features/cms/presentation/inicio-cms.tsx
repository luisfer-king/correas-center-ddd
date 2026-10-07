import { NavLink } from 'react-router-dom'
import { gruposPermitidos } from '../../iam/presentation/navegacion-portal'
import { usarCapacidadesCms } from './capacidades-cms'

export function InicioCms() {
  const capacidades = usarCapacidadesCms()
  const enlaces = gruposPermitidos(null, null, null, capacidades).flatMap(g => g.enlaces)
    .filter(e => e.acceso?.contexto === 'cms')
  return <section className="cms-panel">
    <p className="cms-eyebrow">Correas Center</p><h1>Contenido del sitio</h1>
    <p>Elige un recurso para consultar sus registros y administrar su publicación.</p>
    <div className="cms-cards">{enlaces.map(e => <NavLink key={e.ruta} to={e.ruta}>
      <strong>{e.etiqueta}</strong><span>Abrir administración →</span>
    </NavLink>)}</div>
  </section>
}
