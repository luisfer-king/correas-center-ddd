import { Package, Factory, Wrench, Cog, Settings, ShieldCheck, Layers, Link, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube, Twitter, Building2, Truck, CircleHelp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
const iconos: Record<string, LucideIcon> = { package: Package, box: Package, cube: Package, factory: Factory, industry: Factory, wrench: Wrench, tools: Wrench, cog: Cog, cogs: Cog, gear: Cog, settings: Settings, shieldcheck: ShieldCheck, layers: Layers, link: Link, mappin: MapPin, mapmarkeralt: MapPin, phone: Phone, mail: Mail, envelope: Mail, clock: Clock, facebook: Facebook, facebookf: Facebook, instagram: Instagram, linkedin: Linkedin, linkedinin: Linkedin, youtube: Youtube, twitter: Twitter, building2: Building2, building: Building2, truck: Truck }
export function IconoPublico({ nombre }: { nombre: string | null }) {
 if (!nombre) return null
 const clave = nombre.replace(/^lucide[-_:]?/i, '').replace(/^fa[-_]?(?=[A-Z])/,'').replace(/[^a-z0-9]/gi, '').toLowerCase()
 const Icono = iconos[clave] || CircleHelp
 // Contenedor estable: no sustituir texto contiguo por un icono cargado de forma asíncrona.
 return <span className="publico-icono" translate="no"><Icono size={20} aria-hidden="true" focusable="false" /></span>
}
