# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Estructura del proyecto

```
correas-center-ddd
├─ .env
├─ .env.example
├─ eslint.config.js
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ prisma
│  ├─ cms-permisos.sql
│  ├─ migrations
│  │  ├─ 20260925043331_inicial_cuatro_contextos
│  │  │  └─ migration.sql
│  │  ├─ 20260925054756_estado_asignaciones_iam
│  │  │  └─ migration.sql
│  │  ├─ 20261008185139_items_menu_nombre_categoria_orden
│  │  │  └─ migration.sql
│  │  ├─ 20261008212000_completar_items_menu
│  │  │  └─ migration.sql
│  │  ├─ 20261008212924_completar_items_menu
│  │  │  └─ migration.sql
│  │  ├─ 20261009015500_retirar_stats_contenido_registro
│  │  │  └─ migration.sql
│  │  ├─ 20261010023000_gamas_categoria_modelo
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  ├─ schema.prisma.antes-items-menu-v1
│  ├─ schema.prisma.antes-registros-v1
│  ├─ seed.ts
│  └─ verificar-cms-permisos.sql
├─ prisma7.config.ts
├─ public
│  ├─ favicon.svg
│  ├─ icons.svg
│  ├─ Logo_CC_Blanco.png
│  ├─ Logo_CC_Negro.png
│  └─ Logo_Correas_Center_Oficial.png
├─ README.md
├─ scripts
│  ├─ generar-contenido-institucional.mjs
│  ├─ iniciar-frontend.mjs
│  ├─ iniciar-frontend.test.mjs
│  ├─ integrar-cms-frontend.mjs
│  ├─ integrar-cms-frontend.test.mjs
│  ├─ integrar-cms.mjs
│  ├─ integrar-cms.test.mjs
│  ├─ integrar-fase4-entrega1.mjs
│  ├─ integrar-fase4-entrega1.test.mjs
│  ├─ integrar-fase4-entrega2.mjs
│  ├─ integrar-fase4-entrega2.test.mjs
│  ├─ integrar-items-menu.mjs
│  ├─ integrar-items-menu.test.mjs
│  ├─ integrar-registros.mjs
│  ├─ integrar-registros.test.mjs
│  ├─ integrar-vista-publica.mjs
│  ├─ integrar-vista-publica.test.mjs
│  ├─ sql
│  │  ├─ agregar-permisos-industria-asignaciones.sql
│  │  ├─ agregar-subenlaces-categorias-productos.sql
│  │  ├─ completar-gamas-3vx-5vx.sql
│  │  ├─ contenido-institucional-inicial.sql
│  │  ├─ gama-correas-trapezoidales.sql
│  │  ├─ permisos-gamas-api.sql
│  │  └─ reparar-secuencia-configuracion-sitio.sql
│  ├─ verificar-administracion-gamas.test.tsx
│  ├─ verificar-api-gamas.mjs
│  ├─ verificar-asignaciones-industria-modal.test.tsx
│  ├─ verificar-casos-gamas.mjs
│  ├─ verificar-cierre-entrega5-db.mjs
│  ├─ verificar-cierre-entrega5.test.tsx
│  ├─ verificar-completar-3vx-5vx.mjs
│  ├─ verificar-contenido-institucional-sql.mjs
│  ├─ verificar-contratos-cms.test.ts
│  ├─ verificar-correccion-publica.test.tsx
│  ├─ verificar-fase4-entrega1.mjs
│  ├─ verificar-fase4-entrega2.test.tsx
│  ├─ verificar-fase4-entrega3.test.tsx
│  ├─ verificar-fase4-entrega4.test.tsx
│  ├─ verificar-fase4-entrega5-backend.test.ts
│  ├─ verificar-fase4-entrega5-sql.mjs
│  ├─ verificar-fase4-entrega5.test.tsx
│  ├─ verificar-fase4-entrega6.test.tsx
│  ├─ verificar-fase4-entrega7.test.tsx
│  ├─ verificar-fase4-entrega8.test.tsx
│  ├─ verificar-formulario-configuracion-sitio.test.tsx
│  ├─ verificar-formulario-footer.test.tsx
│  ├─ verificar-formulario-menu.test.tsx
│  ├─ verificar-formulario-registros.test.tsx
│  ├─ verificar-formulario-seccion.test.tsx
│  ├─ verificar-formulario-tipo-seccion.test.tsx
│  ├─ verificar-formulario-wizard.test.tsx
│  ├─ verificar-imagenes-backup.mjs
│  ├─ verificar-imagenes-navigation.test.tsx
│  ├─ verificar-instalacion-entrega6.mjs
│  ├─ verificar-instalacion-entrega7.mjs
│  ├─ verificar-items-menu.test.tsx
│  ├─ verificar-marco-publico.test.tsx
│  ├─ verificar-migracion-gamas.mjs
│  ├─ verificar-navigation-publica.test.tsx
│  ├─ verificar-repositorios-gamas.mjs
│  ├─ verificar-ruta-subenlace.test.ts
│  ├─ verificar-sufijo-menu.test.ts
│  └─ verificar-vistas-cms.test.tsx
├─ skills-lock.json
├─ src
│  ├─ backend
│  │  ├─ app.ts
│  │  ├─ app.ts.antes-cms
│  │  ├─ app.ts.fase4-entrega1-1791776944187.bak
│  │  ├─ app.ts.publico-1791464710070.bak
│  │  ├─ composition
│  │  │  └─ componer-publicacion.ts
│  │  ├─ contexts
│  │  │  ├─ catalog-management
│  │  │  │  ├─ application
│  │  │  │  │  ├─ acceso-catalogo.ts
│  │  │  │  │  ├─ componer-casos-gamas.ts
│  │  │  │  │  ├─ copiar-estructura-gama.ts
│  │  │  │  │  ├─ fecha-cambio-catalogo.ts
│  │  │  │  │  ├─ gamas-aplicacion.ts
│  │  │  │  │  ├─ ports
│  │  │  │  │  │  ├─ consulta-publica-categorias.ts
│  │  │  │  │  │  ├─ consulta-publica-destinos.ts
│  │  │  │  │  │  ├─ consulta-publica-detalle-producto.ts
│  │  │  │  │  │  ├─ consulta-publica-gamas.ts
│  │  │  │  │  │  ├─ consulta-publica-industrias.ts
│  │  │  │  │  │  ├─ consulta-publica-marcas.ts
│  │  │  │  │  │  ├─ consulta-publica-productos.ts
│  │  │  │  │  │  ├─ consulta-publica-servicios.ts
│  │  │  │  │  │  ├─ consulta-publica-soluciones.ts
│  │  │  │  │  │  ├─ repositorio-asignaciones-atributo.ts
│  │  │  │  │  │  ├─ repositorio-asignaciones-industria.ts
│  │  │  │  │  │  ├─ repositorio-asignaciones-marca.ts
│  │  │  │  │  │  ├─ repositorio-atributos-tecnicos.ts
│  │  │  │  │  │  ├─ repositorio-categorias.ts
│  │  │  │  │  │  ├─ repositorio-columnas-gama.ts
│  │  │  │  │  │  ├─ repositorio-filas-gama.ts
│  │  │  │  │  │  ├─ repositorio-gamas.ts
│  │  │  │  │  │  ├─ repositorio-grupos-columnas-gama.ts
│  │  │  │  │  │  ├─ repositorio-grupos-filas-gama.ts
│  │  │  │  │  │  ├─ repositorio-industrias.ts
│  │  │  │  │  │  ├─ repositorio-marcas-producto.ts
│  │  │  │  │  │  ├─ repositorio-marcas.ts
│  │  │  │  │  │  ├─ repositorio-plantillas-gama.ts
│  │  │  │  │  │  ├─ repositorio-productos.ts
│  │  │  │  │  │  ├─ repositorio-servicios.ts
│  │  │  │  │  │  ├─ repositorio-tipos-atributo.ts
│  │  │  │  │  │  ├─ repositorio-valores-gama.ts
│  │  │  │  │  │  └─ unidad-trabajo-gamas.ts
│  │  │  │  │  ├─ tests
│  │  │  │  │  │  ├─ atributos-tipados-casos.test.ts
│  │  │  │  │  │  ├─ casos-catalogo.test.ts
│  │  │  │  │  │  ├─ gamas-casos.test.ts
│  │  │  │  │  │  ├─ marcas-producto.test.ts
│  │  │  │  │  │  └─ slugs-automaticos.test.ts
│  │  │  │  │  ├─ use-cases
│  │  │  │  │  │  ├─ asignaciones-atributo
│  │  │  │  │  │  │  ├─ activar-asignacion-atributo.ts
│  │  │  │  │  │  │  ├─ crear-asignacion-atributo.ts
│  │  │  │  │  │  │  ├─ editar-asignacion-atributo.ts
│  │  │  │  │  │  │  ├─ eliminar-asignacion-atributo.ts
│  │  │  │  │  │  │  ├─ inactivar-asignacion-atributo.ts
│  │  │  │  │  │  │  ├─ listar-asignaciones-atributo.ts
│  │  │  │  │  │  │  └─ obtener-asignacion-atributo.ts
│  │  │  │  │  │  ├─ asignaciones-industria
│  │  │  │  │  │  │  ├─ activar-asignacion-industria.ts
│  │  │  │  │  │  │  ├─ crear-asignacion-industria.ts
│  │  │  │  │  │  │  ├─ editar-asignacion-industria.ts
│  │  │  │  │  │  │  ├─ eliminar-asignacion-industria.ts
│  │  │  │  │  │  │  ├─ inactivar-asignacion-industria.ts
│  │  │  │  │  │  │  ├─ listar-asignaciones-industria.ts
│  │  │  │  │  │  │  └─ obtener-asignacion-industria.ts
│  │  │  │  │  │  ├─ asignaciones-marca
│  │  │  │  │  │  │  ├─ activar-asignacion-marca.ts
│  │  │  │  │  │  │  ├─ crear-asignacion-marca.ts
│  │  │  │  │  │  │  ├─ editar-asignacion-marca.ts
│  │  │  │  │  │  │  ├─ eliminar-asignacion-marca.ts
│  │  │  │  │  │  │  ├─ inactivar-asignacion-marca.ts
│  │  │  │  │  │  │  ├─ listar-asignaciones-marca.ts
│  │  │  │  │  │  │  └─ obtener-asignacion-marca.ts
│  │  │  │  │  │  ├─ atributos-tecnicos
│  │  │  │  │  │  │  ├─ activar-atributo-tecnico.ts
│  │  │  │  │  │  │  ├─ crear-atributo-tecnico.ts
│  │  │  │  │  │  │  ├─ editar-atributo-tecnico.ts
│  │  │  │  │  │  │  ├─ eliminar-atributo-tecnico.ts
│  │  │  │  │  │  │  ├─ inactivar-atributo-tecnico.ts
│  │  │  │  │  │  │  ├─ listar-atributos-tecnicos.ts
│  │  │  │  │  │  │  ├─ obtener-atributo-tecnico.ts
│  │  │  │  │  │  │  └─ reordenar-atributo-tecnico.ts
│  │  │  │  │  │  ├─ auditoria
│  │  │  │  │  │  │  ├─ registrar-lectura-catalogo.ts
│  │  │  │  │  │  │  └─ registrar-lectura-gamas.ts
│  │  │  │  │  │  ├─ autorizacion
│  │  │  │  │  │  │  └─ obtener-capacidades-catalogo.ts
│  │  │  │  │  │  ├─ categorias
│  │  │  │  │  │  │  ├─ activar-categoria.ts
│  │  │  │  │  │  │  ├─ crear-categoria.ts
│  │  │  │  │  │  │  ├─ editar-categoria.ts
│  │  │  │  │  │  │  ├─ eliminar-categoria.ts
│  │  │  │  │  │  │  ├─ inactivar-categoria.ts
│  │  │  │  │  │  │  ├─ listar-categorias.ts
│  │  │  │  │  │  │  ├─ obtener-categoria.ts
│  │  │  │  │  │  │  └─ reordenar-categoria.ts
│  │  │  │  │  │  ├─ columnas-gama
│  │  │  │  │  │  │  ├─ activar-columna-gama.ts
│  │  │  │  │  │  │  ├─ crear-columna-gama.ts
│  │  │  │  │  │  │  ├─ editar-columna-gama.ts
│  │  │  │  │  │  │  ├─ eliminar-columna-gama.ts
│  │  │  │  │  │  │  ├─ inactivar-columna-gama.ts
│  │  │  │  │  │  │  ├─ mover-columna-gama.ts
│  │  │  │  │  │  │  └─ reordenar-columna-gama.ts
│  │  │  │  │  │  ├─ filas-gama
│  │  │  │  │  │  │  ├─ activar-fila-gama.ts
│  │  │  │  │  │  │  ├─ crear-fila-gama.ts
│  │  │  │  │  │  │  ├─ editar-fila-gama.ts
│  │  │  │  │  │  │  ├─ eliminar-fila-gama.ts
│  │  │  │  │  │  │  ├─ inactivar-fila-gama.ts
│  │  │  │  │  │  │  ├─ mover-fila-gama.ts
│  │  │  │  │  │  │  └─ reordenar-fila-gama.ts
│  │  │  │  │  │  ├─ gamas
│  │  │  │  │  │  │  ├─ activar-gama-categoria.ts
│  │  │  │  │  │  │  ├─ crear-gama-categoria.ts
│  │  │  │  │  │  │  ├─ editar-gama-categoria.ts
│  │  │  │  │  │  │  ├─ eliminar-gama-categoria.ts
│  │  │  │  │  │  │  ├─ inactivar-gama-categoria.ts
│  │  │  │  │  │  │  ├─ listar-gamas-producto.ts
│  │  │  │  │  │  │  ├─ obtener-gama-categoria.ts
│  │  │  │  │  │  │  └─ obtener-gama-por-categoria.ts
│  │  │  │  │  │  ├─ grupos-columnas-gama
│  │  │  │  │  │  │  ├─ activar-grupo-columna-gama.ts
│  │  │  │  │  │  │  ├─ crear-grupo-columna-gama.ts
│  │  │  │  │  │  │  ├─ editar-grupo-columna-gama.ts
│  │  │  │  │  │  │  ├─ eliminar-grupo-columna-gama.ts
│  │  │  │  │  │  │  ├─ inactivar-grupo-columna-gama.ts
│  │  │  │  │  │  │  ├─ mover-grupo-columna-gama.ts
│  │  │  │  │  │  │  └─ reordenar-grupo-columna-gama.ts
│  │  │  │  │  │  ├─ grupos-filas-gama
│  │  │  │  │  │  │  ├─ activar-grupo-fila-gama.ts
│  │  │  │  │  │  │  ├─ crear-grupo-fila-gama.ts
│  │  │  │  │  │  │  ├─ editar-grupo-fila-gama.ts
│  │  │  │  │  │  │  ├─ eliminar-grupo-fila-gama.ts
│  │  │  │  │  │  │  ├─ inactivar-grupo-fila-gama.ts
│  │  │  │  │  │  │  ├─ mover-grupo-fila-gama.ts
│  │  │  │  │  │  │  └─ reordenar-grupo-fila-gama.ts
│  │  │  │  │  │  ├─ industrias
│  │  │  │  │  │  │  ├─ activar-industria.ts
│  │  │  │  │  │  │  ├─ crear-industria.ts
│  │  │  │  │  │  │  ├─ editar-industria.ts
│  │  │  │  │  │  │  ├─ eliminar-industria.ts
│  │  │  │  │  │  │  ├─ inactivar-industria.ts
│  │  │  │  │  │  │  ├─ listar-industrias.ts
│  │  │  │  │  │  │  ├─ obtener-industria.ts
│  │  │  │  │  │  │  └─ reordenar-industria.ts
│  │  │  │  │  │  ├─ marcas
│  │  │  │  │  │  │  ├─ activar-marca.ts
│  │  │  │  │  │  │  ├─ crear-marca.ts
│  │  │  │  │  │  │  ├─ editar-marca.ts
│  │  │  │  │  │  │  ├─ eliminar-marca.ts
│  │  │  │  │  │  │  ├─ inactivar-marca.ts
│  │  │  │  │  │  │  ├─ listar-marcas.ts
│  │  │  │  │  │  │  ├─ obtener-marca.ts
│  │  │  │  │  │  │  └─ reordenar-marca.ts
│  │  │  │  │  │  ├─ plantillas-gama
│  │  │  │  │  │  │  ├─ copiar-gama-categoria.ts
│  │  │  │  │  │  │  ├─ copiar-gama-desde-plantilla.ts
│  │  │  │  │  │  │  ├─ obtener-plantilla-gama.ts
│  │  │  │  │  │  │  ├─ quitar-plantilla-gama.ts
│  │  │  │  │  │  │  └─ seleccionar-plantilla-gama.ts
│  │  │  │  │  │  ├─ productos
│  │  │  │  │  │  │  ├─ activar-producto.ts
│  │  │  │  │  │  │  ├─ crear-producto.ts
│  │  │  │  │  │  │  ├─ editar-producto.ts
│  │  │  │  │  │  │  ├─ eliminar-producto.ts
│  │  │  │  │  │  │  ├─ gestionar-marcas-producto.ts
│  │  │  │  │  │  │  ├─ inactivar-producto.ts
│  │  │  │  │  │  │  ├─ listar-productos.ts
│  │  │  │  │  │  │  ├─ obtener-producto.ts
│  │  │  │  │  │  │  └─ reordenar-producto.ts
│  │  │  │  │  │  ├─ publico
│  │  │  │  │  │  │  ├─ leer-categorias.ts
│  │  │  │  │  │  │  ├─ leer-detalle-producto.ts
│  │  │  │  │  │  │  ├─ leer-gama-categoria.ts
│  │  │  │  │  │  │  ├─ leer-industrias.ts
│  │  │  │  │  │  │  ├─ leer-marcas.ts
│  │  │  │  │  │  │  ├─ leer-productos.ts
│  │  │  │  │  │  │  ├─ leer-servicios.ts
│  │  │  │  │  │  │  └─ leer-soluciones.ts
│  │  │  │  │  │  ├─ servicios
│  │  │  │  │  │  │  ├─ activar-servicio.ts
│  │  │  │  │  │  │  ├─ crear-servicio.ts
│  │  │  │  │  │  │  ├─ editar-servicio.ts
│  │  │  │  │  │  │  ├─ eliminar-servicio.ts
│  │  │  │  │  │  │  ├─ inactivar-servicio.ts
│  │  │  │  │  │  │  ├─ listar-servicios.ts
│  │  │  │  │  │  │  ├─ obtener-servicio.ts
│  │  │  │  │  │  │  └─ reordenar-servicio.ts
│  │  │  │  │  │  ├─ tipos-atributo
│  │  │  │  │  │  │  ├─ activar-tipo-atributo.ts
│  │  │  │  │  │  │  ├─ crear-tipo-atributo.ts
│  │  │  │  │  │  │  ├─ editar-tipo-atributo.ts
│  │  │  │  │  │  │  ├─ eliminar-tipo-atributo.ts
│  │  │  │  │  │  │  ├─ inactivar-tipo-atributo.ts
│  │  │  │  │  │  │  ├─ listar-tipos-atributo.ts
│  │  │  │  │  │  │  ├─ obtener-tipo-atributo.ts
│  │  │  │  │  │  │  └─ reordenar-tipo-atributo.ts
│  │  │  │  │  │  └─ valores-gama
│  │  │  │  │  │     └─ guardar-valores-gama.ts
│  │  │  │  │  └─ valor-asignacion-aplicacion.ts
│  │  │  │  ├─ domain
│  │  │  │  │  ├─ asignacion-atributo.ts
│  │  │  │  │  ├─ asignacion-industria.ts
│  │  │  │  │  ├─ asignacion-marca.ts
│  │  │  │  │  ├─ atributo-tecnico.ts
│  │  │  │  │  ├─ catalog-values.ts
│  │  │  │  │  ├─ categoria.ts
│  │  │  │  │  ├─ columna-gama.ts
│  │  │  │  │  ├─ fila-gama.ts
│  │  │  │  │  ├─ gama-categoria.ts
│  │  │  │  │  ├─ gama-values.ts
│  │  │  │  │  ├─ grupo-columna-gama.ts
│  │  │  │  │  ├─ grupo-fila-gama.ts
│  │  │  │  │  ├─ grupo-gama.ts
│  │  │  │  │  ├─ industria.ts
│  │  │  │  │  ├─ marca.ts
│  │  │  │  │  ├─ plantilla-gama-producto.ts
│  │  │  │  │  ├─ producto.ts
│  │  │  │  │  ├─ servicio.ts
│  │  │  │  │  ├─ tests
│  │  │  │  │  │  └─ gamas.test.ts
│  │  │  │  │  ├─ tipo-atributo.ts
│  │  │  │  │  ├─ valor-gama.ts
│  │  │  │  │  └─ valor-tecnico.ts
│  │  │  │  ├─ infrastructure
│  │  │  │  │  ├─ componer-catalogo.ts
│  │  │  │  │  ├─ componer-gamas.ts
│  │  │  │  │  ├─ componer-persistencia-gamas.ts
│  │  │  │  │  ├─ mappers
│  │  │  │  │  │  ├─ asignacion-atributo.ts
│  │  │  │  │  │  ├─ asignacion-industria.ts
│  │  │  │  │  │  ├─ asignacion-marca.ts
│  │  │  │  │  │  ├─ atributo-tecnico.ts
│  │  │  │  │  │  ├─ categoria.ts
│  │  │  │  │  │  ├─ columna-gama.ts
│  │  │  │  │  │  ├─ fila-gama.ts
│  │  │  │  │  │  ├─ gama-categoria.ts
│  │  │  │  │  │  ├─ grupo-columna-gama.ts
│  │  │  │  │  │  ├─ grupo-fila-gama.ts
│  │  │  │  │  │  ├─ industria.ts
│  │  │  │  │  │  ├─ marca.ts
│  │  │  │  │  │  ├─ plantilla-gama-producto.ts
│  │  │  │  │  │  ├─ producto.ts
│  │  │  │  │  │  ├─ servicio.ts
│  │  │  │  │  │  ├─ tipo-atributo.ts
│  │  │  │  │  │  └─ valor-gama.ts
│  │  │  │  │  ├─ operaciones-catalogo.ts
│  │  │  │  │  ├─ operaciones-gamas.ts
│  │  │  │  │  ├─ prisma-asignaciones-atributo.ts
│  │  │  │  │  ├─ prisma-asignaciones-industria.ts
│  │  │  │  │  ├─ prisma-asignaciones-marca.ts
│  │  │  │  │  ├─ prisma-atributos-tecnicos.ts
│  │  │  │  │  ├─ prisma-categorias.ts
│  │  │  │  │  ├─ prisma-columnas-gama.ts
│  │  │  │  │  ├─ prisma-filas-gama.ts
│  │  │  │  │  ├─ prisma-gamas.ts
│  │  │  │  │  ├─ prisma-grupos-columnas-gama.ts
│  │  │  │  │  ├─ prisma-grupos-filas-gama.ts
│  │  │  │  │  ├─ prisma-industrias.ts
│  │  │  │  │  ├─ prisma-marcas-producto.ts
│  │  │  │  │  ├─ prisma-marcas.ts
│  │  │  │  │  ├─ prisma-plantillas-gama.ts
│  │  │  │  │  ├─ prisma-productos.ts
│  │  │  │  │  ├─ prisma-publico-categorias.ts
│  │  │  │  │  ├─ prisma-publico-destinos.ts
│  │  │  │  │  ├─ prisma-publico-detalle-producto.ts
│  │  │  │  │  ├─ prisma-publico-gamas.ts
│  │  │  │  │  ├─ prisma-publico-industrias.ts
│  │  │  │  │  ├─ prisma-publico-marcas.ts
│  │  │  │  │  ├─ prisma-publico-productos.ts
│  │  │  │  │  ├─ prisma-publico-servicios.ts
│  │  │  │  │  ├─ prisma-publico-soluciones.ts
│  │  │  │  │  ├─ prisma-servicios.ts
│  │  │  │  │  ├─ prisma-tipos-atributo.ts
│  │  │  │  │  ├─ prisma-unidad-trabajo-gamas.ts
│  │  │  │  │  ├─ prisma-valores-gama.ts
│  │  │  │  │  └─ tests
│  │  │  │  │     ├─ asignacion-atributo.ts
│  │  │  │  │     ├─ asignacion-industria.ts
│  │  │  │  │     ├─ asignacion-marca.ts
│  │  │  │  │     ├─ atributo-tecnico.ts
│  │  │  │  │     ├─ categoria.ts
│  │  │  │  │     ├─ gamas-compatibilidad.test.ts
│  │  │  │  │     ├─ industria.ts
│  │  │  │  │     ├─ marca.ts
│  │  │  │  │     ├─ marcas-producto-lote.test.ts
│  │  │  │  │     ├─ producto.ts
│  │  │  │  │     ├─ repositorios-gamas.test.ts
│  │  │  │  │     ├─ servicio.ts
│  │  │  │  │     └─ tipo-atributo.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ errores-gamas.ts
│  │  │  │     ├─ errores-http-catalogo.ts
│  │  │  │     ├─ esquema-asignacion-atributo.ts
│  │  │  │     ├─ esquema-asignacion-industria.ts
│  │  │  │     ├─ esquema-asignacion-marca.ts
│  │  │  │     ├─ esquema-atributo-tecnico.ts
│  │  │  │     ├─ esquema-categoria.ts
│  │  │  │     ├─ esquema-industria.ts
│  │  │  │     ├─ esquema-marca.ts
│  │  │  │     ├─ esquema-producto.ts
│  │  │  │     ├─ esquema-servicio.ts
│  │  │  │     ├─ esquema-tipo-atributo.ts
│  │  │  │     ├─ esquemas-catalogo.ts
│  │  │  │     ├─ esquemas-gamas.ts
│  │  │  │     ├─ esquemas-salidas-gamas.ts
│  │  │  │     ├─ http-gamas.ts
│  │  │  │     ├─ registrar-rutas-catalogo.ts
│  │  │  │     ├─ registrar-rutas-gamas.ts
│  │  │  │     ├─ rutas-asignaciones-atributo.ts
│  │  │  │     ├─ rutas-asignaciones-industria.ts
│  │  │  │     ├─ rutas-asignaciones-marca.ts
│  │  │  │     ├─ rutas-atributos-tecnicos.ts
│  │  │  │     ├─ rutas-categorias.ts
│  │  │  │     ├─ rutas-columnas-gama.ts
│  │  │  │     ├─ rutas-filas-gama.ts
│  │  │  │     ├─ rutas-gamas.ts
│  │  │  │     ├─ rutas-grupos-columnas-gama.ts
│  │  │  │     ├─ rutas-grupos-filas-gama.ts
│  │  │  │     ├─ rutas-imagenes-catalogo.ts
│  │  │  │     ├─ rutas-industrias.ts
│  │  │  │     ├─ rutas-marcas.ts
│  │  │  │     ├─ rutas-plantillas-gama.ts
│  │  │  │     ├─ rutas-productos.ts
│  │  │  │     ├─ rutas-publicas-categorias.ts
│  │  │  │     ├─ rutas-publicas-detalle-producto.ts
│  │  │  │     ├─ rutas-publicas-gamas.ts
│  │  │  │     ├─ rutas-publicas-industrias.ts
│  │  │  │     ├─ rutas-publicas-marcas.ts
│  │  │  │     ├─ rutas-publicas-productos.ts
│  │  │  │     ├─ rutas-publicas-servicios.ts
│  │  │  │     ├─ rutas-servicios.ts
│  │  │  │     ├─ rutas-tipos-atributo.ts
│  │  │  │     ├─ rutas-valores-gama.ts
│  │  │  │     ├─ salidas
│  │  │  │     │  ├─ asignacion-atributo.ts
│  │  │  │     │  ├─ asignacion-industria.ts
│  │  │  │     │  ├─ asignacion-marca.ts
│  │  │  │     │  ├─ atributo-tecnico.ts
│  │  │  │     │  ├─ categoria.ts
│  │  │  │     │  ├─ gama.ts
│  │  │  │     │  ├─ industria.ts
│  │  │  │     │  ├─ marca.ts
│  │  │  │     │  ├─ producto.ts
│  │  │  │     │  ├─ servicio.ts
│  │  │  │     │  └─ tipo-atributo.ts
│  │  │  │     └─ tests
│  │  │  │        ├─ rutas-catalogo.test.ts
│  │  │  │        └─ rutas-gamas.test.ts
│  │  │  ├─ commercial
│  │  │  │  ├─ application
│  │  │  │  │  ├─ acceso-crm.ts
│  │  │  │  │  ├─ fecha-cambio-crm.ts
│  │  │  │  │  ├─ ports
│  │  │  │  │  │  ├─ consulta-publica-empresa.ts
│  │  │  │  │  │  ├─ consulta-publica-sucursales.ts
│  │  │  │  │  │  ├─ recepcion-contactos-publicos.ts
│  │  │  │  │  │  ├─ recepcion-suscripciones-publicas.ts
│  │  │  │  │  │  ├─ repositorio-contactos-entrantes.ts
│  │  │  │  │  │  ├─ repositorio-empresas.ts
│  │  │  │  │  │  ├─ repositorio-leads.ts
│  │  │  │  │  │  ├─ repositorio-sucursales.ts
│  │  │  │  │  │  └─ repositorio-suscriptores.ts
│  │  │  │  │  ├─ tests
│  │  │  │  │  │  ├─ autorizacion-casos.test.ts
│  │  │  │  │  │  ├─ contactos-casos.test.ts
│  │  │  │  │  │  ├─ empresas-casos.test.ts
│  │  │  │  │  │  ├─ leads-casos.test.ts
│  │  │  │  │  │  ├─ sucursales-casos.test.ts
│  │  │  │  │  │  └─ suscriptores-casos.test.ts
│  │  │  │  │  ├─ use-cases
│  │  │  │  │  │  ├─ autorizacion
│  │  │  │  │  │  │  └─ obtener-capacidades-crm.ts
│  │  │  │  │  │  ├─ contactos
│  │  │  │  │  │  │  ├─ archivar-contacto.ts
│  │  │  │  │  │  │  ├─ crear-contacto.ts
│  │  │  │  │  │  │  ├─ eliminar-contacto.ts
│  │  │  │  │  │  │  ├─ listar-contactos.ts
│  │  │  │  │  │  │  ├─ marcar-contacto-respondido.ts
│  │  │  │  │  │  │  └─ obtener-contacto.ts
│  │  │  │  │  │  ├─ empresas
│  │  │  │  │  │  │  ├─ activar-empresa.ts
│  │  │  │  │  │  │  ├─ crear-empresa.ts
│  │  │  │  │  │  │  ├─ editar-empresa.ts
│  │  │  │  │  │  │  ├─ eliminar-empresa.ts
│  │  │  │  │  │  │  ├─ inactivar-empresa.ts
│  │  │  │  │  │  │  ├─ listar-empresas.ts
│  │  │  │  │  │  │  └─ obtener-empresa.ts
│  │  │  │  │  │  ├─ leads
│  │  │  │  │  │  │  ├─ asignar-responsable-lead.ts
│  │  │  │  │  │  │  ├─ calificar-lead.ts
│  │  │  │  │  │  │  ├─ crear-lead.ts
│  │  │  │  │  │  │  ├─ descartar-lead.ts
│  │  │  │  │  │  │  ├─ eliminar-lead.ts
│  │  │  │  │  │  │  ├─ listar-leads.ts
│  │  │  │  │  │  │  └─ obtener-lead.ts
│  │  │  │  │  │  ├─ publico
│  │  │  │  │  │  │  ├─ leer-empresa.ts
│  │  │  │  │  │  │  ├─ leer-sucursales.ts
│  │  │  │  │  │  │  ├─ recibir-contacto.ts
│  │  │  │  │  │  │  ├─ recibir-suscripcion.ts
│  │  │  │  │  │  │  └─ validar-captacion.ts
│  │  │  │  │  │  ├─ sucursales
│  │  │  │  │  │  │  ├─ activar-sucursal.ts
│  │  │  │  │  │  │  ├─ crear-sucursal.ts
│  │  │  │  │  │  │  ├─ editar-sucursal.ts
│  │  │  │  │  │  │  ├─ eliminar-sucursal.ts
│  │  │  │  │  │  │  ├─ inactivar-sucursal.ts
│  │  │  │  │  │  │  ├─ listar-sucursales.ts
│  │  │  │  │  │  │  └─ obtener-sucursal.ts
│  │  │  │  │  │  └─ suscriptores
│  │  │  │  │  │     ├─ activar-suscriptor.ts
│  │  │  │  │  │     ├─ crear-suscriptor.ts
│  │  │  │  │  │     ├─ desuscribir-suscriptor.ts
│  │  │  │  │  │     ├─ editar-suscriptor.ts
│  │  │  │  │  │     ├─ eliminar-suscriptor.ts
│  │  │  │  │  │     ├─ inactivar-suscriptor.ts
│  │  │  │  │  │     ├─ listar-suscriptores.ts
│  │  │  │  │  │     └─ obtener-suscriptor.ts
│  │  │  │  │  └─ validaciones-crm.ts
│  │  │  │  ├─ domain
│  │  │  │  │  ├─ commercial-values.ts
│  │  │  │  │  ├─ contacto-entrante.ts
│  │  │  │  │  ├─ empresa.ts
│  │  │  │  │  ├─ lead.ts
│  │  │  │  │  ├─ sucursal.ts
│  │  │  │  │  └─ suscriptor.ts
│  │  │  │  ├─ infrastructure
│  │  │  │  │  ├─ componer-crm.ts
│  │  │  │  │  ├─ mappers
│  │  │  │  │  │  ├─ contacto-entrante.ts
│  │  │  │  │  │  ├─ empresa.ts
│  │  │  │  │  │  ├─ lead.ts
│  │  │  │  │  │  ├─ sucursal.ts
│  │  │  │  │  │  └─ suscriptor.ts
│  │  │  │  │  ├─ operaciones-crm.ts
│  │  │  │  │  ├─ prisma-contactos-entrantes.ts
│  │  │  │  │  ├─ prisma-empresas.ts
│  │  │  │  │  ├─ prisma-leads.ts
│  │  │  │  │  ├─ prisma-publico-empresa.ts
│  │  │  │  │  ├─ prisma-publico-sucursales.ts
│  │  │  │  │  ├─ prisma-recepcion-contactos-publicos.ts
│  │  │  │  │  ├─ prisma-recepcion-suscripciones-publicas.ts
│  │  │  │  │  ├─ prisma-sucursales.ts
│  │  │  │  │  ├─ prisma-suscriptores.ts
│  │  │  │  │  └─ tests
│  │  │  │  │     ├─ prisma-contactos-entrantes.test.ts
│  │  │  │  │     ├─ prisma-empresas.test.ts
│  │  │  │  │     ├─ prisma-leads.test.ts
│  │  │  │  │     ├─ prisma-sucursales.test.ts
│  │  │  │  │     └─ prisma-suscriptores.test.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ errores-http-crm.ts
│  │  │  │     ├─ esquemas-crm.ts
│  │  │  │     ├─ registrar-lectura-crm.ts
│  │  │  │     ├─ registrar-rutas-crm.ts
│  │  │  │     ├─ rutas-captacion-publica.ts
│  │  │  │     ├─ rutas-contactos.ts
│  │  │  │     ├─ rutas-empresas.ts
│  │  │  │     ├─ rutas-leads.ts
│  │  │  │     ├─ rutas-logo-empresa.ts
│  │  │  │     ├─ rutas-publicas-empresa.ts
│  │  │  │     ├─ rutas-publicas-sucursales.ts
│  │  │  │     ├─ rutas-sucursales.ts
│  │  │  │     ├─ rutas-suscriptores.ts
│  │  │  │     ├─ salidas-crm.ts
│  │  │  │     └─ tests
│  │  │  │        ├─ bandejas-crm.test.ts
│  │  │  │        └─ rutas-crm.test.ts
│  │  │  ├─ content-management-system
│  │  │  │  ├─ application
│  │  │  │  │  ├─ operaciones-cms.ts
│  │  │  │  │  ├─ permisos-cms.ts
│  │  │  │  │  ├─ ports
│  │  │  │  │  │  ├─ consulta-publica-configuracion.ts
│  │  │  │  │  │  ├─ consulta-publica-footer.ts
│  │  │  │  │  │  ├─ consulta-publica-menus.ts
│  │  │  │  │  │  ├─ consulta-publica-pasos-wizard.ts
│  │  │  │  │  │  ├─ consulta-publica-registros.ts
│  │  │  │  │  │  ├─ consulta-publica-secciones.ts
│  │  │  │  │  │  ├─ consulta-vista-publica.ts
│  │  │  │  │  │  ├─ repositorio-configuracion-sitio.ts
│  │  │  │  │  │  ├─ repositorio-contenido-registro.ts
│  │  │  │  │  │  ├─ repositorio-contenido-seccion.ts
│  │  │  │  │  │  ├─ repositorio-footer-elemento.ts
│  │  │  │  │  │  ├─ repositorio-menu-item.ts
│  │  │  │  │  │  ├─ repositorio-menu.ts
│  │  │  │  │  │  ├─ repositorio-metadata-seccion.ts
│  │  │  │  │  │  ├─ repositorio-paso-wizard.ts
│  │  │  │  │  │  ├─ repositorio-registro-cms.ts
│  │  │  │  │  │  ├─ repositorio-tipo-seccion.ts
│  │  │  │  │  │  └─ resolver-destinos-publicos.ts
│  │  │  │  │  ├─ proyeccion-menu.ts
│  │  │  │  │  ├─ seguridad-cms.ts
│  │  │  │  │  ├─ tests
│  │  │  │  │  │  ├─ configuracion-sitio-casos.test.ts
│  │  │  │  │  │  ├─ contenido-seccion-opcionales.test.ts
│  │  │  │  │  │  ├─ contenidos-registro-casos.test.ts
│  │  │  │  │  │  ├─ contenidos-seccion-casos.test.ts
│  │  │  │  │  │  ├─ elementos-footer-casos.test.ts
│  │  │  │  │  │  ├─ items-menu-casos.test.ts
│  │  │  │  │  │  ├─ menus-casos.test.ts
│  │  │  │  │  │  ├─ metadata-seccion-casos.test.ts
│  │  │  │  │  │  ├─ pasos-wizard-casos.test.ts
│  │  │  │  │  │  ├─ permisos-compatibles-cms.test.ts
│  │  │  │  │  │  ├─ registros-cms-casos.test.ts
│  │  │  │  │  │  ├─ reglas-aplicacion-cms.test.ts
│  │  │  │  │  │  ├─ soporte-pruebas-cms.ts
│  │  │  │  │  │  ├─ tipos-seccion-casos.test.ts
│  │  │  │  │  │  └─ wizard-configuracion.test.ts
│  │  │  │  │  ├─ use-cases
│  │  │  │  │  │  ├─ autorizacion
│  │  │  │  │  │  │  └─ obtener-capacidades-cms.ts
│  │  │  │  │  │  ├─ configuracion-sitio
│  │  │  │  │  │  │  ├─ cambiar-actividad-configuracion-sitio.ts
│  │  │  │  │  │  │  ├─ crear-configuracion-sitio.ts
│  │  │  │  │  │  │  ├─ datos-configuracion-sitio.ts
│  │  │  │  │  │  │  ├─ editar-configuracion-sitio.ts
│  │  │  │  │  │  │  ├─ listar-configuracion-sitio.ts
│  │  │  │  │  │  │  └─ obtener-configuracion-sitio.ts
│  │  │  │  │  │  ├─ contenidos-registro
│  │  │  │  │  │  │  ├─ activar-contenido-registro.ts
│  │  │  │  │  │  │  ├─ crear-contenido-registro.ts
│  │  │  │  │  │  │  ├─ datos-contenido-registro.ts
│  │  │  │  │  │  │  ├─ editar-contenido-registro.ts
│  │  │  │  │  │  │  ├─ eliminar-contenido-registro.ts
│  │  │  │  │  │  │  ├─ inactivar-contenido-registro.ts
│  │  │  │  │  │  │  ├─ listar-contenidos-registro.ts
│  │  │  │  │  │  │  ├─ obtener-contenido-registro.ts
│  │  │  │  │  │  │  └─ reordenar-contenido-registro.ts
│  │  │  │  │  │  ├─ contenidos-seccion
│  │  │  │  │  │  │  ├─ activar-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ crear-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ datos-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ editar-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ eliminar-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ fijar-visibilidad-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ inactivar-contenido-seccion.ts
│  │  │  │  │  │  │  ├─ listar-contenidos-seccion.ts
│  │  │  │  │  │  │  ├─ obtener-contenido-seccion.ts
│  │  │  │  │  │  │  └─ reordenar-contenido-seccion.ts
│  │  │  │  │  │  ├─ elementos-footer
│  │  │  │  │  │  │  ├─ activar-footer-elemento.ts
│  │  │  │  │  │  │  ├─ crear-footer-elemento.ts
│  │  │  │  │  │  │  ├─ datos-footer-elemento.ts
│  │  │  │  │  │  │  ├─ editar-footer-elemento.ts
│  │  │  │  │  │  │  ├─ eliminar-footer-elemento.ts
│  │  │  │  │  │  │  ├─ fijar-visibilidad-footer-elemento.ts
│  │  │  │  │  │  │  ├─ inactivar-footer-elemento.ts
│  │  │  │  │  │  │  ├─ listar-elementos-footer.ts
│  │  │  │  │  │  │  ├─ obtener-footer-elemento.ts
│  │  │  │  │  │  │  └─ reordenar-footer-elemento.ts
│  │  │  │  │  │  ├─ items-menu
│  │  │  │  │  │  │  ├─ activar-menu-item.ts
│  │  │  │  │  │  │  ├─ crear-menu-item.ts
│  │  │  │  │  │  │  ├─ datos-menu-item.ts
│  │  │  │  │  │  │  ├─ editar-menu-item.ts
│  │  │  │  │  │  │  ├─ eliminar-menu-item.ts
│  │  │  │  │  │  │  ├─ inactivar-menu-item.ts
│  │  │  │  │  │  │  ├─ listar-items-menu.ts
│  │  │  │  │  │  │  ├─ obtener-menu-item.ts
│  │  │  │  │  │  │  └─ reordenar-menu-item.ts
│  │  │  │  │  │  ├─ menus
│  │  │  │  │  │  │  ├─ activar-menu.ts
│  │  │  │  │  │  │  ├─ crear-menu.ts
│  │  │  │  │  │  │  ├─ datos-menu.ts
│  │  │  │  │  │  │  ├─ editar-menu.ts
│  │  │  │  │  │  │  ├─ eliminar-menu.ts
│  │  │  │  │  │  │  ├─ fijar-visibilidad-menu.ts
│  │  │  │  │  │  │  ├─ inactivar-menu.ts
│  │  │  │  │  │  │  ├─ listar-menus.ts
│  │  │  │  │  │  │  ├─ obtener-menu.ts
│  │  │  │  │  │  │  └─ reordenar-menu.ts
│  │  │  │  │  │  ├─ metadata-seccion
│  │  │  │  │  │  │  ├─ obtener-metadata-seccion.ts
│  │  │  │  │  │  │  └─ reemplazar-metadata-seccion.ts
│  │  │  │  │  │  ├─ pasos-wizard
│  │  │  │  │  │  │  ├─ activar-paso-wizard.ts
│  │  │  │  │  │  │  ├─ crear-paso-wizard.ts
│  │  │  │  │  │  │  ├─ datos-paso-wizard.ts
│  │  │  │  │  │  │  ├─ editar-paso-wizard.ts
│  │  │  │  │  │  │  ├─ eliminar-paso-wizard.ts
│  │  │  │  │  │  │  ├─ inactivar-paso-wizard.ts
│  │  │  │  │  │  │  ├─ listar-pasos-wizard.ts
│  │  │  │  │  │  │  ├─ obtener-paso-wizard.ts
│  │  │  │  │  │  │  └─ reordenar-paso-wizard.ts
│  │  │  │  │  │  ├─ publico
│  │  │  │  │  │  │  ├─ leer-configuracion.ts
│  │  │  │  │  │  │  ├─ leer-footer.ts
│  │  │  │  │  │  │  ├─ leer-menus.ts
│  │  │  │  │  │  │  ├─ leer-pasos-wizard.ts
│  │  │  │  │  │  │  ├─ leer-registros.ts
│  │  │  │  │  │  │  ├─ leer-secciones.ts
│  │  │  │  │  │  │  └─ obtener-vista-publica.ts
│  │  │  │  │  │  ├─ registros-cms
│  │  │  │  │  │  │  ├─ activar-registro-cms.ts
│  │  │  │  │  │  │  ├─ crear-registro-cms.ts
│  │  │  │  │  │  │  ├─ datos-registro-cms.ts
│  │  │  │  │  │  │  ├─ editar-registro-cms.ts
│  │  │  │  │  │  │  ├─ eliminar-registro-cms.ts
│  │  │  │  │  │  │  ├─ inactivar-registro-cms.ts
│  │  │  │  │  │  │  ├─ listar-registros-cms.ts
│  │  │  │  │  │  │  ├─ obtener-registro-cms.ts
│  │  │  │  │  │  │  └─ reordenar-registro-cms.ts
│  │  │  │  │  │  └─ tipos-seccion
│  │  │  │  │  │     ├─ activar-tipo-seccion.ts
│  │  │  │  │  │     ├─ cambiar-claves-tipo-seccion.ts
│  │  │  │  │  │     ├─ crear-tipo-seccion.ts
│  │  │  │  │  │     ├─ datos-tipo-seccion.ts
│  │  │  │  │  │     ├─ editar-tipo-seccion.ts
│  │  │  │  │  │     ├─ eliminar-tipo-seccion.ts
│  │  │  │  │  │     ├─ inactivar-tipo-seccion.ts
│  │  │  │  │  │     ├─ listar-tipos-seccion.ts
│  │  │  │  │  │     ├─ obtener-tipo-seccion.ts
│  │  │  │  │  │     └─ reordenar-tipo-seccion.ts
│  │  │  │  │  └─ validaciones-cms.ts
│  │  │  │  ├─ domain
│  │  │  │  │  ├─ cms-values.ts
│  │  │  │  │  ├─ configuracion-sitio.ts
│  │  │  │  │  ├─ contenido-registro.ts
│  │  │  │  │  ├─ contenido-seccion.ts
│  │  │  │  │  ├─ footer-elemento.ts
│  │  │  │  │  ├─ menu-item.ts
│  │  │  │  │  ├─ menu-values.ts
│  │  │  │  │  ├─ menu.ts
│  │  │  │  │  ├─ metadata-seccion.ts
│  │  │  │  │  ├─ paso-wizard.ts
│  │  │  │  │  ├─ registro-cms.ts
│  │  │  │  │  └─ tipo-seccion.ts
│  │  │  │  ├─ infrastructure
│  │  │  │  │  ├─ componer-cms-publico.ts
│  │  │  │  │  ├─ componer-cms.ts
│  │  │  │  │  ├─ configuracion-cms.ts
│  │  │  │  │  ├─ mappers
│  │  │  │  │  │  ├─ configuracion-sitio.ts
│  │  │  │  │  │  ├─ contenido-registro.ts
│  │  │  │  │  │  ├─ contenido-seccion.ts
│  │  │  │  │  │  ├─ footer-elemento.ts
│  │  │  │  │  │  ├─ menu-item.ts
│  │  │  │  │  │  ├─ menu.ts
│  │  │  │  │  │  ├─ metadata-seccion.ts
│  │  │  │  │  │  ├─ paso-wizard.ts
│  │  │  │  │  │  ├─ registro-cms.ts
│  │  │  │  │  │  └─ tipo-seccion.ts
│  │  │  │  │  ├─ operaciones-cms.ts
│  │  │  │  │  ├─ prisma-configuracion-sitio.ts
│  │  │  │  │  ├─ prisma-contenido-registro.ts
│  │  │  │  │  ├─ prisma-contenido-seccion.ts
│  │  │  │  │  ├─ prisma-footer-elemento.ts
│  │  │  │  │  ├─ prisma-lecturas-cms.ts
│  │  │  │  │  ├─ prisma-menu-item.ts
│  │  │  │  │  ├─ prisma-menu.ts
│  │  │  │  │  ├─ prisma-metadata-seccion.ts
│  │  │  │  │  ├─ prisma-paso-wizard.ts
│  │  │  │  │  ├─ prisma-publico-acceso-detalle.ts
│  │  │  │  │  ├─ prisma-publico-configuracion.ts
│  │  │  │  │  ├─ prisma-publico-footer.ts
│  │  │  │  │  ├─ prisma-publico-menus.ts
│  │  │  │  │  ├─ prisma-publico-pasos-wizard.ts
│  │  │  │  │  ├─ prisma-publico-registros.ts
│  │  │  │  │  ├─ prisma-publico-secciones.ts
│  │  │  │  │  ├─ prisma-registro-cms.ts
│  │  │  │  │  ├─ prisma-tipo-seccion.ts
│  │  │  │  │  ├─ prisma-vista-publica.ts
│  │  │  │  │  ├─ reglas-cms.ts
│  │  │  │  │  ├─ ruta-item-menu.ts
│  │  │  │  │  └─ tests
│  │  │  │  │     ├─ configuracion-wizard-default.test.ts
│  │  │  │  │     ├─ contenido-seccion-orden-auto.test.ts
│  │  │  │  │     ├─ menu-numeracion-auto.test.ts
│  │  │  │  │     ├─ orden-footer.test.ts
│  │  │  │  │     ├─ orden-items-menu.test.ts
│  │  │  │  │     ├─ orden-registros.test.ts
│  │  │  │  │     ├─ permisos-compatibles-transaccion.test.ts
│  │  │  │  │     ├─ prisma-configuracion-sitio.test.ts
│  │  │  │  │     ├─ prisma-contenido-registro.test.ts
│  │  │  │  │     ├─ prisma-contenido-seccion.test.ts
│  │  │  │  │     ├─ prisma-footer-elemento.test.ts
│  │  │  │  │     ├─ prisma-menu-item.test.ts
│  │  │  │  │     ├─ prisma-menu.test.ts
│  │  │  │  │     ├─ prisma-metadata-seccion.test.ts
│  │  │  │  │     ├─ prisma-paso-wizard.test.ts
│  │  │  │  │     ├─ prisma-registro-cms.test.ts
│  │  │  │  │     ├─ prisma-tipo-seccion.test.ts
│  │  │  │  │     └─ soporte-pruebas-cms.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ errores-http-cms.ts
│  │  │  │     ├─ esquemas-cms.ts
│  │  │  │     ├─ esquemas-configuracion-sitio.ts
│  │  │  │     ├─ esquemas-contenido-registro.ts
│  │  │  │     ├─ esquemas-contenido-seccion.ts
│  │  │  │     ├─ esquemas-footer-elemento.ts
│  │  │  │     ├─ esquemas-menu-item.ts
│  │  │  │     ├─ esquemas-menu.ts
│  │  │  │     ├─ esquemas-paso-wizard.ts
│  │  │  │     ├─ esquemas-registro-cms.ts
│  │  │  │     ├─ esquemas-tipo-seccion.ts
│  │  │  │     ├─ http-cms.ts
│  │  │  │     ├─ registrar-rutas-cms.ts
│  │  │  │     ├─ registrar-rutas-publicas-cms.ts
│  │  │  │     ├─ rutas-configuracion-sitio.ts
│  │  │  │     ├─ rutas-contenidos-registro.ts
│  │  │  │     ├─ rutas-contenidos-seccion.ts
│  │  │  │     ├─ rutas-elementos-footer.ts
│  │  │  │     ├─ rutas-imagenes-cms.ts
│  │  │  │     ├─ rutas-items-menu.ts
│  │  │  │     ├─ rutas-menus.ts
│  │  │  │     ├─ rutas-metadata-seccion.ts
│  │  │  │     ├─ rutas-pasos-wizard.ts
│  │  │  │     ├─ rutas-publicas-configuracion.ts
│  │  │  │     ├─ rutas-publicas-footer.ts
│  │  │  │     ├─ rutas-publicas-menus.ts
│  │  │  │     ├─ rutas-publicas-pasos-wizard.ts
│  │  │  │     ├─ rutas-publicas-registros.ts
│  │  │  │     ├─ rutas-publicas-secciones.ts
│  │  │  │     ├─ rutas-registros-cms.ts
│  │  │  │     ├─ rutas-tipos-seccion.ts
│  │  │  │     ├─ salidas-configuracion-sitio.ts
│  │  │  │     ├─ salidas-contenido-registro.ts
│  │  │  │     ├─ salidas-contenido-seccion.ts
│  │  │  │     ├─ salidas-footer-elemento.ts
│  │  │  │     ├─ salidas-menu-item.ts
│  │  │  │     ├─ salidas-menu.ts
│  │  │  │     ├─ salidas-paso-wizard.ts
│  │  │  │     ├─ salidas-registro-cms.ts
│  │  │  │     ├─ salidas-tipo-seccion.ts
│  │  │  │     └─ tests
│  │  │  │        ├─ acciones-cms.test.ts
│  │  │  │        ├─ contenido-seccion-formulario.test.ts
│  │  │  │        ├─ formulario-footer-cms.test.ts
│  │  │  │        ├─ menu-formulario.test.ts
│  │  │  │        ├─ registros-formularios.test.ts
│  │  │  │        ├─ ruta-subenlace-cms.test.ts
│  │  │  │        ├─ rutas-configuracion-sitio.test.ts
│  │  │  │        ├─ rutas-contenidos-registro.test.ts
│  │  │  │        ├─ rutas-contenidos-seccion.test.ts
│  │  │  │        ├─ rutas-elementos-footer.test.ts
│  │  │  │        ├─ rutas-items-menu.test.ts
│  │  │  │        ├─ rutas-menus.test.ts
│  │  │  │        ├─ rutas-metadata-seccion.test.ts
│  │  │  │        ├─ rutas-pasos-wizard.test.ts
│  │  │  │        ├─ rutas-registros-cms.test.ts
│  │  │  │        ├─ rutas-tipos-seccion.test.ts
│  │  │  │        ├─ seguridad-y-capacidades-cms.test.ts
│  │  │  │        ├─ soporte-http-cms.ts
│  │  │  │        ├─ tipo-seccion-formulario.test.ts
│  │  │  │        ├─ vista-publica.test.ts
│  │  │  │        └─ wizard-guardado-default.test.ts
│  │  │  └─ identity-access-management
│  │  │     ├─ application
│  │  │     │  ├─ fecha-cambio.ts
│  │  │     │  ├─ ports
│  │  │     │  │  ├─ consulta-autorizacion.ts
│  │  │     │  │  ├─ generador-ids.ts
│  │  │     │  │  ├─ huella-token.ts
│  │  │     │  │  ├─ reloj.ts
│  │  │     │  │  ├─ repositorio-administracion-usuarios.ts
│  │  │     │  │  ├─ repositorio-auditoria.ts
│  │  │     │  │  ├─ repositorio-mi-perfil.ts
│  │  │     │  │  ├─ repositorio-perfiles.ts
│  │  │     │  │  ├─ repositorio-permisos.ts
│  │  │     │  │  ├─ repositorio-roles.ts
│  │  │     │  │  ├─ repositorio-sesiones.ts
│  │  │     │  │  ├─ repositorio-usuarios.ts
│  │  │     │  │  ├─ servicio-tokens.ts
│  │  │     │  │  └─ verificador-clave-seguro.ts
│  │  │     │  ├─ tests
│  │  │     │  │  ├─ administrar-usuarios.test.ts
│  │  │     │  │  ├─ auditoria-casos.test.ts
│  │  │     │  │  ├─ autenticacion-casos.test.ts
│  │  │     │  │  ├─ iam-casos.test.ts
│  │  │     │  │  ├─ mi-perfil.test.ts
│  │  │     │  │  └─ usuarios-casos.test.ts
│  │  │     │  └─ use-cases
│  │  │     │     ├─ auditoria
│  │  │     │     │  ├─ listar-auditoria.ts
│  │  │     │     │  └─ registrar-lectura-iam.ts
│  │  │     │     ├─ autorizacion
│  │  │     │     │  └─ exigir-permiso.ts
│  │  │     │     ├─ perfil
│  │  │     │     │  └─ mi-perfil.ts
│  │  │     │     ├─ permisos
│  │  │     │     │  ├─ listar-permisos.ts
│  │  │     │     │  └─ obtener-permiso.ts
│  │  │     │     ├─ roles
│  │  │     │     │  ├─ activar-rol.ts
│  │  │     │     │  ├─ asignar-permiso-rol.ts
│  │  │     │     │  ├─ crear-rol.ts
│  │  │     │     │  ├─ editar-rol.ts
│  │  │     │     │  ├─ eliminar-rol.ts
│  │  │     │     │  ├─ inactivar-rol.ts
│  │  │     │     │  ├─ listar-roles.ts
│  │  │     │     │  ├─ obtener-capacidades-roles.ts
│  │  │     │     │  ├─ obtener-rol.ts
│  │  │     │     │  └─ retirar-permiso-rol.ts
│  │  │     │     ├─ sesiones
│  │  │     │     │  ├─ cerrar-sesion.ts
│  │  │     │     │  ├─ comprobar-sesion.ts
│  │  │     │     │  └─ iniciar-sesion.ts
│  │  │     │     └─ usuarios
│  │  │     │        ├─ administrar-usuarios.ts
│  │  │     │        ├─ asignar-rol-usuario.ts
│  │  │     │        ├─ listar-usuarios.ts
│  │  │     │        ├─ obtener-usuario.ts
│  │  │     │        └─ retirar-rol-usuario.ts
│  │  │     ├─ domain
│  │  │     │  ├─ evento-auditoria.ts
│  │  │     │  ├─ iam-values.ts
│  │  │     │  ├─ perfil.ts
│  │  │     │  ├─ permiso.ts
│  │  │     │  ├─ rol-permiso.ts
│  │  │     │  ├─ rol.ts
│  │  │     │  ├─ sesion.ts
│  │  │     │  ├─ usuario-rol.ts
│  │  │     │  └─ usuario.ts
│  │  │     ├─ infrastructure
│  │  │     │  ├─ argon2-verificador.ts
│  │  │     │  ├─ componer-iam.ts
│  │  │     │  ├─ contexto-auditoria-http.ts
│  │  │     │  ├─ exigir-permiso-en-transaccion.ts
│  │  │     │  ├─ exigir-super-admin-para-perfil.ts
│  │  │     │  ├─ insertar-auditoria.ts
│  │  │     │  ├─ jose-tokens.ts
│  │  │     │  ├─ mappers
│  │  │     │  │  ├─ perfil.ts
│  │  │     │  │  ├─ permiso.ts
│  │  │     │  │  ├─ rol.ts
│  │  │     │  │  ├─ sesion.ts
│  │  │     │  │  └─ usuario.ts
│  │  │     │  ├─ prisma-administracion-usuarios.ts
│  │  │     │  ├─ prisma-auditoria.ts
│  │  │     │  ├─ prisma-autorizacion.ts
│  │  │     │  ├─ prisma-iam-client.ts
│  │  │     │  ├─ prisma-mi-perfil.ts
│  │  │     │  ├─ prisma-perfiles.ts
│  │  │     │  ├─ prisma-permisos.ts
│  │  │     │  ├─ prisma-roles.ts
│  │  │     │  ├─ prisma-sesiones.ts
│  │  │     │  ├─ prisma-usuarios.ts
│  │  │     │  ├─ reloj-sistema.ts
│  │  │     │  ├─ sha256-huella-token.ts
│  │  │     │  ├─ tests
│  │  │     │  │  ├─ contexto-auditoria-http.test.ts
│  │  │     │  │  ├─ exigir-permiso-en-transaccion.test.ts
│  │  │     │  │  ├─ jose-tokens.test.ts
│  │  │     │  │  ├─ prisma-auditoria.test.ts
│  │  │     │  │  └─ prisma-perfiles.test.ts
│  │  │     │  └─ uuid-seguro.ts
│  │  │     └─ presentation
│  │  │        ├─ errores-http.ts
│  │  │        ├─ esquemas-iam.ts
│  │  │        ├─ registrar-rutas-iam.ts
│  │  │        ├─ rutas-auditoria.ts
│  │  │        ├─ rutas-mi-perfil.ts
│  │  │        ├─ rutas-permisos.ts
│  │  │        ├─ rutas-roles.ts
│  │  │        ├─ rutas-sesiones.ts
│  │  │        ├─ rutas-usuarios.ts
│  │  │        ├─ salidas-iam.ts
│  │  │        ├─ seguridad-http.ts
│  │  │        └─ tests
│  │  │           ├─ lecturas-iam.test.ts
│  │  │           └─ rutas-iam.test.ts
│  │  ├─ generated
│  │  ├─ main.ts
│  │  └─ shared
│  │     ├─ application
│  │     │  ├─ acceso-detalle-publico.ts
│  │     │  └─ lectura-publica.ts
│  │     ├─ domain
│  │     │  └─ value-objects.ts
│  │     ├─ imagenes
│  │     │  ├─ almacen-imagenes.ts
│  │     │  ├─ registrar-rutas-imagenes.ts
│  │     │  └─ tests
│  │     │     └─ imagenes.test.ts
│  │     ├─ infrastructure
│  │     │  └─ paginacion-publica.ts
│  │     └─ presentation
│  │        ├─ lecturas-publicas-http.ts
│  │        └─ tests
│  │           └─ lecturas-publicas-http.test.ts
│  ├─ frontend
│  │  ├─ app
│  │  │  ├─ portada-temporal.tsx
│  │  │  ├─ rutas-portal.tsx
│  │  │  ├─ rutas.tsx
│  │  │  ├─ rutas.tsx.antes-cms-frontend
│  │  │  ├─ rutas.tsx.antes-cms-v2
│  │  │  ├─ rutas.tsx.antes-items-menu-v1
│  │  │  ├─ rutas.tsx.antes-registros-v1
│  │  │  ├─ rutas.tsx.fase4-entrega2-1791828949081.bak
│  │  │  └─ rutas.tsx.publico-1791464710077.bak
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ features
│  │  │  ├─ catalog
│  │  │  │  ├─ api
│  │  │  │  │  ├─ asignaciones-atributo.ts
│  │  │  │  │  ├─ asignaciones-industria.ts
│  │  │  │  │  ├─ asignaciones-marca.ts
│  │  │  │  │  ├─ atributos-tecnicos.ts
│  │  │  │  │  ├─ categorias.ts
│  │  │  │  │  ├─ cliente-catalogo.ts
│  │  │  │  │  ├─ gamas.ts
│  │  │  │  │  ├─ industrias.ts
│  │  │  │  │  ├─ marcas.ts
│  │  │  │  │  ├─ productos.ts
│  │  │  │  │  ├─ publico
│  │  │  │  │  │  ├─ cliente-categorias.ts
│  │  │  │  │  │  ├─ cliente-detalle-producto.ts
│  │  │  │  │  │  ├─ cliente-gama.ts
│  │  │  │  │  │  ├─ cliente-industrias.ts
│  │  │  │  │  │  ├─ cliente-marcas.ts
│  │  │  │  │  │  ├─ cliente-productos.ts
│  │  │  │  │  │  └─ cliente-servicios.ts
│  │  │  │  │  ├─ servicios.ts
│  │  │  │  │  ├─ tipos-atributo.ts
│  │  │  │  │  ├─ tipos-catalogo.ts
│  │  │  │  │  └─ tipos-gamas.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ configuracion-catalogo.ts
│  │  │  │     ├─ formulario-catalogo.tsx
│  │  │  │     ├─ gamas
│  │  │  │     │  ├─ campo-valor-tecnico.tsx
│  │  │  │     │  ├─ controles-gamas.tsx
│  │  │  │     │  ├─ estructura-gama.tsx
│  │  │  │     │  ├─ formulario-elemento-gama.tsx
│  │  │  │     │  ├─ formulario-gama.tsx
│  │  │  │     │  ├─ panel-plantillas-gama.tsx
│  │  │  │     │  └─ tabla-valores-gama.tsx
│  │  │  │     ├─ listado-catalogo.tsx
│  │  │  │     ├─ modal-marcas-producto.tsx
│  │  │  │     ├─ modal-soluciones-industria.tsx
│  │  │  │     ├─ navegacion-catalogo.ts
│  │  │  │     ├─ referencias-catalogo.ts
│  │  │  │     ├─ selector-catalogo.tsx
│  │  │  │     ├─ vista-asignaciones-atributo.tsx
│  │  │  │     ├─ vista-asignaciones-industria.tsx
│  │  │  │     ├─ vista-asignaciones-marca.tsx
│  │  │  │     ├─ vista-atributos-tecnicos.tsx
│  │  │  │     ├─ vista-categorias.tsx
│  │  │  │     ├─ vista-gama-categoria.tsx
│  │  │  │     ├─ vista-industrias.tsx
│  │  │  │     ├─ vista-marcas.tsx
│  │  │  │     ├─ vista-productos.tsx
│  │  │  │     ├─ vista-servicios.tsx
│  │  │  │     └─ vista-tipos-atributo.tsx
│  │  │  ├─ cms
│  │  │  │  ├─ api
│  │  │  │  │  ├─ cliente-capacidades.ts
│  │  │  │  │  ├─ cliente-configuracion-sitio.ts
│  │  │  │  │  ├─ cliente-contenidos-registro.ts
│  │  │  │  │  ├─ cliente-contenidos-seccion.ts
│  │  │  │  │  ├─ cliente-elementos-footer.ts
│  │  │  │  │  ├─ cliente-items-menu.ts
│  │  │  │  │  ├─ cliente-menus.ts
│  │  │  │  │  ├─ cliente-metadata-seccion.ts
│  │  │  │  │  ├─ cliente-pasos-wizard.ts
│  │  │  │  │  ├─ cliente-registros-cms.ts
│  │  │  │  │  ├─ cliente-tipos-seccion.ts
│  │  │  │  │  ├─ modelos-cms.ts
│  │  │  │  │  ├─ operaciones-cms.ts
│  │  │  │  │  ├─ publico
│  │  │  │  │  │  ├─ cliente-configuracion.ts
│  │  │  │  │  │  ├─ cliente-footer.ts
│  │  │  │  │  │  ├─ cliente-menus.ts
│  │  │  │  │  │  ├─ cliente-pasos-wizard.ts
│  │  │  │  │  │  ├─ cliente-registros.ts
│  │  │  │  │  │  └─ cliente-secciones.ts
│  │  │  │  │  ├─ tipos-configuracion-sitio.ts
│  │  │  │  │  ├─ tipos-contenidos-registro.ts
│  │  │  │  │  ├─ tipos-contenidos-seccion.ts
│  │  │  │  │  ├─ tipos-elementos-footer.ts
│  │  │  │  │  ├─ tipos-items-menu.ts
│  │  │  │  │  ├─ tipos-menus.ts
│  │  │  │  │  ├─ tipos-pasos-wizard.ts
│  │  │  │  │  ├─ tipos-registros-cms.ts
│  │  │  │  │  └─ tipos-tipos-seccion.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ campos-cms.ts
│  │  │  │     ├─ campos-metadata-seccion.tsx
│  │  │  │     ├─ capacidades-cms.tsx
│  │  │  │     ├─ cms.css
│  │  │  │     ├─ contenidos-registro.tsx
│  │  │  │     ├─ datos-formulario-seccion.ts
│  │  │  │     ├─ datos-menu-formulario.ts
│  │  │  │     ├─ editor-claves-metadata.tsx
│  │  │  │     ├─ formulario-cms.tsx
│  │  │  │     ├─ formulario-configuracion-sitio.tsx
│  │  │  │     ├─ formulario-contenido-registro.tsx
│  │  │  │     ├─ formulario-contenido-seccion.css
│  │  │  │     ├─ formulario-contenido-seccion.tsx
│  │  │  │     ├─ formulario-footer.tsx
│  │  │  │     ├─ formulario-item-menu.tsx
│  │  │  │     ├─ formulario-menu.tsx
│  │  │  │     ├─ formulario-paso-wizard.tsx
│  │  │  │     ├─ formulario-tipo-seccion.css
│  │  │  │     ├─ grupo-portal-cms.ts
│  │  │  │     ├─ inicio-cms.tsx
│  │  │  │     ├─ listado-cms.tsx
│  │  │  │     ├─ listado-configuracion-sitio.tsx
│  │  │  │     ├─ listado-contenidos-registro.tsx
│  │  │  │     ├─ listado-contenidos-seccion.tsx
│  │  │  │     ├─ listado-elementos-footer.tsx
│  │  │  │     ├─ listado-items-menu.tsx
│  │  │  │     ├─ listado-menus.tsx
│  │  │  │     ├─ listado-pasos-wizard.tsx
│  │  │  │     ├─ listado-registros-cms.tsx
│  │  │  │     ├─ listado-tipos-seccion.tsx
│  │  │  │     ├─ menu-cms.tsx
│  │  │  │     ├─ metadata-seccion.tsx
│  │  │  │     ├─ navegacion-cms.ts
│  │  │  │     ├─ navegacion-cms.ts.antes-items-menu-v1
│  │  │  │     ├─ navegacion-cms.ts.antes-registros-v1
│  │  │  │     ├─ portal-cms.tsx
│  │  │  │     ├─ preview-marcas.tsx
│  │  │  │     ├─ selector-seccion.tsx
│  │  │  │     ├─ subenlaces-menu.tsx
│  │  │  │     ├─ vista-configuracion-sitio.ts
│  │  │  │     ├─ vista-contenidos-registro.ts
│  │  │  │     ├─ vista-contenidos-seccion.ts
│  │  │  │     ├─ vista-elementos-footer.ts
│  │  │  │     ├─ vista-items-menu.ts
│  │  │  │     ├─ vista-menus.ts
│  │  │  │     ├─ vista-pasos-wizard.ts
│  │  │  │     ├─ vista-registros-cms.ts
│  │  │  │     └─ vista-tipos-seccion.ts
│  │  │  ├─ commercial
│  │  │  │  ├─ api
│  │  │  │  │  ├─ cargar-paginas-crm.ts
│  │  │  │  │  ├─ cliente-crm.ts
│  │  │  │  │  ├─ contactos.ts
│  │  │  │  │  ├─ empresas.ts
│  │  │  │  │  ├─ leads.ts
│  │  │  │  │  ├─ publico
│  │  │  │  │  │  ├─ cliente-captacion.ts
│  │  │  │  │  │  ├─ cliente-empresa.ts
│  │  │  │  │  │  └─ cliente-sucursales.ts
│  │  │  │  │  ├─ sucursales.ts
│  │  │  │  │  ├─ suscriptores.ts
│  │  │  │  │  └─ tipos-crm.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ campos-crm.ts
│  │  │  │     ├─ formulario-lead.tsx
│  │  │  │     ├─ formulario-recurso-crm.tsx
│  │  │  │     ├─ formulario-sucursal.tsx
│  │  │  │     ├─ listado-recurso-crm.tsx
│  │  │  │     ├─ navegacion-crm.ts
│  │  │  │     ├─ selector-empresa-sucursal.tsx
│  │  │  │     ├─ selector-logo-empresa.tsx
│  │  │  │     ├─ selector-registro-crm.tsx
│  │  │  │     ├─ vista-contactos.tsx
│  │  │  │     ├─ vista-empresas.tsx
│  │  │  │     ├─ vista-leads.tsx
│  │  │  │     ├─ vista-sucursales.tsx
│  │  │  │     └─ vista-suscriptores.tsx
│  │  │  ├─ iam
│  │  │  │  ├─ api
│  │  │  │  │  ├─ cliente-iam.ts
│  │  │  │  │  └─ tipos-iam.ts
│  │  │  │  └─ presentation
│  │  │  │     ├─ acceso-portal.tsx
│  │  │  │     ├─ acceso-temporal.tsx
│  │  │  │     ├─ datos-rol.tsx
│  │  │  │     ├─ exportar-auditoria-csv.ts
│  │  │  │     ├─ exportar-auditoria-xlsx.ts
│  │  │  │     ├─ listado-auditoria.tsx
│  │  │  │     ├─ listado-roles.tsx
│  │  │  │     ├─ listado-usuarios.tsx
│  │  │  │     ├─ marco-portal.tsx
│  │  │  │     ├─ marco-portal.tsx.antes-cms-frontend
│  │  │  │     ├─ marco-portal.tsx.antes-cms-v2
│  │  │  │     ├─ modal-baja-rol.tsx
│  │  │  │     ├─ modal-detalle-rol.tsx
│  │  │  │     ├─ modal-estado-rol.tsx
│  │  │  │     ├─ modal-formulario-rol.tsx
│  │  │  │     ├─ modal-formulario-usuario.tsx
│  │  │  │     ├─ modal-permisos-rol.tsx
│  │  │  │     ├─ modal-portal.tsx
│  │  │  │     ├─ modal-roles-usuario.tsx
│  │  │  │     ├─ navegacion-portal.ts
│  │  │  │     ├─ navegacion-portal.ts.antes-cms-v2
│  │  │  │     ├─ navegacion-portal.ts.antes-items-menu-v1
│  │  │  │     ├─ navegacion-portal.ts.antes-registros-v1
│  │  │  │     ├─ nombre-exportacion-auditoria.ts
│  │  │  │     ├─ portal-base.tsx
│  │  │  │     ├─ portal-protegido.tsx
│  │  │  │     ├─ sesion-portal.tsx
│  │  │  │     ├─ tema-portal.tsx
│  │  │  │     └─ vista-mi-perfil.tsx
│  │  │  └─ publico
│  │  │     ├─ api
│  │  │     │  ├─ actualizacion-publica.ts
│  │  │     │  ├─ cache-publica.ts
│  │  │     │  ├─ cliente-catalogo-publico.ts
│  │  │     │  ├─ cliente-contenido-publico.ts
│  │  │     │  ├─ cliente-marco-publico.ts
│  │  │     │  ├─ cliente-soluciones-publicas.ts
│  │  │     │  └─ cliente-vista-publica.ts
│  │  │     └─ presentation
│  │  │        ├─ asistente-publico.tsx
│  │  │        ├─ aviso-actualizacion-publica.tsx
│  │  │        ├─ bloque-catalogo-inicio.tsx
│  │  │        ├─ bloque-cms-contenido.tsx
│  │  │        ├─ bloque-cms-inicio.tsx
│  │  │        ├─ breadcrumbs-publico.tsx
│  │  │        ├─ busqueda-publica.tsx
│  │  │        ├─ captacion-publica.css
│  │  │        ├─ catalogo-publico.css
│  │  │        ├─ catalogo-publico.tsx
│  │  │        ├─ categorias-destino-producto.tsx
│  │  │        ├─ cierre-publico.css
│  │  │        ├─ componentes-catalogo.tsx
│  │  │        ├─ componentes-soluciones.tsx
│  │  │        ├─ consulta-categoria.tsx
│  │  │        ├─ contacto-publico.tsx
│  │  │        ├─ contenido-inicio-publico.tsx
│  │  │        ├─ contenido-institucional.tsx
│  │  │        ├─ datos-asistente-publico.ts
│  │  │        ├─ datos-catalogo-publico.ts
│  │  │        ├─ datos-marco-publico.ts
│  │  │        ├─ detalle-catalogo-publico.tsx
│  │  │        ├─ diseno-aprobado.css
│  │  │        ├─ diseno-entrega4.css
│  │  │        ├─ entrada-publica.tsx
│  │  │        ├─ entrega5.css
│  │  │        ├─ footer-publico.tsx
│  │  │        ├─ formulario-contacto-publico.tsx
│  │  │        ├─ gama-categoria-publica.tsx
│  │  │        ├─ gama-publica.css
│  │  │        ├─ hero-publico.tsx
│  │  │        ├─ html-cms.tsx
│  │  │        ├─ icono-publico.tsx
│  │  │        ├─ icono-red-social.tsx
│  │  │        ├─ imagen-publica.ts
│  │  │        ├─ inicio-institucional.css
│  │  │        ├─ integraciones-publicas.tsx
│  │  │        ├─ listado-productos-publico.tsx
│  │  │        ├─ mapa-sucursal.ts
│  │  │        ├─ marcas-inicio.tsx
│  │  │        ├─ marcas-presentacion.css
│  │  │        ├─ marcas-presentacion.tsx
│  │  │        ├─ marco-publico.css
│  │  │        ├─ metadatos-publicos.tsx
│  │  │        ├─ navigation.tsx
│  │  │        ├─ publico.css
│  │  │        ├─ soluciones-publicas.css
│  │  │        ├─ soluciones-publicas.tsx
│  │  │        ├─ soluciones-rutas.ts
│  │  │        ├─ sucursales-footer.tsx
│  │  │        ├─ sucursales-inicio.tsx
│  │  │        ├─ suscripcion-publica.tsx
│  │  │        ├─ use-recurso-publico.ts
│  │  │        ├─ vista-publica.tsx
│  │  │        └─ whatsapp-publico.tsx
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ shared
│  │  │  ├─ api
│  │  │  │  ├─ cliente-http.ts
│  │  │  │  └─ consulta-publica.ts
│  │  │  ├─ imagenes
│  │  │  │  ├─ campo-imagen.tsx
│  │  │  │  ├─ exportar-edicion.ts
│  │  │  │  ├─ miniatura-imagen.tsx
│  │  │  │  ├─ operaciones-imagen.ts
│  │  │  │  └─ url-imagen.ts
│  │  │  └─ navegacion
│  │  │     └─ navegacion-agrupada.tsx
│  │  └─ styles.css
│  └─ shared
│     ├─ mapa-sucursal.ts
│     ├─ publico
│     │  ├─ captacion.ts
│     │  ├─ catalogo.ts
│     │  ├─ cms.ts
│     │  ├─ comun.ts
│     │  ├─ contenido-legal-inicial.ts
│     │  ├─ gamas.ts
│     │  └─ rutas.ts
│     ├─ ruta-subenlace.ts
│     ├─ slug-nombre.ts
│     └─ vista-publica.ts
├─ storage
│  ├─ catalogo
│  │  ├─ categorias
│  │  │  ├─ 186a4516-c7cc-4ed9-a8bc-d435ed391cdb.png
│  │  │  ├─ 21a9f544-24e2-4156-afa8-067ec30856d2.png
│  │  │  ├─ 37e14f35-4d70-415b-b1e3-634e6d3c3f38.png
│  │  │  ├─ 3f670c16-58f7-4a70-b1f9-d3eeb1e5bef8.png
│  │  │  ├─ 417e05f9-87e1-44b0-bb4a-4b5d092a34f3.png
│  │  │  ├─ 489b30d0-58d2-431d-a463-60a9706aec1f.png
│  │  │  ├─ 60229c30-f6dc-4d8f-9f0e-4fa605a2bd99.png
│  │  │  ├─ 65554283-1792-4fa7-9728-627fcbd68193.png
│  │  │  ├─ 66dcb4c0-453b-4960-9da1-82744d064e07.png
│  │  │  ├─ 78495e85-b2e1-44f5-9ae6-5335e84e13db.png
│  │  │  ├─ b82b33c6-eacf-4601-bed2-389e7b492dfa.png
│  │  │  ├─ c4276730-5d38-4012-8ef5-6637a676377e.png
│  │  │  ├─ c8bc45a6-d5a7-40b1-9beb-b06ded4156e4.png
│  │  │  ├─ c927ac96-9c6a-42de-a412-699abd2bf3fa.png
│  │  │  ├─ d32cf2f1-43d4-47f1-a47d-255da5c3c9fb.png
│  │  │  ├─ d67613e3-f783-4dcb-8a65-3a4f4820aa4f.png
│  │  │  ├─ d703746c-4ac6-4a8f-bf47-1756b7bc3d48.png
│  │  │  ├─ db76f7d9-0172-4eec-a8c6-c922fa263c10.png
│  │  │  ├─ e88861cf-7598-4473-aeda-25b0d2f17599.png
│  │  │  └─ ef81c2ef-8cf4-49eb-b1af-401475cda73a.png
│  │  ├─ industrias
│  │  │  ├─ 4cca0759-84b5-4941-8849-1ab8a929e586.png
│  │  │  ├─ 7ba458c9-6583-41db-a655-7537007aef9d.png
│  │  │  ├─ 9e19fe68-7941-4e5d-a097-4ba8b459b95c.png
│  │  │  ├─ b1ed9882-d39f-4e45-ab7c-a9aba62d11f7.png
│  │  │  ├─ b40a8e83-a9ec-49e6-8b4e-e5edb652d81f.png
│  │  │  ├─ c772fd4e-b4b2-4ab0-92ce-adf81aa33c90.png
│  │  │  ├─ c8a0d443-7453-4aeb-b16c-33aa2e60852b.png
│  │  │  ├─ cce53e35-59ad-4ad5-a9bf-a8167830e07c.png
│  │  │  ├─ d6db8fdf-f226-4fd7-b044-ea70dc642bd9.png
│  │  │  └─ e322d077-a88c-4572-a9d9-4bf8aa470dc7.png
│  │  ├─ marcas
│  │  │  ├─ 08bdbd1e-cccf-458d-ac30-506a88e795cc.png
│  │  │  ├─ 20c942a0-78df-4386-a874-84563590f96f.png
│  │  │  ├─ 210fda6d-a639-4b0a-82fc-e0cfbad89ead.png
│  │  │  ├─ 2e0f3f15-cfeb-43bc-9782-ead8f8a73b7f.png
│  │  │  ├─ 2e615859-2f0f-4f04-8ecc-0197f256ad79.png
│  │  │  ├─ 322b99c6-6942-4278-a1d8-ad42f6201d19.png
│  │  │  ├─ 401666c5-1ce3-4de1-a2ae-fb6f2552154e.png
│  │  │  ├─ 40cb3bfa-010c-442d-a767-902b0e4fdf85.png
│  │  │  ├─ 47a6fcf3-29ce-4a63-8e9c-34fd35250482.png
│  │  │  ├─ 4a64fee1-cd59-4b82-ab09-ffa3d8354aa7.png
│  │  │  ├─ 547e0f06-b203-4460-88bb-0a0a8bf8cf8b.png
│  │  │  ├─ 6387bef8-35c5-4a42-aa4e-e0a8ac905a53.png
│  │  │  ├─ 65156082-eec5-4861-af34-5e9f3b33c5ec.png
│  │  │  ├─ 765137eb-bb89-4eba-b89c-495114429985.png
│  │  │  ├─ 768768bd-9d85-4c13-8764-2b163dfb7ed5.png
│  │  │  ├─ 7799276a-44fb-4ec6-96ae-f78dcc0fbebb.png
│  │  │  ├─ a12f7e38-ec8d-469f-a44d-4c79a29f9371.png
│  │  │  ├─ b4ef88d0-6edd-4bbc-8a32-ea4582c711a2.png
│  │  │  ├─ b51757ee-eb3f-473b-878d-1427aba74263.png
│  │  │  ├─ c7a8f706-ebf5-4f81-90fe-71a9ce8a19bd.png
│  │  │  ├─ c95646b2-d202-4dba-83f6-772ddcc53aee.png
│  │  │  ├─ cbc86015-0142-4057-a164-c4ca2e4b7d7d.png
│  │  │  ├─ d644e292-2adb-4136-8602-668c080089ac.png
│  │  │  ├─ d7c8fd6b-c6fb-413e-b234-9b7d43c47b0f.png
│  │  │  ├─ e018cb4d-4fd4-4102-9661-04e9d5cea237.png
│  │  │  ├─ eed29656-94a0-44f3-9609-e2f67cf5a869.png
│  │  │  └─ f1225df0-5e35-480d-b399-9c3aa39f9862.png
│  │  ├─ productos
│  │  │  ├─ 11f0feef-63d8-4c2c-bf6f-575a2a1d803a.png
│  │  │  ├─ 126447ef-eb8c-4e9d-aa45-78d7d1270d04.png
│  │  │  ├─ 1f6d7092-4c0a-47cf-a35c-b1139736145b.png
│  │  │  ├─ 209ea419-7e77-405d-b771-a6f951060e72.png
│  │  │  ├─ 60c41186-fb97-4a7f-85e2-a5b3dbd9033f.png
│  │  │  ├─ 648e9377-a13e-4c52-a96d-c37db143fece.png
│  │  │  ├─ 66010a64-1c6d-481d-9fbc-0768b7e5b398.png
│  │  │  ├─ 7cca5d27-4bda-465a-8c76-4f15bc949ba4.png
│  │  │  ├─ 7f36f181-ba6a-4591-abf0-30e2552f6751.png
│  │  │  ├─ 84aaaac3-a3d8-42d7-acba-27384d9c8bb1.png
│  │  │  ├─ 8e037fff-f9d7-4e07-bbc1-0db7540787de.png
│  │  │  ├─ 967431e9-c100-4acf-a496-6d401027fbce.png
│  │  │  ├─ 982187bb-f233-4340-9774-be8f03c0f04f.png
│  │  │  ├─ 9e625c32-f435-44de-a25d-db67798cfa65.png
│  │  │  ├─ a468708f-4256-4bfd-8b06-06fd6b2ca978.png
│  │  │  ├─ ac257c2c-e1f8-4c90-b5cc-f1a4bb7eaa4d.png
│  │  │  ├─ af75bf80-7f54-4472-a2c6-7f03c1bd8ac0.png
│  │  │  ├─ d7e11e84-6cd2-490a-a791-5aa5b9ce5ba4.png
│  │  │  ├─ ec998617-5349-4855-be04-ddfd283f8684.png
│  │  │  ├─ ecca3b04-e907-4256-bf70-e806b7a3ea49.png
│  │  │  ├─ f6819d1f-a88c-4c1d-8acf-de644927b39e.png
│  │  │  ├─ f87e38a1-ffc3-4b6f-a5a8-992aec7d5f78.png
│  │  │  └─ fd737291-655a-4d20-9766-ee2067f35cb7.png
│  │  └─ servicios
│  │     ├─ 4e1669e7-01cf-4281-a4ed-78c0d28cf876.png
│  │     ├─ 6e03a4d3-fa33-4a41-b8bd-ce9254747098.png
│  │     ├─ a6a86580-bcce-48a8-b057-ac67efcf8795.png
│  │     ├─ c2980c83-4a39-4e86-8b1e-f7f2dda48fb3.png
│  │     ├─ dba86946-1d16-4d33-bdb7-6ac7a410bdb0.png
│  │     └─ ef1a17a5-e490-41ca-bda7-1a051f35536f.png
│  ├─ cms
│  │  └─ contenidos-seccion
│  │     ├─ 09679d5f-6961-4ac3-8c7e-00dbb224bdd3.png
│  │     ├─ 112af80c-cdf2-4a51-b8ac-20407395d58c.png
│  │     ├─ 4939d6da-3808-4d8a-8bef-1b0b699f16a3.png
│  │     ├─ 92d81572-d54e-4ebf-86fe-146200d80809.png
│  │     └─ e5225a91-924c-45de-b2fe-2cee55608264.png
│  └─ crm
│     └─ logos
│        ├─ 9c08f768-8984-4506-abb8-7fafbe266d19.png
│        └─ a1141516-3670-4769-bab4-3023872e5d33.png
├─ tests
│  ├─ frontend
│  │  ├─ cargar-paginas-crm.test.ts
│  │  ├─ cliente-catalogo.test.ts
│  │  ├─ cliente-http.test.ts
│  │  ├─ clientes-crm.test.ts
│  │  ├─ exportar-auditoria-csv.test.ts
│  │  ├─ exportar-auditoria-xlsx.test.ts
│  │  └─ operaciones-imagen.test.ts
│  └─ shared
│     └─ mapa-sucursal.test.ts
├─ tsconfig.app.json
├─ tsconfig.backend.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
