import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { componerIam, type CasosIam } from './contexts/identity-access-management/infrastructure/componer-iam.js';
import { crearClienteIam } from './contexts/identity-access-management/infrastructure/prisma-iam-client.js';
import { registrarRutasIam } from './contexts/identity-access-management/presentation/registrar-rutas-iam.js';
import type { SeguridadIam } from './contexts/identity-access-management/presentation/seguridad-http.js';

export async function createApp(pruebas?: { casos: CasosIam; config: SeguridadIam }) {
  const app = Fastify({
    logger: {
      redact: ['req.headers.cookie', 'req.headers.authorization',
        'req.body.password', 'res.headers.set-cookie']
    }, trustProxy: false
  });
  const origen = process.env.PORTAL_ORIGIN ?? 'http://localhost:5173';
  const url = new URL(origen);
  if (url.origin !== origen || url.pathname !== '/' || url.search || url.hash ||
    (url.protocol !== 'https:' && !(url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname)))) {
    throw new Error('PORTAL_ORIGIN debe ser HTTPS o un origen HTTP local válido');
  }
  const secure = url.protocol === 'https:';
  if (process.env.NODE_ENV === 'production' && !secure) throw new Error('El portal de producción requiere HTTPS');
  const config: SeguridadIam = pruebas?.config ?? {
    origen,
    cookie: secure ? '__Host-cc_portal' : 'cc_portal_local', secure
  };
  const db = pruebas ? null : crearClienteIam(process.env.DATABASE_URL ?? '');
  const casos = pruebas?.casos ?? componerIam(db!, process.env.IAM_JWT_SECRET_B64 ?? '',
    process.env.IAM_JWT_ISSUER ?? '', process.env.IAM_JWT_AUDIENCE ?? '');
  if (db) app.addHook('onClose', async () => { await db.$disconnect(); });
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: { title: "Correas Center API", version: "0.2.0", description: "IAM del portal; cookie HttpOnly y Origin obligatorio en escrituras" },
      components: { securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: config.cookie } } },
    },
  });
  await app.register(swaggerUi, {
    routePrefix: "/api/docs",
    uiConfig: {
      requestInterceptor: function (request) {
        // Swagger UI se ejecuta en el navegador. Añadir el encabezado solo a nuestra API.
        const destino = new URL(request.url, window.location.href);
        if (destino.origin === window.location.origin && destino.pathname.startsWith('/api/') &&
          /^(POST|PUT|PATCH|DELETE)$/i.test(request.method ?? '')) {
          request.headers ??= {};
          request.headers['X-Portal-Request'] = '1';
        }
        return request;
      },
    },
  });
  await app.register(cookie);
  await app.register(rateLimit, { global: false });
  await app.register(async (scope) => registrarRutasIam(scope, casos, config));

  app.get("/api/health", {
    schema: {
      tags: ["Sistema"],
      summary: "Comprueba que el proceso de la API está activo",
      response: {
        200: {
          type: "object",
          required: ["status"],
          properties: { status: { type: "string", enum: ["ok"] } },
        },
      },
    },
  }, async () => ({ status: "ok" }));

  return app;
}