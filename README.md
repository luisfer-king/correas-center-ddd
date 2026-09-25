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
├─ eslint.config.js
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ prisma
│  └─ schema.prisma
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
│  │  │  │  ├─ infrastructure
│  │  │  │  └─ presentation
│  │  │  ├─ content-management-system
│  │  │  │  ├─ application
│  │  │  │  ├─ domain
│  │  │  │  ├─ infrastructure
│  │  │  │  └─ presentation
│  │  │  └─ identity-access-management
│  │  │     ├─ application
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
│  │  │     └─ presentation
│  │  ├─ main.ts
│  │  └─ shared
│  │     └─ domain
│  │        └─ value-objects.ts
│  └─ frontend
│     ├─ App.css
│     ├─ App.tsx
│     ├─ assets
│     │  ├─ hero.png
│     │  ├─ react.svg
│     │  └─ vite.svg
│     ├─ features
│     │  ├─ catalog-management
│     │  ├─ commercial
│     │  ├─ content-management-system
│     │  └─ identity-access-management
│     ├─ index.css
│     ├─ main.tsx
│     └─ shared
├─ tsconfig.app.json
├─ tsconfig.backend.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```