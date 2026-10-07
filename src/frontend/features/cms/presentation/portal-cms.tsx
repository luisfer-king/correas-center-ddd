import { Outlet } from 'react-router-dom'
import { ProveedorCapacidadesCms, usarCargaCapacidadesCms } from './capacidades-cms'
import './cms.css'

/** Layout de permisos. Todas las rutas se declaran en app/rutas.tsx. */
export function PortalCms() {
  const { datos, error, recargar } = usarCargaCapacidadesCms()
  if (error) return <main className="cms-shell"><section className="cms-panel" style={{ gridColumn: '1 / -1' }}>
    <h1>CMS</h1><p role="alert" className="cms-error">{error}</p><button onClick={recargar}>Reintentar</button>
  </section></main>
  if (!datos) return <main className="cms-shell"><p role="status">Consultando permisos…</p></main>
  return <ProveedorCapacidadesCms datos={datos}>
    <main className="cms-shell"><div className="cms-content" style={{ gridColumn: '1 / -1' }}><Outlet /></div></main>
  </ProveedorCapacidadesCms>
}
