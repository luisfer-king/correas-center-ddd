import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config, type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faFacebookF, faFacebook, faInstagram, faLinkedinIn, faLinkedin, faYoutube, faTwitter, faXTwitter, faWhatsapp, faTiktok, faTelegram, faPinterest, faGithub, faThreads } from '@fortawesome/free-brands-svg-icons'
config.autoAddCss = false
const iconos:Record<string,IconDefinition>={facebook:faFacebook,facebookf:faFacebookF,instagram:faInstagram,linkedin:faLinkedin,linkedinin:faLinkedinIn,youtube:faYoutube,twitter:faTwitter,xtwitter:faXTwitter,whatsapp:faWhatsapp,tiktok:faTiktok,telegram:faTelegram,pinterest:faPinterest,github:faGithub,threads:faThreads}
export function resolverIconoRedSocial(nombre:string|null):IconDefinition|null {
 if(!nombre)return null
 // Admite faInstagram, fab fa-instagram, fa-brands fa-instagram y nombres de marca.
 const token=nombre.trim().split(/\s+/).find(t=>t.startsWith('fa-')&&!['fa-brands','fa-solid','fa-regular'].includes(t))||nombre.trim().split(/\s+/).at(-1)||''
 const clave=token.replace(/^fa[-_]/i,'').replace(/^fa(?=[A-Z])/,'').replace(/[^a-z0-9]/gi,'').toLowerCase()
 return iconos[clave]||null
}
export function IconoRedSocial({nombre}:{nombre:string|null}) { const icono=resolverIconoRedSocial(nombre);return icono?<FontAwesomeIcon icon={icono} aria-hidden="true" className="publico-fa" />:null }
