import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const archivos={
  "src/backend/app.ts": "03bbb9bcc9d5f230616cf9139b2ee504dd69a54f63215869ccd803d84c15c2c5",
  "src/shared/publico/captacion.ts": "fd6635d39110eb00490e1ce90868c25faa7013dc6ea12f9a1100a3c7dae2eef0",
  "src/frontend/features/publico/presentation/datos-asistente-publico.ts": "54000d1d8534410e46664aace94710404541eea4e9204bb5fd87e9c119255632",
  "src/frontend/features/publico/presentation/vista-publica.tsx": "516a900dcf0a4bd4f779e012b5d68ee9e77a3220e026f829aa02fde86ad5c7f8",
  "src/frontend/features/publico/presentation/contacto-publico.tsx": "4b4432bae111e46b3e888b26aa2c187216e57e0f6cadf81cacf2f3e12f38633a",
  "src/frontend/features/publico/presentation/footer-publico.tsx": "78cabc97977a598409e59633e46bf88a5fe8478d12d523405c6dfa2eca2e17d7",
  "src/frontend/features/publico/presentation/contenido-inicio-publico.tsx": "85f0b32713a812a4a1c6a3d1ff75ef81a9da7f2260ddd99bf7579c0a5621b316",
  "src/frontend/features/publico/presentation/formulario-contacto-publico.tsx": "3512e4be3431e96c71a616b20132fd970c9a7d93eaaf2d7acd67877254b455e9",
  "src/frontend/features/publico/presentation/asistente-publico.tsx": "83e68893a61d14120e9a0a768bdce64ecab670dfe08452c0929ff18ded752286",
  "src/frontend/features/publico/presentation/suscripcion-publica.tsx": "d6e749008321d85a8a8bb933c607d4fe316ff6dce689c084a350f582ac28774c",
  "src/frontend/features/publico/presentation/captacion-publica.css": "3fbb162b40225420e2c04ce652834534ca63798a621e3f3047b95c3d2be07dbd",
  "src/frontend/features/commercial/api/publico/cliente-captacion.ts": "130001057540d60d304485ffe1526068fabd06cddf07e46c9c715da491df7048",
  "src/backend/composition/componer-publicacion.ts": "5dd8cb180f60f0ea9c6a62c2ac8fc0459b7a65b8f11a727fc14ada0ca7077ff4",
  "src/backend/contexts/commercial/presentation/rutas-captacion-publica.ts": "83556b43e37bb2e4e2adc375fc3ad7161cef54e1e6d012ea2d8585ab337b2038",
  "src/backend/contexts/commercial/infrastructure/prisma-recepcion-suscripciones-publicas.ts": "5808b8b71aeb7daa0dc56bb0f7a8218196977718286524480d304593eace0518",
  "src/backend/contexts/commercial/infrastructure/prisma-recepcion-contactos-publicos.ts": "a1869dd19a86854d19dcfbed3707f2e4fda4c1093931bbdbb89196e2ff4fac3e",
  "src/backend/contexts/commercial/application/ports/recepcion-suscripciones-publicas.ts": "e275405eaa69e12652e1cc394acdb96652954a05dc4fb0bcf7c3acf67f74ed6f",
  "src/backend/contexts/commercial/application/ports/recepcion-contactos-publicos.ts": "0ddbcdfbb614a9ce1c163b552467486cf4960a3931d0a6be77531395f7591817",
  "src/backend/contexts/commercial/application/use-cases/publico/validar-captacion.ts": "1a23dd8157a1387e05c85abebc2ee5288f2711106d7302bab692889893be47ef",
  "src/backend/contexts/commercial/application/use-cases/publico/recibir-suscripcion.ts": "0e8360b78b54235ebd6bee0ddfb3fe2fec6ded664ccd8a071bc91b27d40fd01f",
  "src/backend/contexts/commercial/application/use-cases/publico/recibir-contacto.ts": "54fc6768088dc1eaacd21ba272618114fa38c3d81795c9d6820bdcf7bff1abe7"
}
let errores=0
for(const [ruta,esperado] of Object.entries(archivos)){
 try{const bytes=await readFile(new URL('../'+ruta,import.meta.url));if(createHash('sha256').update(bytes).digest('hex')!==esperado){console.error('Archivo distinto a la entrega 7: '+ruta);errores++}}
 catch{console.error('Falta archivo: '+ruta);errores++}
}
if(errores){console.error('Revisa la copia de src/ en la raíz del proyecto. Compara antes de reemplazar cambios propios.');process.exitCode=1}
else console.log('Entrega 7: archivos instalados correctamente. Reinicia frontend y backend.')
