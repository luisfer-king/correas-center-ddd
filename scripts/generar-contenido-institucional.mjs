import 'dotenv/config'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { contenidoLegalInicial } from '../src/shared/publico/contenido-legal-inicial.ts'
const id=process.env.PUBLIC_EMPRESA_ID
if(!id||!/^\d{1,19}$/.test(id)||BigInt(id)<1n||BigInt(id)>9223372036854775807n)throw Error('Configura PUBLIC_EMPRESA_ID en .env antes de generar el SQL')
const literal=v=>"'"+String(v).replaceAll("'","''")+"'"
const salida=resolve(process.argv[2]||'scripts/sql/contenido-institucional-inicial.sql')
const bloques=['-- Contenido copiado del sitio anterior. No sobrescribe registros existentes ni reactiva bajas.','BEGIN;']
for(const [identificador,d] of Object.entries(contenidoLegalInicial)){
 bloques.push(`INSERT INTO public.registros(identificador,nombre,descripcion,orden,estado)
SELECT ${literal(identificador)},${literal(d.nombre)},NULL,(SELECT COALESCE(MAX(orden),0)+1 FROM public.registros),'activo'
WHERE NOT EXISTS(SELECT 1 FROM public.registros WHERE identificador=${literal(identificador)})
AND EXISTS(SELECT 1 FROM public.empresas WHERE id=${id} AND estado='activo' AND eliminado_en IS NULL);
INSERT INTO public.registro_contenido(empresa_id,registro_id,titulo,descripcion,orden,estado)
SELECT ${id},r.id,NULL,${literal(d.html)},1,'activo' FROM public.registros r
WHERE r.identificador=${literal(identificador)} AND r.estado='activo' AND r.eliminado_en IS NULL
AND EXISTS(SELECT 1 FROM public.empresas WHERE id=${id} AND estado='activo' AND eliminado_en IS NULL)
AND NOT EXISTS(SELECT 1 FROM public.registro_contenido WHERE empresa_id=${id} AND registro_id=r.id);`)
}
bloques.push('COMMIT;')
await mkdir(dirname(salida),{recursive:true});await writeFile(salida,bloques.join('\n\n')+'\n');console.log('SQL generado; no se conectó ni se modificó la base de datos: '+salida)
