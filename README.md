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

```
correas-center-ddd
├─ .env
├─ .env.example
├─ docs
│  ├─ delimitacion_sustantiva.mmd
│  ├─ Delimitacion_Sustantiva.pdf
│  ├─ Delimitacion_Sustantiva.png
│  └─ Delimitacion_Sustantiva.vsdx
├─ eslint.config.js
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ prisma
│  ├─ migrations
│  │  ├─ 20260925043331_inicial_cuatro_contextos
│  │  │  └─ migration.sql
│  │  ├─ 20260925054756_estado_asignaciones_iam
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.ts
├─ prisma7.config.ts
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ skills-lock.json
├─ src
│  ├─ backend
│  │  ├─ app.ts
│  │  ├─ contexts
│  │  │  ├─ catalog-management
│  │  │  │  ├─ application
│  │  │  │  ├─ domain
│  │  │  │  │  ├─ asignacion-atributo.ts
│  │  │  │  │  ├─ asignacion-industria.ts
│  │  │  │  │  ├─ asignacion-marca.ts
│  │  │  │  │  ├─ atributo-tecnico.ts
│  │  │  │  │  ├─ catalog-values.ts
│  │  │  │  │  ├─ categoria.ts
│  │  │  │  │  ├─ industria.ts
│  │  │  │  │  ├─ marca.ts
│  │  │  │  │  ├─ producto.ts
│  │  │  │  │  ├─ servicio.ts
│  │  │  │  │  └─ tipo-atributo.ts
│  │  │  │  ├─ infrastructure
│  │  │  │  └─ presentation
│  │  │  ├─ commercial
│  │  │  │  ├─ application
│  │  │  │  ├─ domain
│  │  │  │  │  ├─ commercial-values.ts
│  │  │  │  │  ├─ contacto-entrante.ts
│  │  │  │  │  ├─ empresa.ts
│  │  │  │  │  ├─ lead.ts
│  │  │  │  │  ├─ sucursal.ts
│  │  │  │  │  └─ suscriptor.ts
│  │  │  │  ├─ infrastructure
│  │  │  │  └─ presentation
│  │  │  ├─ content-management-system
│  │  │  │  ├─ application
│  │  │  │  │  ├─ ports
│  │  │  │  │  ├─ tests
│  │  │  │  │  └─ use-cases
│  │  │  │  ├─ domain
│  │  │  │  │  ├─ cms-values.ts
│  │  │  │  │  ├─ configuracion-sitio.ts
│  │  │  │  │  ├─ contenido-registro.ts
│  │  │  │  │  ├─ contenido-seccion.ts
│  │  │  │  │  ├─ footer-elemento.ts
│  │  │  │  │  ├─ menu-item.ts
│  │  │  │  │  ├─ menu.ts
│  │  │  │  │  ├─ metadata-seccion.ts
│  │  │  │  │  ├─ paso-wizard.ts
│  │  │  │  │  ├─ registro-cms.ts
│  │  │  │  │  └─ tipo-seccion.ts
│  │  │  │  ├─ infrastructure
│  │  │  │  └─ presentation
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
│  │     └─ domain
│  │        └─ value-objects.ts
│  └─ frontend
│     ├─ app
│     │  ├─ portada-temporal.tsx
│     │  └─ rutas.tsx
│     ├─ App.css
│     ├─ App.tsx
│     ├─ assets
│     │  ├─ hero.png
│     │  ├─ react.svg
│     │  └─ vite.svg
│     ├─ features
│     │  ├─ catalog
│     │  ├─ cms
│     │  ├─ commercial
│     │  └─ iam
│     │     ├─ api
│     │     │  ├─ cliente-iam.ts
│     │     │  └─ tipos-iam.ts
│     │     └─ presentation
│     │        ├─ acceso-portal.tsx
│     │        ├─ acceso-temporal.tsx
│     │        ├─ datos-rol.tsx
│     │        ├─ exportar-auditoria-csv.ts
│     │        ├─ exportar-auditoria-xlsx.ts
│     │        ├─ listado-auditoria.tsx
│     │        ├─ listado-roles.tsx
│     │        ├─ listado-usuarios.tsx
│     │        ├─ marco-portal.tsx
│     │        ├─ modal-baja-rol.tsx
│     │        ├─ modal-detalle-rol.tsx
│     │        ├─ modal-estado-rol.tsx
│     │        ├─ modal-formulario-rol.tsx
│     │        ├─ modal-formulario-usuario.tsx
│     │        ├─ modal-permisos-rol.tsx
│     │        ├─ modal-portal.tsx
│     │        ├─ modal-roles-usuario.tsx
│     │        ├─ nombre-exportacion-auditoria.ts
│     │        ├─ portal-base.tsx
│     │        ├─ portal-protegido.tsx
│     │        ├─ sesion-portal.tsx
│     │        ├─ tema-portal.tsx
│     │        └─ vista-mi-perfil.tsx
│     ├─ index.css
│     ├─ main.tsx
│     ├─ shared
│     │  └─ api
│     │     └─ cliente-http.ts
│     └─ styles.css
├─ tests
│  └─ frontend
│     ├─ cliente-http.test.ts
│     ├─ exportar-auditoria-csv.test.ts
│     └─ exportar-auditoria-xlsx.test.ts
├─ tsconfig.app.json
├─ tsconfig.backend.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```