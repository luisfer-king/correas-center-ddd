import { Link } from 'react-router-dom'
export function BreadcrumbsPublico({ nombre, padre }: { nombre: string; padre?: { nombre: string; ruta: string } }) {
 return <nav className="publico-breadcrumbs" aria-label="Ruta de navegación"><ol><li><Link to="/">Inicio</Link></li>{padre && <li><Link to={padre.ruta}>{padre.nombre}</Link></li>}<li aria-current="page">{nombre}</li></ol></nav>
}
