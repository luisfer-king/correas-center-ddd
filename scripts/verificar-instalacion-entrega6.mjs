import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const archivos={
  "src/backend/composition/componer-publicacion.ts": "fbdeda3cc434046e6c99a0018fd4e8999a466a202ff5073680bd0c13fed30a49",
  "src/backend/contexts/catalog-management/application/ports/consulta-publica-soluciones.ts": "37b6a72048195d1c6c67f58f1ab04782c457b59765f388684ebf37d29108e2e2",
  "src/backend/contexts/catalog-management/application/use-cases/publico/leer-soluciones.ts": "da3da7b399f77a9bc0a6029c39de7f6b703630c2e9b837fbf9b354f1e6e4f089",
  "src/backend/contexts/catalog-management/infrastructure/prisma-publico-soluciones.ts": "e9343359215e44f9ea954c93d0294c31478742ac728824d5803d113208b4cc9b",
  "src/backend/contexts/content-management-system/application/use-cases/publico/leer-footer.ts": "bba302d2c9487cc5033ef1ee63c6d6d621b6cbff7ad392b95bbbefd8df7dbdbb",
  "src/frontend/features/catalog/presentation/listado-catalogo.tsx": "4de57522cae373635ad0775adda981b5d0a9a6cfa99ae7c15a20e085a7c3ed0a",
  "src/frontend/features/catalog/presentation/modal-soluciones-industria.tsx": "6f655b89941ca957336118fd2e330fb4e24ec3388f356d780a5d8792cb312306",
  "src/frontend/features/catalog/presentation/vista-industrias.tsx": "eed4fb6d2eb07ea26a4ec6a56efa1cfdd7b59c8a6a735d5b2227d793c470c993",
  "src/frontend/features/publico/api/cliente-soluciones-publicas.ts": "09f23936c771a89fd24efa35790a322af544ccab6c36beddb99cbb203730f49e",
  "src/frontend/features/publico/presentation/bloque-catalogo-inicio.tsx": "658e353bfdd31bfc3a9bf0db6edf3d311c672d42b7374ac74059e0d36395e3e6",
  "src/frontend/features/publico/presentation/componentes-soluciones.tsx": "ed7c885f6614bcffa003245b2a0dc426dbd0698c24baffbe5da98b9dcd3ba2c4",
  "src/frontend/features/publico/presentation/soluciones-publicas.css": "0f46fe279a2801993dd3e608b603762f5ef6c486eeac26825583dac93366458f",
  "src/frontend/features/publico/presentation/soluciones-publicas.tsx": "a56fdef16d4a524b89fab5263313d527d7a3ef20404a43842c68316eb18d395a",
  "src/frontend/features/publico/presentation/soluciones-rutas.ts": "5818dad36f82707b469cb3fd4a802ef3765adbf0f17bf23c234f81ec0ad2fb1c",
  "src/frontend/features/publico/presentation/vista-publica.tsx": "893bd1ee276d2456f60b03e3cdce76810007990ae8ca5be98fabe423f56d61b3",
  "src/shared/publico/catalogo.ts": "33cfa72a54aadfef1b877c21bce4343c6fec53647f519d653c5001c21780b87c"
}
let errores=0
for(const [ruta,esperado] of Object.entries(archivos)){
 try{const bytes=await readFile(new URL('../'+ruta,import.meta.url));if(createHash('sha256').update(bytes).digest('hex')!==esperado){console.error('Archivo distinto a esta revisión: '+ruta);errores++}}
 catch{console.error('Falta archivo: '+ruta);errores++}
}
if(errores){console.error('Copia nuevamente src/ desde el ZIP a la raíz del proyecto. Si hiciste cambios propios, compara antes de reemplazar.');process.exitCode=1}
else console.log('Entrega 6 revisada: todos los archivos coinciden. Reinicia el frontend o despliega el build nuevo para ver los cambios.')
