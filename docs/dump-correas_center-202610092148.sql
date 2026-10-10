--
-- PostgreSQL database dump
--

\restrict VX4HPD1ONRPtl3PzLfiYwF1nCc5DcxCsnWo7FCcIBDeeaNCOTqSgrClajCYSnLT

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-10-09 21:48:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 26310)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 923 (class 1247 OID 26336)
-- Name: enum_accion_auditoria; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_accion_auditoria AS ENUM (
    'Lectura',
    'Creación',
    'Edición',
    'Eliminación'
);


ALTER TYPE public.enum_accion_auditoria OWNER TO postgres;

--
-- TOC entry 914 (class 1247 OID 26312)
-- Name: enum_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_estado AS ENUM (
    'activo',
    'inactivo',
    'eliminado'
);


ALTER TYPE public.enum_estado OWNER TO postgres;

--
-- TOC entry 1025 (class 1247 OID 31422)
-- Name: enum_estado_asignacion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_estado_asignacion AS ENUM (
    'activo',
    'inactivo'
);


ALTER TYPE public.enum_estado_asignacion OWNER TO postgres;

--
-- TOC entry 917 (class 1247 OID 26320)
-- Name: enum_estado_contacto; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_estado_contacto AS ENUM (
    'nuevo',
    'respondido',
    'archivado'
);


ALTER TYPE public.enum_estado_contacto OWNER TO postgres;

--
-- TOC entry 926 (class 1247 OID 26346)
-- Name: enum_estado_lead; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_estado_lead AS ENUM (
    'nuevo',
    'calificado',
    'descartado'
);


ALTER TYPE public.enum_estado_lead OWNER TO postgres;

--
-- TOC entry 920 (class 1247 OID 26328)
-- Name: enum_estado_suscriptor; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_estado_suscriptor AS ENUM (
    'activo',
    'inactivo',
    'desuscrito'
);


ALTER TYPE public.enum_estado_suscriptor OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 26353)
-- Name: users; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.users (
    id uuid NOT NULL,
    email character varying,
    encrypted_password character varying
);


ALTER TABLE auth.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25445)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 26507)
-- Name: atributos_tecnico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atributos_tecnico (
    id bigint NOT NULL,
    tipo_atributo_id bigint NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    valor_numerico numeric,
    unidad_medida character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.atributos_tecnico OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 26506)
-- Name: atributos_tecnico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atributos_tecnico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.atributos_tecnico_id_seq OWNER TO postgres;

--
-- TOC entry 5431 (class 0 OID 0)
-- Dependencies: 236
-- Name: atributos_tecnico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.atributos_tecnico_id_seq OWNED BY public.atributos_tecnico.id;


--
-- TOC entry 274 (class 1259 OID 26897)
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id bigint NOT NULL,
    usuario_id uuid,
    accion public.enum_accion_auditoria NOT NULL,
    tabla_afectada character varying NOT NULL,
    registro_id character varying,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    ip_address character varying,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 26896)
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_id_seq OWNER TO postgres;

--
-- TOC entry 5432 (class 0 OID 0)
-- Dependencies: 273
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_id_seq OWNED BY public.auditoria.id;


--
-- TOC entry 239 (class 1259 OID 26527)
-- Name: categoria_atributo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_atributo (
    id bigint NOT NULL,
    categoria_id bigint NOT NULL,
    atributo_id bigint NOT NULL,
    valor_personalizado numeric,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categoria_atributo OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 26526)
-- Name: categoria_atributo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_atributo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_atributo_id_seq OWNER TO postgres;

--
-- TOC entry 5433 (class 0 OID 0)
-- Dependencies: 238
-- Name: categoria_atributo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_atributo_id_seq OWNED BY public.categoria_atributo.id;


--
-- TOC entry 229 (class 1259 OID 26424)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id bigint NOT NULL,
    producto_id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    imagen character varying,
    descripcion text,
    descripcion_corta text,
    uso character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 26423)
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- TOC entry 5434 (class 0 OID 0)
-- Dependencies: 228
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- TOC entry 276 (class 1259 OID 26912)
-- Name: configuracion_sitio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_sitio (
    id integer NOT NULL,
    empresa_id bigint,
    clave character varying NOT NULL,
    valor text,
    tipo character varying DEFAULT 'texto'::character varying,
    descripcion text,
    grupo character varying,
    activo boolean DEFAULT true,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.configuracion_sitio OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 26911)
-- Name: configuracion_sitio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_sitio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_sitio_id_seq OWNER TO postgres;

--
-- TOC entry 5435 (class 0 OID 0)
-- Dependencies: 275
-- Name: configuracion_sitio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_sitio_id_seq OWNED BY public.configuracion_sitio.id;


--
-- TOC entry 263 (class 1259 OID 26786)
-- Name: contactos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contactos (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    nombre character varying NOT NULL,
    empresa character varying,
    telefono character varying NOT NULL,
    email character varying NOT NULL,
    mensaje text NOT NULL,
    estado public.enum_estado_contacto DEFAULT 'nuevo'::public.enum_estado_contacto NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contactos OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 26785)
-- Name: contactos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contactos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contactos_id_seq OWNER TO postgres;

--
-- TOC entry 5436 (class 0 OID 0)
-- Dependencies: 262
-- Name: contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contactos_id_seq OWNED BY public.contactos.id;


--
-- TOC entry 249 (class 1259 OID 26631)
-- Name: contenido_seccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contenido_seccion (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    tipo_seccion_id bigint NOT NULL,
    titulo character varying,
    subtitulo character varying,
    descripcion text,
    icono character varying,
    imagen character varying,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    mostrar boolean DEFAULT true NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contenido_seccion OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 26630)
-- Name: contenido_seccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contenido_seccion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contenido_seccion_id_seq OWNER TO postgres;

--
-- TOC entry 5437 (class 0 OID 0)
-- Dependencies: 248
-- Name: contenido_seccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contenido_seccion_id_seq OWNED BY public.contenido_seccion.id;


--
-- TOC entry 223 (class 1259 OID 26362)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    logo character varying,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT empresas_nombre_no_vacio CHECK (((nombre)::text <> ''::text))
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 26361)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresas_id_seq OWNER TO postgres;

--
-- TOC entry 5438 (class 0 OID 0)
-- Dependencies: 222
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_seq OWNED BY public.empresas.id;


--
-- TOC entry 259 (class 1259 OID 26741)
-- Name: footers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.footers (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    tipo character varying NOT NULL,
    tipo_registro character varying,
    registro_id bigint,
    titulo character varying,
    url character varying,
    icono character varying,
    orden integer DEFAULT 0 NOT NULL,
    mostrar boolean DEFAULT true NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT footers_tipo_registro_valido CHECK (((tipo_registro)::text = ANY ((ARRAY['producto'::character varying, 'industria'::character varying, 'servicio'::character varying])::text[]))),
    CONSTRAINT footers_tipo_valido CHECK (((tipo)::text = ANY ((ARRAY['producto'::character varying, 'industria'::character varying, 'servicio'::character varying, 'red_social'::character varying])::text[])))
);


ALTER TABLE public.footers OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 26740)
-- Name: footers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.footers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footers_id_seq OWNER TO postgres;

--
-- TOC entry 5439 (class 0 OID 0)
-- Dependencies: 258
-- Name: footers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.footers_id_seq OWNED BY public.footers.id;


--
-- TOC entry 245 (class 1259 OID 26588)
-- Name: industria_asignacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industria_asignacion (
    id bigint NOT NULL,
    industria_id bigint NOT NULL,
    tipo_registro character varying NOT NULL,
    registro_id bigint NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT industria_asignacion_tipo_valido CHECK (((tipo_registro)::text = ANY ((ARRAY['categoria'::character varying, 'servicio'::character varying])::text[])))
);


ALTER TABLE public.industria_asignacion OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 26587)
-- Name: industria_asignacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.industria_asignacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.industria_asignacion_id_seq OWNER TO postgres;

--
-- TOC entry 5440 (class 0 OID 0)
-- Dependencies: 244
-- Name: industria_asignacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.industria_asignacion_id_seq OWNED BY public.industria_asignacion.id;


--
-- TOC entry 241 (class 1259 OID 26547)
-- Name: industrias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industrias (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    imagen character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.industrias OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 26546)
-- Name: industrias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.industrias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.industrias_id_seq OWNER TO postgres;

--
-- TOC entry 5441 (class 0 OID 0)
-- Dependencies: 240
-- Name: industrias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.industrias_id_seq OWNED BY public.industrias.id;


--
-- TOC entry 278 (class 1259 OID 26941)
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    id uuid NOT NULL,
    empresa_id bigint NOT NULL,
    contacto_id bigint,
    responsable_id uuid,
    estado public.enum_estado_lead DEFAULT 'nuevo'::public.enum_estado_lead NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    eliminado_en timestamp(6) with time zone
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 26445)
-- Name: marcas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marcas (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    logo character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.marcas OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 26444)
-- Name: marcas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marcas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marcas_id_seq OWNER TO postgres;

--
-- TOC entry 5442 (class 0 OID 0)
-- Dependencies: 230
-- Name: marcas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marcas_id_seq OWNED BY public.marcas.id;


--
-- TOC entry 257 (class 1259 OID 26721)
-- Name: menu_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item (
    id bigint NOT NULL,
    menu_id bigint NOT NULL,
    ruta character varying NOT NULL,
    orden integer DEFAULT 1 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nombre character varying(255) NOT NULL,
    categoria_id bigint
);


ALTER TABLE public.menu_item OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 26720)
-- Name: menu_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_item_id_seq OWNER TO postgres;

--
-- TOC entry 5443 (class 0 OID 0)
-- Dependencies: 256
-- Name: menu_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_item_id_seq OWNED BY public.menu_item.id;


--
-- TOC entry 255 (class 1259 OID 26695)
-- Name: menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menus (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    grupo character varying NOT NULL,
    tipo_registro character varying NOT NULL,
    registro_id bigint NOT NULL,
    ruta character varying NOT NULL,
    icono character varying,
    mostrar boolean DEFAULT true NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cargar_submenu text DEFAULT 'activo'::text,
    CONSTRAINT menus_cargar_submenu_valido CHECK ((cargar_submenu = ANY (ARRAY['activo'::text, 'inactivo'::text]))),
    CONSTRAINT menus_tipo_registro_valido CHECK (((tipo_registro)::text = ANY ((ARRAY['producto'::character varying, 'industria'::character varying, 'servicio'::character varying])::text[])))
);


ALTER TABLE public.menus OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 26694)
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO postgres;

--
-- TOC entry 5444 (class 0 OID 0)
-- Dependencies: 254
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- TOC entry 261 (class 1259 OID 26763)
-- Name: pasos_wizard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pasos_wizard (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    identificador character varying NOT NULL,
    titulo character varying NOT NULL,
    descripcion character varying NOT NULL,
    fuente_datos character varying NOT NULL,
    campo_filtro character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pasos_wizard OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 26762)
-- Name: pasos_wizard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pasos_wizard_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pasos_wizard_id_seq OWNER TO postgres;

--
-- TOC entry 5445 (class 0 OID 0)
-- Dependencies: 260
-- Name: pasos_wizard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pasos_wizard_id_seq OWNED BY public.pasos_wizard.id;


--
-- TOC entry 266 (class 1259 OID 26824)
-- Name: perfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles (
    id uuid NOT NULL,
    nombre_completo character varying NOT NULL,
    telefono character varying,
    avatar_url character varying,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email character varying,
    email_verified_at timestamp(6) with time zone
);


ALTER TABLE public.perfiles OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 26860)
-- Name: permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    grupo character varying NOT NULL,
    descripcion text,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permisos OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 26859)
-- Name: permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_id_seq OWNER TO postgres;

--
-- TOC entry 5446 (class 0 OID 0)
-- Dependencies: 269
-- Name: permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permisos_id_seq OWNED BY public.permisos.id;


--
-- TOC entry 233 (class 1259 OID 26465)
-- Name: producto_marca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto_marca (
    id bigint NOT NULL,
    producto_id bigint NOT NULL,
    marca_id bigint NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    orden integer
);


ALTER TABLE public.producto_marca OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 26464)
-- Name: producto_marca_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_marca_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_marca_id_seq OWNER TO postgres;

--
-- TOC entry 5447 (class 0 OID 0)
-- Dependencies: 232
-- Name: producto_marca_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_marca_id_seq OWNED BY public.producto_marca.id;


--
-- TOC entry 227 (class 1259 OID 26403)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    imagen character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26402)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- TOC entry 5448 (class 0 OID 0)
-- Dependencies: 226
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- TOC entry 253 (class 1259 OID 26675)
-- Name: registro_contenido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registro_contenido (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    registro_id bigint NOT NULL,
    titulo character varying,
    subtitulo character varying,
    descripcion text,
    icono character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.registro_contenido OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 26674)
-- Name: registro_contenido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registro_contenido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registro_contenido_id_seq OWNER TO postgres;

--
-- TOC entry 5449 (class 0 OID 0)
-- Dependencies: 252
-- Name: registro_contenido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registro_contenido_id_seq OWNED BY public.registro_contenido.id;


--
-- TOC entry 251 (class 1259 OID 26655)
-- Name: registros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registros (
    id bigint NOT NULL,
    identificador character varying NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.registros OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 26654)
-- Name: registros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registros_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registros_id_seq OWNER TO postgres;

--
-- TOC entry 5450 (class 0 OID 0)
-- Dependencies: 250
-- Name: registros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registros_id_seq OWNED BY public.registros.id;


--
-- TOC entry 271 (class 1259 OID 26878)
-- Name: rol_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_permiso (
    rol_id bigint NOT NULL,
    permiso_id bigint NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado public.enum_estado_asignacion DEFAULT 'activo'::public.enum_estado_asignacion NOT NULL
);


ALTER TABLE public.rol_permiso OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 26840)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    descripcion text,
    es_sistema boolean DEFAULT false NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 26839)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5451 (class 0 OID 0)
-- Dependencies: 267
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 243 (class 1259 OID 26568)
-- Name: servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    imagen character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.servicios OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 26567)
-- Name: servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_id_seq OWNER TO postgres;

--
-- TOC entry 5452 (class 0 OID 0)
-- Dependencies: 242
-- Name: servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicios_id_seq OWNED BY public.servicios.id;


--
-- TOC entry 277 (class 1259 OID 26926)
-- Name: sesiones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sesiones (
    id uuid NOT NULL,
    usuario_id uuid NOT NULL,
    huella_token character varying(64) NOT NULL,
    expira_en timestamp(6) with time zone NOT NULL,
    revocada_en timestamp(6) with time zone,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    eliminado_en timestamp(6) with time zone
);


ALTER TABLE public.sesiones OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 26379)
-- Name: sucursales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursales (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    nombre character varying NOT NULL,
    direccion character varying NOT NULL,
    telefono character varying NOT NULL,
    email character varying,
    horarios character varying,
    mapa_incrustado text,
    latitud numeric,
    longitud numeric,
    es_principal boolean DEFAULT false NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sucursales OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 26378)
-- Name: sucursales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sucursales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sucursales_id_seq OWNER TO postgres;

--
-- TOC entry 5453 (class 0 OID 0)
-- Dependencies: 224
-- Name: sucursales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sucursales_id_seq OWNED BY public.sucursales.id;


--
-- TOC entry 265 (class 1259 OID 26807)
-- Name: suscriptores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suscriptores (
    id bigint NOT NULL,
    email character varying NOT NULL,
    nombre character varying,
    estado public.enum_estado_suscriptor DEFAULT 'activo'::public.enum_estado_suscriptor NOT NULL,
    email_verificado_en timestamp(6) with time zone,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    empresa_id bigint NOT NULL
);


ALTER TABLE public.suscriptores OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 26806)
-- Name: suscriptores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suscriptores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suscriptores_id_seq OWNER TO postgres;

--
-- TOC entry 5454 (class 0 OID 0)
-- Dependencies: 264
-- Name: suscriptores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suscriptores_id_seq OWNED BY public.suscriptores.id;


--
-- TOC entry 235 (class 1259 OID 26481)
-- Name: tipo_atributo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_atributo (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    descripcion text,
    permite_descripcion boolean DEFAULT false NOT NULL,
    permite_valor_numerico boolean DEFAULT false NOT NULL,
    permite_unidad_medida boolean DEFAULT false NOT NULL,
    icono character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tipo_atributo OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 26480)
-- Name: tipo_atributo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_atributo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_atributo_id_seq OWNER TO postgres;

--
-- TOC entry 5455 (class 0 OID 0)
-- Dependencies: 234
-- Name: tipo_atributo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_atributo_id_seq OWNED BY public.tipo_atributo.id;


--
-- TOC entry 247 (class 1259 OID 26609)
-- Name: tipo_seccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_seccion (
    id bigint NOT NULL,
    nombre character varying NOT NULL,
    slug character varying NOT NULL,
    descripcion text,
    campos_metadata jsonb DEFAULT '[]'::jsonb NOT NULL,
    icono character varying,
    orden integer DEFAULT 0 NOT NULL,
    estado public.enum_estado DEFAULT 'activo'::public.enum_estado NOT NULL,
    eliminado_en timestamp(6) with time zone,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tipo_seccion OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 26608)
-- Name: tipo_seccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_seccion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_seccion_id_seq OWNER TO postgres;

--
-- TOC entry 5456 (class 0 OID 0)
-- Dependencies: 246
-- Name: tipo_seccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_seccion_id_seq OWNED BY public.tipo_seccion.id;


--
-- TOC entry 272 (class 1259 OID 26887)
-- Name: usuario_rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_rol (
    usuario_id uuid NOT NULL,
    rol_id bigint NOT NULL,
    creado_en timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado public.enum_estado_asignacion DEFAULT 'activo'::public.enum_estado_asignacion NOT NULL
);


ALTER TABLE public.usuario_rol OWNER TO postgres;

--
-- TOC entry 4966 (class 2604 OID 26510)
-- Name: atributos_tecnico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributos_tecnico ALTER COLUMN id SET DEFAULT nextval('public.atributos_tecnico_id_seq'::regclass);


--
-- TOC entry 5061 (class 2604 OID 26900)
-- Name: auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria ALTER COLUMN id SET DEFAULT nextval('public.auditoria_id_seq'::regclass);


--
-- TOC entry 4971 (class 2604 OID 26530)
-- Name: categoria_atributo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo ALTER COLUMN id SET DEFAULT nextval('public.categoria_atributo_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 26427)
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- TOC entry 5064 (class 2604 OID 26915)
-- Name: configuracion_sitio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sitio ALTER COLUMN id SET DEFAULT nextval('public.configuracion_sitio_id_seq'::regclass);


--
-- TOC entry 5037 (class 2604 OID 26789)
-- Name: contactos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos ALTER COLUMN id SET DEFAULT nextval('public.contactos_id_seq'::regclass);


--
-- TOC entry 4997 (class 2604 OID 26634)
-- Name: contenido_seccion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenido_seccion ALTER COLUMN id SET DEFAULT nextval('public.contenido_seccion_id_seq'::regclass);


--
-- TOC entry 4929 (class 2604 OID 26365)
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- TOC entry 5026 (class 2604 OID 26744)
-- Name: footers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footers ALTER COLUMN id SET DEFAULT nextval('public.footers_id_seq'::regclass);


--
-- TOC entry 4986 (class 2604 OID 26591)
-- Name: industria_asignacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industria_asignacion ALTER COLUMN id SET DEFAULT nextval('public.industria_asignacion_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 26550)
-- Name: industrias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industrias ALTER COLUMN id SET DEFAULT nextval('public.industrias_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 26448)
-- Name: marcas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas ALTER COLUMN id SET DEFAULT nextval('public.marcas_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 26724)
-- Name: menu_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item ALTER COLUMN id SET DEFAULT nextval('public.menu_item_id_seq'::regclass);


--
-- TOC entry 5014 (class 2604 OID 26698)
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- TOC entry 5032 (class 2604 OID 26766)
-- Name: pasos_wizard id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pasos_wizard ALTER COLUMN id SET DEFAULT nextval('public.pasos_wizard_id_seq'::regclass);


--
-- TOC entry 5053 (class 2604 OID 26863)
-- Name: permisos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos ALTER COLUMN id SET DEFAULT nextval('public.permisos_id_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 26468)
-- Name: producto_marca id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_marca ALTER COLUMN id SET DEFAULT nextval('public.producto_marca_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 26406)
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- TOC entry 5009 (class 2604 OID 26678)
-- Name: registro_contenido id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_contenido ALTER COLUMN id SET DEFAULT nextval('public.registro_contenido_id_seq'::regclass);


--
-- TOC entry 5004 (class 2604 OID 26658)
-- Name: registros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros ALTER COLUMN id SET DEFAULT nextval('public.registros_id_seq'::regclass);


--
-- TOC entry 5048 (class 2604 OID 26843)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4981 (class 2604 OID 26571)
-- Name: servicios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios ALTER COLUMN id SET DEFAULT nextval('public.servicios_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 26382)
-- Name: sucursales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales ALTER COLUMN id SET DEFAULT nextval('public.sucursales_id_seq'::regclass);


--
-- TOC entry 5041 (class 2604 OID 26810)
-- Name: suscriptores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscriptores ALTER COLUMN id SET DEFAULT nextval('public.suscriptores_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 26484)
-- Name: tipo_atributo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_atributo ALTER COLUMN id SET DEFAULT nextval('public.tipo_atributo_id_seq'::regclass);


--
-- TOC entry 4991 (class 2604 OID 26612)
-- Name: tipo_seccion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_seccion ALTER COLUMN id SET DEFAULT nextval('public.tipo_seccion_id_seq'::regclass);


--
-- TOC entry 5368 (class 0 OID 26353)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.users (id, email, encrypted_password) FROM stdin;
48aa7abf-0acb-47b5-bd73-172aaec874f1	admin@correascenter.com	$argon2id$v=19$m=19456,p=1,t=2$AxdSVXemdWt+/2M8bar0yA$HeThh3MS4+Errd2FN66tbO6qdajQHnoSPRS4H/nbVKw
0798a4a0-61af-40b0-a7a3-94b7c602648e	prueba@gmail.com	$argon2id$v=19$m=19456,p=1,t=2$ecu8n28cqxVpLZQSoG2UkQ$DTQM+zitORVIFbYor/t9dmddGJP9iJSLJW0allXpZ5E
\.


--
-- TOC entry 5367 (class 0 OID 25445)
-- Dependencies: 220
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9d3f6415-1473-4e79-be1a-bcd819ba0c3a	c65a11493f78e2620509539f5b4a789963c24e7627c0fb0697d6e740d3a0fded	2026-09-25 00:37:28.739119-04	20260925043331_inicial_cuatro_contextos	\N	\N	2026-09-25 00:37:27.720771-04	1
72aa1df1-0fed-402f-bd4e-8bd06b6d1c75	cead1c66d9cc5dfeb93e3e1842664f59509f46962b638629108eb6d5f5d27916	2026-09-25 01:49:55.904611-04	20260925054756_estado_asignaciones_iam	\N	\N	2026-09-25 01:49:55.803272-04	1
d41b87bd-1e8b-410b-af66-b5718f7e9b78	ca81bb75c332724039f960c06743238300f9db0a91e58c6607f75cb8d1c6686b	2026-10-08 14:51:39.092049-04	20261008185139_items_menu_nombre_categoria_orden	\N	\N	2026-10-08 14:51:39.03289-04	1
dafa97cc-fc08-4bb2-92eb-837a6f48f99d	7be199506079018e489ae975933f936cba0f06bfb8594bb3e115de4f3d3be58a	2026-10-08 17:28:16.555837-04	20261008212000_completar_items_menu	\N	\N	2026-10-08 17:28:16.374521-04	1
680d77c4-4852-4d2e-9185-d64554898ca4	ca7654749fd6c1f5f77b9b705a075be4ba440aa739ae2274b18a295d5289d2de	2026-10-08 17:29:24.737376-04	20261008212924_completar_items_menu	\N	\N	2026-10-08 17:29:24.653022-04	1
0e6bdb9b-b31e-445f-9d29-51398082f3c1	8de44451780048c1d7466c7effdd28b8dc67352497b873a28806720d16bf26f0	2026-10-08 22:38:18.441156-04	20261009015500_retirar_stats_contenido_registro	\N	\N	2026-10-08 22:38:18.433828-04	1
\.


--
-- TOC entry 5384 (class 0 OID 26507)
-- Dependencies: 237
-- Data for Name: atributos_tecnico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atributos_tecnico (id, tipo_atributo_id, nombre, descripcion, valor_numerico, unidad_medida, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
\.


--
-- TOC entry 5421 (class 0 OID 26897)
-- Dependencies: 274
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditoria (id, usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos, ip_address, user_agent, metadata, creado_en) FROM stdin;
1	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	607ae5b1-c9b5-4abf-ae49-7720e632f2ac	null	{"id": "607ae5b1-c9b5-4abf-ae49-7720e632f2ac"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-25 22:09:11.178-04
2	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	5cb21340-69bc-4c73-9de2-6e78efcb8c61	null	{"id": "5cb21340-69bc-4c73-9de2-6e78efcb8c61"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-25 22:09:34.699-04
3	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	5cb21340-69bc-4c73-9de2-6e78efcb8c61	{"estado": "activo"}	{"estado": "inactivo"}	\N	\N	{"operacion": "iam.sesiones.cerrar"}	2026-09-25 22:11:22.952-04
4	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	24e50031-6604-4bf4-a8e1-2014f9daf2ee	null	{"id": "24e50031-6604-4bf4-a8e1-2014f9daf2ee"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-25 22:11:39.741-04
5	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	f33fb0c7-8147-4c33-bcae-92fe65b23bf1	null	{"id": "f33fb0c7-8147-4c33-bcae-92fe65b23bf1"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 00:55:40.432-04
6	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	f33fb0c7-8147-4c33-bcae-92fe65b23bf1	{"estado": "activo"}	{"estado": "inactivo"}	\N	\N	{"operacion": "iam.sesiones.cerrar"}	2026-09-26 00:55:58.112-04
7	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ee145a42-1358-48d4-9800-741817744ab8	null	{"id": "ee145a42-1358-48d4-9800-741817744ab8"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 00:58:59.568-04
8	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	ee145a42-1358-48d4-9800-741817744ab8	{"estado": "activo"}	{"estado": "inactivo"}	\N	\N	{"operacion": "iam.sesiones.cerrar"}	2026-09-26 00:59:03.202-04
9	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	45334ade-9767-4044-883f-1e4f15b67502	null	{"id": "45334ade-9767-4044-883f-1e4f15b67502"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 01:11:09.634-04
10	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	a993752e-cdb8-4f07-aaaf-466b30fc19da	null	{"id": "a993752e-cdb8-4f07-aaaf-466b30fc19da"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 01:26:48.123-04
11	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	492e98d4-4fdd-4373-85a7-9b5baeced0ef	null	{"id": "492e98d4-4fdd-4373-85a7-9b5baeced0ef"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 05:09:51.156-04
12	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	roles	2	null	{"id": "2", "slug": "administrador"}	\N	\N	{"operacion": "iam.roles.create"}	2026-09-26 05:20:12.308-04
13	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.update"}	2026-09-26 05:20:50.438-04
14	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	2b668c61-602d-435e-b02d-58688336acfd	null	{"id": "2b668c61-602d-435e-b02d-58688336acfd"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 05:29:48.542-04
15	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:39:57.752-04
16	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:39:58.812-04
17	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:39:59.903-04
18	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:12.282-04
19	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:13.908-04
20	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:14.877-04
21	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:20.758-04
22	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:21.805-04
23	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:22.677-04
24	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:32.649-04
25	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:33.655-04
26	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:35.102-04
27	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:35.788-04
28	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:39.241-04
29	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:39.669-04
30	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:42.921-04
31	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:43.694-04
32	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:44.352-04
33	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:44.866-04
34	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:45.88-04
35	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:55.577-04
36	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:56.602-04
37	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:57.089-04
38	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:58.446-04
39	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:59.072-04
40	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:40:59.687-04
41	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:00.298-04
42	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:02.788-04
88	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	\N	\N	{"operacion": "iam.auditoria.read"}	2026-09-26 14:06:31.13-04
43	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:03.23-04
44	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:04.266-04
45	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:04.873-04
46	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:05.397-04
47	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:08.074-04
48	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:08.633-04
49	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:09.464-04
50	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:10.257-04
51	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:10.815-04
52	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:14.32-04
53	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:14.738-04
54	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:15.461-04
55	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:15.951-04
56	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:16.41-04
57	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:18.666-04
58	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:19.715-04
59	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:20.304-04
60	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:20.874-04
61	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:23.887-04
62	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:24.461-04
63	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:25.042-04
64	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:25.52-04
65	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:26.071-04
66	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:26.543-04
67	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 05:41:27.831-04
68	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	roles	3	null	{"id": "3", "slug": "prueba"}	\N	\N	{"operacion": "iam.roles.create"}	2026-09-26 05:41:53.139-04
69	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	3	{"estado": "activo"}	{"estado": "inactivo"}	\N	\N	{"operacion": "iam.roles.update"}	2026-09-26 05:42:18.752-04
70	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	3	{"estado": "inactivo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.update"}	2026-09-26 05:42:24.635-04
71	48aa7abf-0acb-47b5-bd73-172aaec874f1	Eliminación	roles	3	{"estado": "activo"}	{"estado": "eliminado"}	\N	\N	{"operacion": "iam.roles.delete"}	2026-09-26 05:42:40.844-04
72	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	61c5df27-e5e1-41ad-bc51-16b155a42366	null	{"id": "61c5df27-e5e1-41ad-bc51-16b155a42366"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 05:45:05.287-04
73	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ada2ac09-1848-4afe-a7c6-1bf87a76fa40	null	{"id": "ada2ac09-1848-4afe-a7c6-1bf87a76fa40"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 12:12:45.053-04
74	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 12:19:36.027-04
75	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	2	{"estado": "activo"}	{"estado": "activo"}	\N	\N	{"operacion": "iam.roles.permisos.assign"}	2026-09-26 12:19:42.74-04
76	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0356c018-affc-4a5e-b1a6-3ac89cdfe505	null	{"id": "0356c018-affc-4a5e-b1a6-3ac89cdfe505"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 12:47:25.273-04
77	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	usuario_rol	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	\N	\N	{"operacion": "iam.usuarios.roles.assign"}	2026-09-26 12:47:43.117-04
78	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	usuario_rol	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	\N	\N	{"operacion": "iam.usuarios.roles.assign"}	2026-09-26 12:47:49.938-04
79	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	bf9bad90-354f-4275-ab28-0d0cb29956d3	null	{"id": "bf9bad90-354f-4275-ab28-0d0cb29956d3"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 13:06:52.698-04
80	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	a5f7937b-5247-42f5-954b-85c7e8967424	null	{"id": "a5f7937b-5247-42f5-954b-85c7e8967424"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 13:28:42.823-04
81	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	7ab089a0-f585-4060-a0c0-5f1ec16d8462	null	{"id": "7ab089a0-f585-4060-a0c0-5f1ec16d8462"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 14:02:21.204-04
82	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	\N	\N	{"operacion": "iam.portal.read"}	2026-09-26 14:02:21.603-04
83	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	\N	\N	{"operacion": "iam.portal.read"}	2026-09-26 14:02:25.039-04
84	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	\N	\N	{"operacion": "iam.roles.read"}	2026-09-26 14:02:25.072-04
85	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	\N	\N	{"operacion": "iam.usuarios.read"}	2026-09-26 14:02:28.898-04
86	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	\N	\N	{"operacion": "iam.portal.read"}	2026-09-26 14:02:28.943-04
87	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	\N	\N	{"operacion": "iam.auditoria.read"}	2026-09-26 14:02:32.421-04
89	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d3041c6a-87f3-4e25-998c-38072679248e	null	{"id": "d3041c6a-87f3-4e25-998c-38072679248e"}	\N	\N	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 14:30:15.705-04
90	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	\N	\N	{"operacion": "iam.portal.read"}	2026-09-26 14:30:16.589-04
91	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	\N	\N	{"operacion": "iam.auditoria.read"}	2026-09-26 14:30:16.684-04
92	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	4c0b09cc-da2d-420a-b1e5-f94592f6617a	null	{"id": "4c0b09cc-da2d-420a-b1e5-f94592f6617a"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 14:50:07.608-04
93	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 14:50:08.048-04
94	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 14:50:12.802-04
95	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 14:50:12.972-04
96	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 14:50:14.022-04
97	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 14:50:14.029-04
98	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 14:50:15.571-04
99	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 14:50:15.577-04
100	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-09-26 14:50:16.37-04
101	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	c43e7502-aced-4504-948b-1b742d1159bd	null	{"id": "c43e7502-aced-4504-948b-1b742d1159bd"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 15:47:34.535-04
102	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-09-26 15:47:34.827-04
103	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 15:47:35.311-04
104	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 15:47:38.617-04
105	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 15:47:38.759-04
106	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	perfiles	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	{"id": "0798a4a0-61af-40b0-a7a3-94b7c602648e", "email": "prueba@gmail.com", "estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.create"}	2026-09-26 15:48:59.13-04
107	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 15:48:59.256-04
108	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 15:48:59.523-04
109	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 15:49:05.869-04
110	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 15:49:05.936-04
111	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 15:49:05.954-04
112	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 15:49:23.812-04
113	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 15:49:23.951-04
114	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 15:50:19.737-04
115	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 15:50:19.785-04
116	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 15:50:19.888-04
117	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 15:50:23.783-04
118	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 15:50:23.902-04
119	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-26 15:50:26.04-04
120	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-26 15:50:26.056-04
121	0798a4a0-61af-40b0-a7a3-94b7c602648e	Creación	sesiones	bf4b4ca3-0a4e-4490-a784-6524a4c495e2	null	{"id": "bf4b4ca3-0a4e-4490-a784-6524a4c495e2"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 16:17:40.515-04
122	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:41.013-04
123	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:41.045-04
124	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:45.541-04
125	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:47.45-04
126	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:51.294-04
127	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:55.183-04
128	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:55.622-04
129	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:56.122-04
130	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:17:56.509-04
131	0798a4a0-61af-40b0-a7a3-94b7c602648e	Edición	sesiones	bf4b4ca3-0a4e-4490-a784-6524a4c495e2	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-26 16:17:59.204-04
132	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	94ff70a1-af94-4f45-8869-bca375b3f0be	null	{"id": "94ff70a1-af94-4f45-8869-bca375b3f0be"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 16:18:08.941-04
133	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:18:09.138-04
134	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 16:18:12.423-04
135	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:18:12.531-04
136	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	perfiles	0798a4a0-61af-40b0-a7a3-94b7c602648e	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.update"}	2026-09-26 16:18:26.191-04
137	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 16:18:26.234-04
138	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:18:26.416-04
139	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	94ff70a1-af94-4f45-8869-bca375b3f0be	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-26 16:18:30.689-04
140	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d1be457b-44bd-441c-9a4e-565f21a57c2a	null	{"id": "d1be457b-44bd-441c-9a4e-565f21a57c2a"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-26 16:19:41.331-04
141	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:19:41.556-04
142	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-26 16:19:45.093-04
143	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:19:45.21-04
144	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-26 16:21:26.485-04
145	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-26 16:21:26.752-04
146	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	f015054d-4871-46ba-84b1-c706e240b0b8	null	{"id": "f015054d-4871-46ba-84b1-c706e240b0b8"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 03:10:30.748-04
147	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:10:31.229-04
148	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:10:31.252-04
149	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:10:31.302-04
150	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:10:35.032-04
2346	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:59:18.131-04
2347	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:59:18.173-04
2450	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 13:37:10.584-04
2489	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 21:32:44.822-04
2564	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 00:12:08.545-04
2565	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 00:12:08.684-04
2715	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 00:34:13.289-04
2817	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 01:32:22.53-04
2820	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 01:32:22.705-04
2821	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 01:32:33.204-04
2871	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 02:56:14.892-04
2872	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:56:14.997-04
2873	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 02:56:16.932-04
2944	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:13:12.597-04
2945	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	18	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:13:34.242-04
2946	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:13:34.314-04
2986	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 14:20:00.36-04
3007	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 20:43:47.895-04
3008	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 20:43:52.075-04
3009	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 20:43:52.098-04
3031	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 21:49:43.168-04
151	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:10:35.042-04
152	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	perfiles	0798a4a0-61af-40b0-a7a3-94b7c602648e	{"email": "prueba@gmail.com", "telefono": null, "nombreCompleto": "Prueba"}	{"email": "prueba@gmail.com", "telefono": null, "nombreCompleto": "Prueba"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.update", "claveRestablecida": true}	2026-09-28 03:11:03.059-04
153	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:11:03.171-04
154	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:11:03.412-04
155	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:11:10.06-04
156	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:11:10.217-04
157	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	roles	6	null	{"id": "6", "slug": "pruebas"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.create"}	2026-09-28 03:11:41.857-04
158	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-28 03:11:51.063-04
159	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-28 03:11:51.174-04
160	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-09-28 03:12:14.124-04
161	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:12:14.159-04
162	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-28 03:12:14.191-04
163	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-09-28 03:12:17.889-04
164	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:12:17.92-04
165	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-28 03:12:17.956-04
166	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-09-28 03:12:19.219-04
167	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:12:19.244-04
168	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-28 03:12:19.274-04
169	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-09-28 03:12:19.999-04
170	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:12:20.027-04
171	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-09-28 03:12:20.053-04
172	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	f015054d-4871-46ba-84b1-c706e240b0b8	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-28 03:12:39.569-04
173	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	8f64f523-6102-40a2-b3f8-e0253aceea10	null	{"id": "8f64f523-6102-40a2-b3f8-e0253aceea10"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 03:13:15.092-04
174	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:13:15.205-04
175	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:13:15.406-04
176	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:13:15.442-04
177	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:13:18.04-04
178	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:13:18.15-04
208	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:27.626-04
179	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	perfiles	0798a4a0-61af-40b0-a7a3-94b7c602648e	{"email": "prueba@gmail.com", "telefono": null, "nombreCompleto": "Prueba"}	{"email": "prueba@gmail.com", "telefono": null, "nombreCompleto": "Prueba"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.update", "claveRestablecida": true}	2026-09-28 03:13:34.819-04
180	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:13:34.874-04
181	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:13:35.039-04
182	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:13:36.634-04
183	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:13:36.683-04
184	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:13:36.71-04
185	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:13:52.058-04
186	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:13:52.091-04
187	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	perfiles	0798a4a0-61af-40b0-a7a3-94b7c602648e	{"estado": "inactivo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.update"}	2026-09-28 03:13:57.169-04
188	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:13:57.319-04
189	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:13:57.326-04
190	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:13:58.444-04
191	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:13:58.491-04
192	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:13:58.499-04
193	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	usuario_rol	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.roles.assign"}	2026-09-28 03:14:00.241-04
194	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	0798a4a0-61af-40b0-a7a3-94b7c602648e	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:14:00.271-04
195	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:14:00.305-04
196	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	8f64f523-6102-40a2-b3f8-e0253aceea10	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-28 03:14:05.669-04
197	0798a4a0-61af-40b0-a7a3-94b7c602648e	Creación	sesiones	d9a72b70-5e2a-47c0-90e6-c727c2f508f7	null	{"id": "d9a72b70-5e2a-47c0-90e6-c727c2f508f7"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 03:14:18.473-04
198	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:14:18.584-04
199	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:18.765-04
200	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:18.792-04
201	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:14:21.246-04
202	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:21.352-04
203	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:25.159-04
204	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:14:25.17-04
205	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:26.139-04
206	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:14:26.14-04
207	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:14:27.624-04
209	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	rol	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 03:14:28.532-04
210	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:14:48.647-04
211	0798a4a0-61af-40b0-a7a3-94b7c602648e	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:14:48.76-04
212	0798a4a0-61af-40b0-a7a3-94b7c602648e	Edición	sesiones	d9a72b70-5e2a-47c0-90e6-c727c2f508f7	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-28 03:16:20.862-04
213	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	68dcd598-1fcf-4941-bc0a-2bc5f187480b	null	{"id": "68dcd598-1fcf-4941-bc0a-2bc5f187480b"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 03:56:58.776-04
214	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 03:56:59.167-04
215	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:56:59.257-04
216	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 03:56:59.292-04
217	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.mi-perfil.read"}	2026-09-28 03:57:02.103-04
218	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.mi-perfil.read"}	2026-09-28 03:58:28.019-04
219	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-09-28 03:58:29.859-04
220	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	68dcd598-1fcf-4941-bc0a-2bc5f187480b	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-28 04:01:23.667-04
221	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	3fe52689-f4c6-45c0-8c61-ef31b222d58f	null	{"id": "3fe52689-f4c6-45c0-8c61-ef31b222d58f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 12:10:20.029-04
222	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 12:10:20.568-04
223	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.mi-perfil.read"}	2026-09-28 12:10:24.997-04
224	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ca0910b2-ac28-4e93-9c38-2113af415b08	null	{"id": "ca0910b2-ac28-4e93-9c38-2113af415b08"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 16:09:34.804-04
225	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 16:09:35.291-04
226	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d51c51b1-951f-4483-a06c-ba71e7ef4887	null	{"id": "d51c51b1-951f-4483-a06c-ba71e7ef4887"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 21:14:57.039-04
227	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:14:57.576-04
228	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 21:14:57.705-04
229	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:15:02.504-04
230	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:02.517-04
231	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:05.545-04
232	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-28 21:15:05.546-04
233	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:15:06.746-04
234	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:06.764-04
235	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:15:07.474-04
236	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:07.48-04
237	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:08.438-04
238	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-28 21:15:08.44-04
239	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:15:09.198-04
244	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:11.099-04
245	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:15:11.7-04
2348	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:00:16.784-04
2451	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 13:37:10.645-04
2490	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 21:32:45.019-04
2491	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 21:32:53.769-04
2492	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 21:32:54.002-04
2493	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 21:32:57.463-04
2494	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:32:57.612-04
2566	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 00:12:08.772-04
2567	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 00:12:14.05-04
2568	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:12:14.387-04
2569	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registros	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.manage"}	2026-10-09 00:12:40.499-04
2570	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:12:40.619-04
2571	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registros	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.manage"}	2026-10-09 00:13:05.785-04
2572	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:13:05.912-04
2573	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registros	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.manage"}	2026-10-09 00:13:29.767-04
2574	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:13:29.858-04
2575	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registros	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.manage"}	2026-10-09 00:13:55.838-04
2576	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:13:56.251-04
2577	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registros	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.manage"}	2026-10-09 00:14:19.933-04
2578	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:14:20.394-04
2579	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registros	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.manage"}	2026-10-09 00:14:47.651-04
2580	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 00:14:47.82-04
2581	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-09 00:14:52.085-04
2716	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 00:34:13.361-04
2717	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 00:34:17.961-04
2718	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 00:34:18.022-04
240	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:09.204-04
241	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-28 21:15:09.822-04
246	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:11.709-04
247	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-28 21:15:12.152-04
2349	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:00:40.231-04
2350	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:00:41.177-04
2351	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:00:45.179-04
2352	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:00:47.103-04
2454	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-10-08 13:37:24.093-04
2455	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-08 13:37:24.262-04
2456	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-08 13:37:24.54-04
2495	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:32:57.651-04
2582	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 00:15:32.45-04
2719	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	8b3bde58-85bf-4717-b738-c6f68df0083f	null	{"id": "8b3bde58-85bf-4717-b738-c6f68df0083f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 01:09:11.818-04
2720	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 01:09:12.227-04
2721	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 01:09:12.57-04
2722	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 01:09:12.694-04
2724	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 01:09:12.842-04
2818	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 01:32:22.533-04
2819	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 01:32:22.68-04
2874	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 02:56:46.029-04
2875	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:56:48.71-04
2947	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 03:13:48.179-04
2948	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:13:48.248-04
2949	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:13:49.662-04
2987	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d29e2c23-4690-4236-b6bf-67c2d9136459	null	{"id": "d29e2c23-4690-4236-b6bf-67c2d9136459"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 14:29:14.491-04
2988	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-09 14:29:14.723-04
3010	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	configuracion_sitio	2	null	{"activo": true}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.manage"}	2026-10-09 20:45:09.238-04
3011	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 20:45:09.337-04
3012	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 20:45:13.651-04
242	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:09.827-04
243	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:15:11.086-04
248	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:15:12.167-04
249	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	d51c51b1-951f-4483-a06c-ba71e7ef4887	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-28 21:15:22.608-04
250	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	22718137-d644-4205-9479-087ab3f42a8a	null	{"id": "22718137-d644-4205-9479-087ab3f42a8a"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 21:22:06.493-04
251	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:07.081-04
252	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 21:22:07.111-04
253	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:09.903-04
254	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:22:09.904-04
255	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-28 21:22:27.231-04
256	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:27.363-04
257	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:22:28.239-04
258	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:22:35.204-04
259	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:35.344-04
260	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:22:37.725-04
261	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:37.734-04
262	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:22:39.937-04
263	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:39.939-04
264	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:22:40.547-04
265	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:22:40.568-04
266	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:22:50.366-04
267	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:50.493-04
268	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:22:51.655-04
269	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:22:54.334-04
270	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:54.337-04
271	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:22:54.958-04
272	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:54.959-04
273	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:22:55.386-04
274	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:55.393-04
275	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:22:55.789-04
276	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:55.797-04
277	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:22:56.123-04
279	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:56.507-04
2353	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:00:48.825-04
2457	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 13:37:40.068-04
2458	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 13:37:40.568-04
2496	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menu_item	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.manage"}	2026-10-08 21:33:15.622-04
2497	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 21:33:15.75-04
2498	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 21:33:22.333-04
2499	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:33:22.438-04
2583	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	40f6cf72-b653-4f27-b7de-db2f39049aa4	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-09 00:21:30.972-04
2723	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 01:09:12.824-04
2822	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 01:36:37.064-04
2823	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 01:36:46.469-04
2876	48aa7abf-0acb-47b5-bd73-172aaec874f1	Eliminación	registro_contenido	2	{"estado": "activo"}	{"estado": "eliminado"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 02:57:49.276-04
2877	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:57:49.674-04
2950	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	19	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:14:20.69-04
2951	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:14:20.756-04
2989	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 14:29:15.072-04
3013	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 20:45:13.727-04
3032	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 21:49:43.656-04
278	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:22:56.134-04
280	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-28 21:22:56.513-04
281	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:22:57.244-04
282	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-28 21:23:01.651-04
2354	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:00:48.827-04
2356	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:00:59.012-04
2357	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-07 14:01:00.683-04
2459	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 13:38:04.688-04
2460	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 13:38:04.919-04
2500	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:33:22.595-04
2584	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	6a630b3e-5d3d-459b-9313-d211f93de7c9	null	{"id": "6a630b3e-5d3d-459b-9313-d211f93de7c9"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 00:22:18.346-04
2585	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 00:22:18.621-04
2725	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 01:09:13.295-04
2726	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:09:18.458-04
2727	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:09:20.194-04
2728	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:09:20.236-04
2824	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 01:38:18.349-04
2825	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 01:38:38.755-04
2878	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:58:08.576-04
2952	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	6c357cf0-c6ae-46f0-81e6-4a100cebf72c	null	{"id": "6c357cf0-c6ae-46f0-81e6-4a100cebf72c"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 04:10:32.985-04
2953	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 04:10:33.28-04
2954	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 04:10:33.434-04
2955	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 04:10:33.585-04
2990	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 14:29:15.222-04
3014	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	configuracion_sitio	3	null	{"activo": true}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.manage"}	2026-10-09 20:46:10.315-04
3015	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 20:46:10.438-04
3033	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 21:49:43.661-04
3034	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	03ca07f8-9c81-4e8a-8c13-02e19ab43472	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-09 21:49:47.499-04
283	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:23:01.659-04
284	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:27:28.633-04
285	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:27:28.79-04
286	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:28:13.826-04
287	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	4f67d7fa-5b7a-49c3-8261-aa8bbb8b04ec	null	{"id": "4f67d7fa-5b7a-49c3-8261-aa8bbb8b04ec"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-28 21:37:55.946-04
288	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-28 21:37:56.149-04
289	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:37:56.308-04
290	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:37:56.498-04
291	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 21:37:56.556-04
292	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:37:58.845-04
293	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:37:58.854-04
294	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:38:02.61-04
295	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:38:02.629-04
296	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:43:06.402-04
297	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:06.574-04
298	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:43:06.821-04
299	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-28 21:43:07.34-04
300	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:07.722-04
301	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:07.729-04
302	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:43:08.909-04
303	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-28 21:43:15.659-04
304	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:15.662-04
305	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-28 21:43:17.055-04
306	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:17.063-04
307	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:39.882-04
308	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-28 21:43:40.055-04
309	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-28 21:43:40.055-04
310	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-28 21:43:40.056-04
311	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-28 21:43:41.604-04
312	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.mi-perfil.read"}	2026-09-28 21:50:14.46-04
313	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-09-28 21:50:17.648-04
314	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 21:50:17.932-04
315	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-28 21:50:18.759-04
316	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-28 21:50:18.915-04
317	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.mi-perfil.read"}	2026-09-28 21:50:19.273-04
318	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-09-28 21:50:19.891-04
319	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	b9b01228-f054-44ad-9960-94b42faca98c	null	{"id": "b9b01228-f054-44ad-9960-94b42faca98c"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 03:34:19.869-04
320	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 03:34:20.2-04
321	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 03:34:20.319-04
322	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 03:34:24.118-04
323	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 03:34:24.128-04
324	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	empresas	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.manage"}	2026-09-29 03:36:54.244-04
325	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 03:36:54.292-04
326	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 03:36:54.476-04
327	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 03:37:03.654-04
328	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ea2d7df8-59cf-4301-9d19-272baf236c4f	null	{"id": "ea2d7df8-59cf-4301-9d19-272baf236c4f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 04:28:21.655-04
329	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:28:22.128-04
330	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 04:28:22.204-04
331	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:28:25.095-04
332	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:28:25.101-04
333	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:28:27.147-04
334	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:28:27.186-04
335	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:28:31.116-04
336	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sucursales	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.manage"}	2026-09-29 04:29:52.277-04
337	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:29:52.34-04
338	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:29:52.485-04
339	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:29:58.802-04
340	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:30:56.311-04
341	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:30:56.314-04
342	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:31:52.9-04
343	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sucursales	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.manage"}	2026-09-29 04:31:56-04
344	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:31:56.045-04
345	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:31:56.155-04
346	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:31:59.608-04
347	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:31:59.658-04
348	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:33:00.912-04
349	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sucursales	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.manage"}	2026-09-29 04:33:37.541-04
350	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:33:37.585-04
351	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:33:37.775-04
352	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:33:48.655-04
353	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:33:48.686-04
354	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:33:59.387-04
355	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sucursales	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.manage"}	2026-09-29 04:34:40.942-04
356	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:34:40.991-04
357	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:34:41.334-04
358	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:34:44.114-04
359	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 04:34:44.147-04
360	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sucursales	4	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.manage"}	2026-09-29 04:34:46.693-04
361	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:34:46.745-04
362	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:34:46.853-04
363	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:38:19.371-04
364	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:38:19.466-04
365	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 04:38:20.045-04
366	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 04:38:20.054-04
367	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-09-29 04:38:22.608-04
368	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	c077b2da-6a23-405d-a435-8e58242e432c	null	{"id": "c077b2da-6a23-405d-a435-8e58242e432c"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 12:20:11.806-04
369	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 12:20:12.245-04
370	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 12:20:12.326-04
371	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-29 12:20:14.931-04
372	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 12:20:14.94-04
373	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 12:20:20.243-04
376	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-29 12:20:23.603-04
378	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 12:20:26.094-04
2355	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:00:49.356-04
2502	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 21:33:44.1-04
2501	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 21:33:44.099-04
2586	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 00:22:18.774-04
2729	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:09:45.832-04
2826	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	2b6ebb7c-5783-4598-a5d9-022ece374f55	null	{"id": "2b6ebb7c-5783-4598-a5d9-022ece374f55"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 02:49:58.747-04
2827	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 02:49:59.049-04
2879	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:58:29.498-04
2956	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-09 04:10:33.653-04
2991	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 14:29:15.296-04
2992	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 14:29:15.387-04
2993	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 14:29:15.438-04
2996	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 14:29:20.295-04
2997	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 14:29:20.387-04
3016	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	2976075d-c417-44a7-8392-a18fe0f87268	null	{"id": "2976075d-c417-44a7-8392-a18fe0f87268"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 21:13:32.688-04
3017	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 21:13:32.912-04
3018	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 21:13:33.191-04
374	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-29 12:20:20.25-04
379	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-09-29 12:20:26.095-04
2358	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:01:19.168-04
2359	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:01:19.397-04
2503	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:33:44.208-04
2587	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 00:22:18.82-04
2730	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:10:15.581-04
2731	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:10:15.758-04
2732	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:10:17.937-04
2733	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:10:17.959-04
2734	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:10:20.304-04
2828	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 02:49:59.304-04
2880	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:58:41.115-04
2881	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:58:41.231-04
2882	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 02:58:42.525-04
2957	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 04:10:33.678-04
2994	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 14:29:15.539-04
2995	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 14:29:20.292-04
3019	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 21:13:33.229-04
3020	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 21:13:33.372-04
375	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 12:20:23.599-04
377	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-29 12:20:26.092-04
380	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	c077b2da-6a23-405d-a435-8e58242e432c	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-09-29 12:20:49.593-04
381	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	062c8b55-9f9c-4eac-a81b-46f92fbb74d8	null	{"id": "062c8b55-9f9c-4eac-a81b-46f92fbb74d8"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 14:17:18.059-04
382	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:17:18.5-04
383	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 14:17:18.568-04
384	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 14:17:18.705-04
385	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:17:23.872-04
386	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:17:23.905-04
387	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:17:23.914-04
388	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:17:23.924-04
389	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:17:27.971-04
390	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:17:31.561-04
391	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:17:31.596-04
392	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 14:17:38.883-04
393	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:17:39.055-04
394	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:17:39.068-04
395	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:17:41.68-04
396	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:17:41.714-04
397	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 14:17:53.917-04
398	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:17:53.937-04
399	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:17:59.712-04
400	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-09-29 14:17:59.716-04
401	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:17:59.891-04
402	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:00.983-04
403	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:00.995-04
404	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:04.701-04
405	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-09-29 14:18:04.703-04
406	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:18:04.725-04
407	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:05.235-04
408	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:05.258-04
409	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:18:16.515-04
410	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:16.546-04
411	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:18:16.549-04
412	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:17.355-04
413	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:18:17.375-04
414	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:03.235-04
415	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:03.351-04
416	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:19:07.257-04
417	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:19:07.27-04
418	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 14:19:07.411-04
419	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:19:08.002-04
420	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 14:19:08.029-04
421	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 14:19:14.026-04
422	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:19:14.054-04
423	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:17.653-04
424	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-09-29 14:19:17.658-04
425	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:19:17.832-04
426	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:21.099-04
427	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:21.122-04
428	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-09-29 14:19:24.767-04
429	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:24.782-04
430	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:19:24.788-04
431	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:25.787-04
432	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:25.839-04
433	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:30.765-04
434	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-09-29 14:19:30.768-04
435	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:19:30.781-04
436	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:31.461-04
437	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 14:19:31.484-04
438	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 14:19:33.593-04
2360	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:01:19.528-04
2361	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:01:25.789-04
2504	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:34:08.168-04
2505	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 21:34:16.34-04
2506	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 21:34:16.414-04
2507	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 21:34:18.369-04
2508	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 21:34:18.515-04
2509	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 21:34:21.956-04
2510	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:34:22.049-04
2588	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 00:22:18.859-04
2589	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 00:22:23.991-04
2590	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:22:24.268-04
2591	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:22:27.746-04
2592	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:22:27.773-04
2593	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:22:30.538-04
2594	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:22:32.022-04
2735	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:10:31.225-04
2736	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:10:31.324-04
2737	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:10:32.984-04
2738	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:10:33.045-04
2829	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 02:49:59.318-04
2883	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 02:59:24.3-04
2884	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:59:24.474-04
2885	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:59:28.892-04
2886	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:59:29.011-04
2887	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 02:59:39.135-04
2888	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:00:08.069-04
2889	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:00:08.13-04
2958	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 04:10:33.768-04
439	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 14:19:33.602-04
440	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d5a0ab53-a253-4436-aff9-2defb80f17fb	null	{"id": "d5a0ab53-a253-4436-aff9-2defb80f17fb"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 15:10:36.832-04
441	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:10:37.088-04
442	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:10:37.23-04
443	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 15:10:37.363-04
444	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:10:39.992-04
445	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:10:40.005-04
446	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:10:40.021-04
447	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:10:42.111-04
448	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:10:42.146-04
449	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:10:55.633-04
450	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:11:07.016-04
451	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:11:07.027-04
452	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:11:07.029-04
453	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:11:08.833-04
454	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:11:08.835-04
455	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:11:08.841-04
456	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:22:54.743-04
457	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:22:55.133-04
458	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:23:34.028-04
459	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:23:34.143-04
460	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:23:44.96-04
461	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:23:45.003-04
462	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:23:45.129-04
463	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:23:47.053-04
464	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:23:47.08-04
465	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-09-29 15:25:31.028-04
466	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:31.082-04
467	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:25:31.181-04
468	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:25:34.233-04
469	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:34.236-04
470	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:25:34.364-04
471	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:35.807-04
472	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:35.827-04
473	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	b8c3c3e6-fd9c-4d61-bec9-6c41a60f480a	null	{"id": "b8c3c3e6-fd9c-4d61-bec9-6c41a60f480a"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 15:25:43.859-04
474	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:43.969-04
475	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:25:44.001-04
2362	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:01:46.249-04
2511	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:34:22.203-04
2595	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:23:52.563-04
2596	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:23:52.718-04
2597	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:23:55.787-04
2598	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:23:55.817-04
2599	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:23:55.846-04
2600	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:23:57.774-04
2739	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:11:07.611-04
2740	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:11:14.921-04
2741	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:11:15.001-04
2742	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:16.634-04
2743	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:16.656-04
2744	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:11:19.96-04
2745	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:11:24.491-04
2746	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:11:24.845-04
2747	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:27.726-04
2748	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:11:30.006-04
2749	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:11:35.762-04
2750	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:11:35.85-04
2751	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:37.905-04
2752	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:37.927-04
2753	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:11:40.866-04
476	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:25:44.008-04
477	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:25:44.043-04
478	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:25:44.136-04
479	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 15:25:44.209-04
480	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:47.392-04
481	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:47.418-04
482	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:59.209-04
483	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:25:59.219-04
484	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:26:03.615-04
485	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:26:03.619-04
486	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:26:04.594-04
487	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:26:04.606-04
488	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:26:04.768-04
489	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:26:10.968-04
490	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:26:10.978-04
491	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-09-29 15:29:14.257-04
492	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:29:14.32-04
493	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:29:14.48-04
494	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:29:21.995-04
495	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:29:22.009-04
496	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:29:22.148-04
497	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:29:22.876-04
498	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:29:22.877-04
499	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:29:22.884-04
500	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:35:26.152-04
501	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:35:26.354-04
502	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:35:26.393-04
503	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:35:27.651-04
504	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:35:27.712-04
505	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:35:40.324-04
506	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:35:40.335-04
507	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:35:43.57-04
514	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-09-29 15:35:51.089-04
2363	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:01:46.263-04
2364	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:01:49.068-04
2512	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menu_item	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.manage"}	2026-10-08 21:34:33.846-04
2513	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 21:34:33.96-04
2514	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:34:35.517-04
2515	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:34:35.538-04
2601	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:23:57.902-04
2602	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:23:59.292-04
2754	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:11:46.922-04
2755	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:11:47.056-04
2756	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:11:52.195-04
2757	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:52.361-04
2830	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:49:59.482-04
2831	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:50:05.418-04
2832	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:50:05.507-04
2833	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:50:15.938-04
2834	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:50:16.045-04
2835	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:50:16.089-04
2840	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 02:50:23.057-04
2890	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:00:43.086-04
2959	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 04:10:37.794-04
2960	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 04:10:37.823-04
2998	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	9978c52b-aac6-42c7-83da-ed2c09b27300	null	{"id": "9978c52b-aac6-42c7-83da-ed2c09b27300"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 20:43:27.764-04
3021	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 21:13:33.382-04
508	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-09-29 15:35:43.575-04
509	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:35:43.727-04
510	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:35:46.909-04
511	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:35:46.938-04
512	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:35:51.076-04
513	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:35:51.083-04
515	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:37:20.544-04
516	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:37:20.72-04
517	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:37:20.722-04
518	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:37:22.191-04
519	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:37:22.213-04
520	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0e0d83fe-0ab2-43a2-a7a2-3fd1a1c057d0	null	{"id": "0e0d83fe-0ab2-43a2-a7a2-3fd1a1c057d0"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-09-29 15:41:12.619-04
521	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-09-29 15:41:12.778-04
522	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:41:13.028-04
523	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:41:13.05-04
524	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-09-29 15:41:13.128-04
525	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:41:13.152-04
526	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:41:13.169-04
527	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:41:15.801-04
528	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:41:15.807-04
529	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:41:19.577-04
530	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-09-29 15:41:26.294-04
531	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:41:30.457-04
532	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:41:31.134-04
533	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:41:31.161-04
534	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:41:33.376-04
535	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:42:33.532-04
536	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:42:33.643-04
537	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:42:35.59-04
538	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-09-29 15:42:39.986-04
539	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:42:40.102-04
542	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:42:40.882-04
547	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:42:42.4-04
548	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:42:47.742-04
2365	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:02:11.25-04
2366	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:02:11.632-04
2367	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:13.618-04
2368	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:15.373-04
2369	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:15.483-04
2370	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:15.726-04
2371	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:02:22.731-04
2372	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:02:23.339-04
2373	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:26.87-04
2374	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:29.795-04
2516	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 21:34:35.751-04
2517	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:34:35.825-04
2603	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:24:09.798-04
2604	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:24:09.907-04
2605	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:11.281-04
2606	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:11.321-04
2607	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:11.37-04
2608	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:24:14.512-04
2758	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:11:52.61-04
2836	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 02:50:16.333-04
2891	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:01:11.895-04
2892	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:01:11.972-04
2893	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:01:20.076-04
2894	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:01:46.072-04
2895	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:01:46.135-04
2896	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:01:55.322-04
540	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-09-29 15:42:40.455-04
544	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:42:41.257-04
2375	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:30.086-04
2376	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:02:39.946-04
2377	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:02:40.042-04
2378	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:43.252-04
2379	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:43.283-04
2380	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:45.449-04
2461	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	acec9985-f517-4bb8-96e8-68a3c60141a3	null	{"id": "acec9985-f517-4bb8-96e8-68a3c60141a3"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-08 20:04:18.91-04
2518	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menu_item	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.manage"}	2026-10-08 21:35:01.911-04
2519	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 21:35:01.99-04
2609	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:24:14.637-04
2610	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	18	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:24:25.858-04
2611	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:24:25.965-04
2612	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:29.694-04
2613	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:29.726-04
2614	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:34.761-04
2615	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:34.791-04
2616	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:24:36.425-04
2759	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:11:59.789-04
2760	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:12:01.564-04
2837	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 02:50:16.338-04
2842	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:50:23.177-04
2843	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:50:23.3-04
2897	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:02:21.318-04
2898	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:02:21.378-04
2899	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:02:30.231-04
2961	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d6d65212-8080-41d1-bda8-f340db7f9057	null	{"id": "d6d65212-8080-41d1-bda8-f340db7f9057"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 14:10:54.089-04
2962	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 14:10:54.49-04
2965	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 14:10:54.911-04
541	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:42:40.456-04
543	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-09-29 15:42:40.885-04
545	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-09-29 15:42:41.257-04
546	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:42:42.395-04
549	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:43:05.015-04
550	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:43:05.035-04
551	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:43:05.059-04
552	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:43:06.58-04
553	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:44:27.731-04
554	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-09-29 15:44:27.811-04
555	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-09-29 15:46:52.538-04
556	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:46:52.693-04
557	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:46:52.697-04
558	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:54:34.905-04
559	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-09-29 15:54:35.072-04
560	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-09-29 15:54:35.107-04
561	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:54:35.819-04
562	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-09-29 15:54:35.834-04
563	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d17b5a1b-65d0-4585-a26d-2e1f0d78926a	null	{"id": "d17b5a1b-65d0-4585-a26d-2e1f0d78926a"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 13:20:46.995-04
564	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 13:20:47.467-04
565	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:20:47.535-04
566	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 13:20:47.618-04
567	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 13:20:50.109-04
568	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:20:50.143-04
569	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 13:20:50.141-04
570	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:20:50.165-04
571	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	productos	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-01 13:23:16.785-04
572	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:23:16.838-04
573	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:23:16.966-04
574	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:23:20.876-04
575	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:23:20.88-04
576	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:23:21.016-04
577	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:23:22.67-04
578	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:23:22.699-04
579	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:23:25.032-04
580	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-01 13:25:32.986-04
581	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:25:33.048-04
582	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:25:33.197-04
583	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ff7ebdc5-75c6-49f1-8ea4-8a9c1b186239	null	{"id": "ff7ebdc5-75c6-49f1-8ea4-8a9c1b186239"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 13:50:57.303-04
584	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:50:58.097-04
586	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 13:50:58.378-04
585	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:50:58.361-04
587	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 13:50:58.447-04
588	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:50:58.453-04
589	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:50:58.498-04
590	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:51:11.393-04
591	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 13:51:12.813-04
592	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-01 13:52:31.15-04
593	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 13:52:31.2-04
594	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:52:31.329-04
595	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:52:36.271-04
596	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:52:36.277-04
597	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:52:36.312-04
598	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-01 13:58:33.226-04
599	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:58:33.279-04
600	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:58:33.422-04
601	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 13:58:35.956-04
602	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:58:35.968-04
603	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:58:38.992-04
604	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:58:38.997-04
605	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:58:39.157-04
606	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 13:58:39.664-04
607	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:58:39.688-04
610	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 13:58:46.744-04
611	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:58:46.766-04
612	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 13:58:52.103-04
613	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:58:52.108-04
614	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 13:58:54.67-04
2381	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:02:45.614-04
2462	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 20:04:19.737-04
2520	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:37:39.433-04
2617	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:24:36.55-04
2618	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:24:37.658-04
2619	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	19	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:24:44.472-04
2620	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:24:44.626-04
2621	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:50.343-04
2622	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:50.378-04
2623	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:24:50.415-04
2624	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:24:51.859-04
2625	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:24:51.885-04
2626	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:24:52.868-04
2761	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:12:13.741-04
2762	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:12:13.878-04
2763	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:12:17.18-04
2764	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:12:17.216-04
2765	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:12:19.334-04
2838	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 02:50:16.396-04
2839	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 02:50:23.046-04
2900	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:02:50.874-04
608	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 13:58:39.7-04
609	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 13:58:46.732-04
615	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:05:10.787-04
616	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 14:05:10.902-04
617	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:05:10.911-04
618	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 14:05:14.596-04
619	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0af1334f-008a-4076-8aa0-4c9ad50878b0	null	{"id": "0af1334f-008a-4076-8aa0-4c9ad50878b0"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 14:09:42.069-04
620	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:09:42.22-04
621	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 14:09:42.442-04
622	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:09:42.448-04
623	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 14:09:42.531-04
624	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:09:42.553-04
625	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 14:09:42.585-04
626	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:09:46.021-04
627	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:09:46.025-04
628	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:09:46.024-04
629	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:09:48.506-04
630	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:13:43.827-04
631	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	productos	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-01 14:14:16.385-04
632	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:14:16.453-04
633	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:14:16.565-04
634	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:14:59.526-04
635	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 14:14:59.659-04
636	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:15:09.582-04
637	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:15:21.249-04
638	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 14:15:21.386-04
639	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:21.415-04
640	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:15:21.792-04
641	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:15:21.799-04
642	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:21.805-04
643	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 14:15:23.212-04
647	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:24.207-04
648	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:15:24.853-04
653	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 14:15:26.892-04
654	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:15:27.593-04
2382	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:02:55.826-04
2383	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:02:55.918-04
2384	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:59.319-04
2385	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:59.346-04
2386	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:02:59.369-04
2387	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:02.493-04
2393	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:09.524-04
2394	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:09.555-04
2463	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 20:04:19.787-04
2521	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 21:37:39.597-04
2522	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:37:39.641-04
2523	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 21:37:39.684-04
2627	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:24:53.033-04
2628	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	20	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:24:58.46-04
2629	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:24:58.572-04
2630	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:04.662-04
2631	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:04.692-04
2632	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:25:09.222-04
2633	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:25:10.529-04
2634	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	21	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:25:16.802-04
2635	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:25:16.93-04
2636	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:20.169-04
2637	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:20.195-04
2638	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:25:22.022-04
2639	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:25:23.413-04
644	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 14:15:23.213-04
650	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 14:15:24.869-04
651	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:15:26.861-04
656	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:27.611-04
2388	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:02.602-04
2389	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:03:07.252-04
2390	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:07.333-04
2391	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:09.445-04
2392	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:09.522-04
2395	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:09.556-04
2396	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	menus	10	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:03:13.408-04
2397	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:13.517-04
2398	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:18.286-04
2399	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:18.355-04
2400	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:20.183-04
2464	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:04:19.926-04
2524	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	f9b5a792-51ec-4361-98a0-0df6a51ccff8	null	{"id": "f9b5a792-51ec-4361-98a0-0df6a51ccff8"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-08 22:05:12.815-04
2525	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 22:05:13.265-04
2526	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 22:05:13.593-04
2528	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 22:05:13.775-04
2640	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	22	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:25:28.633-04
2641	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:25:28.759-04
2642	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:37.507-04
2643	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:37.536-04
2644	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:25:39.367-04
2645	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:25:42.687-04
2652	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:25:51.732-04
2653	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:25:52.975-04
2766	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:12:30.884-04
2841	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 02:50:23.134-04
645	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:23.224-04
646	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 14:15:24.205-04
649	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:24.865-04
652	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:15:26.889-04
655	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 14:15:27.609-04
657	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	a9fa3c03-400d-4d20-af03-f0999cefc940	null	{"id": "a9fa3c03-400d-4d20-af03-f0999cefc940"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 14:36:03.27-04
658	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 14:36:03.612-04
659	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 14:36:03.632-04
660	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 14:36:03.681-04
661	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:36:03.683-04
662	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 14:36:03.732-04
663	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 14:36:03.787-04
664	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	a9fa3c03-400d-4d20-af03-f0999cefc940	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-01 14:42:07.675-04
665	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	70db2290-d1ea-4aab-a1ac-7cf6b96a6fba	null	{"id": "70db2290-d1ea-4aab-a1ac-7cf6b96a6fba"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 15:30:44.803-04
666	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:30:45.114-04
667	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 15:30:45.284-04
668	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 15:30:45.412-04
669	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:30:48.201-04
670	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:30:48.215-04
671	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 15:30:48.21-04
672	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:30:48.221-04
673	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:30:48.333-04
674	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 15:31:01.92-04
675	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 15:31:01.957-04
676	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:31:01.971-04
677	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 15:31:06.777-04
678	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:31:06.778-04
679	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 15:31:09.389-04
680	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:31:14.804-04
681	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 15:31:14.82-04
682	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:31:14.981-04
683	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:31:16.195-04
684	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:31:16.199-04
685	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 15:31:16.23-04
686	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:33:29.357-04
687	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 15:33:29.499-04
688	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 15:33:29.5-04
689	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:33:30.28-04
690	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 15:33:30.308-04
691	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	24bff1f7-c3f2-4c56-b20d-863ea88554b5	null	{"id": "24bff1f7-c3f2-4c56-b20d-863ea88554b5"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 16:07:31.891-04
692	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:07:32.25-04
694	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:07:32.39-04
693	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:07:32.389-04
695	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:07:32.485-04
696	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:07:32.578-04
697	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 16:07:32.594-04
698	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:07:35.108-04
699	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:07:35.123-04
700	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:07:46.871-04
701	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:07:49.138-04
702	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:07:49.286-04
703	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:09:49.129-04
704	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:09:49.155-04
705	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-01 16:09:51.864-04
706	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-01 16:09:51.893-04
707	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-10-01 16:09:59.119-04
708	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:09:59.151-04
709	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-01 16:09:59.182-04
710	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:10:03.844-04
712	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:10:04.008-04
714	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:10:06.119-04
2401	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:20.336-04
2402	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:03:25.78-04
2403	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:25.895-04
2404	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:29.708-04
2405	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:29.741-04
2406	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:32.348-04
2407	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:32.373-04
2465	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 20:04:19.932-04
2466	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:04:30.356-04
2527	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 22:05:13.694-04
2646	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:25:42.822-04
2647	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	23	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:25:48.317-04
2648	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:25:48.45-04
2649	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:49.823-04
2650	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:25:49.896-04
2651	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:25:51.73-04
2654	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:25:52.995-04
2655	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	24	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:25:58.735-04
2656	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:25:58.829-04
2767	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 01:12:46.469-04
2844	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:50:23.316-04
2845	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:50:25.037-04
2901	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:02:50.941-04
2963	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 14:10:54.778-04
2964	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 14:10:54.904-04
2999	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 20:43:28.482-04
3022	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 21:13:33.51-04
711	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 16:10:04.008-04
713	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:10:06.099-04
717	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:10:07.164-04
2408	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:03:44.521-04
2409	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:44.601-04
2410	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:49.335-04
2411	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:49.42-04
2412	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:51.348-04
2418	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:58.414-04
2419	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:58.442-04
2467	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 20:04:39.49-04
2470	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 20:04:39.888-04
2529	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 22:05:14.02-04
2657	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:19.96-04
2658	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:20.012-04
2659	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:21.501-04
2660	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 00:27:22.574-04
2661	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:23.947-04
2768	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:13:03.6-04
2769	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:13:03.913-04
2770	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:13:05.936-04
2771	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 01:13:10.098-04
2772	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:13:18.944-04
2773	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:13:19.151-04
2846	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:51:06.282-04
2902	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:03:02.946-04
2903	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:03:28.997-04
2904	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:03:29.075-04
2905	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 03:03:39.878-04
2906	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:03:39.942-04
715	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:10:06.134-04
716	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:10:07.153-04
718	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:11:43.075-04
719	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:11:43.282-04
720	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-10-01 16:11:59.155-04
721	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:11:59.323-04
722	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:11:59.661-04
723	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:11:59.747-04
724	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:02.913-04
725	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:04.021-04
726	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:04.73-04
727	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:04.911-04
728	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:05.646-04
729	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:12.534-04
730	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:13.286-04
731	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:13.446-04
732	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	24bff1f7-c3f2-4c56-b20d-863ea88554b5	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-01 16:12:24.83-04
733	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	fe0f5491-8c9c-47ff-a78f-9b0d21d9680f	null	{"id": "fe0f5491-8c9c-47ff-a78f-9b0d21d9680f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-01 16:12:58.05-04
734	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:12:58.179-04
735	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 16:12:58.347-04
736	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:12:58.418-04
737	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:12:58.514-04
738	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-01 16:12:58.557-04
739	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-01 16:13:01.916-04
740	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-01 16:13:01.988-04
741	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	roles	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.permisos.assign"}	2026-10-01 16:13:07.791-04
742	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-01 16:13:07.823-04
743	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-01 16:13:07.855-04
744	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:13:10.611-04
745	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:13:10.775-04
746	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:13:10.793-04
747	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:13:12.101-04
748	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:13:13.884-04
756	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:13:20.753-04
2413	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:51.493-04
2414	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:03:56.708-04
2415	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:56.791-04
2416	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:03:58.339-04
2417	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:03:58.407-04
2420	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:03:58.443-04
2421	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	menus	12	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:04:00.26-04
2422	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:04:00.35-04
2423	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:04:02.842-04
2424	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	13	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:04:05.095-04
2425	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:04:07.68-04
2426	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:04:07.72-04
2427	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:04:09.806-04
2428	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:04:09.826-04
2429	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:04:16.656-04
2430	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:04:16.743-04
2468	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:04:39.556-04
2469	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:04:39.812-04
2530	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 22:05:14.312-04
2531	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 22:05:18.295-04
2532	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 22:05:18.519-04
2533	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:05:26.773-04
2662	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:24.101-04
2663	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	25	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:27:31.581-04
2664	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:27:31.694-04
2665	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:33.221-04
2666	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:33.251-04
749	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:13:13.898-04
753	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:13:19.07-04
754	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:13:20.737-04
2431	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:04:31.396-04
2471	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 20:04:39.955-04
2472	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-08 20:04:44.764-04
2534	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 22:05:27.05-04
2535	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:05:27.1-04
2536	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:05:27.375-04
2667	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:34.929-04
2668	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:34.959-04
2669	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:36.115-04
2676	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:45.011-04
2677	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:46.202-04
2678	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:46.25-04
2679	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	27	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:27:51.137-04
2680	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:27:51.287-04
2681	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:52.254-04
2682	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:52.287-04
2683	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:53.724-04
2686	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:54.953-04
2687	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	28	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:28:00.271-04
2688	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:28:00.395-04
2774	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:13:44.898-04
2847	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 02:51:06.384-04
2907	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:03:41.289-04
2966	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 14:11:00.228-04
2967	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-09 14:11:00.438-04
2968	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 14:11:02.152-04
3000	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 20:43:28.644-04
750	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-01 16:13:13.905-04
751	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-01 16:13:19.011-04
752	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:13:19.062-04
755	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-01 16:13:20.738-04
757	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-01 16:13:20.849-04
758	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:16:33.48-04
759	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:16:33.697-04
760	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 16:16:33.724-04
761	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:16:34.887-04
762	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:16:34.901-04
763	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:16:36.153-04
764	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:16:36.158-04
765	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:16:36.168-04
766	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:16:38.193-04
767	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:16:38.199-04
768	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:16:38.21-04
769	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:16:38.916-04
770	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:16:38.917-04
771	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:16:38.926-04
772	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:17:17.234-04
773	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:17:17.341-04
774	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:17:26.224-04
775	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:17:26.281-04
776	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:17:26.29-04
777	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:17:32.88-04
778	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:17:32.904-04
779	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:17:38.536-04
780	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:17:38.591-04
781	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:17:38.6-04
782	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:17:45.482-04
783	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:17:45.506-04
784	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:17:54.093-04
785	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:17:54.147-04
786	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:17:54.327-04
787	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:01.713-04
788	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:18:07.79-04
789	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:18:07.835-04
790	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:18:07.95-04
791	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:13.389-04
792	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:13.418-04
793	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:18:19.681-04
794	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:18:19.743-04
795	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:18:19.821-04
796	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:25.133-04
797	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:25.159-04
798	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:18:34.386-04
799	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:18:34.447-04
800	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:18:34.55-04
801	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:18:39.309-04
802	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:18:39.378-04
803	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:18:39.388-04
804	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:45.994-04
805	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:18:46.023-04
806	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:18:54.697-04
807	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:18:54.74-04
808	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:18:54.843-04
809	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:03.279-04
810	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:03.304-04
811	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:19:09.247-04
812	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:19:09.301-04
813	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:09.406-04
814	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:13.569-04
815	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:13.606-04
816	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	industrias	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:19:20.609-04
817	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:19:20.66-04
818	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:20.756-04
819	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	9	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-01 16:19:28.006-04
820	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:19:28.054-04
821	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:28.062-04
822	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-01 16:19:35.771-04
823	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:35.776-04
824	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:19:36.522-04
825	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 16:19:36.526-04
826	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:36.691-04
827	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:36.984-04
828	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:19:36.985-04
829	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:36.991-04
830	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-10-01 16:19:38.926-04
831	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 16:19:38.928-04
832	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 16:19:39.371-04
833	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-10-01 16:19:39.385-04
834	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 16:19:39.726-04
835	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-10-01 16:19:39.733-04
836	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-01 16:19:40.081-04
837	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-10-01 16:19:40.088-04
838	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:41.259-04
839	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:19:41.262-04
840	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:19:41.272-04
841	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:44.351-04
842	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:19:44.372-04
843	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	servicios	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-01 16:20:03.041-04
844	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:20:03.077-04
845	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:20:03.204-04
846	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:20:08.682-04
847	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:20:08.688-04
848	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	servicios	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-01 16:20:22.09-04
849	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:20:22.149-04
850	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:20:22.261-04
851	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:20:28.3-04
852	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:20:28.328-04
853	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	servicios	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-01 16:20:38.669-04
854	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:20:38.712-04
855	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:20:38.814-04
856	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:20:47.322-04
857	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:20:47.364-04
858	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	servicios	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-01 16:20:59.253-04
859	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:20:59.312-04
860	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:20:59.446-04
861	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:05.341-04
862	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:05.365-04
863	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	servicios	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-01 16:21:17.65-04
864	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:21:17.704-04
865	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:21:17.8-04
866	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:27.263-04
867	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:27.283-04
868	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	servicios	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-01 16:21:39.188-04
869	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:21:39.263-04
870	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:21:39.496-04
871	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:51.954-04
872	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-01 16:21:52.119-04
873	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:21:52.128-04
874	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:54.834-04
879	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:21:56.838-04
880	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-01 16:21:58.269-04
2432	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 14:04:31.516-04
2433	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 14:04:33.5-04
2473	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-08 20:04:44.772-04
2537	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 22:05:54.021-04
2670	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:36.283-04
2671	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	26	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:27:42.099-04
2672	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:27:42.218-04
2673	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:43.22-04
2674	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:27:43.25-04
2675	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:44.997-04
2684	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:27:53.735-04
2685	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:27:54.94-04
2775	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:13:45.057-04
2776	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 01:13:47.21-04
2777	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 01:13:53.812-04
2778	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:13:58.935-04
2779	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:13:59.024-04
2780	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:14:01.668-04
2781	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:14:01.704-04
2782	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-09 01:14:05.843-04
2783	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:14:10.698-04
2784	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:14:10.786-04
2785	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:14:13.834-04
2786	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:14:13.879-04
2787	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 01:14:31.011-04
2848	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 02:51:06.41-04
875	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-01 16:21:54.84-04
878	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-01 16:21:56.825-04
881	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:21:58.284-04
2434	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 14:04:44.117-04
2435	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 14:04:44.22-04
2474	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:07:27.497-04
2475	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:07:27.744-04
2476	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 20:07:27.929-04
2538	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 22:05:54.151-04
2689	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:28:13.137-04
2692	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:28:15.068-04
2693	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:28:16.367-04
2694	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:28:16.404-04
2788	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:14:59.172-04
2789	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:14:59.263-04
2790	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:15:01.944-04
2791	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 01:15:06.014-04
2849	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 02:51:06.411-04
2850	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:51:12.606-04
2851	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:51:12.663-04
2852	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:51:14.776-04
2853	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 02:51:20.985-04
2908	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:04:07.586-04
2909	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:04:07.671-04
2910	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:04:08.78-04
2911	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:04:29.638-04
2912	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:04:29.692-04
2913	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:04:37.247-04
2914	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:04:55.135-04
2915	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:04:55.201-04
876	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:21:54.848-04
877	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-01 16:21:56.818-04
882	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-01 16:21:58.293-04
883	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	46257069-aef5-4693-8e10-db0a1cb9acb6	null	{"id": "46257069-aef5-4693-8e10-db0a1cb9acb6"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 12:58:42.745-04
884	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 12:58:43.585-04
885	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 12:58:43.775-04
886	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 12:58:43.874-04
887	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:08:36.877-04
888	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:08:37.076-04
889	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:08:37.338-04
890	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:08:37.44-04
891	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:08:39.51-04
892	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 13:08:39.547-04
893	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:08:39.611-04
894	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:08:42.817-04
895	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 13:08:42.928-04
896	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:08:45.023-04
897	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 13:08:45.052-04
898	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:08:45.19-04
899	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:08:48.104-04
900	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 13:08:48.111-04
901	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:08:48.129-04
902	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:09:40.783-04
903	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 13:09:41.005-04
904	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:09:41.112-04
905	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:10:49.136-04
906	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:10:49.345-04
907	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:10:49.369-04
908	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:10:53.126-04
909	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:10:53.196-04
910	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:12:28.721-04
911	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:12:28.848-04
912	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:12:29.589-04
913	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:12:43.918-04
914	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	2312650e-6a56-4d89-8f87-9f70104df77c	null	{"id": "2312650e-6a56-4d89-8f87-9f70104df77c"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 13:13:52.064-04
915	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:13:53.062-04
916	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 13:13:54.387-04
917	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:13:54.978-04
918	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:13:55.348-04
919	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 13:13:57.388-04
920	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:13:57.488-04
921	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:14:01.933-04
922	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:16:23.073-04
923	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 13:16:23.42-04
924	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:16:23.436-04
925	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:16:23.68-04
926	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 13:16:23.709-04
927	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:16:23.8-04
928	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:16:28.675-04
929	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:17:13.916-04
930	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:17:14.018-04
931	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:17:14.228-04
932	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:17:31.413-04
933	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:27:14.689-04
934	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:27:14.748-04
935	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 13:27:14.863-04
937	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:27:14.916-04
936	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:27:14.916-04
938	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 13:27:15.155-04
939	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:27:28.161-04
940	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:27:28.197-04
941	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:28:38.722-04
942	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:28:38.785-04
943	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:28:38.962-04
944	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0ed62ba4-aaae-461c-85f2-4c579b2c9749	null	{"id": "0ed62ba4-aaae-461c-85f2-4c579b2c9749"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 13:29:30.778-04
945	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:29:30.968-04
946	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 13:29:31.267-04
947	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:29:31.313-04
948	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:29:31.331-04
949	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:29:31.559-04
950	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 13:29:31.649-04
951	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:29:34.312-04
952	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:29:34.362-04
953	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:30:43.921-04
954	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:30:44.012-04
955	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:30:44.16-04
956	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:31:30.253-04
957	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:31:30.365-04
958	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:32:59.157-04
959	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:32:59.245-04
960	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:32:59.446-04
961	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:33:30.636-04
962	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:33:30.665-04
963	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:34:39.743-04
964	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:34:39.808-04
965	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:34:39.924-04
966	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:35:15.015-04
967	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:35:15.144-04
968	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:36:29.754-04
969	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:36:29.839-04
970	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:36:30.002-04
971	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:36:52.817-04
972	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:36:52.934-04
973	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:37:59.327-04
974	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:37:59.39-04
975	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:37:59.538-04
976	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	productos	10	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:38:17.523-04
977	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:38:17.6-04
978	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:38:17.75-04
979	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:39:02.404-04
980	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:39:02.436-04
981	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:39:22.669-04
982	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:39:22.734-04
983	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:39:22.877-04
984	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:39:55.586-04
985	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:39:55.754-04
986	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:41:24.857-04
987	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:41:24.93-04
988	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:41:25.086-04
989	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:41:48.344-04
990	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:41:48.399-04
991	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:42:49.527-04
992	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:42:49.594-04
993	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:42:49.746-04
994	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:43:16.601-04
995	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:43:16.72-04
996	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 13:44:22.366-04
997	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:44:22.428-04
998	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:44:22.613-04
1028	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:06:00.559-04
999	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	372e1ac6-e088-40fd-9ed0-f0fd4f52186b	null	{"id": "372e1ac6-e088-40fd-9ed0-f0fd4f52186b"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 13:44:53.914-04
1000	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 13:44:54.102-04
1001	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 13:44:54.297-04
1002	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 13:44:54.314-04
1003	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:44:54.358-04
1004	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 13:44:54.397-04
1005	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 13:44:54.433-04
1006	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	e9ecfa15-d45d-400a-be88-b04c0bee1a18	null	{"id": "e9ecfa15-d45d-400a-be88-b04c0bee1a18"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 14:01:45.715-04
1007	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:01:45.969-04
1008	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 14:01:46.37-04
1009	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:01:46.565-04
1010	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 14:01:46.678-04
1011	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:01:46.691-04
1012	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:01:46.752-04
1013	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:01:59.408-04
1014	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:01:59.457-04
1015	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 14:03:24.223-04
1016	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:03:24.317-04
1017	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:03:24.518-04
1018	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:03:46.107-04
1019	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:03:46.141-04
1020	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	productos	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.manage"}	2026-10-05 14:05:39.205-04
1021	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:05:39.342-04
1022	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:05:39.584-04
1023	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:05:58.533-04
1024	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:05:58.734-04
1025	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:05:58.75-04
1026	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:06:00.549-04
1027	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:06:00.555-04
1029	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:06:01.654-04
1030	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:06:01.661-04
1032	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:06:02.221-04
2436	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	957f4554-0fb2-4e1a-8f98-0eeaf5a1937a	null	{"id": "957f4554-0fb2-4e1a-8f98-0eeaf5a1937a"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-08 13:34:08.352-04
2477	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 20:07:28.248-04
2539	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 22:05:54.208-04
2543	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 22:05:57.119-04
2544	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 22:05:57.341-04
2545	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 22:06:02.311-04
2690	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:28:13.17-04
2691	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:28:15.05-04
2792	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 01:15:06.133-04
2793	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:15:10.02-04
2794	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:15:10.204-04
2795	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:15:16.51-04
2796	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 01:15:21.213-04
2854	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 02:51:21.198-04
2858	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:51:21.423-04
2916	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	2cc613d3-d75c-4dcb-8f99-14e26e81490d	null	{"id": "2cc613d3-d75c-4dcb-8f99-14e26e81490d"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 03:06:11.484-04
2917	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 03:06:11.688-04
2918	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 03:06:11.829-04
2919	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 03:06:11.887-04
2969	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	pasos_wizard	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.manage"}	2026-10-09 14:11:37.365-04
2970	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-09 14:11:37.594-04
2971	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 14:11:39.506-04
2972	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 14:11:39.56-04
2973	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	pasos_wizard	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.manage"}	2026-10-09 14:12:26.711-04
2974	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-09 14:12:27.065-04
2975	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 14:12:31.933-04
2976	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 14:12:35.108-04
2977	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 14:12:35.326-04
1031	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:06:01.667-04
1034	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:06:02.236-04
2437	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 13:34:09.053-04
2478	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 20:07:28.526-04
2540	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 22:05:54.522-04
2541	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 22:05:54.693-04
2542	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 22:05:54.837-04
2546	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:06:02.313-04
2547	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:06:02.44-04
2548	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:06:02.497-04
2695	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	29	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:28:35.074-04
2696	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:28:35.177-04
2697	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:28:42.426-04
2698	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:28:42.459-04
2699	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:28:44.185-04
2702	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:28:46.132-04
2703	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	30	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-09 00:28:54.33-04
2704	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-09 00:28:54.451-04
2705	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:29:00.873-04
2706	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 00:29:00.901-04
2707	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:29:03.538-04
2797	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 01:15:21.329-04
2798	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:15:28.542-04
2799	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:15:28.655-04
2800	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:15:39.213-04
2801	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 01:15:42.998-04
2802	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:15:47.093-04
2803	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:15:47.206-04
2855	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:51:21.268-04
2857	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:51:21.399-04
1033	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:06:02.223-04
1035	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:08:32.494-04
1036	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:08:32.582-04
1037	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:08:32.779-04
1038	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	2	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:08:47.712-04
1039	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:08:47.814-04
1040	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:08:48.004-04
1041	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	4	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:09:17.04-04
1042	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:09:17.104-04
1043	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:09:17.263-04
1044	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	5	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:09:30.853-04
1045	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:09:30.914-04
1046	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:09:31.055-04
1047	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	3	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:10:16.954-04
1048	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:10:17.005-04
1049	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:10:17.203-04
1050	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	9	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:10:42.377-04
1051	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:10:42.46-04
1052	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:10:42.59-04
1053	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	9	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:11:07.639-04
1054	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:11:07.692-04
1055	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:11:07.803-04
1056	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	8	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:11:50.486-04
1057	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:11:50.712-04
1058	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:11:50.747-04
1059	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:12:06.19-04
1060	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:12:06.242-04
1061	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:12:06.387-04
1062	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	industrias	7	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.manage"}	2026-10-05 14:12:20.058-04
1063	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:12:20.124-04
1064	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:12:20.27-04
1065	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:12:29.123-04
1066	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:12:29.127-04
1067	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:12:29.716-04
1068	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:12:29.728-04
1069	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:12:29.892-04
1070	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	servicios	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-05 14:14:25.399-04
1071	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:14:25.46-04
1072	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:14:25.597-04
1073	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	servicios	2	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-05 14:14:50.189-04
1074	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:14:50.257-04
1075	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:14:50.411-04
1076	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	servicios	3	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-05 14:15:18.251-04
1077	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:15:18.36-04
1078	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:15:18.591-04
1079	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	servicios	4	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-05 14:15:48.141-04
1080	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:15:48.214-04
1081	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:15:48.672-04
1082	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	servicios	5	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-05 14:16:02.423-04
1083	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:16:02.486-04
1084	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:16:02.696-04
1085	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	servicios	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.manage"}	2026-10-05 14:16:16.615-04
1086	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-05 14:16:16.675-04
1087	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:16:16.839-04
1088	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 14:16:19.925-04
1089	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-05 14:16:19.931-04
1090	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:16:20.092-04
1091	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:16:20.856-04
1092	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:16:20.867-04
1093	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	c104b73d-5238-4a9a-9360-c668015c2bfa	null	{"id": "c104b73d-5238-4a9a-9360-c668015c2bfa"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 14:17:04.757-04
1094	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:17:04.896-04
1095	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:17:05.108-04
1096	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 14:17:05.125-04
1097	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:17:05.257-04
1098	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 14:17:05.327-04
1099	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:18:28.126-04
1100	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:18:28.174-04
1101	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:18:28.302-04
1102	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:19:22.628-04
1103	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:19:22.674-04
1104	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:19:23.095-04
1105	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:19:56.067-04
1106	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:19:56.12-04
1107	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:19:56.271-04
1108	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:21:21.548-04
1109	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:21:21.602-04
1110	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:21:21.837-04
1111	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:22:10.868-04
1112	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:22:10.961-04
1113	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:22:11.199-04
1114	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:22:50.99-04
1115	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:22:51.042-04
1116	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:22:51.152-04
1117	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:23:51.846-04
1118	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:23:51.916-04
1119	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:23:52.117-04
1120	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:24:31.454-04
1121	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:24:31.542-04
1122	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:24:31.677-04
1123	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:24:59.626-04
1124	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:24:59.686-04
1125	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:24:59.804-04
1126	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	10	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:25:10.302-04
1127	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:25:10.357-04
1128	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:25:10.489-04
1129	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:26:37.849-04
1130	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:26:37.908-04
1131	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:26:38.028-04
1132	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:27:49.24-04
1133	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:27:49.299-04
1134	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:27:49.491-04
1135	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:28:27.016-04
1136	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:28:27.171-04
1137	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:28:27.478-04
1138	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:30:14.713-04
1139	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:30:14.822-04
1140	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:30:14.949-04
1141	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:30:59.429-04
1142	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:30:59.504-04
1143	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:30:59.644-04
1144	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	11	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:31:37.03-04
1145	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:31:37.114-04
1146	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:31:37.267-04
1147	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	5c33768f-9b29-4dcd-b02c-d7e42321788f	null	{"id": "5c33768f-9b29-4dcd-b02c-d7e42321788f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 14:32:20.32-04
1148	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:32:20.463-04
1149	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 14:32:20.641-04
1150	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:32:20.656-04
1151	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:32:20.744-04
1152	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 14:32:20.854-04
1153	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:32:48.348-04
1154	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:32:48.414-04
1155	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:32:48.556-04
1156	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:33:45.263-04
1157	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:33:45.349-04
1158	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:33:45.435-04
1159	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	18	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:34:31.645-04
1160	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:34:31.732-04
1161	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:34:31.874-04
1162	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	19	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:34:54.671-04
1163	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:34:54.736-04
1164	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:34:54.852-04
1165	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	6	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:35:21.667-04
1166	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:35:21.758-04
1167	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:35:21.914-04
1168	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	3	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:35:39.553-04
1169	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:35:39.618-04
1170	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:35:39.778-04
1171	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	2	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:35:52.108-04
1172	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:35:52.181-04
1173	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:35:52.309-04
1174	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	5	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:36:07.228-04
1175	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:36:07.283-04
1176	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:36:07.409-04
1177	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	20	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:36:46.17-04
1178	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:36:46.257-04
1179	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:36:46.418-04
1243	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:52:17.287-04
1180	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	8	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:36:56.223-04
1181	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:36:56.284-04
1185	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:37:06.192-04
1186	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	9	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:37:21.795-04
1187	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:37:21.857-04
2438	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 13:34:09.3-04
2440	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 13:34:09.53-04
2441	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-08 13:34:22.431-04
2479	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:15:07.781-04
2480	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 20:15:08.04-04
2481	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 20:15:08.487-04
2549	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 22:07:39.276-04
2550	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:07:43.372-04
2700	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:28:44.288-04
2701	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:28:46.128-04
2804	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:16:07.525-04
2805	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:16:07.55-04
2856	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 02:51:21.367-04
2920	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 03:06:12.054-04
2921	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 03:06:12.135-04
2978	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 14:19:28.31-04
3001	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 20:43:28.706-04
3023	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	15	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 21:18:44.551-04
3024	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	16	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 21:18:48.071-04
3025	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	17	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 21:18:51.77-04
3026	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	14	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 21:18:55.032-04
1182	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:36:56.293-04
1183	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	7	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:37:06.069-04
1184	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:37:06.17-04
1188	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:37:22.041-04
1189	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	10	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:41:15.306-04
1190	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:41:15.382-04
1191	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:41:15.579-04
1192	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	4	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:41:27.175-04
1193	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:41:27.261-04
1194	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:41:27.43-04
1195	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	13	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:41:44.659-04
1196	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:41:44.725-04
1197	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:41:44.893-04
1198	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	21	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:42:27.957-04
1199	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:42:28.037-04
1200	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:42:28.137-04
1201	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	22	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:43:02.657-04
1202	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:43:02.728-04
1203	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:43:02.86-04
1204	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	marcas	12	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:43:17.778-04
1205	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:43:17.865-04
1206	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:43:18.03-04
1207	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	marcas	23	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.manage"}	2026-10-05 14:44:02.339-04
1208	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 14:44:02.411-04
1209	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:44:02.535-04
1210	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:44:36.727-04
1211	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:44:36.892-04
1212	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:44:36.911-04
1213	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:45:01.35-04
1214	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:45:01.404-04
1215	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:45:09.39-04
1216	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	88ddac8d-a6f7-4bc5-9082-bc7674f1227b	null	{"id": "88ddac8d-a6f7-4bc5-9082-bc7674f1227b"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 14:47:28.361-04
1217	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:47:28.676-04
1218	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:47:28.724-04
1219	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:47:28.746-04
1220	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 14:47:28.761-04
1221	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:47:28.822-04
1222	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 14:47:28.884-04
1223	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:47:31.453-04
1224	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:47:31.475-04
1225	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:48:21.651-04
1226	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:48:59.612-04
1227	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:48:59.69-04
1228	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:48:59.978-04
1229	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	2	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:49:09.977-04
1230	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:49:10.032-04
1231	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:49:10.15-04
1232	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:50:21.503-04
1233	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:50:21.656-04
1234	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:50:24.677-04
1235	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:51:40.85-04
1236	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:51:40.926-04
1237	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:51:41.153-04
1238	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	3	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:51:46.723-04
1239	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:51:46.781-04
1240	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:51:46.788-04
1241	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:52:14.58-04
1242	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:52:14.69-04
1244	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:53:22.881-04
1245	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:53:22.964-04
1246	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:53:23.151-04
1247	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	2	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:54:20.812-04
1248	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:54:20.877-04
1249	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:54:21.002-04
1250	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:54:29.188-04
1251	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:54:29.238-04
1252	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:54:32.424-04
1253	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:55:24.111-04
1254	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:55:24.186-04
1255	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:55:24.284-04
1256	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:55:50.343-04
1257	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:55:55.816-04
1258	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:57:59.058-04
1259	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:57:59.142-04
1260	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:57:59.288-04
1261	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:58:15.813-04
1262	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:58:15.841-04
1263	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:58:19.821-04
1264	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 14:59:08.785-04
1265	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 14:59:08.853-04
1266	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 14:59:08.982-04
1267	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:59:54.638-04
1268	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:59:54.642-04
1269	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 14:59:58.763-04
1270	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:01:05.859-04
1271	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:01:05.96-04
1272	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:01:05.99-04
1273	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:02:05.089-04
1274	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:02:05.316-04
1275	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:02:08.515-04
1276	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	4072a2fb-9bed-4491-90c7-df18d5faf26f	null	{"id": "4072a2fb-9bed-4491-90c7-df18d5faf26f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 15:02:46.611-04
1277	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:02:46.755-04
1278	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:02:46.941-04
1279	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:02:46.957-04
1280	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:02:46.995-04
1281	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 15:02:47.155-04
1282	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 15:02:47.183-04
1283	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:03:24.611-04
1284	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:03:24.725-04
1285	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:03:30.609-04
1286	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:04:52.174-04
1287	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:04:52.257-04
1288	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:04:52.462-04
1289	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:05:01.473-04
1290	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:05:01.511-04
1291	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:05:45.439-04
1292	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:06:23.713-04
1293	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:06:23.839-04
1294	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:06:26.446-04
1295	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:07:32.884-04
1296	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:07:32.963-04
1297	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:07:33.082-04
1298	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:08:01.782-04
1299	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:08:01.894-04
1300	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:08:05.137-04
1301	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:08:26.398-04
1302	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:08:26.444-04
1303	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:08:29.767-04
1304	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:09:51.621-04
1305	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:09:51.688-04
1306	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:09:51.853-04
1307	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	11	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:10:07.207-04
1308	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:10:07.269-04
1309	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:10:07.381-04
1310	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:10:17.245-04
1311	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:10:17.308-04
1312	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:10:19.534-04
1313	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:11:12.006-04
1314	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:11:12.077-04
1315	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:11:12.303-04
1316	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:12:11.94-04
1317	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:12:12.188-04
1318	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:12:15.019-04
1319	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:13:19.578-04
1320	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:13:19.654-04
1321	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:13:19.768-04
1322	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:13:56.411-04
1323	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:13:56.554-04
1324	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:13:59.338-04
1325	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:14:59.013-04
1326	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:14:59.329-04
1327	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:14:59.44-04
1328	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:15:38.349-04
1329	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:15:38.454-04
1330	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:15:43.885-04
1331	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:16:31.694-04
1332	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:16:31.769-04
1333	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:16:31.873-04
1334	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:16:55.404-04
1335	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:16:55.44-04
1336	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:16:57.874-04
1337	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:17:45.118-04
1338	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:17:45.241-04
1339	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:17:45.377-04
1340	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d97383bf-47cc-4645-9080-67bb7781cc43	null	{"id": "d97383bf-47cc-4645-9080-67bb7781cc43"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 15:17:54.064-04
1341	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:17:54.18-04
1342	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:17:54.181-04
1343	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 15:17:54.402-04
1344	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 15:17:54.452-04
1345	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:17:54.501-04
1346	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:17:54.541-04
1347	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:18:17.913-04
1348	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:18:18.038-04
1349	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:18:19.967-04
1350	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:19:12.014-04
1351	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:19:12.142-04
1352	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:19:12.397-04
1353	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:20:24.85-04
1354	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:20:25.054-04
1355	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:20:29.714-04
1356	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:21:00.638-04
1357	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:21:00.8-04
1358	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:21:04.061-04
1359	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	18	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:22:11.572-04
1360	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:22:11.644-04
1361	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:22:11.808-04
1362	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:22:20.489-04
1363	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:22:20.522-04
1364	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:22:28.371-04
1365	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	19	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:23:41.69-04
1366	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:23:41.769-04
1367	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:23:41.991-04
1368	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	19	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:24:08.454-04
1369	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:24:08.511-04
1370	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:24:08.542-04
1371	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:24:10.039-04
1372	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:24:10.12-04
1373	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:24:14.404-04
1374	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	20	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:25:08.69-04
1375	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:25:08.772-04
1376	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:25:08.916-04
1377	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	19	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:25:18.45-04
1378	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:25:18.56-04
1379	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:25:18.567-04
1380	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:25:29.875-04
1381	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:25:29.935-04
1382	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:25:32.45-04
1383	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	21	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:26:15.26-04
1384	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:26:15.354-04
1385	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:26:15.468-04
1386	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:27:39.264-04
1387	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:27:39.318-04
1388	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:27:42.509-04
1389	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:28:00.124-04
1390	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:28:00.278-04
1391	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:28:03.632-04
1392	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	22	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:28:52.31-04
1393	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:28:52.383-04
1394	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:28:52.522-04
1395	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:29:14.892-04
1396	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:29:14.921-04
1397	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:29:17.193-04
1398	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	23	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:30:24.813-04
1399	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:30:24.918-04
1400	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:30:24.982-04
1401	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	23	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:30:39.16-04
1402	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:30:42.447-04
1403	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:31:51.923-04
1404	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:31:51.957-04
1405	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:31:53.839-04
1406	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	24	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:32:29.155-04
1407	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:32:29.251-04
1408	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:32:29.428-04
1409	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	724a66fb-6d20-4d61-957a-b7cb724d55f6	null	{"id": "724a66fb-6d20-4d61-957a-b7cb724d55f6"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 15:33:00.231-04
1410	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:33:00.421-04
1411	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:33:00.64-04
1412	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:33:00.74-04
1413	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 15:33:00.839-04
1414	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:33:00.932-04
1415	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 15:33:01.035-04
1416	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:33:13.283-04
1417	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:33:13.321-04
1418	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:33:15.716-04
1419	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	25	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:33:51.428-04
1420	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:33:51.514-04
1421	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:33:51.645-04
1422	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:34:13.076-04
1423	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:34:13.088-04
1424	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:34:22.118-04
1425	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	26	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:34:53.935-04
1426	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:34:54.027-04
1427	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:34:54.136-04
1428	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:35:43.056-04
1429	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:35:43.117-04
1430	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:35:45.388-04
1431	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	27	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:36:27.018-04
1432	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:36:27.104-04
1433	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:36:27.245-04
1434	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:37:02.36-04
1435	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:37:02.387-04
1436	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:37:05.97-04
1437	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	28	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:37:36.543-04
1438	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:37:36.625-04
1439	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:37:36.747-04
1440	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:37:57.922-04
1441	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:37:57.956-04
1442	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:38:00.681-04
1443	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	29	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:39:34.737-04
1444	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:39:34.82-04
1445	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:39:35.031-04
1446	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:40:05.714-04
1447	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:40:05.749-04
1448	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:40:08.728-04
1449	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:40:31.059-04
1450	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:40:31.129-04
1451	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:40:33.784-04
1452	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	30	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:41:12.708-04
1453	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:41:12.834-04
1454	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:41:13.003-04
1455	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:41:43.404-04
1456	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:41:43.439-04
1457	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:41:46.986-04
1458	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	31	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:42:27.922-04
1459	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:42:28.037-04
1460	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:42:28.289-04
1461	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:43:24.903-04
1462	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:43:24.939-04
1463	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:43:31.225-04
1464	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	32	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:44:18.856-04
1465	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:44:19.015-04
1466	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:44:19.299-04
1467	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:44:34.739-04
1468	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:44:34.771-04
1469	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:44:37.783-04
1470	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	33	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:45:20.946-04
1471	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:45:21.046-04
1472	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:45:21.315-04
1473	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:45:33.91-04
1474	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:45:33.942-04
1475	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:45:37.14-04
1476	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	34	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:46:36.706-04
1477	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:46:36.808-04
1478	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:46:37.027-04
1479	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:46:52.476-04
1480	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:46:52.546-04
1481	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:46:54.931-04
1482	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	35	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:47:46.158-04
1483	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:47:46.238-04
1484	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:47:46.413-04
1485	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	2b327bdd-6106-4de2-adc7-d62b6bae830e	null	{"id": "2b327bdd-6106-4de2-adc7-d62b6bae830e"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 15:48:09.165-04
1486	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:48:09.311-04
1487	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:48:09.357-04
1488	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:48:09.486-04
1489	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 15:48:09.538-04
1490	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 15:48:09.558-04
1491	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:48:09.609-04
1492	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:48:31.967-04
1493	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:48:31.993-04
1494	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:48:35.2-04
1495	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	36	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:49:12.124-04
1496	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:49:12.21-04
1497	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:49:12.341-04
1498	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:50:17.752-04
1499	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:50:17.789-04
1500	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:50:17.809-04
1501	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	8	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:50:22.131-04
1502	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	37	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:51:36.232-04
1503	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:51:36.378-04
1504	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:51:36.766-04
1505	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:51:53.606-04
1506	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:51:53.692-04
1507	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	8	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:51:56.441-04
1508	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	38	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:52:33.099-04
1509	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:52:33.181-04
1510	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:52:33.321-04
1511	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:52:43.625-04
1512	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:52:43.653-04
1513	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	8	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:52:46.916-04
1514	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	39	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:53:21.473-04
1515	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:53:21.582-04
1516	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:53:21.732-04
1517	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:53:59.163-04
1518	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:53:59.194-04
1519	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	9	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:54:01.817-04
1520	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	40	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:55:37.757-04
1521	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:55:37.886-04
1522	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:55:38.129-04
1523	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	40	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:55:52.607-04
1524	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:55:52.71-04
1525	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:55:52.929-04
1526	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:56:18.892-04
1527	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:56:18.925-04
1528	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	9	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:56:33.023-04
1529	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	41	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:57:52.799-04
1530	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:57:52.896-04
1531	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:57:53.05-04
1532	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:58:09.42-04
1533	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	9	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:58:14.095-04
1534	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	42	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 15:58:55.648-04
1535	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 15:58:55.769-04
1536	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 15:58:55.914-04
1537	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:59:53.29-04
1538	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:59:53.334-04
1539	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	7	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 15:59:56.859-04
1540	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	43	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:00:38.91-04
1541	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:00:38.983-04
1542	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:00:39.118-04
1543	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:00:46.898-04
1544	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:00:46.923-04
1545	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	7	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:00:50.262-04
1546	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	44	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:01:20.031-04
1547	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:01:20.168-04
1548	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:01:20.285-04
1549	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:01:37.406-04
1550	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:01:37.434-04
1551	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	7	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:01:40.092-04
1552	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	45	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:02:17.662-04
1553	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:02:17.865-04
1554	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:02:17.962-04
1555	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:02:40.405-04
1556	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:02:40.57-04
1557	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	7	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:02:43.447-04
1558	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	7c556efd-adc7-4d5d-b800-cd3e63f68aba	null	{"id": "7c556efd-adc7-4d5d-b800-cd3e63f68aba"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 16:03:18.176-04
1559	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:03:19.06-04
1560	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:03:19.334-04
1561	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:03:19.378-04
1562	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 16:03:19.601-04
1563	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 16:03:19.622-04
1564	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:03:23.311-04
1565	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:03:38.569-04
1566	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:03:38.596-04
1567	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	7	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:04:13.422-04
1568	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	46	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:04:18.97-04
1569	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:04:19.07-04
1570	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:04:19.224-04
1571	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:05:11.892-04
1572	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:05:11.921-04
1573	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	7	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:05:14.458-04
1574	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	47	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:06:18.022-04
1575	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:06:18.139-04
1576	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:06:18.318-04
1577	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:07:33.104-04
1578	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:07:33.129-04
1579	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	11	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:07:45.033-04
1580	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	48	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:08:14.7-04
1581	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:08:14.806-04
1582	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:08:15.023-04
1583	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:08:27.671-04
1584	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:08:27.71-04
1585	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	11	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:08:31.652-04
1586	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	49	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:09:00.006-04
1587	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:09:00.13-04
1588	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:09:00.435-04
1589	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:09:23.267-04
1590	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:09:23.296-04
1591	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	11	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:09:27.317-04
1592	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	50	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:09:53.531-04
1593	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:09:53.655-04
1594	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:09:54.021-04
1595	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:10:21.486-04
1596	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:10:21.512-04
1597	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:10:26.409-04
1598	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	51	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:11:09.901-04
1599	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:11:10.032-04
1600	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:11:10.158-04
1601	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:11:24.125-04
1602	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:11:24.151-04
1603	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:11:32.128-04
1604	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	52	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:11:56.651-04
1605	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:11:56.752-04
1606	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:11:56.894-04
1607	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:12:15.388-04
1608	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:12:15.415-04
1609	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:12:18.682-04
1610	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	53	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:12:46.803-04
1611	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:12:46.905-04
1612	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:12:47.088-04
1613	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:13:23.388-04
1614	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:13:23.419-04
1615	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:13:27.236-04
1616	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	54	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:13:53.504-04
1617	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:13:53.622-04
1618	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:13:53.802-04
1619	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:14:16.892-04
1620	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:14:16.92-04
1621	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	12	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:14:21.623-04
1622	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	55	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:15:11.837-04
1623	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:15:11.925-04
1624	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:15:12.099-04
1625	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	categorias	55	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:15:30.159-04
1626	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:15:30.248-04
1627	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:15:30.362-04
1628	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:15:52.244-04
1629	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:15:52.272-04
1630	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	13	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:15:54.957-04
1631	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	56	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:16:21.629-04
1632	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:16:21.727-04
1633	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:16:22.074-04
1634	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:16:49.819-04
1635	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:16:49.852-04
1636	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	14	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:16:53.503-04
1637	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:16:59.082-04
1638	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:16:59.118-04
1639	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	14	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:17:02.022-04
1640	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	57	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:17:30.671-04
1641	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:17:30.803-04
1642	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:17:30.965-04
1643	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:17:36.753-04
1644	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:17:36.784-04
1645	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	14	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:18:10.254-04
1646	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	58	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:18:13.228-04
1647	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:18:13.337-04
1648	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:18:13.47-04
1649	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ab4bde8a-0baf-4759-ad47-d351290aa24d	null	{"id": "ab4bde8a-0baf-4759-ad47-d351290aa24d"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 16:18:26.445-04
1650	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:18:26.582-04
1651	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:18:26.85-04
1652	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 16:18:27.012-04
1653	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:18:27.086-04
1654	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:18:27.164-04
1655	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 16:18:27.256-04
1656	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:18:45.836-04
1657	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:18:45.871-04
1658	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	14	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:18:50.12-04
1659	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	59	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:19:14.612-04
1660	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:19:14.709-04
1661	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:19:14.839-04
1662	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:19:31.359-04
1663	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:19:31.394-04
1664	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	14	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:19:34.816-04
1665	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	60	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:19:59.348-04
1666	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:19:59.44-04
1667	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:19:59.572-04
1668	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:20:23.913-04
1669	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:20:23.948-04
1670	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:20:23.977-04
1671	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	15	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:20:26.35-04
1672	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	61	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:21:04.002-04
1673	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:21:04.121-04
1674	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:21:04.262-04
1675	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:21:17.616-04
1676	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	15	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:21:27.64-04
1677	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	62	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:21:52.048-04
1678	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:21:52.164-04
1679	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:21:52.278-04
1680	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:22:05.31-04
1681	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:22:05.345-04
1682	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	15	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:22:08.126-04
1683	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	63	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:22:37.822-04
1684	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:22:37.923-04
1685	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:22:38.054-04
1686	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:22:51.823-04
1687	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:22:51.851-04
1688	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	15	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:22:53.921-04
1689	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	categorias	64	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.manage"}	2026-10-05 16:23:16.183-04
1690	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:23:16.351-04
1691	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:23:16.384-04
1692	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:23:38.614-04
1693	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:23:38.798-04
1694	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 16:23:38.801-04
1695	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:23:41.492-04
1696	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:23:44.524-04
1697	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:23:44.528-04
1698	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:23:44.603-04
1699	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:23:44.607-04
1700	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:26.727-04
1701	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:26.733-04
1702	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:26.736-04
1703	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:26.74-04
1704	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:26.743-04
1705	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:26.746-04
1706	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:24:26.818-04
1707	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:24:26.857-04
1708	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:24:30.232-04
1709	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:24:30.235-04
1710	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:24:30.298-04
1711	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:24:30.301-04
1712	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:24:34.17-04
1713	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:24:34.176-04
1714	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:24:34.212-04
1715	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:24:34.212-04
1716	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.277-04
1717	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.282-04
1718	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.285-04
1719	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.288-04
1720	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.292-04
1721	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.296-04
1722	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:24:54.298-04
1723	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:24:54.362-04
1724	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:24:54.501-04
1725	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:24:56.876-04
1726	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:24:56.884-04
1727	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:24:56.916-04
1728	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:24:56.918-04
1729	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.606-04
1730	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.611-04
1731	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.614-04
1732	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	18	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.618-04
1733	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	19	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.621-04
1734	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	20	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.624-04
1735	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	21	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:23.627-04
1736	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:25:23.693-04
1737	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:25:23.842-04
1738	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:25:30.414-04
1739	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:25:30.418-04
1740	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:25:30.452-04
1741	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:25:30.456-04
1742	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	22	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:25:39.645-04
1743	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:25:39.718-04
1744	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:25:39.726-04
1745	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:25:46.134-04
1746	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:25:46.135-04
1747	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:25:46.159-04
1748	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:25:46.263-04
1749	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:25:52.704-04
1752	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:25:52.757-04
2439	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 13:34:09.428-04
2482	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 20:15:09.115-04
2551	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 22:07:43.91-04
2552	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:07:44.162-04
2553	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:07:44.567-04
2554	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 22:07:49.557-04
2555	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-08 22:07:57.476-04
2556	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 22:07:57.822-04
2557	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:08:00.447-04
2708	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 00:29:03.666-04
2709	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:29:04.501-04
2710	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-09 00:29:04.541-04
2711	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	6a630b3e-5d3d-459b-9313-d211f93de7c9	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-09 00:29:11.168-04
2806	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:18:58.086-04
2807	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:18:58.226-04
2808	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:19:08.237-04
2809	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 01:19:08.387-04
2859	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:55:16.224-04
2860	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 02:55:16.341-04
2861	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:55:16.379-04
2862	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 02:55:16.419-04
2867	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:55:18.079-04
2922	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 03:06:12.158-04
2923	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 03:06:15.361-04
2924	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:06:15.426-04
2979	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 14:19:28.387-04
3002	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 20:43:28.759-04
1750	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:25:52.71-04
1751	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:25:52.736-04
1753	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	23	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:26:19.653-04
1754	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	24	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:26:19.658-04
1755	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:26:19.753-04
1756	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:26:19.916-04
1757	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:26:31.383-04
1758	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	marcas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.marcas.read"}	2026-10-05 16:26:31.41-04
1759	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:26:31.539-04
1760	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-05 16:26:31.551-04
1761	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	asignaciones-marca	25	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.manage"}	2026-10-05 16:26:37.169-04
1762	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:26:37.238-04
1763	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:26:37.247-04
1764	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 16:30:42.618-04
1765	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:30:43.061-04
1766	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 16:30:43.39-04
1767	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:30:43.493-04
1768	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:30:43.545-04
1769	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 16:30:43.601-04
1770	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0201caf2-75f1-4644-a5be-3cb9da215e5f	null	{"id": "0201caf2-75f1-4644-a5be-3cb9da215e5f"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-05 16:35:15.993-04
1771	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-05 16:35:16.343-04
1772	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:35:16.638-04
1773	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 16:35:16.697-04
1774	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:35:16.765-04
1775	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 16:35:16.787-04
1776	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:35:16.824-04
1777	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:35:24.696-04
1778	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:35:24.721-04
1779	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:35:24.744-04
1780	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:36:26.33-04
1781	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 16:36:26.663-04
1782	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:36:26.714-04
1783	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:36:26.776-04
1784	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:36:26.911-04
1785	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 16:36:27.139-04
1786	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-05 16:37:55.38-04
1787	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-05 16:37:55.873-04
1788	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:37:56.003-04
1789	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-05 16:37:56.198-04
1790	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-05 16:37:56.284-04
1791	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-05 16:37:56.484-04
1792	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	0201caf2-75f1-4644-a5be-3cb9da215e5f	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-05 16:38:07.879-04
1793	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	c6f665ba-68f7-4baa-bc6a-ec4dc86c9c31	null	{"id": "c6f665ba-68f7-4baa-bc6a-ec4dc86c9c31"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-06 04:17:53.095-04
1794	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:17:53.537-04
1795	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:17:53.548-04
1796	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-06 04:17:53.659-04
1797	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-06 04:17:58.402-04
1798	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-06 04:17:58.409-04
1799	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-06 04:17:59.811-04
1800	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.usuarios.read"}	2026-10-06 04:17:59.814-04
1801	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	perfil	48aa7abf-0acb-47b5-bd73-172aaec874f1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.mi-perfil.read"}	2026-10-06 04:18:00.211-04
1802	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-10-06 04:18:00.959-04
1803	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-06 04:19:22.634-04
1804	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:19:22.9-04
1805	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	sucursales	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.sucursales.read"}	2026-10-06 04:19:23.122-04
1806	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:19:23.304-04
1807	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:19:23.56-04
1808	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contactos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.contactos.read"}	2026-10-06 04:19:23.58-04
1809	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	suscriptores	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.suscriptores.read"}	2026-10-06 04:19:24.159-04
1810	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:19:24.204-04
1811	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	leads	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.leads.read"}	2026-10-06 04:19:24.472-04
1814	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-06 04:19:25.809-04
1815	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-06 04:19:25.848-04
1816	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-06 04:19:26.476-04
2442	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 13:34:22.738-04
2443	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	6	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-08 13:34:30.928-04
2444	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-08 13:34:34.568-04
2483	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 20:15:09.28-04
2558	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-08 22:08:00.762-04
2559	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-08 22:08:01.027-04
2712	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	b085bdf2-9293-4610-92da-6c4aa9598c65	null	{"id": "b085bdf2-9293-4610-92da-6c4aa9598c65"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 00:34:12.923-04
2810	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	footers	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.manage"}	2026-10-09 01:20:07.902-04
2811	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-09 01:20:08.041-04
2812	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 01:20:16.246-04
2813	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 01:20:19.682-04
2863	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-09 02:55:16.449-04
2925	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 03:10:42.135-04
2926	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:10:42.212-04
2927	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:10:43.245-04
2928	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:11:06.479-04
2929	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:11:06.541-04
2930	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:11:08.021-04
2931	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:11:28.321-04
2932	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:11:28.375-04
2933	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:11:29.634-04
2934	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:11:29.653-04
2935	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:11:56.376-04
2936	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:11:56.427-04
1812	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:19:24.473-04
1813	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:19:25.807-04
1817	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-06 04:19:26.48-04
2445	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	sesiones	957f4554-0fb2-4e1a-8f98-0eeaf5a1937a	{"estado": "activo"}	{"estado": "inactivo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.cerrar"}	2026-10-08 13:35:05.944-04
2484	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	a106ecf0-8c34-4653-bb80-e95ff7aaace9	null	{"id": "a106ecf0-8c34-4653-bb80-e95ff7aaace9"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-08 21:32:43.848-04
2485	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 21:32:44.191-04
2486	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-08 21:32:44.394-04
2488	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 21:32:44.599-04
2560	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menu_item	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.manage"}	2026-10-08 22:08:25.153-04
2561	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-08 22:08:25.448-04
2713	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 00:34:13.231-04
2814	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0a68c6bb-af94-429b-9ad5-3ac9e2df5176	null	{"id": "0a68c6bb-af94-429b-9ad5-3ac9e2df5176"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 01:32:21.935-04
2815	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 01:32:22.339-04
2864	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-09 02:55:16.471-04
2865	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:55:17.99-04
2866	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:55:18.067-04
2937	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:11:58.559-04
2938	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:12:28.262-04
2939	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:12:28.358-04
2940	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:12:36.213-04
2980	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 14:19:28.428-04
2981	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	asignaciones-marca	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.asignaciones_marca.read"}	2026-10-09 14:19:34.939-04
2982	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 14:19:45.02-04
2983	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-09 14:19:45.133-04
2984	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-09 14:19:59.883-04
3003	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 20:43:28.873-04
3004	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 20:43:28.941-04
3027	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	03ca07f8-9c81-4e8a-8c13-02e19ab43472	null	{"id": "03ca07f8-9c81-4e8a-8c13-02e19ab43472"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 21:49:42.274-04
3028	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 21:49:42.727-04
1818	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:19:26.488-04
1819	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-06 04:21:22.471-04
1820	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:21:22.677-04
1821	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:21:22.699-04
1822	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-06 04:21:22.702-04
1823	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-06 04:21:22.784-04
1824	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:21:22.794-04
1825	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-06 04:25:34.022-04
1826	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:25:34.388-04
1827	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-06 04:25:34.452-04
1828	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-06 04:25:34.456-04
1829	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:25:34.595-04
1830	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:25:34.757-04
1831	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-06 04:25:35.098-04
1832	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-06 04:25:41.492-04
1833	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:25:41.605-04
1834	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-06 04:25:46.79-04
1835	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-06 04:25:46.947-04
1836	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:25:46.967-04
1837	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-06 04:25:48.977-04
1838	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:25:49.052-04
1839	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-06 04:25:51.093-04
1840	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-06 04:25:52.044-04
1841	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-06 04:25:52.757-04
1842	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:25:53.727-04
1843	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-06 04:25:54.669-04
1844	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-06 04:25:55.396-04
1845	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-06 04:25:56.004-04
1846	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-06 04:25:57.944-04
1847	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-06 04:25:58.62-04
1848	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-06 04:25:59.299-04
1849	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:26:01.183-04
1850	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:26:01.312-04
1851	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-06 04:26:01.738-04
1852	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:26:03.223-04
1853	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-06 04:26:05.425-04
1854	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-06 04:26:06.115-04
1855	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	4634d0b9-042d-46de-84fc-4faa795caaf0	null	{"id": "4634d0b9-042d-46de-84fc-4faa795caaf0"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-06 04:41:17.538-04
1856	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-06 04:41:17.922-04
1857	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-06 04:41:18.13-04
1858	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-06 04:41:18.322-04
1859	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-06 04:41:18.422-04
1860	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-06 04:41:18.509-04
1861	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-06 04:41:18.765-04
1862	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:41:29.486-04
1863	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-06 04:41:36.008-04
1864	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-06 04:41:38.158-04
1865	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-06 04:41:41.279-04
1866	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-06 04:41:41.425-04
1867	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-06 04:41:43.844-04
1868	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:42:27.212-04
1869	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-06 04:43:09.865-04
1870	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-06 04:43:31.83-04
1871	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-06 04:43:35.149-04
1872	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-06 04:43:45.485-04
1873	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:44:12.289-04
1874	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	configuracion_sitio	1	null	{"activo": true}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.manage"}	2026-10-06 04:45:27.533-04
1875	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:45:27.64-04
1876	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:45:32.914-04
1877	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:45:37.177-04
1878	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-06 04:45:46.02-04
1879	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-06 04:46:41.216-04
1880	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-06 04:46:48.535-04
1881	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-06 04:46:54.454-04
1882	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	footers	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.elementos_footer.read"}	2026-10-06 04:47:00.187-04
1883	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-06 04:47:11.29-04
1884	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	pasos_wizard	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.pasos_wizard.read"}	2026-10-06 04:47:13.776-04
1885	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-06 04:47:33.221-04
1886	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-06 04:47:45.584-04
1887	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	61d16206-5832-4eda-aabe-bd94c35cd775	null	{"id": "61d16206-5832-4eda-aabe-bd94c35cd775"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 00:47:19.239-04
1888	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 00:47:19.752-04
1889	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 00:47:20.082-04
1890	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 00:47:20.154-04
1891	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 00:47:20.184-04
1892	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 00:47:25.517-04
1893	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:47:25.626-04
1894	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	tipo_seccion	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.manage"}	2026-10-07 00:49:13.758-04
1895	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:49:14.105-04
1896	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:49:17.038-04
1897	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	tipo_seccion	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.manage"}	2026-10-07 00:49:20.302-04
1898	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:49:20.636-04
1899	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	tipo_seccion	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.manage"}	2026-10-07 00:50:10.068-04
1900	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:50:10.159-04
1901	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:50:13.613-04
1902	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:50:17.07-04
1903	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	tipo_seccion	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.manage"}	2026-10-07 00:50:56.133-04
1904	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:50:56.272-04
1905	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	tipo_seccion	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.manage"}	2026-10-07 00:51:44.506-04
1906	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:51:44.636-04
1907	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	tipo_seccion	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.manage"}	2026-10-07 00:52:31.712-04
1908	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 00:52:32.25-04
1909	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 00:52:42.595-04
1910	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:01:06.474-04
1911	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:01:06.825-04
1912	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 01:01:07.035-04
1913	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 01:01:07.344-04
1914	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 01:01:07.385-04
1915	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:01:07.505-04
1916	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 01:01:07.536-04
1917	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:01:07.557-04
1918	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:01:07.693-04
1919	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:01:07.742-04
1920	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	31f1eb4c-be64-4150-b2ab-c087b2819c69	null	{"id": "31f1eb4c-be64-4150-b2ab-c087b2819c69"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 01:03:01.185-04
1921	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:03:01.445-04
1922	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:03:01.642-04
1924	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 01:03:01.716-04
1923	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:03:01.715-04
1925	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 01:03:01.951-04
1926	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:03:02.018-04
1927	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:04:37.663-04
1928	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:04:43.503-04
1929	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 01:04:43.661-04
1930	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:04:43.672-04
1931	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:04:46.892-04
1932	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:04:46.928-04
1933	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-07 01:05:40.141-04
1934	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 01:05:40.38-04
1935	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:05:40.383-04
1936	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:07:14.63-04
1937	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 01:07:14.926-04
1938	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:07:15.021-04
1939	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:07:26.28-04
1940	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:07:51.297-04
1941	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:07:51.38-04
1942	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:09:56.08-04
1943	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:09:58.852-04
1944	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:10:01.907-04
1945	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	779667c6-cae6-4d22-8283-a31574125469	null	{"id": "779667c6-cae6-4d22-8283-a31574125469"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 01:44:00.32-04
1946	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:44:00.766-04
1947	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:44:01-04
1948	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:44:01.183-04
1949	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 01:44:01.206-04
1950	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:44:01.25-04
1951	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 01:44:01.473-04
1952	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:44:05.846-04
1954	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:44:08.01-04
1953	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:44:07.982-04
1955	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:44:08.087-04
1956	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:44:08.116-04
1957	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:44:17.731-04
1958	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:44:21.448-04
1959	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:44:24.683-04
1960	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:48:13.604-04
1961	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:13.72-04
1962	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:27.589-04
1963	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:35.714-04
1964	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:48:35.795-04
1965	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:48:35.991-04
1966	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:48:35.996-04
1967	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:48:36.054-04
1968	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:48:36.056-04
1969	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:47.105-04
1970	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.metadata_seccion.read"}	2026-10-07 01:48:47.173-04
1971	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:48:47.227-04
1972	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:54.339-04
1973	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:48:56.219-04
1974	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:56.303-04
1975	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:57.401-04
1976	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	1	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:48:58.193-04
1977	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:48:58.313-04
1978	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:49:10.339-04
1979	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:49:10.369-04
1980	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:49:10.58-04
1981	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:49:24.28-04
1982	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:50:26.765-04
1983	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:50:27.65-04
1984	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:50:53.525-04
1985	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:50:56.13-04
1986	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:50:56.281-04
1987	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:50:57.26-04
1988	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:51:06.109-04
1989	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:51:06.495-04
1990	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:51:06.517-04
1991	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:51:06.528-04
1992	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:51:07.316-04
1993	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:51:07.336-04
1994	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:51:10.101-04
1995	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	2	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:52:12.411-04
1996	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:52:12.542-04
1997	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:52:15.241-04
1998	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:52:15.422-04
1999	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:52:15.47-04
2000	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:52:15.744-04
2001	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:52:19.068-04
2002	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:52:19.081-04
2003	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:52:19.112-04
2004	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:52:19.126-04
2005	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:52:29.761-04
2006	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:53:38.991-04
2007	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:53:39.083-04
2008	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:54:12.279-04
2009	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:54:12.417-04
2010	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:54:12.468-04
2011	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:12.687-04
2012	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:12.746-04
2013	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:12.764-04
2014	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:12.777-04
2015	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	3	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:54:33.145-04
2016	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:54:33.244-04
2017	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:54:48.636-04
2018	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:48.842-04
2019	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:48.843-04
2020	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:54:48.918-04
2021	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:54:52.908-04
2022	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:55:48.959-04
2023	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:55:49.052-04
2024	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:56:21.891-04
2025	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:56:21.909-04
2026	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:56:24.432-04
2027	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	5	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:57:10.642-04
2028	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:57:10.781-04
2029	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:57:33.948-04
2030	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:57:34.012-04
2031	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:57:34.312-04
2032	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:57:34.394-04
2033	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:57:38.083-04
2034	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	6	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:58:09.555-04
2035	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:58:09.648-04
2036	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:58:24.423-04
2037	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:58:24.529-04
2038	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:58:24.604-04
2039	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:58:24.71-04
2040	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:58:27.078-04
2041	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	7	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:58:56.935-04
2042	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:58:57.113-04
2043	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:58:59.561-04
2044	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:58:59.697-04
2045	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:58:59.752-04
2046	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:58:59.766-04
2047	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	ff7d63b6-dfe3-4cfb-9f0d-97ff5e16e980	null	{"id": "ff7d63b6-dfe3-4cfb-9f0d-97ff5e16e980"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 01:59:16.514-04
2048	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:59:17.224-04
2049	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 01:59:17.3-04
2050	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 01:59:17.434-04
2051	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 01:59:17.478-04
2052	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 01:59:17.493-04
2053	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:59:17.53-04
2055	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:59:21.777-04
2056	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:59:21.805-04
2446	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	cfa979ce-b471-4cef-accf-af8c8ec378b6	null	{"id": "cfa979ce-b471-4cef-accf-af8c8ec378b6"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-08 13:37:09.478-04
2447	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	rol	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.roles.read"}	2026-10-08 13:37:09.822-04
2487	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 21:32:44.582-04
2562	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	40f6cf72-b653-4f27-b7de-db2f39049aa4	null	{"id": "40f6cf72-b653-4f27-b7de-db2f39049aa4"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-09 00:12:07.345-04
2563	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 00:12:07.94-04
2714	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-09 00:34:13.237-04
2816	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 01:32:22.495-04
2868	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registros	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.registros_cms.read"}	2026-10-09 02:55:41.88-04
2869	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 02:55:41.945-04
2870	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 02:55:43.066-04
2941	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	registro_contenido	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.manage"}	2026-10-09 03:13:00.739-04
2942	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-09 03:13:00.822-04
2943	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 03:13:12.5-04
2985	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-09 14:20:00.176-04
3005	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 20:43:47.636-04
3006	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-09 20:43:47.701-04
3029	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-09 21:49:42.922-04
3030	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	configuracion_sitio	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.configuracion_sitio.read"}	2026-10-09 21:49:43.166-04
2054	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 01:59:21.751-04
2057	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:59:21.824-04
2058	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 01:59:41.917-04
2059	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	8	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 01:59:51.64-04
2060	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 01:59:51.723-04
2061	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:00:12.299-04
2062	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:00:12.33-04
2063	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:00:12.521-04
2064	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:00:12.566-04
2065	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:00:15.226-04
2066	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	9	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:00:33.119-04
2067	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:00:33.212-04
2068	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:00:45.295-04
2069	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:00:45.338-04
2070	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:00:45.491-04
2071	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:00:45.554-04
2072	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:01:14.194-04
2073	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	10	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:01:25.732-04
2074	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:01:25.834-04
2075	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	10	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:01:48.042-04
2076	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	10	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:01:52.068-04
2077	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:01:52.187-04
2078	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	9	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:02:10.252-04
2079	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	9	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:02:12.999-04
2080	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:02:13.132-04
2081	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:02:23.201-04
2082	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:02:23.255-04
2083	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:02:23.422-04
2084	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:02:23.46-04
2085	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:02:26.518-04
2086	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	11	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:02:55.735-04
2087	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:02:55.848-04
2088	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	11	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:02:58.091-04
2089	48aa7abf-0acb-47b5-bd73-172aaec874f1	Edición	contenido_seccion	11	{"estado": "activo"}	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:03:01.639-04
2090	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:03:01.723-04
2091	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:03:58.692-04
2092	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:03:58.722-04
2093	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:03:58.889-04
2094	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:03:58.895-04
2095	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:04:01.347-04
2096	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	12	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:04:28.213-04
2097	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:04:28.325-04
2098	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:04:39.642-04
2099	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:04:39.698-04
2100	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:04:39.847-04
2101	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:04:39.927-04
2102	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:05:04.617-04
2103	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	13	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:05:07.957-04
2104	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:05:08.063-04
2105	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:05:40.35-04
2106	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:05:40.383-04
2107	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:05:40.541-04
2108	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:05:40.563-04
2109	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:05:44.337-04
2110	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	14	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:05:57.479-04
2111	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:05:57.579-04
2112	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:06:11.061-04
2113	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:06:11.293-04
2114	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	2	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:06:13.635-04
2115	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:06:15.347-04
2116	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	15	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:06:27.145-04
2117	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:06:27.238-04
2118	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:06:51.153-04
2119	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:06:51.188-04
2120	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:06:51.329-04
2121	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:06:51.397-04
2122	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:06:54.627-04
2123	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	16	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:07:05.793-04
2124	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:07:05.895-04
2125	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:07:34.994-04
2126	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:07:35.056-04
2127	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:07:35.19-04
2128	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:07:35.208-04
2129	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:07:38.073-04
2130	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	17	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:07:54.423-04
2131	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:07:54.513-04
2132	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	17	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:08:08.37-04
2133	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:08:08.433-04
2134	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:08:08.496-04
2135	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:08:08.669-04
2136	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:08:08.676-04
2137	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	3	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:08:08.727-04
2138	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:08:08.771-04
2139	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	auditoria	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.auditoria.read"}	2026-10-07 02:08:19.556-04
2140	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 02:09:16.937-04
2141	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:09:17.001-04
2142	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:09:25.955-04
2144	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:09:25.992-04
2143	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:09:25.992-04
2145	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:09:26.16-04
2146	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:09:29.173-04
2147	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	18	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:09:41.657-04
2148	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:09:41.764-04
2149	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:09:56.602-04
2150	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:09:56.657-04
2151	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:09:57.046-04
2152	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:09:57.221-04
2153	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:00.569-04
2154	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	19	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:10:07.894-04
2155	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:10:08.005-04
2156	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:10:24.006-04
2157	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:10:24.064-04
2158	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:24.305-04
2159	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:24.334-04
2160	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:27.074-04
2161	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	20	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:10:36.428-04
2162	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:10:36.529-04
2163	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:10:46.089-04
2164	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:10:46.137-04
2165	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:46.324-04
2166	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:46.342-04
2167	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:10:50.577-04
2168	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	21	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:10:57.323-04
2169	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:10:57.426-04
2170	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:11:06.374-04
2171	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:11:06.408-04
2172	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:11:06.452-04
2173	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:11:06.753-04
2174	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:11:06.861-04
2175	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:11:09.448-04
2176	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	22	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:11:16.434-04
2177	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:11:16.539-04
2178	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:11:35.187-04
2179	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:11:35.25-04
2180	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:11:35.382-04
2181	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:11:35.433-04
2182	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:11:40.543-04
2183	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	23	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:11:47.978-04
2184	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:11:48.109-04
2185	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:12:18.027-04
2186	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:12:18.092-04
2187	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:12:18.231-04
2188	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:12:18.262-04
2189	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:12:21.144-04
2190	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	24	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:12:39.511-04
2191	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:12:39.613-04
2192	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:12:47.722-04
2193	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:12:47.759-04
2194	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:12:47.837-04
2195	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:12:47.968-04
2196	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:12:50.133-04
2197	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	25	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:13:09.679-04
2198	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:13:09.791-04
2199	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:13:24.11-04
2200	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:13:24.169-04
2201	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:13:24.376-04
2202	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:13:24.389-04
2203	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:13:26.977-04
2204	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	26	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:13:46.72-04
2205	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:13:46.89-04
2206	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:13:54.321-04
2207	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:13:54.388-04
2208	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:13:54.545-04
2209	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:13:54.55-04
2210	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:13:58.344-04
2211	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	f71fa186-9a97-4705-be46-9c5cc6c12445	null	{"id": "f71fa186-9a97-4705-be46-9c5cc6c12445"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 02:14:26.156-04
2212	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 02:14:26.315-04
2213	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 02:14:26.39-04
2214	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:14:26.447-04
2215	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 02:14:26.546-04
2216	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 02:14:26.646-04
2217	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 02:14:26.767-04
2218	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:14:40.075-04
2219	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:14:49.888-04
2220	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:14:49.946-04
2221	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 02:14:50.124-04
2222	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:14:50.137-04
2223	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:14:50.156-04
2224	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	5	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:14:50.196-04
2225	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	contenido_seccion	27	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.manage"}	2026-10-07 02:15:14.283-04
2226	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:15:14.357-04
2227	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:15:41.751-04
2228	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 02:15:50.293-04
2229	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-07 02:15:52.629-04
2230	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 02:16:56.946-04
2231	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	registro_contenido	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_registro.read"}	2026-10-07 02:18:59.19-04
2232	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:19:51.973-04
2233	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:07.276-04
2234	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:20.156-04
2235	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:20.275-04
2236	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:27.654-04
2237	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:27.824-04
2238	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:39.33-04
2239	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.contenidos_seccion.read"}	2026-10-07 02:21:46.875-04
2240	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.metadata_seccion.read"}	2026-10-07 02:21:46.971-04
2241	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	contenido_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.metadata_seccion.read"}	2026-10-07 02:21:47.181-04
2242	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	tipo_seccion	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.tipos_seccion.read"}	2026-10-07 02:21:47.238-04
2243	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 02:21:52.083-04
2244	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	79255750-0a57-4334-b87d-d57de2cb2db7	null	{"id": "79255750-0a57-4334-b87d-d57de2cb2db7"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 02:31:30.116-04
2245	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 02:31:30.315-04
2246	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 02:31:30.456-04
2247	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 02:31:30.49-04
2248	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 02:31:30.546-04
2249	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 02:31:30.58-04
2250	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 02:31:30.729-04
2251	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	7c123abd-0e5e-45d6-a52e-2694917105d6	null	{"id": "7c123abd-0e5e-45d6-a52e-2694917105d6"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 10:40:33.295-04
2252	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 10:40:33.635-04
2253	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 10:40:33.941-04
2254	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 10:40:33.95-04
2255	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 10:40:34.116-04
2256	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 10:40:37.176-04
2257	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 10:40:37.258-04
2258	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 10:40:38.697-04
2259	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 10:40:38.733-04
2260	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	0de52335-9a98-41a3-b89b-dc66e2bd875d	null	{"id": "0de52335-9a98-41a3-b89b-dc66e2bd875d"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 11:54:21.071-04
2261	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 11:54:21.801-04
2262	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 11:54:21.927-04
2263	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 11:54:22.002-04
2264	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 11:54:22.052-04
2265	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 11:54:22.166-04
2266	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 11:54:22.232-04
2267	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-07 11:54:31.578-04
2268	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 11:55:41.595-04
2269	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 11:55:42.922-04
2270	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 11:55:42.949-04
2271	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 11:59:56.591-04
2272	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 11:59:56.764-04
2273	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	categorias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.categorias.read"}	2026-10-07 11:59:56.791-04
2274	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 12:00:34.906-04
2275	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 12:00:34.967-04
2276	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 12:00:37.046-04
2277	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 12:00:37.124-04
2278	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	d39801d8-ea82-4cde-bb3e-c578524aa8f3	null	{"id": "d39801d8-ea82-4cde-bb3e-c578524aa8f3"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 13:04:49.102-04
2279	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 13:04:49.828-04
2280	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 13:04:49.941-04
2281	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:04:49.955-04
2282	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 13:04:49.997-04
2283	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:04:55.504-04
2284	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:04:55.643-04
2285	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:04:58.844-04
2286	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:04:58.888-04
2287	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:05:08.58-04
2288	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	1	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 13:07:14.442-04
2289	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:07:14.606-04
2290	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	1	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:07:17.732-04
2291	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menu_item	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.items_menu.read"}	2026-10-07 13:07:17.973-04
2292	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:08:15.433-04
2293	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:08:15.468-04
2294	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	98865dfb-aedd-407c-961d-b67c388cc51d	null	{"id": "98865dfb-aedd-407c-961d-b67c388cc51d"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 13:31:09.961-04
2295	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 13:31:10.44-04
2296	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:31:10.482-04
2297	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 13:31:10.493-04
2298	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 13:31:10.539-04
2299	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:31:10.598-04
2300	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:31:10.649-04
2301	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:31:13.373-04
2302	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:31:13.41-04
2303	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-07 13:31:22.039-04
2304	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-07 13:31:39.615-04
2305	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	industrias	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.industrias.read"}	2026-10-07 13:31:39.734-04
2306	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:32:02.47-04
2307	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 13:32:02.686-04
2308	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:32:02.698-04
2309	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	servicios	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.servicios.read"}	2026-10-07 13:32:23.294-04
2310	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:32:23.568-04
2311	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 13:32:23.603-04
2312	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:33:14.167-04
2313	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:33:14.269-04
2314	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:33:15.862-04
2315	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:33:15.911-04
2316	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:45:34.919-04
2317	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	sesiones	c5fc799b-ddba-4fac-bd4f-23bf9b6bd1ef	null	{"id": "c5fc799b-ddba-4fac-bd4f-23bf9b6bd1ef"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.sesiones.iniciar"}	2026-10-07 13:57:29.882-04
2318	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:57:30.217-04
2319	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-07 13:57:30.347-04
2320	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_cms	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.portal.read"}	2026-10-07 13:57:30.492-04
2321	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-07 13:57:30.604-04
2322	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:57:30.617-04
2323	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-07 13:57:30.752-04
2324	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:57:48.103-04
2325	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:57:48.15-04
2326	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:57:51.524-04
2327	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:57:51.63-04
2328	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	2	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 13:58:24.261-04
2329	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:58:24.413-04
2330	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:58:26.573-04
2331	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:58:29.022-04
2332	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:58:29.269-04
2333	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	3	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 13:58:48.405-04
2334	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:58:48.486-04
2335	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:58:51.041-04
2336	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:58:51.075-04
2337	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:58:53.074-04
2338	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:58:53.184-04
2339	48aa7abf-0acb-47b5-bd73-172aaec874f1	Creación	menus	4	null	{"estado": "activo"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.manage"}	2026-10-07 13:59:09.597-04
2340	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:59:09.679-04
2341	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	menus	4	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "cms.menus.read"}	2026-10-07 13:59:12.3-04
2342	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:59:12.373-04
2343	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	empresas	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.empresas.read"}	2026-10-07 13:59:12.405-04
2344	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:59:12.548-04
2345	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	productos	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.productos.read"}	2026-10-07 13:59:12.556-04
2448	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_catalogo	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "catalog.portal.read"}	2026-10-08 13:37:10.311-04
2449	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_crm	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "crm.portal.read"}	2026-10-08 13:37:10.399-04
2452	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	portal_iam	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.portal.read"}	2026-10-08 13:37:10.712-04
2453	48aa7abf-0acb-47b5-bd73-172aaec874f1	Lectura	permiso	\N	null	null	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	{"operacion": "iam.permisos.read"}	2026-10-08 13:37:12.941-04
\.


--
-- TOC entry 5386 (class 0 OID 26527)
-- Dependencies: 239
-- Data for Name: categoria_atributo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_atributo (id, categoria_id, atributo_id, valor_personalizado, orden, estado, creado_en, actualizado_en) FROM stdin;
\.


--
-- TOC entry 5376 (class 0 OID 26424)
-- Dependencies: 229
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, producto_id, nombre, slug, imagen, descripcion, descripcion_corta, uso, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	Trapezoidales	correas/trapezoidales	http://localhost:5173/api/public/catalogo/imagenes/categorias/d703746c-4ac6-4a8f-bf47-1756b7bc3d48.png	Las correas en V son elementos de transmisión de potencia de forma trapezoidal. Se dividen principalmente en correas lisas y correas dentadas, diferenciándose en su flexibilidad, nivel de enfriamiento y el tipo de trabajo mecánico que pueden soportar.	Correas industriales, automotrices y maquinaria para alta resistencia para transmisión de potencia	Transmisión de potencia	1	activo	\N	2026-10-01 13:25:32.963-04	2026-10-01 13:58:33.204-04
3	1	Sincronas	correas/sincronas	http://localhost:5173/api/public/catalogo/imagenes/categorias/e88861cf-7598-4473-aeda-25b0d2f17599.png	Las correas síncronas (o correas dentadas) son bandas planas con dientes internos que engranan con poleas ranuradas. Transmiten movimiento exacto sin resbalar. Funcionan como una cadena de bicicleta, pero son de caucho y fibra. Proveen alta eficiencia y no requieren lubricación.	Correas para sistemas de velocidad variable.	Velocidad variable	2	activo	\N	2026-10-05 14:51:40.845-04	2026-10-05 14:51:46.71-04
4	1	Acanaladas	correas/acanaladas	http://localhost:5173/api/public/catalogo/imagenes/categorias/66dcb4c0-453b-4960-9da1-82744d064e07.png	Una correa acanalada es una banda flexible con múltiples ranuras en forma de "V" en su interior. Transmite energía desde un motor a otras partes de una máquina. Son muy eficientes porque sus canales aumentan el agarre, lo que evita que resbalen.	Correas multicanales para alta eficiencia.	Alta eficiencia	3	activo	\N	2026-10-05 14:53:22.876-04	2026-10-05 14:53:22.876-04
2	10	Succión y Descarga	mangueras/succion-y-descarga	http://localhost:5173/api/public/catalogo/imagenes/categorias/d67613e3-f783-4dcb-8a65-3a4f4820aa4f.png	Las mangueras de succión y descarga mueven líquidos y sólidos entre lugares. Son tubos flexibles que conectan bombas de agua. Funcionan aspirando líquidos (vacío) o empujándolos con fuerza (presión).	Mangueras para transferencia de fluidos	Transferencia de fluidos	2	activo	\N	2026-10-05 14:48:59.602-04	2026-10-05 14:54:20.798-04
5	10	Hidráulicas	mangueras/hidraulicas	http://localhost:5173/api/public/catalogo/imagenes/categorias/d32cf2f1-43d4-47f1-a47d-255da5c3c9fb.png	Las mangueras hidráulicas son tubos flexibles diseñados para transportar líquidos a alta presión (como el aceite hidráulico) entre partes de una máquina. Transmiten la fuerza necesaria para mover equipos pesados como excavadoras y tractores. Su flexibilidad ayuda a absorber las vibraciones del motor.	Mangueras de alta presión para sistemas hidráulicos industriales.	Alta presión	1	activo	\N	2026-10-05 14:55:24.107-04	2026-10-05 14:55:24.107-04
6	10	Multiusos	mangueras/multiusos	http://localhost:5173/api/public/catalogo/imagenes/categorias/186a4516-c7cc-4ed9-a8bc-d435ed391cdb.png	Las mangueras multiusos son tubos flexibles diseñados para transportar varios tipos de fluidos como agua, aire y aceites en una sola herramienta.	Mangueras versátiles para múltiples aplicaciones.	Versátiles	3	activo	\N	2026-10-05 14:57:59.055-04	2026-10-05 14:57:59.055-04
7	10	Neumáticas	mangueras/neumaticas	http://localhost:5173/api/public/catalogo/imagenes/categorias/60229c30-f6dc-4d8f-9f0e-4fa605a2bd99.png	Las mangueras neumáticas son tubos flexibles que llevan aire a presión desde un compresor hacia máquinas o herramientas. Son clave en fábricas y talleres. Funcionan como las venas del sistema. Mueven la fuerza del aire para hacer girar, levantar o cortar piezas.	Mangueras para sistemas de aire comprimido.	Aire comprimido	4	activo	\N	2026-10-05 14:59:08.781-04	2026-10-05 14:59:08.781-04
8	10	Combustible o petróleo	mangueras/combustible-o-petroleo	http://localhost:5173/api/public/catalogo/imagenes/categorias/21a9f544-24e2-4156-afa8-067ec30856d2.png	Una manguera de succión de combustible o petróleo es un tubo flexible de servicio pesado diseñado para tirar y empujar el aceite, diesel, gasolina y otros combustibles refinados. Cuenta con un núcleo de caucho de nitrilo suave resistente al aceite, tejido y refuerzos de alambre de acero dual para la resistencia al vacío, y una cubierta exterior resistente a la intemperie.	Manguera para transporte de combustible o pétroleo.	Manejo de Combustibles	5	activo	\N	2026-10-05 15:01:05.855-04	2026-10-05 15:01:05.855-04
9	2	Rígidos de Bolas	rodamientos/rigidos-de-bolas	http://localhost:5173/api/public/catalogo/imagenes/categorias/417e05f9-87e1-44b0-bb4a-4b5d092a34f3.png	Un rodamiento rígido de bolas es una pieza mecánica que reduce la fricción entre partes móviles. Usa pequeñas esferas de metal que ruedan entre dos anillos. Esto permite que las piezas giren rápido y suavemente. Es como usar ruedas de patines para mover cosas pesadas con poco esfuerzo.	Rodamientos de precisión para alta velocidad.	Alta velocidad	2	activo	\N	2026-10-05 15:04:52.169-04	2026-10-05 15:04:52.169-04
10	2	Rodillos Cilíndricos	rodamientos/rodillos-cilindricos	http://localhost:5173/api/public/catalogo/imagenes/categorias/c927ac96-9c6a-42de-a412-699abd2bf3fa.png	Los rodamientos de rodillos cilíndricos son componentes mecánicos formados por aros interior y exterior, una jaula y rodillos con forma de cilindro, destacando por su gran capacidad de carga radial, alta rigidez y aptitud para trabajar a altas velocidades.	Soportan gran carga radial a altas velocidades con rodillos cilíndricos.	Cargas radiales pesadas, guiar ejes de alta velocidad	1	activo	\N	2026-10-05 15:07:32.88-04	2026-10-05 15:07:32.88-04
11	2	Agujas	rodamientos/agujas	http://localhost:5173/api/public/catalogo/imagenes/categorias/c4276730-5d38-4012-8ef5-6637a676377e.png	Los rodamientos de agujas son cojinetes que usan rodillos cilíndricos muy finos y largos. Soportan cargas radiales pesadas en espacios muy pequeños. El contacto entre el rodillo y la pista es lineal, lo que distribuye el peso de manera uniforme.	Rodamientos compactos para espacios reducidos.	Compactos	3	activo	\N	2026-10-05 15:09:51.617-04	2026-10-05 15:10:07.195-04
12	2	Lineales	rodamientos/lineales	http://localhost:5173/api/public/catalogo/imagenes/categorias/c8bc45a6-d5a7-40b1-9beb-b06ded4156e4.png	Los rodamientos lineales son piezas mecánicas que permiten a una máquina mover objetos en línea recta con un esfuerzo muy bajo. Funcionan guiando un carro sobre un riel o eje mediante pequeñas bolitas o rodillos. Esto reduce el desgaste y permite movimientos suaves y exactos.	Rodamientos para movimiento lineal.	Movimiento lineal	4	activo	\N	2026-10-05 15:11:12.002-04	2026-10-05 15:11:12.002-04
13	2	Rodillos Esféricos	rodamientos/rodillos-esfericos	http://localhost:5173/api/public/catalogo/imagenes/categorias/ef81c2ef-8cf4-49eb-b1af-401475cda73a.png	Los rodamientos de rodillos esféricos son piezas mecánicas que reducen la fricción entre ejes giratorios y otras partes de una máquina. Usan cilindros o barriles en lugar de bolas. Este diseño crea una línea de contacto. Como resultado, soportan cargas mucho más pesadas y resisten mejor los golpes que los rodamientos de bolas.	Rodamientos para cargas pesadas	Cargas pesadas	5	activo	\N	2026-10-05 15:13:19.574-04	2026-10-05 15:13:19.574-04
14	2	Bolas de Contacto Angular	rodamientos/bolas-de-contacto-angular	http://localhost:5173/api/public/catalogo/imagenes/categorias/3f670c16-58f7-4a70-b1f9-d3eeb1e5bef8.png	Los rodamientos de bolas de contacto angular son piezas mecánicas con pistas de rodadura inclinadas, diseñadas para soportar cargas combinadas (radiales y axiales al mismo tiempo) y operar a altas velocidades.	Rodamientos con pistas inclinadas para cargas combinadas y altas velocidades.	Motores, Bombas y Engranajes	6	activo	\N	2026-10-05 15:14:59.009-04	2026-10-05 15:14:59.009-04
15	2	Axiales	rodamientos/axiales	http://localhost:5173/api/public/catalogo/imagenes/categorias/37e14f35-4d70-415b-b1e3-634e6d3c3f38.png	Los rodamientos axiales, o rodamientos de empuje, soportan fuerzas paralelas al eje de rotación. Funcionan como una prensa que aprieta hacia abajo. Se dividen en tres tipos principales: de bolas para alta velocidad, de rodillos para cargas extremas, y esféricos que corrigen errores de alineación.	Rodamientos para cargas axiales.	Cargas axiales	7	activo	\N	2026-10-05 15:16:31.688-04	2026-10-05 15:16:31.688-04
16	2	Husillos	rodamientos/husillos	http://localhost:5173/api/public/catalogo/imagenes/categorias/78495e85-b2e1-44f5-9ae6-5335e84e13db.png	Los rodamientos para husillos son rodamientos de bolas de contacto angular de alta precisión, diseñados para soportar cargas radiales y axiales de forma simultánea, y garantizan un giro rápido y exacto en máquinas herramienta.	Rodamientos de precisión para giros rápidos, exactos y combinados.	Alta Velocidad, Precisión Extrema, Doble carga	8	activo	\N	2026-10-05 15:17:45.095-04	2026-10-05 15:17:45.095-04
17	2	Chumaceras	rodamientos/chumaceras	http://localhost:5173/api/public/catalogo/imagenes/categorias/489b30d0-58d2-431d-a463-60a9706aec1f.png	Las chumaceras son unidades de rodamientos montados que sirven para sostener ejes de rotación y facilitar su movimiento con baja fricción. Sus componentes principales son el soporte o carcasa y el rodamiento interior o inserto.	Rodamientos montados	Industrial y Soporte	9	activo	\N	2026-10-05 15:19:12.011-04	2026-10-05 15:19:12.011-04
18	3	Retenes	retenes-sellos-y-o-rings/retenes	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los retenes para sellado son piezas que cierran los espacios entre piezas fijas y móviles. Retienen los lubricantes (aceite o grasa) dentro de las máquinas. También frenan la entrada de polvo y agua. Se usan mucho en motores, cajas de cambios y ruedas.	Elementos de sellado para ejes rotativos.	Sellado de ejes	1	activo	\N	2026-10-05 15:22:11.567-04	2026-10-05 15:22:11.567-04
20	3	Sellos Hidráulicos	retenes-sellos-y-o-rings/sellos-hidraulicos	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los sellos hidráulicos son anillos de caucho o plástico. Actúan como tapones herméticos. Su objetivo es evitar que el aceite o líquido se escape entre las partes de una máquina.	Sellos para sistemas hidráulicos	Sistemas hidráulicos	2	activo	\N	2026-10-05 15:25:08.687-04	2026-10-05 15:25:08.687-04
19	3	O-Rings	retenes-sellos-y-o-rings/o-rings	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Un o-ring (o junta tórica) es un anillo en forma de rosquilla con sección transversal redonda. Hecho de materiales elásticos, se coloca en una ranura y se comprime al unir dos piezas. Actúa como barrera, bloqueando el paso y evitando fugas de líquidos o gases.	Juntas tóricas para sellado estático y dinámico.	Juntas tóricas	4	activo	\N	2026-10-05 15:23:41.686-04	2026-10-05 15:25:18.435-04
21	3	Neumáticos	retenes-sellos-y-o-rings/neumaticos	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los sellos neumáticos son componentes de goma o plástico que retienen el aire comprimido en equipos como cilindros o compresores. Su función es evitar fugas, mantener la fuerza del aire y proteger el sistema contra la suciedad.	Sellos para sistemas neumáticos.	Sistemas neumáticos	3	activo	\N	2026-10-05 15:26:15.258-04	2026-10-05 15:26:15.258-04
22	5	Lisas	bandas-transportadoras-pesadas/lisas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras lisas son cintas planas sin relieves. Mueven productos de un punto a otro. Son la opción más común en fábricas. Funcionan bien en superficies planas o con poca inclinación (hasta 20°).	Bandas para cargas pesadas, minería e industria.	Cargas pesadas	1	activo	\N	2026-10-05 15:28:52.306-04	2026-10-05 15:28:52.306-04
23	5	Nervadas	bandas-transportadoras-pesadas/nervadas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras nervadas tienen relieves en su superficie, como tacos o crestas. Estos relieves evitan que el material se resbale o se caiga. Permiten subir productos con inclinaciones muy altas (hasta de 45º) y son ideales para cargar productos sueltos, cajas o alimentos.	Bandas para cargas pesadas, minería e industria	Cargas pesadas	2	activo	\N	2026-10-05 15:30:24.809-04	2026-10-05 15:30:24.809-04
24	5	Verticales	bandas-transportadoras-pesadas/verticales	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras verticales mueven objetos automáticamente entre diferentes niveles o pisos. Funcionan como un elevador continuo de carga. Su diseño ahorra espacio en las fábricas.	Bandas para cargas pesadas, minería e industria.	Cargas pesadas	3	activo	\N	2026-10-05 15:32:29.151-04	2026-10-05 15:32:29.151-04
25	5	Bordes	bandas-transportadoras-pesadas/bordes	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras con bordes contienen barreras físicas o sellos laterales que evitan que el material se caiga durante el traslado. Son clave para subir productos en ángulo o mover materiales sueltos. Existen dos tipos principales de bordes según su fabricación: cortados o moldeados.	Bandas para cargas pesadas, minería e industria.	Cargas pesadas	4	activo	\N	2026-10-05 15:33:51.421-04	2026-10-05 15:33:51.421-04
26	5	Corrugadas	bandas-transportadoras-pesadas/corrugadas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras corrugadas son cintas industriales con relieves en su superficie. Estos relieves mejoran el agarre. Están diseñadas para mover productos frágiles o cargas inclinadas. Evitan que la mercancía ruede o resbale hacia atrás.	Bandas para cargas pesadas, minería e industria.	Cargas pesadas	5	activo	\N	2026-10-05 15:34:53.931-04	2026-10-05 15:34:53.931-04
27	6	Sintenticas	bandas-transportadoras-livianas/sintenticas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras sintéticas son sistemas de movimiento continuo formados por capas de tela unidas con plásticos como PVC o poliuretano mediante calor. Son muy flexibles, resistentes a la abrasión y fáciles de limpiar. Se usan mucho en alimentos, medicinas y paquetería gracias a sus características higiénicas.	Bandas para industria ligera.	Industria ligera	1	activo	\N	2026-10-05 15:36:27.014-04	2026-10-05 15:36:27.014-04
28	6	Modulares	bandas-transportadoras-livianas/modulares	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una banda transportadora modular es un sistema formado por piezas de plástico unidas entre sí. Estas piezas encajan como bloques de construcción. Se conectan usando varillas largas. Esta unión crea una superficie plana, resistente y flexible que se mueve usando ruedas dentadas.	Bandas para industria ligera.	Industria ligera	2	activo	\N	2026-10-05 15:37:36.539-04	2026-10-05 15:37:36.539-04
29	6	Politetrafluoroetileno (PTFE)	bandas-transportadoras-livianas/politetrafluoroetileno-ptfe	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras de PTFE (politetrafluoroetileno, conocido como Teflón) son cintas de fibra de vidrio recubiertas de resina sintética. Son famosas por su superficie antiadherente y su gran resistencia al calor. Soportan temperaturas extremas de -73 °C hasta 260 °C sin dañarse.	Bandas para industria ligera.	Industria ligera	3	activo	\N	2026-10-05 15:39:34.734-04	2026-10-05 15:39:34.734-04
30	6	Homogeneas	bandas-transportadoras-livianas/homogeneas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras homogéneas son fajas continuas hechas de un solo material sólido, como poliuretano o caucho. A diferencia de las bandas tradicionales, no tienen capas internas (lonas) ni grietas. Esto las hace más seguras, duraderas y fáciles de limpiar.	Bandas para industria ligera.	Industria ligera	4	activo	\N	2026-10-05 15:41:12.704-04	2026-10-05 15:41:12.704-04
31	6	Caucho Ligeras	bandas-transportadoras-livianas/caucho-ligeras	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las bandas transportadoras de caucho ligeras son cintas flexibles hechas de capas de tela (como poliéster) recubiertas de caucho. Mueven materiales de peso bajo o mediano en distancias cortas. Pesan poco y son fáciles de doblar. Estas bandas se usan mucho en agricultura, logística y empaque.	Bandas para industria ligera.	Industria ligera	5	activo	\N	2026-10-05 15:42:27.906-04	2026-10-05 15:42:27.906-04
32	4	Rodillos de Precisión	cadenas/rodillos-de-precision	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las cadenas de rodillos de precisión son piezas mecánicas que transmiten fuerza entre ejes. Usan eslabones metálicos y pequeños cilindros rodantes que engranan en ruedas dentadas. Son vitales en industrias y vehículos, ya que garantizan un movimiento silencioso y sin pérdidas de energía.	Cadenas para transmisión de potencia.	Transmisión	1	activo	\N	2026-10-05 15:44:18.852-04	2026-10-05 15:44:18.852-04
33	4	Acero Inoxidable	cadenas/acero-inoxidable	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las cadenas de acero inoxidable son tiras de eslabones de metal muy fuertes. No se oxidan ni se manchan. Son una mezcla de hierro, cromo y otros metales. El cromo forma una capa invisible que las protege del agua y del clima. Son muy duraderas y seguras para la piel.	Cadenas resistentes a la corrosión.	Resistentes	2	activo	\N	2026-10-05 15:45:20.942-04	2026-10-05 15:45:20.942-04
34	4	Transmisión	cadenas/transmision	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una cadena de transmisión es un mecanismo que transfiere energía mecánica y movimiento entre dos o más ejes. Consiste en una serie de eslabones metálicos que se engranan con ruedas dentadas (llamadas piñones). Este sistema evita que la cadena resbale, lo que asegura una fuerza exacta y constante.	Cadenas para transmisión industrial.	Industrial	3	activo	\N	2026-10-05 15:46:36.702-04	2026-10-05 15:46:36.702-04
35	4	Transportador	cadenas/transportador	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los transportadores de cadena son sistemas industriales que usan eslabones metálicos continuos para mover productos pesados. Un motor gira una rueda. La rueda tira de la cadena. La cadena arrastra la carga. Son muy fuertes. Mueven cosas grandes como palés donde las cintas de goma fallan.	Cadenas para sistemas de transporte.	Transporte	4	activo	\N	2026-10-05 15:47:46.155-04	2026-10-05 15:47:46.155-04
36	4	Agrícolas	cadenas/agricolas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las cadenas agrícolas tienen dos significados. En las máquinas, son piezas de metal o plástico que mueven partes de los equipos. En los negocios, son todas las etapas por las que pasa un cultivo desde la granja hasta tu mesa.	Cadenas para maquinaria agrícola.	Agrícola	5	activo	\N	2026-10-05 15:49:12.118-04	2026-10-05 15:49:12.118-04
62	15	Inoxidables	abrazaderas/inoxidables	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las abrazaderas de acero inoxidable son mecanismos de sujeción. Se usan para fijar, unir o soportar tuberías y mangueras. Aplican una fuerza de presión uniforme. Son muy duraderas porque resisten el óxido y los cambios de temperatura.	Abrazaderas de acero inoxidable.	Inoxidables	2	activo	\N	2026-10-05 16:21:52.044-04	2026-10-05 16:21:52.044-04
37	8	V de Taladro Cónico y Cilíndrico	poleas/v-de-taladro-conico-y-cilindrico	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las poleas en V para taladro transmiten el movimiento del motor al husillo mediante una correa trapezoidal. Los términos cónicas y cilindricas describen cómo se fija la polea al eje.	Poleas para correas trapezoidales o en V	Correas Trapezoidales	1	activo	\N	2026-10-05 15:51:36.224-04	2026-10-05 15:51:36.224-04
38	8	Sincrónicas	poleas/sincronicas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las poleas sincrónicas (o dentadas) son ruedas con ranuras que transmiten fuerza mediante el acoplamiento positivo. Sus dientes encajan perfectamente con los de una correa especial. No usan fricción. Esto garantiza una sincronización exacta, cero deslizamientos y máxima eficiencia.	Poleas para correas dentadas.	Correas dentadas	2	activo	\N	2026-10-05 15:52:33.093-04	2026-10-05 15:52:33.093-04
39	8	MI-Lock	poleas/mi-lock	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las poleas Mi-Lock son componentes mecánicos industriales de transmisión de potencia. Destacan por su sistema de bloqueo cónico sin chavetero, que une la polea al eje mediante presión. Esto elimina la necesidad de ranuras y tornillos. Son duraderas, silenciosas y evitan el desgaste.	Poleas con sistema de bloqueo MI-Lock.	Sistema MI-Lock	3	activo	\N	2026-10-05 15:53:21.469-04	2026-10-05 15:53:21.469-04
40	9	Taladro cónico	pinones/taladro-conico	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los piñones de taladro cónico son ruedas dentadas en forma de cono que transfieren la fuerza de giro y el movimiento entre ejes que se cruzan. Se usan mucho en taladros manuales (de pecho o berbiquí) para cambiar la dirección del giro 90° y aumentar la velocidad de la broca.	Piñones con ajuste cónico.	Ajuste cónico	1	activo	\N	2026-10-05 15:55:37.753-04	2026-10-05 15:55:52.588-04
41	9	Agujero Piloto	pinones/agujero-piloto	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los piñones con agujero piloto (también llamados barrenos piloto o pilot bore) son ruedas dentadas que cuentan con un orificio central pequeño y preperforado. Este agujero no está listo para instalarse en una máquina. Sirve como guía para que un tornero lo perfore al tamaño exacto de tu eje.	Piñones para mecanizado personalizado.	Mecanizado	2	activo	\N	2026-10-05 15:57:52.794-04	2026-10-05 15:57:52.794-04
42	9	Simples de Taladro Cónico para 2 Cadenas	pinones/simples-de-taladro-conico-para-2-cadenas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los piñones simples de taladro cónico para dos cadenas son ruedas dentadas dobles diseñadas para alojar dos cadenas simples paralelas. Usan un sistema de casquillo cónico para un agarre firme. Esto elimina el juego y hace que el montaje y desmontaje sean muy rápidos y sencillos.	Piñones dobles para transmisión.	Transmisión doble	3	activo	\N	2026-10-05 15:58:55.643-04	2026-10-05 15:58:55.643-04
43	7	Hidráulicos	niples-conexiones-y-conectores/hidraulicos	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Un niple hidráulico es un tubo corto con roscas en ambos extremos. Sirve para unir dos tuberías o mangueras en un sistema hidráulico, que es un mecanismo que usa aceite u otro líquido a presión para mover maquinaria. Su función principal es transmitir esta fuerza con seguridad y sin fugas.	Conexiones para sistemas hidráulicos.	Hidráulicos	1	activo	\N	2026-10-05 16:00:38.906-04	2026-10-05 16:00:38.906-04
44	7	Cobre	niples-conexiones-y-conectores/cobre	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los niples de cobre son segmentos cortos de tubo que sirven para conectar dos accesorios de tubería o extender un sistema. Son muy resistentes al calor y a la corrosión, por lo que se usan mucho en agua, gas y aire acondicionado. A menudo se sueldan y garantizan una unión fuerte.	Conexiones de cobre para diversas aplicaciones.	Cobre	2	activo	\N	2026-10-05 16:01:20.027-04	2026-10-05 16:01:20.027-04
45	7	Rápidas	niples-conexiones-y-conectores/rapidas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las conexiones rápidas son accesorios mecánicos que unen tuberías o mangueras en segundos sin usar herramientas. Se componen de dos partes: el macho (que se inserta) y la hembra (que bloquea y sella). Permiten conectar y desconectar sistemas de agua, aire o aceite de forma fácil y sin fugas.	Conexiones de acople rápido.	Acople rápido	3	activo	\N	2026-10-05 16:02:17.649-04	2026-10-05 16:02:17.649-04
46	7	Adaptadores	niples-conexiones-y-conectores/adaptadores	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los adaptadores son piezas clave que unen mangueras entre sí o las conectan a tuberías, llaves y equipos. Evitan fugas y mantienen la presión.	Adaptadores para diferentes configuraciones.	Adaptación	4	activo	\N	2026-10-05 16:04:18.965-04	2026-10-05 16:04:18.965-04
47	7	Racores	niples-conexiones-y-conectores/racores	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los conectores rápidos (o racores) permiten unir mangueras, herramientas y equipos de aire comprimido al instante. No necesitas herramientas para conectarlos. Ahorran tiempo, evitan fugas de aire y soportan alta presión gracias a sus sellos internos.	Conectores para conexión rápida.	Conexión rápida	5	activo	\N	2026-10-05 16:06:18.018-04	2026-10-05 16:06:18.018-04
48	11	Neumáticos	cilindros/neumaticos	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los cilindros neumáticos son dispositivos que transforman la energía del aire comprimido en movimiento mecánico lineal. Se usan mucho en la industria para mover, levantar o empujar objetos. Funcionan como una jeringa: el aire empuja una pieza interna, haciendo que una barra salga o entre.	Cilindros para sistemas neumáticos.	Neumáticos	1	activo	\N	2026-10-05 16:08:14.696-04	2026-10-05 16:08:14.696-04
49	11	HTR (Tirantes)	cilindros/htr-tirantes	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los cilindros de tirantes (conocidos como HTR) son componentes mecánicos que usan varillas de acero roscadas para unir las tapas de los extremos al cuerpo del cilindro. Su diseño estandarizado permite un fácil mantenimiento. Son ideales para uso industrial en prensas, maquinaria agrícola y equipos de manipulación de materiales.	Cilindros con diseño de tirantes.	Tirantes	2	activo	\N	2026-10-05 16:09:00.001-04	2026-10-05 16:09:00.001-04
50	11	HCW (Patentado)	cilindros/hcw-patentado	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los cilindros HCW son actuadores lineales soldados de doble efecto diseñados para maquinaria industrial. Su nombre alude a los cilindros soldados con extremos de horquilla ajustables (Clevis Welded). Su diseño optimizado maneja grandes cargas en espacios pequeños.	Cilindros con diseño patentado.	Patentado	3	activo	\N	2026-10-05 16:09:53.527-04	2026-10-05 16:09:53.527-04
51	12	HD Stax (Heavy Duty)	cangilones/hd-stax-heavy-duty	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los cangilones HD-STAX son recipientes de plástico para elevadores de cangilones. Mueven materiales a granel verticalmente. Son muy populares en la agricultura y la industria. Su diseño "Heavy Duty" (servicio pesado) permite soportar trabajos duros y desgastantes.	Cangilones de alta resistencia.	Alta resistencia	1	activo	\N	2026-10-05 16:11:09.897-04	2026-10-05 16:11:09.897-04
52	12	Nylon	cangilones/nylon	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los cangilones de nylon son recipientes plásticos que se instalan en cintas o cadenas para elevar materiales verticalmente. Son famosos por su gran fuerza y resistencia.	Cangilones ligeros de nylon.	Ligeros	2	activo	\N	2026-10-05 16:11:56.648-04	2026-10-05 16:11:56.648-04
53	12	Poliuretano	cangilones/poliuretano	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los cangilones de poliuretano son recipientes flexibles y ultrarresistentes utilizados en elevadores industriales para cargar y transportar materiales sólidos a granel. Funcionan como cucharas montadas en bandas móviles. Destacan por su extrema resistencia a la abrasión (desgaste por fricción) y su flexibilidad superior al metal o al plástico común.	Cangilones resistentes al desgaste.	Resistentes	3	activo	\N	2026-10-05 16:12:46.799-04	2026-10-05 16:12:46.799-04
54	12	Pernos	cangilones/pernos	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Los pernos para cangilones (también conocidos como pernos de elevador) son elementos de fijación especializados diseñados para unir de forma segura los cangilones a las bandas o cadenas transportadoras. Evitan que la correa se rompa o resbale durante la operación.	Pernos para fijación de cangilones.	Fijación	4	activo	\N	2026-10-05 16:13:53.501-04	2026-10-05 16:13:53.501-04
55	12	Grapas de Empalme Mecánico	cangilones/grapas-de-empalme-mecanico	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las grapas para elevadores de cangilones son un tipo de empalme mecánico usado para unir los extremos de una banda transportadora. Permiten crear una banda continua. A la vez, permiten desarmar la unión fácil y rápidamente para hacer reparaciones o ajustes.	Grapas para unión de bandas elevadoras de cangilones.	Unión	5	activo	\N	2026-10-05 16:15:11.833-04	2026-10-05 16:15:30.149-04
56	13	Agrícolas	cardanes/agricolas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Un cardán agrícola es una barra de transmisión. Lleva la fuerza y el movimiento de rotación desde el tractor hasta la maquinaria (como una desbrozadora o segadora). Funciona como una articulación. Permite que el tractor y el apero giren y se muevan sobre terreno irregular sin romperse.	Cardanes para maquinaria agrícola.	Agrícola	1	activo	\N	2026-10-05 16:16:21.625-04	2026-10-05 16:16:21.625-04
57	14	1 Palanca	cajas-de-comandos/1-palanca	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una caja de comandos de una palanca es un dispositivo mecánico o hidráulico que controla dos acciones clave con un solo mango. Dependiendo del equipo, regula el flujo de aceite para mover maquinaria pesada (como grúas) o controla de forma simultánea la marcha y la aceleración en motores marinos.	Caja de comando con una palanca	1 Palanca	1	activo	\N	2026-10-05 16:17:30.667-04	2026-10-05 16:17:30.667-04
58	14	2 Palancas	cajas-de-comandos/2-palancas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una caja de comandos de 2 palancas es un dispositivo que permite controlar dos funciones mecánicas o hidráulicas desde un solo lugar. Por ejemplo, en maquinarias, una palanca sube y baja un brazo, mientras que la otra abre y cierra una pinza.	Caja de comando con dos palancas.	2 Palancas	2	activo	\N	2026-10-05 16:18:13.222-04	2026-10-05 16:18:13.222-04
59	14	3 Palancas	cajas-de-comandos/3-palancas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una caja de comandos de 3 palancas es un dispositivo hidráulico usado para controlar maquinaria pesada. Permite dirigir el flujo de aceite para activar tres movimientos independientes. Las palancas se mueven a mano para subir, bajar o girar partes de equipos como grúas o tractores.	Caja de comando con tres palancas	3 Palancas	3	activo	\N	2026-10-05 16:19:14.608-04	2026-10-05 16:19:14.608-04
60	14	4 Palancas	cajas-de-comandos/4-palancas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una caja de comandos de 4 palancas es un dispositivo que controla sistemas hidráulicos. Permite dirigir el aceite a presión hacia diferentes cilindros o motores. Cada palanca opera una función independiente. Se usa mucho en grúas, montacargas, maquinaria agrícola e hidroelevadores.	Caja de comando con cuatro palancas.	4 Palancas	4	activo	\N	2026-10-05 16:19:59.345-04	2026-10-05 16:19:59.345-04
61	15	Galvanizadas	abrazaderas/galvanizadas	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una abrazadera galvanizada es una pieza de metal resistente que sirve para sujetar y asegurar tuberías, cables o mangueras. Está hecha de acero y recubierta con zinc para evitar la oxidación. Esto permite usarla en exteriores o lugares húmedos sin que se dañe.	Abrazaderas con recubrimiento galvanizado.	Galvanizadas	1	activo	\N	2026-10-05 16:21:03.999-04	2026-10-05 16:21:03.999-04
63	15	Tornillo	abrazaderas/tornillo	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Las abrazaderas de tornillo son dispositivos que unen o sujetan objetos firmemente usando un mecanismo de tornillo. En fontanería y automoción, sellan mangueras. En carpintería, sostienen piezas juntas de forma temporal. Son reutilizables, ajustables y ofrecen una gran fuerza de apriete.	Abrazaderas con sistema de tornillo.	Tornillo	3	activo	\N	2026-10-05 16:22:37.807-04	2026-10-05 16:22:37.807-04
64	15	Alambre	abrazaderas/alambre	http://localhost:5173/api/public/catalogo/imagenes/categorias/b82b33c6-eacf-4601-bed2-389e7b492dfa.png	Una abrazadera de alambre es un anillo de metal diseñado para sujetar tuberías, cables o mangueras. Aprieta el tubo alrededor de otra pieza usando un tornillo o tuerca. Es ideal para trabajos donde hay baja presión o espacio reducido, ya que no daña los materiales.	Abrazaderas de alambre.	Alambre	4	activo	\N	2026-10-05 16:23:16.179-04	2026-10-05 16:23:16.179-04
\.


--
-- TOC entry 5423 (class 0 OID 26912)
-- Dependencies: 276
-- Data for Name: configuracion_sitio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_sitio (id, empresa_id, clave, valor, tipo, descripcion, grupo, activo, creado_en, actualizado_en) FROM stdin;
1	1	titulo_sitio	Correas Center	texto	Título principal del sitio	general	t	2026-10-06 04:45:27.533-04	2026-10-06 04:45:27.533-04
2	1	descripcion_sitio	Especialistas en correas industriales	texto	Descripción meta del sitio	general	t	2026-10-09 20:45:09.238-04	2026-10-09 20:45:09.238-04
3	1	telefono_principal	+591 7 7306576	texto	Teléfono principal de contacto	general	t	2026-10-09 20:46:10.315-04	2026-10-09 20:46:10.315-04
4	1	email_contacto	info@correascenter.com	texto	Email de contacto	general	t	2026-10-09 17:06:43.947316-04	2026-10-09 17:06:43.947316-04
5	1	google_analytics_id	G-CFYF3B7114	texto	ID de Google Analytics (ej: G-XXXXXXXXXX)	analytics	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
6	1	google_analytics_activo	true	booleano	Activar o desactivar Google Analytics	analytics	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
7	1	whatsapp_numero	59177306576	texto	Número de WhatsApp (con código de país, sin +)	whatsapp	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
8	1	whatsapp_mensaje	Hola, necesito información sobre sus productos y servicios	texto	Mensaje predeterminado de WhatsApp	whatsapp	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
9	1	whatsapp_activo	true	booleano	Mostrar u ocultar el botón de WhatsApp	whatsapp	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
10	1	tawk_property_id	6a443b02f81fcf1d458442b0	texto	Property ID de Tawk.to	chat	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
11	1	tawk_widget_id	1jsd8d0at	texto	Widget ID de Tawk.to	chat	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
12	1	tawk_activo	true	booleano	Activar o desactivar el chat de Tawk.to	chat	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
13	1	facebook_url	https://www.facebook.com/CorreasCenterLtda	texto	URL completa del perfil de Facebook	redes_sociales	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
14	1	instagram_url	https://www.instagram.com/correascenterltda	texto	URL completa del perfil de Instagram	redes_sociales	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
17	1	tiktok_url	https://www.tiktok.com/@correas.center.ltda	texto	URL de la página de Tiktok	general	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
15	1	linkedin_url		texto	URL completa del perfil de LinkedIn	redes_sociales	f	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
16	1	youtube_url	https://www.youtube.com/@CorreasCenterLtda	texto	URL completa del canal de YouTube	redes_sociales	t	2026-10-09 17:10:14.402052-04	2026-10-09 17:10:14.402052-04
\.


--
-- TOC entry 5410 (class 0 OID 26786)
-- Dependencies: 263
-- Data for Name: contactos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contactos (id, empresa_id, nombre, empresa, telefono, email, mensaje, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
\.


--
-- TOC entry 5396 (class 0 OID 26631)
-- Dependencies: 249
-- Data for Name: contenido_seccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contenido_seccion (id, empresa_id, tipo_seccion_id, titulo, subtitulo, descripcion, icono, imagen, metadata, orden, mostrar, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	1	Soluciones Industriales Confiables	Más de 25 años brindando repuestos, fabricación especializada y soporte técnico para la industria boliviana.	\N	\N	http://localhost:3000/api/public/cms/imagenes/contenidos-seccion/112af80c-cdf2-4a51-b8ac-20407395d58c.png	{"badge_text": "Lider en Soluciones Industriales", "cta_primary_href": "/contact", "cta_primary_text": "Solicitar Asesoría", "cta_secondary_href": "/products", "cta_secondary_text": "Ver Productos"}	1	t	activo	\N	2026-10-07 01:48:13.604-04	2026-10-07 01:48:58.193-04
2	1	1	Calidad SKF Garantizada	Fabricación autorizada de sellos SKF con los más altos estándares de calidad.	\N	\N	http://localhost:3000/api/public/cms/imagenes/contenidos-seccion/4939d6da-3808-4d8a-8bef-1b0b699f16a3.png	{"badge_text": "Fabricante Autorizado", "cta_primary_text": "Conocer Más", "cta_secondary_text": "Ver Productos"}	2	t	activo	\N	2026-10-07 01:50:26.765-04	2026-10-07 01:52:12.411-04
3	1	1	Bandas Transportadoras y Correas de Alta Resistencia	Amplio stock en bandas transportadoras, correas en V, variadoras y acanaladas para todo tipo de maquinaria.	\N	\N	http://localhost:3000/api/public/cms/imagenes/contenidos-seccion/e5225a91-924c-45de-b2fe-2cee55608264.png	{"badge_text": "Amplio Stock de Productos", "cta_primary_text": "Ver Correas", "cta_secondary_text": "Solicitar Cotización"}	3	t	activo	\N	2026-10-07 01:53:38.991-04	2026-10-07 01:54:33.145-04
4	1	1	Sistemas Hidráulicos y Neumáticos	Mangueras, conectores y componentes hidráulicos de las mejores marcas del mercado.	\N	\N	http://localhost:3000/api/public/cms/imagenes/contenidos-seccion/92d81572-d54e-4ebf-86fe-146200d80809.png	{"badge_text": "Proveedores de Sistemas Hidráulicos y Neumáticos", "cta_primary_text": "Ver Mangueras", "cta_secondary_text": "Contactar Ahora"}	4	t	activo	\N	2026-10-07 01:55:48.959-04	2026-10-07 01:55:48.959-04
5	1	1	Entregas Rápidas a Todo Bolivia	Entregas rápidas a todo Bolivia con el respaldo de nuestro equipo técnico especializado	\N	\N	http://localhost:3000/api/public/cms/imagenes/contenidos-seccion/09679d5f-6961-4ac3-8c7e-00dbb224bdd3.png	{"badge_text": "Cobertura Nacional", "cta_primary_text": "Contactar Ahora", "cta_secondary_text": "Ver Sucursales"}	5	t	activo	\N	2026-10-07 01:57:10.642-04	2026-10-07 01:57:10.642-04
6	1	2	+25 Años	Experiencia Comprobada	Más de dos décadas liderando el mercado industrial boliviano	Clock	\N	{"subtitulo": "Experiencia Comprobada"}	1	t	activo	\N	2026-10-07 01:58:09.555-04	2026-10-07 01:58:09.555-04
7	1	2	SKF	Licencia Exclusiva	Únicos autorizados para fabricar sellos SKF en Bolivia	Award	\N	{"subtitulo": "Licencia Exclusiva"}	2	t	activo	\N	2026-10-07 01:58:56.935-04	2026-10-07 01:58:56.935-04
8	1	2	10,000+	Productos en Stock	Amplio inventario para entregas inmediatas	Package	\N	{"subtitulo": "Productos en Stock"}	3	t	activo	\N	2026-10-07 01:59:51.64-04	2026-10-07 01:59:51.64-04
10	1	2	100%	Atención Personalizada	Soluciones a medida para cada cliente	Users	\N	{"subtitulo": "Atención Personalizada"}	6	t	activo	\N	2026-10-07 02:01:25.732-04	2026-10-07 02:01:52.068-04
9	1	2	4	Sucursales	Cobertura nacional para estar cerca de ti	MapPin	\N	{"subtitulo": "Sucursales"}	5	t	activo	\N	2026-10-07 02:00:33.119-04	2026-10-07 02:02:12.999-04
11	1	2	24/7	Soporte Técnico	Asesoría especializada cuando la necesites	HeadphonesIcon	\N	{"subtitulo": "Soporte Técnico"}	4	t	activo	\N	2026-10-07 02:02:55.735-04	2026-10-07 02:03:01.639-04
12	1	3	Calidad Garantizada	\N	Productos de las mejores marcas internacionales con garantía de calidad	CheckCircle2	\N	{}	1	t	activo	\N	2026-10-07 02:04:28.213-04	2026-10-07 02:04:28.213-04
13	1	3	Asesoría Técnica Especializada	\N	Equipo técnico capacitado para brindarte la mejor solución	CheckCircle2	\N	{}	2	t	activo	\N	2026-10-07 02:05:07.957-04	2026-10-07 02:05:07.957-04
14	1	3	Cobertura Nacional	\N	4 sucursales estratégicamente ubicadas para atenderte mejor	CheckCircle2	\N	{}	3	t	activo	\N	2026-10-07 02:05:57.479-04	2026-10-07 02:05:57.479-04
15	1	3	Entregas Rápidas	\N	Amplio inventario para entregas inmediatas en todo Bolivia	CheckCircle2	\N	{}	4	t	activo	\N	2026-10-07 02:06:27.145-04	2026-10-07 02:06:27.145-04
16	1	3	Fabricante Autorizado SKF	\N	Únicos autorizados para fabricar sellos SKF en Bolivia	CheckCircle2	\N	{}	5	t	activo	\N	2026-10-07 02:07:05.793-04	2026-10-07 02:07:05.793-04
17	1	3	Servicio Personalizado	\N	Soluciones a medida para cada cliente y cada industria	CheckCircle2	\N	{}	6	t	activo	\N	2026-10-07 02:07:54.423-04	2026-10-07 02:07:54.423-04
18	1	4	Fabricación de sellos SKF a medida	\N	\N	CheckCircle2	\N	{}	1	t	activo	\N	2026-10-07 02:09:41.657-04	2026-10-07 02:09:41.657-04
19	1	4	Prensado de mangueras hidráulicas	\N	\N	CheckCircle2	\N	{}	2	t	activo	\N	2026-10-07 02:10:07.894-04	2026-10-07 02:10:07.894-04
20	1	4	Reparación de cilindros industriales	\N	\N	CheckCircle2	\N	{}	3	t	activo	\N	2026-10-07 02:10:36.428-04	2026-10-07 02:10:36.428-04
21	1	4	Empalmes y montaje de bandas transportadoras	\N	\N	CheckCircle2	\N	{}	4	t	activo	\N	2026-10-07 02:10:57.323-04	2026-10-07 02:10:57.323-04
22	1	4	Asesoría técnica especializada	\N	\N	CheckCircle2	\N	{}	5	t	activo	\N	2026-10-07 02:11:16.434-04	2026-10-07 02:11:16.434-04
23	1	4	Entregas a todo Bolivia	\N	\N	CheckCircle2	\N	{}	6	t	activo	\N	2026-10-07 02:11:47.978-04	2026-10-07 02:11:47.978-04
24	1	5	Planta de Fabricación	\N	Instalaciones modernas equipadas con tecnología de punta para la fabricación de sellos SKF	Factory	\N	{"stats": "500m²"}	1	t	activo	\N	2026-10-07 02:12:39.511-04	2026-10-07 02:12:39.511-04
25	1	5	Centro de Distribución	\N	Almacén estratégico con más de 10,000 productos en stock para entregas inmediatas	Truck	\N	{"stats": "10,000+ productos"}	2	t	activo	\N	2026-10-07 02:13:09.679-04	2026-10-07 02:13:09.679-04
26	1	5	Equipo Técnico	\N	Personal altamente capacitado con certificaciones internacionales	Users	\N	{"stats": "+25 técnicos"}	3	t	activo	\N	2026-10-07 02:13:46.72-04	2026-10-07 02:13:46.72-04
27	1	5	Certificaciones	\N	Licencia exclusiva SKF y certificaciones de calidad internacionales	Award	\N	{"stats": "SKF Autorizado"}	4	t	activo	\N	2026-10-07 02:15:14.283-04	2026-10-07 02:15:14.283-04
\.


--
-- TOC entry 5370 (class 0 OID 26362)
-- Dependencies: 223
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresas (id, nombre, logo, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	Correas Center	http://localhost:5173/api/public/crm/logos/9c08f768-8984-4506-abb8-7fafbe266d19.png	activo	\N	2026-09-29 03:36:54.229-04	2026-09-29 03:36:54.229-04
\.


--
-- TOC entry 5406 (class 0 OID 26741)
-- Dependencies: 259
-- Data for Name: footers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.footers (id, empresa_id, tipo, tipo_registro, registro_id, titulo, url, icono, orden, mostrar, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	producto	producto	1	\N	\N	\N	1	t	activo	\N	2026-10-09 01:10:15.581-04	2026-10-09 01:10:15.581-04
2	1	producto	producto	2	\N	\N	\N	2	t	activo	\N	2026-10-09 01:10:31.225-04	2026-10-09 01:10:31.225-04
3	1	producto	producto	3	\N	\N	\N	3	t	activo	\N	2026-10-09 01:11:14.921-04	2026-10-09 01:11:14.921-04
4	1	producto	producto	4	\N	\N	\N	4	t	activo	\N	2026-10-09 01:11:24.491-04	2026-10-09 01:11:24.491-04
5	1	producto	producto	5	\N	\N	\N	5	t	activo	\N	2026-10-09 01:11:35.762-04	2026-10-09 01:11:35.762-04
6	1	producto	producto	6	\N	\N	\N	6	t	activo	\N	2026-10-09 01:11:46.922-04	2026-10-09 01:11:46.922-04
7	1	producto	producto	7	\N	\N	\N	7	t	activo	\N	2026-10-09 01:12:13.741-04	2026-10-09 01:12:13.741-04
8	1	industria	industria	1	\N	\N	\N	1	t	activo	\N	2026-10-09 01:13:03.6-04	2026-10-09 01:13:03.6-04
9	1	industria	industria	2	\N	\N	\N	2	t	activo	\N	2026-10-09 01:13:18.944-04	2026-10-09 01:13:18.944-04
10	1	industria	industria	3	\N	\N	\N	3	t	activo	\N	2026-10-09 01:13:58.935-04	2026-10-09 01:13:58.935-04
11	1	industria	industria	4	\N	\N	\N	4	t	activo	\N	2026-10-09 01:14:10.698-04	2026-10-09 01:14:10.698-04
12	1	servicio	servicio	1	\N	\N	\N	1	t	activo	\N	2026-10-09 01:14:59.172-04	2026-10-09 01:14:59.172-04
13	1	servicio	servicio	2	\N	\N	\N	2	t	activo	\N	2026-10-09 01:15:10.02-04	2026-10-09 01:15:10.02-04
14	1	servicio	servicio	3	\N	\N	\N	3	t	activo	\N	2026-10-09 01:15:28.542-04	2026-10-09 01:15:28.542-04
15	1	servicio	servicio	4	\N	\N	\N	4	t	activo	\N	2026-10-09 01:15:47.093-04	2026-10-09 01:15:47.093-04
16	1	red_social	\N	\N	Facebook	https://www.facebook.com/profile.php?id=61594099740087	fa-facebook-f	1	t	activo	\N	2026-10-09 01:18:58.086-04	2026-10-09 01:18:58.086-04
17	1	red_social	\N	\N	Instagram	https://www.instagram.com/correas.center.central.scz/	fa-instagram	2	t	activo	\N	2026-10-09 01:20:07.902-04	2026-10-09 01:20:07.902-04
\.


--
-- TOC entry 5392 (class 0 OID 26588)
-- Dependencies: 245
-- Data for Name: industria_asignacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industria_asignacion (id, industria_id, tipo_registro, registro_id, orden, estado, creado_en, actualizado_en) FROM stdin;
\.


--
-- TOC entry 5388 (class 0 OID 26547)
-- Dependencies: 241
-- Data for Name: industrias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industrias (id, empresa_id, nombre, slug, imagen, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	Industria Alimenticia	industria-alimenticia	http://localhost:5173/api/public/catalogo/imagenes/industrias/b1ed9882-d39f-4e45-ab7c-a9aba62d11f7.png	1	activo	\N	2026-10-01 16:17:26.215-04	2026-10-05 14:08:32.473-04
2	1	Agroindustrial	agroindustrial	http://localhost:5173/api/public/catalogo/imagenes/industrias/c8a0d443-7453-4aeb-b16c-33aa2e60852b.png	2	activo	\N	2026-10-01 16:17:38.534-04	2026-10-05 14:08:47.7-04
4	1	Industria Metalúrgica	industria-metalurgica	http://localhost:5173/api/public/catalogo/imagenes/industrias/4cca0759-84b5-4941-8849-1ab8a929e586.png	4	activo	\N	2026-10-01 16:18:07.786-04	2026-10-05 14:09:17.028-04
5	1	Petróleo y Gas	petroleo-y-gas	http://localhost:5173/api/public/catalogo/imagenes/industrias/c772fd4e-b4b2-4ab0-92ce-adf81aa33c90.png	5	activo	\N	2026-10-01 16:18:19.677-04	2026-10-05 14:09:30.84-04
3	1	Industria Minera	industria-minera	http://localhost:5173/api/public/catalogo/imagenes/industrias/e322d077-a88c-4572-a9d9-4bf8aa470dc7.png	3	activo	\N	2026-10-01 16:17:54.088-04	2026-10-05 14:10:16.937-04
9	1	Logística	logistica	http://localhost:5173/api/public/catalogo/imagenes/industrias/b40a8e83-a9ec-49e6-8b4e-e5edb652d81f.png	9	activo	\N	2026-10-01 16:19:20.606-04	2026-10-05 14:11:07.627-04
8	1	Transporte	transporte	http://localhost:5173/api/public/catalogo/imagenes/industrias/9e19fe68-7941-4e5d-a097-4ba8b459b95c.png	8	activo	\N	2026-10-01 16:19:09.242-04	2026-10-05 14:11:50.425-04
6	1	Manufactura	manufactura	http://localhost:5173/api/public/catalogo/imagenes/industrias/7ba458c9-6583-41db-a655-7537007aef9d.png	6	activo	\N	2026-10-01 16:18:34.384-04	2026-10-05 14:12:06.177-04
7	1	Construcción	construccion	http://localhost:5173/api/public/catalogo/imagenes/industrias/cce53e35-59ad-4ad5-a9bf-a8167830e07c.png	7	activo	\N	2026-10-01 16:18:54.695-04	2026-10-05 14:12:20.043-04
\.


--
-- TOC entry 5425 (class 0 OID 26941)
-- Dependencies: 278
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leads (id, empresa_id, contacto_id, responsable_id, estado, creado_en, actualizado_en, eliminado_en) FROM stdin;
\.


--
-- TOC entry 5378 (class 0 OID 26445)
-- Dependencies: 231
-- Data for Name: marcas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marcas (id, nombre, slug, logo, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	JASON MEGADYNE	jason-megadyne	http://localhost:5173/api/public/catalogo/imagenes/marcas/768768bd-9d85-4c13-8764-2b163dfb7ed5.png	1	activo	\N	2026-09-29 15:29:14.249-04	2026-10-01 13:52:31.131-04
14	SKF	skf	http://localhost:5173/api/public/catalogo/imagenes/marcas/2e615859-2f0f-4f04-8ecc-0197f256ad79.png	2	activo	\N	2026-10-05 14:30:14.709-04	2026-10-05 14:30:14.709-04
15	ARCA	arca	http://localhost:5173/api/public/catalogo/imagenes/marcas/cbc86015-0142-4057-a164-c4ca2e4b7d7d.png	4	activo	\N	2026-10-05 14:30:59.425-04	2026-10-05 14:30:59.425-04
11	F&D	f-d	http://localhost:5173/api/public/catalogo/imagenes/marcas/eed29656-94a0-44f3-9609-e2f67cf5a869.png	20	activo	\N	2026-10-05 14:26:37.846-04	2026-10-05 14:31:37.021-04
16	HERCULES	hercules	http://localhost:5173/api/public/catalogo/imagenes/marcas/65156082-eec5-4861-af34-5e9f3b33c5ec.png	18	activo	\N	2026-10-05 14:32:48.344-04	2026-10-05 14:32:48.344-04
17	WORLD GASKET	world-gasket	http://localhost:5173/api/public/catalogo/imagenes/marcas/c7a8f706-ebf5-4f81-90fe-71a9ce8a19bd.png	19	activo	\N	2026-10-05 14:33:45.261-04	2026-10-05 14:33:45.261-04
18	TOP-Q	top-q	http://localhost:5173/api/public/catalogo/imagenes/marcas/6387bef8-35c5-4a42-aa4e-e0a8ac905a53.png	23	activo	\N	2026-10-05 14:34:31.639-04	2026-10-05 14:34:31.639-04
19	GMORS	gmors	http://localhost:5173/api/public/catalogo/imagenes/marcas/d7c8fd6b-c6fb-413e-b234-9b7d43c47b0f.png	17	activo	\N	2026-10-05 14:34:54.667-04	2026-10-05 14:34:54.667-04
6	GATES	gates	http://localhost:5173/api/public/catalogo/imagenes/marcas/b4ef88d0-6edd-4bbc-8a32-ea4582c711a2.png	11	activo	\N	2026-10-05 14:22:10.864-04	2026-10-05 14:35:21.659-04
3	ABIX	abix	http://localhost:5173/api/public/catalogo/imagenes/marcas/4a64fee1-cd59-4b82-ab09-ffa3d8354aa7.png	12	activo	\N	2026-10-05 14:19:22.624-04	2026-10-05 14:35:39.546-04
2	MITSUBA	mitsuba	http://localhost:5173/api/public/catalogo/imagenes/marcas/b51757ee-eb3f-473b-878d-1427aba74263.png	10	activo	\N	2026-10-05 14:18:28.112-04	2026-10-05 14:35:52.098-04
5	PERFECT POWER	perfect-power	http://localhost:5173/api/public/catalogo/imagenes/marcas/08bdbd1e-cccf-458d-ac30-506a88e795cc.png	9	activo	\N	2026-10-05 14:21:21.544-04	2026-10-05 14:36:07.217-04
20	SAV	sav	http://localhost:5173/api/public/catalogo/imagenes/marcas/a12f7e38-ec8d-469f-a44d-4c79a29f9371.png	3	activo	\N	2026-10-05 14:36:46.167-04	2026-10-05 14:36:46.167-04
8	INA	ina	http://localhost:5173/api/public/catalogo/imagenes/marcas/20c942a0-78df-4386-a874-84563590f96f.png	6	activo	\N	2026-10-05 14:23:51.843-04	2026-10-05 14:36:56.215-04
7	FAG	fag	http://localhost:5173/api/public/catalogo/imagenes/marcas/7799276a-44fb-4ec6-96ae-f78dcc0fbebb.png	5	activo	\N	2026-10-05 14:22:50.985-04	2026-10-05 14:37:06.061-04
9	NSK	nsk	http://localhost:5173/api/public/catalogo/imagenes/marcas/401666c5-1ce3-4de1-a2ae-fb6f2552154e.png	7	activo	\N	2026-10-05 14:24:31.449-04	2026-10-05 14:37:21.786-04
10	NTN	ntn	http://localhost:5173/api/public/catalogo/imagenes/marcas/2e0f3f15-cfeb-43bc-9782-ead8f8a73b7f.png	8	activo	\N	2026-10-05 14:24:59.621-04	2026-10-05 14:41:15.295-04
4	PIX	pix	http://localhost:5173/api/public/catalogo/imagenes/marcas/e018cb4d-4fd4-4102-9661-04e9d5cea237.png	13	activo	\N	2026-10-05 14:19:56.063-04	2026-10-05 14:41:27.166-04
13	KFB	kfb	http://localhost:5173/api/public/catalogo/imagenes/marcas/d644e292-2adb-4136-8602-668c080089ac.png	22	activo	\N	2026-10-05 14:28:27.011-04	2026-10-05 14:41:44.649-04
21	PABOVI	pabovi	http://localhost:5173/api/public/catalogo/imagenes/marcas/765137eb-bb89-4eba-b89c-495114429985.png	15	activo	\N	2026-10-05 14:42:27.953-04	2026-10-05 14:42:27.953-04
22	ZMTE	zmte	http://localhost:5173/api/public/catalogo/imagenes/marcas/c95646b2-d202-4dba-83f6-772ddcc53aee.png	14	activo	\N	2026-10-05 14:43:02.653-04	2026-10-05 14:43:02.653-04
12	FBJ	fbj	http://localhost:5173/api/public/catalogo/imagenes/marcas/547e0f06-b203-4460-88bb-0a0a8bf8cf8b.png	21	activo	\N	2026-10-05 14:27:49.236-04	2026-10-05 14:43:17.768-04
23	APC	apc	http://localhost:5173/api/public/catalogo/imagenes/marcas/f1225df0-5e35-480d-b399-9c3aa39f9862.png	16	activo	\N	2026-10-05 14:44:02.336-04	2026-10-05 14:44:02.336-04
\.


--
-- TOC entry 5404 (class 0 OID 26721)
-- Dependencies: 257
-- Data for Name: menu_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item (id, menu_id, ruta, orden, estado, eliminado_en, creado_en, actualizado_en, nombre, categoria_id) FROM stdin;
4	2	/products/rodamientos/rigidos-de-bolas/	1	activo	\N	2026-10-08 22:08:25.153-04	2026-10-08 22:08:25.153	Rodamientos Rígidos de Bolas	9
1	1	/products/correas/trapezoidales/	1	activo	\N	2026-10-08 21:33:15.622-04	2026-10-08 21:33:15.622	Correas en V	1
2	1	/products/correas/sincronas/	2	activo	\N	2026-10-08 21:34:33.846-04	2026-10-08 21:34:33.846	Correas Sincronas	3
3	1	/products/correas/acanaladas/	3	activo	\N	2026-10-08 21:35:01.911-04	2026-10-08 21:35:01.911	Correas Acanaladas	4
\.


--
-- TOC entry 5402 (class 0 OID 26695)
-- Dependencies: 255
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menus (id, empresa_id, grupo, tipo_registro, registro_id, ruta, icono, mostrar, orden, estado, eliminado_en, creado_en, actualizado_en, cargar_submenu) FROM stdin;
3	1	Producto	producto	3	/products/retenes-sellos-y-o-rings/	Package	t	3	activo	\N	2026-10-07 13:58:48.405-04	2026-10-07 13:58:48.405-04	inactivo
4	1	Producto	producto	4	/products/cadenas/	Package	t	4	activo	\N	2026-10-07 13:59:09.597-04	2026-10-07 13:59:09.597-04	inactivo
5	1	Producto	producto	5	/products/bandas-transportadoras-pesadas/	Package	t	5	activo	\N	2026-10-07 14:00:40.231-04	2026-10-07 14:00:40.231-04	inactivo
6	1	Producto	producto	6	/products/bandas-transportadoras-livianas/	Package	t	6	activo	\N	2026-10-07 14:02:11.25-04	2026-10-07 14:02:11.25-04	inactivo
7	1	Producto	producto	7	/products/niples-conexiones-y-conectores/	Package	t	7	activo	\N	2026-10-07 14:02:22.731-04	2026-10-07 14:02:22.731-04	inactivo
8	1	Producto	producto	8	/products/poleas/	Package	t	8	activo	\N	2026-10-07 14:02:39.946-04	2026-10-07 14:02:39.946-04	inactivo
9	1	Producto	producto	9	/products/pinones/	Package	t	9	activo	\N	2026-10-07 14:02:55.826-04	2026-10-07 14:02:55.826-04	inactivo
10	1	Producto	producto	10	/products/mangueras/	Package	t	10	activo	\N	2026-10-07 14:03:07.252-04	2026-10-07 14:03:13.408-04	inactivo
11	1	Producto	producto	11	/products/cilindros/	Package	t	11	activo	\N	2026-10-07 14:03:25.78-04	2026-10-07 14:03:25.78-04	\N
13	1	Producto	producto	13	/products/cardanes/	Package	t	13	activo	\N	2026-10-07 14:03:56.708-04	2026-10-07 14:03:56.708-04	inactivo
12	1	Producto	producto	12	/products/cangilones/	Package	t	12	activo	\N	2026-10-07 14:03:44.521-04	2026-10-07 14:04:00.26-04	inactivo
14	1	Producto	producto	14	/products/cajas-de-comandos/	Package	t	14	activo	\N	2026-10-07 14:04:16.656-04	2026-10-07 14:04:16.656-04	inactivo
15	1	Producto	producto	15	/products/abrazaderas/	Package	t	15	activo	\N	2026-10-07 14:04:44.117-04	2026-10-07 14:04:44.117-04	inactivo
1	1	Producto	producto	1	/products/correas/	Package	t	1	activo	\N	2026-10-07 13:07:14.442-04	2026-10-08 21:35:01.911-04	inactivo
2	1	Producto	producto	2	/products/rodamientos/	Package	t	2	activo	\N	2026-10-07 13:58:24.261-04	2026-10-08 22:08:25.153-04	inactivo
16	1	Aplicacion	industria	1	/applications/industria-alimenticia/	Factory	t	1	activo	\N	2026-10-09 00:23:52.563-04	2026-10-09 00:23:52.563-04	inactivo
17	1	Aplicacion	industria	2	/applications/agroindustrial/	Factory	t	2	activo	\N	2026-10-09 00:24:09.798-04	2026-10-09 00:24:09.798-04	inactivo
18	1	Aplicacion	industria	3	/applications/industria-minera/	Factory	t	3	activo	\N	2026-10-09 00:24:25.858-04	2026-10-09 00:24:25.858-04	inactivo
19	1	Aplicacion	industria	4	/applications/industria-metalurgica/	Factory	t	4	activo	\N	2026-10-09 00:24:44.472-04	2026-10-09 00:24:44.472-04	inactivo
20	1	Aplicacion	industria	5	/applications/petroleo-y-gas/	Factory	t	5	activo	\N	2026-10-09 00:24:58.46-04	2026-10-09 00:24:58.46-04	inactivo
21	1	Aplicacion	industria	6	/applications/manufactura/	Factory	t	6	activo	\N	2026-10-09 00:25:16.802-04	2026-10-09 00:25:16.802-04	inactivo
22	1	Aplicacion	industria	7	/applications/construccion/	Factory	t	7	activo	\N	2026-10-09 00:25:28.633-04	2026-10-09 00:25:28.633-04	inactivo
23	1	Aplicacion	industria	8	/applications/transporte/	Factory	t	8	activo	\N	2026-10-09 00:25:48.317-04	2026-10-09 00:25:48.317-04	inactivo
24	1	Aplicacion	industria	9	/applications/logistica/	Factory	t	9	activo	\N	2026-10-09 00:25:58.735-04	2026-10-09 00:25:58.735-04	inactivo
25	1	Servicio	servicio	1	/services/fabricacion-de-sellos-skf/	Wrench	t	1	activo	\N	2026-10-09 00:27:31.581-04	2026-10-09 00:27:31.581-04	inactivo
26	1	Servicio	servicio	2	/services/prensado-de-mangueras/	Wrench	t	2	activo	\N	2026-10-09 00:27:42.099-04	2026-10-09 00:27:42.099-04	inactivo
27	1	Servicio	servicio	3	/services/reparacion-de-cilindros/	Wrench	t	3	activo	\N	2026-10-09 00:27:51.137-04	2026-10-09 00:27:51.137-04	inactivo
28	1	Servicio	servicio	4	/services/fabricacion-de-o-rings/	Wrench	t	4	activo	\N	2026-10-09 00:28:00.271-04	2026-10-09 00:28:00.271-04	inactivo
29	1	Servicio	servicio	5	/services/asesoria-tecnica-industrial/	Wrench	t	5	activo	\N	2026-10-09 00:28:35.074-04	2026-10-09 00:28:35.074-04	inactivo
30	1	Servicio	servicio	6	/services/empalmes-y-montaje-de-bandas/	Wrench	t	6	activo	\N	2026-10-09 00:28:54.33-04	2026-10-09 00:28:54.33-04	inactivo
\.


--
-- TOC entry 5408 (class 0 OID 26763)
-- Dependencies: 261
-- Data for Name: pasos_wizard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pasos_wizard (id, empresa_id, identificador, titulo, descripcion, fuente_datos, campo_filtro, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	industria	¿En qué industria trabajas?	Selecciona tu sector para recomendarte los mejores productos	industrias	\N	1	activo	\N	2026-10-09 14:11:37.365-04	2026-10-09 14:11:37.365-04
2	1	producto	¿Qué tipo de producto necesitas?	Elige la categoría principal de producto	productos	\N	2	activo	\N	2026-10-09 14:12:26.711-04	2026-10-09 14:12:26.711-04
\.


--
-- TOC entry 5413 (class 0 OID 26824)
-- Dependencies: 266
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfiles (id, nombre_completo, telefono, avatar_url, estado, eliminado_en, creado_en, actualizado_en, email, email_verified_at) FROM stdin;
48aa7abf-0acb-47b5-bd73-172aaec874f1	Superadministrador	\N	\N	activo	\N	2026-09-25 05:15:23.323-04	2026-09-26 12:47:49.921-04	admin@correascenter.com	2026-09-25 05:15:23.321-04
0798a4a0-61af-40b0-a7a3-94b7c602648e	Prueba	\N	\N	activo	\N	2026-09-26 15:48:59.124-04	2026-09-28 03:14:00.217-04	prueba@gmail.com	2026-09-26 15:48:59.12-04
\.


--
-- TOC entry 5417 (class 0 OID 26860)
-- Dependencies: 270
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permisos (id, nombre, slug, grupo, descripcion, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	Ver roles	iam.roles.read	iam	\N	activo	\N	2026-09-25 05:15:23.007-04	2026-09-25 05:15:23.007-04
2	Crear roles	iam.roles.create	iam	\N	activo	\N	2026-09-25 05:15:23.04-04	2026-09-25 05:15:23.04-04
3	Editar roles	iam.roles.update	iam	\N	activo	\N	2026-09-25 05:15:23.051-04	2026-09-25 05:15:23.051-04
4	Desactivar roles	iam.roles.delete	iam	\N	activo	\N	2026-09-25 05:15:23.057-04	2026-09-25 05:15:23.057-04
5	Ver permisos	iam.permisos.read	iam	\N	activo	\N	2026-09-25 05:15:23.063-04	2026-09-25 05:15:23.063-04
6	Crear permisos	iam.permisos.create	iam	\N	activo	\N	2026-09-25 05:15:23.068-04	2026-09-25 05:15:23.068-04
7	Editar permisos	iam.permisos.update	iam	\N	activo	\N	2026-09-25 05:15:23.076-04	2026-09-25 05:15:23.076-04
8	Desactivar permisos	iam.permisos.delete	iam	\N	activo	\N	2026-09-25 05:15:23.082-04	2026-09-25 05:15:23.082-04
9	Ver usuarios	iam.usuarios.read	iam	\N	activo	\N	2026-09-25 05:15:23.088-04	2026-09-25 05:15:23.088-04
10	Crear usuarios	iam.usuarios.create	iam	\N	activo	\N	2026-09-25 05:15:23.094-04	2026-09-25 05:15:23.094-04
11	Editar usuarios	iam.usuarios.update	iam	\N	activo	\N	2026-09-25 05:15:23.1-04	2026-09-25 05:15:23.1-04
12	Desactivar usuarios	iam.usuarios.delete	iam	\N	activo	\N	2026-09-25 05:15:23.106-04	2026-09-25 05:15:23.106-04
13	Ver sesiones	iam.sesiones.read	iam	\N	activo	\N	2026-09-25 05:15:23.112-04	2026-09-25 05:15:23.112-04
14	Revocar sesiones	iam.sesiones.revoke	iam	\N	activo	\N	2026-09-25 05:15:23.117-04	2026-09-25 05:15:23.117-04
15	Ver auditoría	iam.auditoria.read	iam	\N	activo	\N	2026-09-25 05:15:23.123-04	2026-09-25 05:15:23.123-04
16	Ver productos	catalog.productos.read	catalog	\N	activo	\N	2026-09-25 05:15:23.13-04	2026-09-25 05:15:23.13-04
17	Gestionar productos	catalog.productos.manage	catalog	\N	activo	\N	2026-09-25 05:15:23.136-04	2026-09-25 05:15:23.136-04
18	Ver categorías	catalog.categorias.read	catalog	\N	activo	\N	2026-09-25 05:15:23.141-04	2026-09-25 05:15:23.141-04
19	Gestionar categorías	catalog.categorias.manage	catalog	\N	activo	\N	2026-09-25 05:15:23.147-04	2026-09-25 05:15:23.147-04
20	Ver marcas	catalog.marcas.read	catalog	\N	activo	\N	2026-09-25 05:15:23.153-04	2026-09-25 05:15:23.153-04
21	Gestionar marcas	catalog.marcas.manage	catalog	\N	activo	\N	2026-09-25 05:15:23.159-04	2026-09-25 05:15:23.159-04
22	Ver atributos técnicos	catalog.atributos.read	catalog	\N	activo	\N	2026-09-25 05:15:23.164-04	2026-09-25 05:15:23.164-04
23	Gestionar atributos técnicos	catalog.atributos.manage	catalog	\N	activo	\N	2026-09-25 05:15:23.169-04	2026-09-25 05:15:23.169-04
24	Ver industrias	catalog.industrias.read	catalog	\N	activo	\N	2026-09-25 05:15:23.174-04	2026-09-25 05:15:23.174-04
25	Gestionar industrias	catalog.industrias.manage	catalog	\N	activo	\N	2026-09-25 05:15:23.179-04	2026-09-25 05:15:23.179-04
26	Ver servicios	catalog.servicios.read	catalog	\N	activo	\N	2026-09-25 05:15:23.184-04	2026-09-25 05:15:23.184-04
27	Gestionar servicios	catalog.servicios.manage	catalog	\N	activo	\N	2026-09-25 05:15:23.189-04	2026-09-25 05:15:23.189-04
28	Ver menús	cms.menus.read	cms	\N	activo	\N	2026-09-25 05:15:23.195-04	2026-09-25 05:15:23.195-04
29	Gestionar menús	cms.menus.manage	cms	\N	activo	\N	2026-09-25 05:15:23.201-04	2026-09-25 05:15:23.201-04
30	Ver footers	cms.footers.read	cms	\N	activo	\N	2026-09-25 05:15:23.206-04	2026-09-25 05:15:23.206-04
31	Gestionar footers	cms.footers.manage	cms	\N	activo	\N	2026-09-25 05:15:23.211-04	2026-09-25 05:15:23.211-04
32	Ver secciones	cms.secciones.read	cms	\N	activo	\N	2026-09-25 05:15:23.216-04	2026-09-25 05:15:23.216-04
33	Gestionar secciones	cms.secciones.manage	cms	\N	activo	\N	2026-09-25 05:15:23.221-04	2026-09-25 05:15:23.221-04
34	Ver registros	cms.registros.read	cms	\N	activo	\N	2026-09-25 05:15:23.23-04	2026-09-25 05:15:23.23-04
35	Gestionar registros	cms.registros.manage	cms	\N	activo	\N	2026-09-25 05:15:23.235-04	2026-09-25 05:15:23.235-04
36	Ver pasos del wizard	cms.wizard.read	cms	\N	activo	\N	2026-09-25 05:15:23.24-04	2026-09-25 05:15:23.24-04
37	Gestionar pasos del wizard	cms.wizard.manage	cms	\N	activo	\N	2026-09-25 05:15:23.244-04	2026-09-25 05:15:23.244-04
38	Ver configuración	cms.configuracion.read	cms	\N	activo	\N	2026-09-25 05:15:23.249-04	2026-09-25 05:15:23.249-04
39	Gestionar configuración	cms.configuracion.manage	cms	\N	activo	\N	2026-09-25 05:15:23.254-04	2026-09-25 05:15:23.254-04
40	Ver empresas	crm.empresas.read	crm	\N	activo	\N	2026-09-25 05:15:23.259-04	2026-09-25 05:15:23.259-04
41	Gestionar empresas	crm.empresas.manage	crm	\N	activo	\N	2026-09-25 05:15:23.263-04	2026-09-25 05:15:23.263-04
42	Ver sucursales	crm.sucursales.read	crm	\N	activo	\N	2026-09-25 05:15:23.267-04	2026-09-25 05:15:23.267-04
43	Gestionar sucursales	crm.sucursales.manage	crm	\N	activo	\N	2026-09-25 05:15:23.271-04	2026-09-25 05:15:23.271-04
44	Ver contactos	crm.contactos.read	crm	\N	activo	\N	2026-09-25 05:15:23.276-04	2026-09-25 05:15:23.276-04
45	Gestionar contactos	crm.contactos.manage	crm	\N	activo	\N	2026-09-25 05:15:23.28-04	2026-09-25 05:15:23.28-04
46	Ver suscriptores	crm.suscriptores.read	crm	\N	activo	\N	2026-09-25 05:15:23.285-04	2026-09-25 05:15:23.285-04
47	Gestionar suscriptores	crm.suscriptores.manage	crm	\N	activo	\N	2026-09-25 05:15:23.292-04	2026-09-25 05:15:23.292-04
48	Ver leads	crm.leads.read	crm	\N	activo	\N	2026-09-25 05:15:23.296-04	2026-09-25 05:15:23.296-04
49	Gestionar leads	crm.leads.manage	crm	\N	activo	\N	2026-09-25 05:15:23.299-04	2026-09-25 05:15:23.299-04
50	Asignar permisos a roles	iam.roles.permisos.assign	iam	\N	activo	\N	2026-09-25 05:15:23.304-04	2026-09-25 05:15:23.304-04
51	Asignar roles a usuarios	iam.usuarios.roles.assign	iam	\N	activo	\N	2026-09-25 05:15:23.307-04	2026-09-25 05:15:23.307-04
52	Agregar Permisos	catalog.asignaciones_marca.manage	catalog	\N	activo	\N	2026-10-01 12:09:39.15365-04	2026-10-01 12:09:39.15365-04
53	Leer marca asignada	catalog.asignaciones_marca.read	catalog	\N	activo	\N	2026-10-01 12:11:37.023568-04	2026-10-01 12:11:37.023568-04
\.


--
-- TOC entry 5380 (class 0 OID 26465)
-- Dependencies: 233
-- Data for Name: producto_marca; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto_marca (id, producto_id, marca_id, estado, creado_en, actualizado_en, orden) FROM stdin;
1	1	1	activo	2026-10-01 16:13:19-04	2026-10-01 16:13:19-04	\N
2	1	2	activo	2026-10-05 16:24:26.716-04	2026-10-05 16:24:26.716-04	\N
3	1	6	activo	2026-10-05 16:24:26.716-04	2026-10-05 16:24:26.716-04	\N
4	1	3	activo	2026-10-05 16:24:26.716-04	2026-10-05 16:24:26.716-04	\N
5	1	4	activo	2026-10-05 16:24:26.716-04	2026-10-05 16:24:26.716-04	\N
6	1	5	activo	2026-10-05 16:24:26.716-04	2026-10-05 16:24:26.716-04	\N
7	1	18	activo	2026-10-05 16:24:26.716-04	2026-10-05 16:24:26.716-04	\N
8	2	7	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
9	2	8	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
10	2	9	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
11	2	10	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
12	2	11	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
13	2	12	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
14	2	13	activo	2026-10-05 16:24:54.27-04	2026-10-05 16:24:54.27-04	\N
15	3	14	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
16	3	20	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
17	3	15	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
18	3	23	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
19	3	19	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
20	3	16	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
21	3	17	activo	2026-10-05 16:25:23.6-04	2026-10-05 16:25:23.6-04	\N
22	4	18	activo	2026-10-05 16:25:39.639-04	2026-10-05 16:25:39.639-04	\N
23	10	21	activo	2026-10-05 16:26:19.646-04	2026-10-05 16:26:19.646-04	\N
24	10	22	activo	2026-10-05 16:26:19.646-04	2026-10-05 16:26:19.646-04	\N
25	15	18	activo	2026-10-05 16:26:37.165-04	2026-10-05 16:26:37.165-04	\N
\.


--
-- TOC entry 5374 (class 0 OID 26403)
-- Dependencies: 227
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, empresa_id, nombre, slug, imagen, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	Correas	correas	http://localhost:5173/api/public/catalogo/imagenes/productos/fd737291-655a-4d20-9766-ee2067f35cb7.png	1	activo	\N	2026-09-29 15:25:31.005-04	2026-10-01 14:14:16.362-04
2	1	Rodamientos	rodamientos	http://localhost:5173/api/public/catalogo/imagenes/productos/11f0feef-63d8-4c2c-bf6f-575a2a1d803a.png	2	activo	\N	2026-10-05 13:12:28.705-04	2026-10-05 13:12:28.705-04
3	1	Retenes, Sellos y O-rings	retenes-sellos-y-o-rings	http://localhost:5173/api/public/catalogo/imagenes/productos/7f36f181-ba6a-4591-abf0-30e2552f6751.png	3	activo	\N	2026-10-05 13:17:13.909-04	2026-10-05 13:17:13.909-04
4	1	Cadenas	cadenas	http://localhost:5173/api/public/catalogo/imagenes/productos/af75bf80-7f54-4472-a2c6-7f03c1bd8ac0.png	4	activo	\N	2026-10-05 13:28:38.715-04	2026-10-05 13:28:38.715-04
5	1	Bandas Transportadoras Pesadas	bandas-transportadoras-pesadas	http://localhost:5173/api/public/catalogo/imagenes/productos/7cca5d27-4bda-465a-8c76-4f15bc949ba4.png	5	activo	\N	2026-10-05 13:30:43.916-04	2026-10-05 13:30:43.916-04
6	1	Bandas Transportadoras Livianas	bandas-transportadoras-livianas	http://localhost:5173/api/public/catalogo/imagenes/productos/66010a64-1c6d-481d-9fbc-0768b7e5b398.png	6	activo	\N	2026-10-05 13:32:59.152-04	2026-10-05 13:32:59.152-04
7	1	Niples, Conexiones y Conectores	niples-conexiones-y-conectores	http://localhost:5173/api/public/catalogo/imagenes/productos/8e037fff-f9d7-4e07-bbc1-0db7540787de.png	7	activo	\N	2026-10-05 13:34:39.738-04	2026-10-05 13:34:39.738-04
8	1	Poleas	poleas	http://localhost:5173/api/public/catalogo/imagenes/productos/9e625c32-f435-44de-a25d-db67798cfa65.png	8	activo	\N	2026-10-05 13:36:29.75-04	2026-10-05 13:36:29.75-04
9	1	Piñones	pinones	http://localhost:5173/api/public/catalogo/imagenes/productos/d7e11e84-6cd2-490a-a791-5aa5b9ce5ba4.png	9	activo	\N	2026-10-05 13:37:59.323-04	2026-10-05 13:38:17.485-04
10	1	Mangueras	mangueras	http://localhost:5173/api/public/catalogo/imagenes/productos/ac257c2c-e1f8-4c90-b5cc-f1a4bb7eaa4d.png	10	activo	\N	2026-10-05 13:39:22.665-04	2026-10-05 13:39:22.665-04
11	1	Cilindros	cilindros	http://localhost:5173/api/public/catalogo/imagenes/productos/84aaaac3-a3d8-42d7-acba-27384d9c8bb1.png	11	activo	\N	2026-10-05 13:41:24.849-04	2026-10-05 13:41:24.849-04
12	1	Cangilones	cangilones	http://localhost:5173/api/public/catalogo/imagenes/productos/1f6d7092-4c0a-47cf-a35c-b1139736145b.png	12	activo	\N	2026-10-05 13:42:49.522-04	2026-10-05 13:42:49.522-04
13	1	Cardanes	cardanes	http://localhost:5173/api/public/catalogo/imagenes/productos/648e9377-a13e-4c52-a96d-c37db143fece.png	13	activo	\N	2026-10-05 13:44:22.36-04	2026-10-05 13:44:22.36-04
14	1	Cajas de Comandos	cajas-de-comandos	http://localhost:5173/api/public/catalogo/imagenes/productos/ec998617-5349-4855-be04-ddfd283f8684.png	14	activo	\N	2026-10-05 14:03:24.217-04	2026-10-05 14:03:24.217-04
15	1	Abrazaderas	abrazaderas	http://localhost:5173/api/public/catalogo/imagenes/productos/967431e9-c100-4acf-a496-6d401027fbce.png	15	activo	\N	2026-10-05 14:05:39.199-04	2026-10-05 14:05:39.199-04
\.


--
-- TOC entry 5400 (class 0 OID 26675)
-- Dependencies: 253
-- Data for Name: registro_contenido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registro_contenido (id, empresa_id, registro_id, titulo, subtitulo, descripcion, icono, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	1	Sobre Nosotros	\N	Líderes en soluciones industriales, hidráulicas, neumáticas y transmisión de potencia en Bolivia	\N	1	activo	\N	2026-10-09 02:56:14.892-04	2026-10-09 02:56:14.892-04
2	1	1	Más de 25 Años de Experiencia	\N	En <span class="font-semibold text-[#EA0A2A]">Correas Center</span>, nos dedicamos a proveer soluciones integrales de transmisión de potencia, sistemas hidráulicos y neumáticos con los más altos estándares de calidad. Contamos con asesoría técnica especializada y servicio personalizado para nuestros clientes en todo Bolivia.	\N	2	eliminado	2026-10-09 02:57:49.276-04	2026-10-09 02:56:46.029-04	2026-10-09 02:57:49.276-04
3	1	2	Más de 25 Años de Experiencia	\N	En <span class="font-semibold text-[#EA0A2A]">Correas Center</span>, nos dedicamos a proveer soluciones integrales de transmisión de potencia, sistemas hidráulicos y neumáticos con los más altos estándares de calidad. Contamos con asesoría técnica especializada y servicio personalizado para nuestros clientes en todo Bolivia.	\N	1	activo	\N	2026-10-09 02:59:24.3-04	2026-10-09 02:59:24.3-04
4	1	3	+25 Años	Experiencia Comprobada	Más de dos décadas liderando el mercado industrial boliviano	Clock	1	activo	\N	2026-10-09 03:00:08.069-04	2026-10-09 03:00:08.069-04
5	1	3	SKF	Licencia Exclusiva	Únicos autorizados para fabricar sellos SKF en Bolivia	Award	2	activo	\N	2026-10-09 03:01:11.895-04	2026-10-09 03:01:11.895-04
6	1	3	10,000+	Productos en Stock	Amplio inventario para entregas inmediatas	Package	3	activo	\N	2026-10-09 03:01:46.072-04	2026-10-09 03:01:46.072-04
7	1	3	24/7	Soporte Técnico	Asesoría especializada cuando la necesites	HeadphonesIcon	4	activo	\N	2026-10-09 03:02:21.318-04	2026-10-09 03:02:21.318-04
8	1	3	4	Sucursales	Cobertura nacional para estar cerca de ti	MapPin	5	activo	\N	2026-10-09 03:02:50.874-04	2026-10-09 03:02:50.874-04
9	1	3	100%	Atención Personalizada	Soluciones a medida para cada cliente	Users	6	activo	\N	2026-10-09 03:03:28.997-04	2026-10-09 03:03:28.997-04
10	1	4	Visión	\N	Ser la empresa líder en soluciones industriales, hidráulicas y neumáticas en Bolivia, reconocida por nuestra calidad, servicio técnico especializado y compromiso con el desarrollo industrial del país.	Eye	1	activo	\N	2026-10-09 03:04:07.586-04	2026-10-09 03:04:07.586-04
11	1	4	Misión	\N	Proveer soluciones integrales de transmisión de potencia, sistemas hidráulicos y neumáticos con los más altos estándares de calidad, brindando asesoría técnica especializada y servicio personalizado a nuestros clientes.	Target	2	activo	\N	2026-10-09 03:04:29.638-04	2026-10-09 03:04:29.638-04
12	1	4	Valores	\N	Ética decidida, integridad, compromiso, calidad, innovación, servicio al cliente, responsabilidad social y trabajo en equipo.	Heart	3	activo	\N	2026-10-09 03:04:55.135-04	2026-10-09 03:04:55.135-04
13	1	5	Calidad Garantizada	\N	Productos de las mejores marcas internacionales con garantía de calidad	CheckCircle2	1	activo	\N	2026-10-09 03:11:06.479-04	2026-10-09 03:11:06.479-04
14	1	5	Asesoría Técnica Especializada	\N	Equipo técnico capacitado para brindarte la mejor solución	CheckCircle2	2	activo	\N	2026-10-09 03:11:28.321-04	2026-10-09 03:11:28.321-04
15	1	5	Cobertura Nacional	\N	4 sucursales estratégicamente ubicadas para atenderte mejor	CheckCircle2	3	activo	\N	2026-10-09 03:11:56.376-04	2026-10-09 03:11:56.376-04
16	1	5	Entregas Rápidas	\N	Amplio inventario para entregas inmediatas en todo Bolivia	CheckCircle2	4	activo	\N	2026-10-09 03:12:28.262-04	2026-10-09 03:12:28.262-04
17	1	5	Fabricante Autorizado SKF	\N	Únicos autorizados para fabricar sellos SKF en Bolivia	CheckCircle2	5	activo	\N	2026-10-09 03:13:00.739-04	2026-10-09 03:13:00.739-04
18	1	5	Servicio Personalizado	\N	Soluciones a medida para cada cliente y cada industria	CheckCircle2	6	activo	\N	2026-10-09 03:13:34.242-04	2026-10-09 03:13:34.242-04
19	1	6	1999	Fundación	La empresa CORREAS CENTER LTDA. fue fundada en la ciudad de Santa Cruz – Bolivia en el año 1999 por el Gerente General y Propietario el Señor Joel Jessen Arrien.	Calendar	1	activo	\N	2026-10-09 03:14:20.69-04	2026-10-09 03:14:20.69-04
\.


--
-- TOC entry 5398 (class 0 OID 26655)
-- Dependencies: 251
-- Data for Name: registros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registros (id, identificador, nombre, descripcion, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	header	Sobre Nosotros	Líderes en soluciones industriales, hidráulicas, neumáticas y transmisión de potencia en Bolivia	1	activo	\N	2026-10-09 00:12:40.499-04	2026-10-09 00:12:40.499-04
2	introduccion	Más de 25 Años de Experiencia	En <span class="font-semibold text-[#EA0A2A]">Correas Center</span>, nos dedicamos a proveer soluciones integrales de transmisión de potencia, sistemas hidráulicos y neumáticos con los más altos estándares de calidad. Contamos con asesoría técnica especializada y servicio personalizado para nuestros clientes en todo Bolivia.	2	activo	\N	2026-10-09 00:13:05.785-04	2026-10-09 00:13:05.785-04
3	estadisticas	Nuestras Estadísticas	Cifras que respaldan nuestra trayectoria	3	activo	\N	2026-10-09 00:13:29.767-04	2026-10-09 00:13:29.767-04
4	filosofia	Nuestra Filosofía Corporativa	Los principios que guían nuestro trabajo diario	4	activo	\N	2026-10-09 00:13:55.838-04	2026-10-09 00:13:55.838-04
5	porque_elegirnos	¿Por Qué Elegirnos?	Compromiso, calidad y experiencia al servicio de tu industria	5	activo	\N	2026-10-09 00:14:19.933-04	2026-10-09 00:14:19.933-04
6	timeline	Nuestra Historia	Un recorrido por los hitos más importantes de nuestra trayectoria	6	activo	\N	2026-10-09 00:14:47.651-04	2026-10-09 00:14:47.651-04
\.


--
-- TOC entry 5418 (class 0 OID 26878)
-- Dependencies: 271
-- Data for Name: rol_permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol_permiso (rol_id, permiso_id, creado_en, estado) FROM stdin;
2	11	2026-09-26 05:40:33.63-04	activo
2	8	2026-09-26 05:40:14.857-04	activo
2	4	2026-09-26 05:40:20.737-04	activo
2	23	2026-09-26 05:40:35.08-04	activo
2	19	2026-09-26 05:40:35.766-04	activo
2	18	2026-09-26 05:41:08.027-04	activo
2	44	2026-09-26 05:41:10.219-04	activo
2	15	2026-09-26 05:41:08.59-04	activo
2	22	2026-09-26 05:41:05.35-04	activo
2	12	2026-09-26 05:40:21.789-04	activo
2	7	2026-09-26 05:40:22.653-04	activo
2	25	2026-09-26 05:40:44.32-04	activo
2	40	2026-09-26 05:41:10.762-04	activo
2	51	2026-09-26 05:39:58.799-04	activo
2	43	2026-09-26 05:41:03.192-04	activo
2	47	2026-09-26 05:41:04.228-04	activo
2	14	2026-09-26 05:41:04.813-04	activo
2	38	2026-09-26 05:41:09.424-04	activo
2	6	2026-09-26 05:39:59.889-04	activo
2	10	2026-09-26 05:40:13.888-04	activo
2	50	2026-09-26 05:39:57.686-04	activo
2	30	2026-09-26 05:41:14.272-04	activo
2	39	2026-09-26 05:40:39.208-04	activo
2	37	2026-09-26 05:40:58.414-04	activo
2	45	2026-09-26 05:40:39.646-04	activo
2	41	2026-09-26 05:40:42.892-04	activo
2	29	2026-09-26 05:40:55.543-04	activo
2	33	2026-09-26 05:41:00.26-04	activo
2	27	2026-09-26 05:41:02.741-04	activo
2	31	2026-09-26 05:40:43.66-04	activo
2	24	2026-09-26 05:41:14.693-04	activo
2	49	2026-09-26 05:40:44.84-04	activo
2	2	2026-09-26 05:40:12.267-04	activo
2	17	2026-09-26 05:40:59.033-04	activo
2	35	2026-09-26 05:40:59.644-04	activo
2	48	2026-09-26 05:41:15.421-04	activo
2	3	2026-09-26 05:40:32.628-04	activo
2	21	2026-09-26 05:40:45.848-04	activo
2	20	2026-09-26 05:41:15.904-04	activo
2	28	2026-09-26 05:41:16.348-04	activo
2	36	2026-09-26 05:41:18.619-04	activo
2	5	2026-09-26 05:41:19.67-04	activo
2	16	2026-09-26 05:41:20.257-04	activo
2	34	2026-09-26 05:41:20.82-04	activo
1	1	2026-09-25 05:15:23.031-04	activo
1	2	2026-09-25 05:15:23.047-04	activo
1	3	2026-09-25 05:15:23.054-04	activo
1	4	2026-09-25 05:15:23.059-04	activo
1	5	2026-09-25 05:15:23.065-04	activo
1	6	2026-09-25 05:15:23.072-04	activo
1	7	2026-09-25 05:15:23.079-04	activo
1	8	2026-09-25 05:15:23.085-04	activo
1	9	2026-09-25 05:15:23.091-04	activo
1	10	2026-09-25 05:15:23.097-04	activo
1	11	2026-09-25 05:15:23.103-04	activo
1	12	2026-09-25 05:15:23.108-04	activo
1	13	2026-09-25 05:15:23.114-04	activo
1	14	2026-09-25 05:15:23.119-04	activo
1	15	2026-09-25 05:15:23.126-04	activo
1	16	2026-09-25 05:15:23.133-04	activo
1	17	2026-09-25 05:15:23.138-04	activo
1	18	2026-09-25 05:15:23.144-04	activo
1	19	2026-09-25 05:15:23.15-04	activo
1	20	2026-09-25 05:15:23.155-04	activo
1	21	2026-09-25 05:15:23.161-04	activo
1	22	2026-09-25 05:15:23.166-04	activo
1	23	2026-09-25 05:15:23.171-04	activo
1	24	2026-09-25 05:15:23.176-04	activo
1	25	2026-09-25 05:15:23.181-04	activo
1	26	2026-09-25 05:15:23.186-04	activo
1	27	2026-09-25 05:15:23.192-04	activo
1	28	2026-09-25 05:15:23.198-04	activo
1	29	2026-09-25 05:15:23.203-04	activo
1	30	2026-09-25 05:15:23.208-04	activo
1	31	2026-09-25 05:15:23.213-04	activo
1	32	2026-09-25 05:15:23.218-04	activo
1	33	2026-09-25 05:15:23.223-04	activo
1	34	2026-09-25 05:15:23.232-04	activo
1	35	2026-09-25 05:15:23.237-04	activo
1	36	2026-09-25 05:15:23.242-04	activo
1	37	2026-09-25 05:15:23.246-04	activo
1	38	2026-09-25 05:15:23.251-04	activo
1	39	2026-09-25 05:15:23.256-04	activo
1	40	2026-09-25 05:15:23.261-04	activo
1	41	2026-09-25 05:15:23.265-04	activo
2	1	2026-09-26 05:41:23.822-04	activo
2	32	2026-09-26 05:41:24.399-04	activo
2	26	2026-09-26 05:41:24.979-04	activo
2	13	2026-09-26 05:41:25.453-04	activo
2	42	2026-09-26 05:41:26.015-04	activo
2	46	2026-09-26 05:41:26.494-04	activo
2	9	2026-09-26 05:41:27.782-04	activo
1	42	2026-09-25 05:15:23.269-04	activo
1	43	2026-09-25 05:15:23.273-04	activo
1	44	2026-09-25 05:15:23.278-04	activo
1	45	2026-09-25 05:15:23.282-04	activo
1	46	2026-09-25 05:15:23.289-04	activo
1	47	2026-09-25 05:15:23.294-04	activo
1	48	2026-09-25 05:15:23.297-04	activo
1	49	2026-09-25 05:15:23.301-04	activo
1	50	2026-09-25 05:15:23.305-04	activo
1	51	2026-09-25 05:15:23.309-04	activo
1	52	2026-10-01 16:09:58.986-04	activo
1	53	2026-10-01 16:13:07.713-04	activo
6	1	2026-09-28 03:12:14.085-04	activo
6	9	2026-09-28 03:12:17.877-04	activo
6	13	2026-09-28 03:12:19.205-04	inactivo
6	45	2026-10-08 13:37:24.023-04	activo
\.


--
-- TOC entry 5415 (class 0 OID 26840)
-- Dependencies: 268
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nombre, slug, descripcion, es_sistema, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
3	Prueba	prueba	Rol de Prueba	f	eliminado	2026-09-26 05:42:40.831-04	2026-09-26 05:41:53.136-04	2026-09-26 05:42:40.831-04
2	Administrador	administrador	Administrador del sistema de CC	f	activo	\N	2026-09-26 05:20:12.303-04	2026-09-26 12:19:42.647-04
1	Superadministrador	super_admin	\N	t	activo	\N	2026-09-25 05:15:22.981-04	2026-10-01 16:13:07.713-04
6	Pruebas	pruebas	Prueba 2	f	activo	\N	2026-09-28 03:11:41.854-04	2026-10-08 13:37:24.023-04
\.


--
-- TOC entry 5390 (class 0 OID 26568)
-- Dependencies: 243
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios (id, empresa_id, nombre, descripcion, imagen, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	Fabricacion de Sellos SKF	Fabricación especializada de sellos y retenes con licencia exclusiva SKF para Bolivia	http://localhost:5173/api/public/catalogo/imagenes/servicios/6e03a4d3-fa33-4a41-b8bd-ce9254747098.png	1	activo	\N	2026-10-01 16:20:03.034-04	2026-10-05 14:14:25.38-04
2	1	Prensado de Mangueras	Prensado profesional de mangueras con equipos de última generación de alta precisión	http://localhost:5173/api/public/catalogo/imagenes/servicios/c2980c83-4a39-4e86-8b1e-f7f2dda48fb3.png	2	activo	\N	2026-10-01 16:20:22.088-04	2026-10-05 14:14:50.174-04
3	1	Reparacion de Cilindros	Reparación y mantenimiento especializado de cilindros hidráulicos y neumáticos	http://localhost:5173/api/public/catalogo/imagenes/servicios/ef1a17a5-e490-41ca-bda7-1a051f35536f.png	3	activo	\N	2026-10-01 16:20:38.665-04	2026-10-05 14:15:18.238-04
4	1	Fabricacion de O-rings	Fabricación de juntas tóricas a medida según especificaciones del cliente	http://localhost:5173/api/public/catalogo/imagenes/servicios/a6a86580-bcce-48a8-b057-ac67efcf8795.png	4	activo	\N	2026-10-01 16:20:59.248-04	2026-10-05 14:15:48.126-04
5	1	Asesoria Tecnica Industrial	Asesoría especializada en selección de productos y soluciones técnicas	http://localhost:5173/api/public/catalogo/imagenes/servicios/dba86946-1d16-4d33-bdb7-6ac7a410bdb0.png	5	activo	\N	2026-10-01 16:21:17.645-04	2026-10-05 14:16:02.41-04
6	1	Empalmes y Montaje de Bandas	Servicio de empalme y montaje de bandas transportadoras	http://localhost:5173/api/public/catalogo/imagenes/servicios/4e1669e7-01cf-4281-a4ed-78c0d28cf876.png	6	activo	\N	2026-10-01 16:21:39.186-04	2026-10-05 14:16:16.601-04
\.


--
-- TOC entry 5424 (class 0 OID 26926)
-- Dependencies: 277
-- Data for Name: sesiones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sesiones (id, usuario_id, huella_token, expira_en, revocada_en, estado, creado_en, actualizado_en, eliminado_en) FROM stdin;
607ae5b1-c9b5-4abf-ae49-7720e632f2ac	48aa7abf-0acb-47b5-bd73-172aaec874f1	8eb9c6065c06f9b81e534b37a3ff99c791438f98bb20e2ee358ed00b45a10dbf	2026-09-25 22:24:11-04	\N	activo	2026-09-25 22:09:11.178-04	2026-09-25 22:09:11.178-04	\N
5cb21340-69bc-4c73-9de2-6e78efcb8c61	48aa7abf-0acb-47b5-bd73-172aaec874f1	b89678fe125f0419b1801b81a4a5e0a16e6cbb28489e1ba0e9426b9b41ab7259	2026-09-25 22:24:34-04	2026-09-25 22:11:22.952-04	inactivo	2026-09-25 22:09:34.699-04	2026-09-25 22:11:22.952-04	\N
24e50031-6604-4bf4-a8e1-2014f9daf2ee	48aa7abf-0acb-47b5-bd73-172aaec874f1	e4672d9497401101782b800c46a895dce969d0c2484234200bad609bcb15bb20	2026-09-25 22:26:39-04	\N	activo	2026-09-25 22:11:39.741-04	2026-09-25 22:11:39.741-04	\N
f33fb0c7-8147-4c33-bcae-92fe65b23bf1	48aa7abf-0acb-47b5-bd73-172aaec874f1	529d9f676258296d4674ba3e318abd59470cda1a5a69c4052012c0397973463b	2026-09-26 01:10:40-04	2026-09-26 00:55:58.112-04	inactivo	2026-09-26 00:55:40.432-04	2026-09-26 00:55:58.112-04	\N
ee145a42-1358-48d4-9800-741817744ab8	48aa7abf-0acb-47b5-bd73-172aaec874f1	e6d7da8f0def8072c418ef094cc46d7153fe870e5327651f0665d163a9f01bc8	2026-09-26 01:13:59-04	2026-09-26 00:59:03.202-04	inactivo	2026-09-26 00:58:59.568-04	2026-09-26 00:59:03.202-04	\N
45334ade-9767-4044-883f-1e4f15b67502	48aa7abf-0acb-47b5-bd73-172aaec874f1	217231f28d1fac3cb7fafbd0b7c59b3cb25faa165343a274ef040157c71d3142	2026-09-26 01:26:09-04	\N	activo	2026-09-26 01:11:09.634-04	2026-09-26 01:11:09.634-04	\N
a993752e-cdb8-4f07-aaaf-466b30fc19da	48aa7abf-0acb-47b5-bd73-172aaec874f1	571ccb198ed8627ff59c9698cc69a276fb5303d814fa96aa16bb1073801c87c6	2026-09-26 01:41:48-04	\N	activo	2026-09-26 01:26:48.123-04	2026-09-26 01:26:48.123-04	\N
492e98d4-4fdd-4373-85a7-9b5baeced0ef	48aa7abf-0acb-47b5-bd73-172aaec874f1	611f4efd064c8b8a62a4f2e88bdc7f4f89fb1cfed450544d2de63dc22d82b05d	2026-09-26 05:24:51-04	\N	activo	2026-09-26 05:09:51.156-04	2026-09-26 05:09:51.156-04	\N
2b668c61-602d-435e-b02d-58688336acfd	48aa7abf-0acb-47b5-bd73-172aaec874f1	9fce8af27557058497aa3a43f7f22e65931854188d7118a659ed69e4c5ebffa1	2026-09-26 05:44:48-04	\N	activo	2026-09-26 05:29:48.542-04	2026-09-26 05:29:48.542-04	\N
61c5df27-e5e1-41ad-bc51-16b155a42366	48aa7abf-0acb-47b5-bd73-172aaec874f1	277ffa684c5d12b57917dd083663181b4f500af58b421f387d8c0b4ad9d67bc2	2026-09-26 06:00:05-04	\N	activo	2026-09-26 05:45:05.287-04	2026-09-26 05:45:05.287-04	\N
ada2ac09-1848-4afe-a7c6-1bf87a76fa40	48aa7abf-0acb-47b5-bd73-172aaec874f1	4ae1871532aa623b74476ff92d61d20954be8ddbf98ada414c96790fde34fa4d	2026-09-26 12:27:45-04	\N	activo	2026-09-26 12:12:45.053-04	2026-09-26 12:12:45.053-04	\N
0356c018-affc-4a5e-b1a6-3ac89cdfe505	48aa7abf-0acb-47b5-bd73-172aaec874f1	afeca6551ea3f6d9e80ccaa5f0c59a6a6272c17dd75c76461a89080bdf211c61	2026-09-26 13:02:25-04	\N	activo	2026-09-26 12:47:25.273-04	2026-09-26 12:47:25.273-04	\N
bf9bad90-354f-4275-ab28-0d0cb29956d3	48aa7abf-0acb-47b5-bd73-172aaec874f1	8f2e77be69438b2b1dffdcb8eb63892ff91df2795739b2d5179a54e2664a324a	2026-09-26 13:21:52-04	\N	activo	2026-09-26 13:06:52.698-04	2026-09-26 13:06:52.698-04	\N
a5f7937b-5247-42f5-954b-85c7e8967424	48aa7abf-0acb-47b5-bd73-172aaec874f1	f4211f059e0bb3520bf028c5dc6cc7951be4752162d1a90924467cbb1c5e1cfb	2026-09-26 13:43:42-04	\N	activo	2026-09-26 13:28:42.823-04	2026-09-26 13:28:42.823-04	\N
7ab089a0-f585-4060-a0c0-5f1ec16d8462	48aa7abf-0acb-47b5-bd73-172aaec874f1	40c3fb7027644cbc2b85e5f3a64a460d48d6ebe7777a08012391bc6aa719e68b	2026-09-26 14:17:21-04	\N	activo	2026-09-26 14:02:21.204-04	2026-09-26 14:02:21.204-04	\N
d3041c6a-87f3-4e25-998c-38072679248e	48aa7abf-0acb-47b5-bd73-172aaec874f1	0c969ae05675c7f1c1345411ad4773764e3909187c7ce93e8a17316d9af334b1	2026-09-26 14:45:15-04	\N	activo	2026-09-26 14:30:15.705-04	2026-09-26 14:30:15.705-04	\N
4c0b09cc-da2d-420a-b1e5-f94592f6617a	48aa7abf-0acb-47b5-bd73-172aaec874f1	24edb4c5723bb18a00fda1f30f7fb5a14e03b6613c6df9752329722cde48e053	2026-09-26 15:05:07-04	\N	activo	2026-09-26 14:50:07.608-04	2026-09-26 14:50:07.608-04	\N
c43e7502-aced-4504-948b-1b742d1159bd	48aa7abf-0acb-47b5-bd73-172aaec874f1	8eb85db83f44ab0a13740ce1e93bd69f7ed54a8d809c8330dc5b79548312969e	2026-09-26 16:02:34-04	\N	activo	2026-09-26 15:47:34.535-04	2026-09-26 15:47:34.535-04	\N
bf4b4ca3-0a4e-4490-a784-6524a4c495e2	0798a4a0-61af-40b0-a7a3-94b7c602648e	5de802b7d67cb9c5ca8b3fb429a0b44ec245803a4cccb378e901cfc00642cbe7	2026-09-26 16:32:40-04	2026-09-26 16:17:59.204-04	inactivo	2026-09-26 16:17:40.515-04	2026-09-26 16:17:59.204-04	\N
94ff70a1-af94-4f45-8869-bca375b3f0be	48aa7abf-0acb-47b5-bd73-172aaec874f1	93571d9245a960ce46fb19cd468df5eb76e13587ef1a0360501af01ed14798e1	2026-09-26 16:33:08-04	2026-09-26 16:18:30.689-04	inactivo	2026-09-26 16:18:08.941-04	2026-09-26 16:18:30.689-04	\N
d1be457b-44bd-441c-9a4e-565f21a57c2a	48aa7abf-0acb-47b5-bd73-172aaec874f1	279250781e34eab359a781e333d76dfb069aa5a2b3c80e91c20caf1d451e08ac	2026-09-26 16:34:41-04	\N	activo	2026-09-26 16:19:41.331-04	2026-09-26 16:19:41.331-04	\N
f015054d-4871-46ba-84b1-c706e240b0b8	48aa7abf-0acb-47b5-bd73-172aaec874f1	3d8c0469325282cadc13fc402d9fbe779d26181e5233e9b718ce42fef97c7705	2026-09-28 03:25:30-04	2026-09-28 03:12:39.569-04	inactivo	2026-09-28 03:10:30.748-04	2026-09-28 03:12:39.569-04	\N
8f64f523-6102-40a2-b3f8-e0253aceea10	48aa7abf-0acb-47b5-bd73-172aaec874f1	b5ecf6acb953979bff944a8dc18f5f048efb5e123098e1c579b20f844743ab0e	2026-09-28 03:28:15-04	2026-09-28 03:14:05.669-04	inactivo	2026-09-28 03:13:15.092-04	2026-09-28 03:14:05.669-04	\N
d9a72b70-5e2a-47c0-90e6-c727c2f508f7	0798a4a0-61af-40b0-a7a3-94b7c602648e	d495ff1e296d9ec48cc58764ac98af9627cf04801e65c396f7fb2b40c114618f	2026-09-28 03:29:18-04	2026-09-28 03:16:20.862-04	inactivo	2026-09-28 03:14:18.473-04	2026-09-28 03:16:20.862-04	\N
68dcd598-1fcf-4941-bc0a-2bc5f187480b	48aa7abf-0acb-47b5-bd73-172aaec874f1	d23e7597acee1b186a63eef88e6f6ccda2496d49525df762e54687a1ca1157aa	2026-09-28 04:11:58-04	2026-09-28 04:01:23.667-04	inactivo	2026-09-28 03:56:58.776-04	2026-09-28 04:01:23.667-04	\N
3fe52689-f4c6-45c0-8c61-ef31b222d58f	48aa7abf-0acb-47b5-bd73-172aaec874f1	ce065ffe168f265969164ba50a6b43398d529db9eedfd2691ebd86f27144e2a9	2026-09-28 12:25:20-04	\N	activo	2026-09-28 12:10:20.029-04	2026-09-28 12:10:20.029-04	\N
ca0910b2-ac28-4e93-9c38-2113af415b08	48aa7abf-0acb-47b5-bd73-172aaec874f1	4df4439541aa31cd916a75c918da7dd629c3ad5ce117966c5501ff37c8c1d4f5	2026-09-28 16:24:34-04	\N	activo	2026-09-28 16:09:34.804-04	2026-09-28 16:09:34.804-04	\N
d51c51b1-951f-4483-a06c-ba71e7ef4887	48aa7abf-0acb-47b5-bd73-172aaec874f1	dc181af6e5896d18e16d9cd99fd2f50cb1a2216443540613f25b0b1c3fbdae6b	2026-09-28 21:29:57-04	2026-09-28 21:15:22.608-04	inactivo	2026-09-28 21:14:57.039-04	2026-09-28 21:15:22.608-04	\N
22718137-d644-4205-9479-087ab3f42a8a	48aa7abf-0acb-47b5-bd73-172aaec874f1	cefa8e5c23e74d2677c1fa8cc1d085a05f034daf2b3217c9d6e0e7bea514314f	2026-09-28 21:37:06-04	\N	activo	2026-09-28 21:22:06.493-04	2026-09-28 21:22:06.493-04	\N
4f67d7fa-5b7a-49c3-8261-aa8bbb8b04ec	48aa7abf-0acb-47b5-bd73-172aaec874f1	32004e21454aa4d5c896f586a557e5d209840ad8897e68307774ca2ecda120ae	2026-09-28 21:52:55-04	\N	activo	2026-09-28 21:37:55.946-04	2026-09-28 21:37:55.946-04	\N
b9b01228-f054-44ad-9960-94b42faca98c	48aa7abf-0acb-47b5-bd73-172aaec874f1	0ca01a79bf0fc4701fb5432ecbd01b1ed82c47b3640c7ba45669d1ec286e4d92	2026-09-29 03:49:19-04	\N	activo	2026-09-29 03:34:19.869-04	2026-09-29 03:34:19.869-04	\N
ea2d7df8-59cf-4301-9d19-272baf236c4f	48aa7abf-0acb-47b5-bd73-172aaec874f1	1b1e9b69fe399671b1b5e5bc1b9b5c77a22d83f9085f62e02a2810b8924adcac	2026-09-29 04:43:21-04	\N	activo	2026-09-29 04:28:21.655-04	2026-09-29 04:28:21.655-04	\N
c077b2da-6a23-405d-a435-8e58242e432c	48aa7abf-0acb-47b5-bd73-172aaec874f1	c137bd70322756b743e4caae27fcee386c86f0faa669bb600ddb6446760e960d	2026-09-29 12:35:11-04	2026-09-29 12:20:49.593-04	inactivo	2026-09-29 12:20:11.806-04	2026-09-29 12:20:49.593-04	\N
062c8b55-9f9c-4eac-a81b-46f92fbb74d8	48aa7abf-0acb-47b5-bd73-172aaec874f1	5512cd311b5c1c37c420fcec3dede04a0b5d88ad7d314623a6e03ac3f622ac6c	2026-09-29 14:32:18-04	\N	activo	2026-09-29 14:17:18.059-04	2026-09-29 14:17:18.059-04	\N
d5a0ab53-a253-4436-aff9-2defb80f17fb	48aa7abf-0acb-47b5-bd73-172aaec874f1	a4b0f2e356ce6d9693193e1df59eb1b36e7f9c7abe5a1c2c6d2210ad1f728fe3	2026-09-29 15:25:36-04	\N	activo	2026-09-29 15:10:36.832-04	2026-09-29 15:10:36.832-04	\N
b8c3c3e6-fd9c-4d61-bec9-6c41a60f480a	48aa7abf-0acb-47b5-bd73-172aaec874f1	9eb77a7738e1e1893df53db9004a79a889b0a04e1a91d6d6fe2a20b7273396c7	2026-09-29 15:40:43-04	\N	activo	2026-09-29 15:25:43.859-04	2026-09-29 15:25:43.859-04	\N
0e0d83fe-0ab2-43a2-a7a2-3fd1a1c057d0	48aa7abf-0acb-47b5-bd73-172aaec874f1	b60a41ee7a41228897f8ea0e31e2a6c4a6e8dcd487a79233d01e274c8f3653ba	2026-09-29 15:56:12-04	\N	activo	2026-09-29 15:41:12.619-04	2026-09-29 15:41:12.619-04	\N
d17b5a1b-65d0-4585-a26d-2e1f0d78926a	48aa7abf-0acb-47b5-bd73-172aaec874f1	a449c9a66d2ff7a4b2c71b86702845ad9db35fc93629c8b828f203fc05c55838	2026-10-01 13:35:46-04	\N	activo	2026-10-01 13:20:46.995-04	2026-10-01 13:20:46.995-04	\N
ff7ebdc5-75c6-49f1-8ea4-8a9c1b186239	48aa7abf-0acb-47b5-bd73-172aaec874f1	2ff9d4476ce1eb99c655573b0f79503fa57f86c2c041df8afcf2771a4e06c6a6	2026-10-01 14:05:57-04	\N	activo	2026-10-01 13:50:57.303-04	2026-10-01 13:50:57.303-04	\N
0af1334f-008a-4076-8aa0-4c9ad50878b0	48aa7abf-0acb-47b5-bd73-172aaec874f1	a11bf4f8e819f7ea88c9b694c8ca3b6ebd53eea42fba4b1702273538bc25053b	2026-10-01 14:24:42-04	\N	activo	2026-10-01 14:09:42.069-04	2026-10-01 14:09:42.069-04	\N
a9fa3c03-400d-4d20-af03-f0999cefc940	48aa7abf-0acb-47b5-bd73-172aaec874f1	76d2bb034720eaa698ce36ea9b9d663ad45ce07c66687c7dd6ffb3d3c06af4e4	2026-10-01 14:51:03-04	2026-10-01 14:42:07.675-04	inactivo	2026-10-01 14:36:03.27-04	2026-10-01 14:42:07.675-04	\N
70db2290-d1ea-4aab-a1ac-7cf6b96a6fba	48aa7abf-0acb-47b5-bd73-172aaec874f1	507090ea4d1bb9a5840a96767ad46feb3bf939cd2f41d7ff60606301b3436aa7	2026-10-01 15:45:44-04	\N	activo	2026-10-01 15:30:44.803-04	2026-10-01 15:30:44.803-04	\N
24bff1f7-c3f2-4c56-b20d-863ea88554b5	48aa7abf-0acb-47b5-bd73-172aaec874f1	16715216448df577f8108d18fe471749d6d528dead3add1ec866d5a13b7b6c36	2026-10-01 16:22:31-04	2026-10-01 16:12:24.83-04	inactivo	2026-10-01 16:07:31.891-04	2026-10-01 16:12:24.83-04	\N
fe0f5491-8c9c-47ff-a78f-9b0d21d9680f	48aa7abf-0acb-47b5-bd73-172aaec874f1	db75a358df2459ee5f4988a23da78a733dd5628c60cfa4863c63e30ce9453580	2026-10-01 16:27:58-04	\N	activo	2026-10-01 16:12:58.05-04	2026-10-01 16:12:58.05-04	\N
46257069-aef5-4693-8e10-db0a1cb9acb6	48aa7abf-0acb-47b5-bd73-172aaec874f1	0d109694c48460ab7180c77741e548a41f2d9b8e5d3777fb899b2724d8148e42	2026-10-05 13:13:42-04	\N	activo	2026-10-05 12:58:42.745-04	2026-10-05 12:58:42.745-04	\N
2312650e-6a56-4d89-8f87-9f70104df77c	48aa7abf-0acb-47b5-bd73-172aaec874f1	28d2eea96f13208b74ca309895000b95d0de1b457967f89f145c837457906593	2026-10-05 13:28:52-04	\N	activo	2026-10-05 13:13:52.064-04	2026-10-05 13:13:52.064-04	\N
0ed62ba4-aaae-461c-85f2-4c579b2c9749	48aa7abf-0acb-47b5-bd73-172aaec874f1	c76b8dd6bc99a9af32397698992ba60bb86eaa35661bc33651d71db88ea728e1	2026-10-05 13:44:30-04	\N	activo	2026-10-05 13:29:30.778-04	2026-10-05 13:29:30.778-04	\N
372e1ac6-e088-40fd-9ed0-f0fd4f52186b	48aa7abf-0acb-47b5-bd73-172aaec874f1	db84008621dbae14969ae1eb93f5c21e01a8944f5c793ebdee7990fda07da847	2026-10-05 13:59:53-04	\N	activo	2026-10-05 13:44:53.914-04	2026-10-05 13:44:53.914-04	\N
e9ecfa15-d45d-400a-be88-b04c0bee1a18	48aa7abf-0acb-47b5-bd73-172aaec874f1	0997726b4ddf5b6fa953ec53971b37b8bfadac02714082859d5eace5ae0fbaef	2026-10-05 14:16:45-04	\N	activo	2026-10-05 14:01:45.715-04	2026-10-05 14:01:45.715-04	\N
c104b73d-5238-4a9a-9360-c668015c2bfa	48aa7abf-0acb-47b5-bd73-172aaec874f1	2e133732b810d9f4fc2cd7813ae8ebcfea55688957b488013ec82dd1212d02b2	2026-10-05 14:32:04-04	\N	activo	2026-10-05 14:17:04.757-04	2026-10-05 14:17:04.757-04	\N
5c33768f-9b29-4dcd-b02c-d7e42321788f	48aa7abf-0acb-47b5-bd73-172aaec874f1	e29031de581607534d4242186e25f4b629b5a5f8c6b61cc8be1a2d9db7e42175	2026-10-05 14:47:20-04	\N	activo	2026-10-05 14:32:20.32-04	2026-10-05 14:32:20.32-04	\N
88ddac8d-a6f7-4bc5-9082-bc7674f1227b	48aa7abf-0acb-47b5-bd73-172aaec874f1	8f554c431e86a549aa690830df73ad296fd802a8be44520371c9e6d2cf7e090a	2026-10-05 15:02:28-04	\N	activo	2026-10-05 14:47:28.361-04	2026-10-05 14:47:28.361-04	\N
4072a2fb-9bed-4491-90c7-df18d5faf26f	48aa7abf-0acb-47b5-bd73-172aaec874f1	b5ac5102acbdeac28db43ed8f63305b690dd05e9370dcbdf9a73378f6fe77d7e	2026-10-05 15:17:46-04	\N	activo	2026-10-05 15:02:46.611-04	2026-10-05 15:02:46.611-04	\N
d97383bf-47cc-4645-9080-67bb7781cc43	48aa7abf-0acb-47b5-bd73-172aaec874f1	dba80fbd3d84a7f0eb57fcde675b631fd0f1fe6d84c0b57b0be6c81de93aae2c	2026-10-05 15:32:54-04	\N	activo	2026-10-05 15:17:54.064-04	2026-10-05 15:17:54.064-04	\N
724a66fb-6d20-4d61-957a-b7cb724d55f6	48aa7abf-0acb-47b5-bd73-172aaec874f1	17729ef3f3cb3f9e7265511aafb228b88780ed0224c047f0a1845a1c397d7739	2026-10-05 15:48:00-04	\N	activo	2026-10-05 15:33:00.231-04	2026-10-05 15:33:00.231-04	\N
2b327bdd-6106-4de2-adc7-d62b6bae830e	48aa7abf-0acb-47b5-bd73-172aaec874f1	3c73d5973e8d1dd173e664aa8b138b0388eac82fa3fac7058c38f59bd4aedfa8	2026-10-05 16:03:09-04	\N	activo	2026-10-05 15:48:09.165-04	2026-10-05 15:48:09.165-04	\N
7c556efd-adc7-4d5d-b800-cd3e63f68aba	48aa7abf-0acb-47b5-bd73-172aaec874f1	a45e4a861f1c296fd8247611cf0fb9cdb279cff4c582037cade9a8b40a371aef	2026-10-05 16:18:18-04	\N	activo	2026-10-05 16:03:18.176-04	2026-10-05 16:03:18.176-04	\N
ab4bde8a-0baf-4759-ad47-d351290aa24d	48aa7abf-0acb-47b5-bd73-172aaec874f1	b5df85d6deb05e382a634403c5cf4e5195aeeeeb07e8661d4017bd3ae6d1a4e4	2026-10-05 16:33:26-04	\N	activo	2026-10-05 16:18:26.445-04	2026-10-05 16:18:26.445-04	\N
0201caf2-75f1-4644-a5be-3cb9da215e5f	48aa7abf-0acb-47b5-bd73-172aaec874f1	2501742d9e4c8f58266a08e7c95d1b45807189e6894a340ded35f91c63c5df20	2026-10-05 16:50:15-04	2026-10-05 16:38:07.879-04	inactivo	2026-10-05 16:35:15.993-04	2026-10-05 16:38:07.879-04	\N
c6f665ba-68f7-4baa-bc6a-ec4dc86c9c31	48aa7abf-0acb-47b5-bd73-172aaec874f1	967e217b3d3958ae368bc543e099edce0e335305aa613b7e999e0272e9a1b1d5	2026-10-06 04:32:53-04	\N	activo	2026-10-06 04:17:53.095-04	2026-10-06 04:17:53.095-04	\N
4634d0b9-042d-46de-84fc-4faa795caaf0	48aa7abf-0acb-47b5-bd73-172aaec874f1	dc2f998d2d8cc6688489a7da2b602a6518a821c292db819dfb89fbedf9c600fa	2026-10-06 04:56:17-04	\N	activo	2026-10-06 04:41:17.538-04	2026-10-06 04:41:17.538-04	\N
61d16206-5832-4eda-aabe-bd94c35cd775	48aa7abf-0acb-47b5-bd73-172aaec874f1	29ba6f4f1af6adf8382e5745599084f4fcd047b3d4718299912b5324e6fdf722	2026-10-07 01:02:19-04	\N	activo	2026-10-07 00:47:19.239-04	2026-10-07 00:47:19.239-04	\N
31f1eb4c-be64-4150-b2ab-c087b2819c69	48aa7abf-0acb-47b5-bd73-172aaec874f1	0f250ce09f2f16e9818d1ddb2d8e2a4ff36226759b7037af51a9e97d6d9c924f	2026-10-07 01:18:01-04	\N	activo	2026-10-07 01:03:01.185-04	2026-10-07 01:03:01.185-04	\N
779667c6-cae6-4d22-8283-a31574125469	48aa7abf-0acb-47b5-bd73-172aaec874f1	8e5282822f9f8ec732c997c3ad4b976bfa4690ee2f1a75025c7837fd5587e964	2026-10-07 01:59:00-04	\N	activo	2026-10-07 01:44:00.32-04	2026-10-07 01:44:00.32-04	\N
ff7d63b6-dfe3-4cfb-9f0d-97ff5e16e980	48aa7abf-0acb-47b5-bd73-172aaec874f1	8a4ed58a65da521d4a3d47c9ddb7e3e7a218f35bc13a98240417c882fcbb6fa1	2026-10-07 02:14:16-04	\N	activo	2026-10-07 01:59:16.514-04	2026-10-07 01:59:16.514-04	\N
f71fa186-9a97-4705-be46-9c5cc6c12445	48aa7abf-0acb-47b5-bd73-172aaec874f1	8996dead4dc7d09808d58bdf4016093f763a5ad8a0b3b8ffcdd5e674ee7d4339	2026-10-07 02:29:26-04	\N	activo	2026-10-07 02:14:26.156-04	2026-10-07 02:14:26.156-04	\N
79255750-0a57-4334-b87d-d57de2cb2db7	48aa7abf-0acb-47b5-bd73-172aaec874f1	264bb4609ad595f97b2c064bf3ca6dd26acd731a7299957a19c426adf52dae14	2026-10-07 02:46:30-04	\N	activo	2026-10-07 02:31:30.116-04	2026-10-07 02:31:30.116-04	\N
7c123abd-0e5e-45d6-a52e-2694917105d6	48aa7abf-0acb-47b5-bd73-172aaec874f1	aa32281b7d0426a6b20fb1f1af31c875ed9bd80c57990c7f6da41746f78f3227	2026-10-07 10:55:33-04	\N	activo	2026-10-07 10:40:33.295-04	2026-10-07 10:40:33.295-04	\N
0de52335-9a98-41a3-b89b-dc66e2bd875d	48aa7abf-0acb-47b5-bd73-172aaec874f1	3dcc3d1be636da8895769dcb68a5787e9c4f191db7514eb37b99271a617b9cfd	2026-10-07 12:09:21-04	\N	activo	2026-10-07 11:54:21.071-04	2026-10-07 11:54:21.071-04	\N
d39801d8-ea82-4cde-bb3e-c578524aa8f3	48aa7abf-0acb-47b5-bd73-172aaec874f1	3f13443c1246b3133634016882aa6838ba3d7cb2e46ef649412694e4bd75abf9	2026-10-07 13:19:49-04	\N	activo	2026-10-07 13:04:49.102-04	2026-10-07 13:04:49.102-04	\N
98865dfb-aedd-407c-961d-b67c388cc51d	48aa7abf-0acb-47b5-bd73-172aaec874f1	a70e319243f5b65fb9a3f2928ec2935af7cd1bb4cafb17004ddc1b5f379356ae	2026-10-07 13:46:09-04	\N	activo	2026-10-07 13:31:09.961-04	2026-10-07 13:31:09.961-04	\N
c5fc799b-ddba-4fac-bd4f-23bf9b6bd1ef	48aa7abf-0acb-47b5-bd73-172aaec874f1	684b7aadb00146e670d0937425a4c2cfe8370e9c708d3b0b611b3bebe22c68c8	2026-10-07 14:12:29-04	\N	activo	2026-10-07 13:57:29.882-04	2026-10-07 13:57:29.882-04	\N
957f4554-0fb2-4e1a-8f98-0eeaf5a1937a	48aa7abf-0acb-47b5-bd73-172aaec874f1	eb4213727331adf05ad429850012030df54f253bc6a76ed36f851a3ba6139cc3	2026-10-08 13:49:08-04	2026-10-08 13:35:05.944-04	inactivo	2026-10-08 13:34:08.352-04	2026-10-08 13:35:05.944-04	\N
cfa979ce-b471-4cef-accf-af8c8ec378b6	48aa7abf-0acb-47b5-bd73-172aaec874f1	57e332ff256254dbf810cec64ea40bc8779dd230480105ebff485988a5adbe40	2026-10-08 13:52:09-04	\N	activo	2026-10-08 13:37:09.478-04	2026-10-08 13:37:09.478-04	\N
acec9985-f517-4bb8-96e8-68a3c60141a3	48aa7abf-0acb-47b5-bd73-172aaec874f1	b65c9d06827945ee1d342541ca9bb26645574202f861d7629b993a5c119b6bd6	2026-10-08 20:19:18-04	\N	activo	2026-10-08 20:04:18.91-04	2026-10-08 20:04:18.91-04	\N
a106ecf0-8c34-4653-bb80-e95ff7aaace9	48aa7abf-0acb-47b5-bd73-172aaec874f1	4c7480a65b38c8d3f8576efb5141a14d8c3b6b49b62bcd9739c754470deabc5a	2026-10-08 21:47:43-04	\N	activo	2026-10-08 21:32:43.848-04	2026-10-08 21:32:43.848-04	\N
f9b5a792-51ec-4361-98a0-0df6a51ccff8	48aa7abf-0acb-47b5-bd73-172aaec874f1	e3d383e41ed441d6dcb3e7d2f75c42dc16874b411cc84477e36007fb8cd0aa7b	2026-10-08 22:20:12-04	\N	activo	2026-10-08 22:05:12.815-04	2026-10-08 22:05:12.815-04	\N
40f6cf72-b653-4f27-b7de-db2f39049aa4	48aa7abf-0acb-47b5-bd73-172aaec874f1	96f509db83e03dafff9cd6cb32c7540a37f93d66aaf829a621dd73898436e2fc	2026-10-09 00:27:07-04	2026-10-09 00:21:30.972-04	inactivo	2026-10-09 00:12:07.345-04	2026-10-09 00:21:30.972-04	\N
6a630b3e-5d3d-459b-9313-d211f93de7c9	48aa7abf-0acb-47b5-bd73-172aaec874f1	098fc93f11776fd8f83f69a6ca5fc69456d39e66c6ba6a068604b39f82f136b3	2026-10-09 00:37:18-04	2026-10-09 00:29:11.168-04	inactivo	2026-10-09 00:22:18.346-04	2026-10-09 00:29:11.168-04	\N
b085bdf2-9293-4610-92da-6c4aa9598c65	48aa7abf-0acb-47b5-bd73-172aaec874f1	c63fe75920f3faa1878097c419ecc958e835d3bbedfe5fed1a6799c25b436533	2026-10-09 00:49:12-04	\N	activo	2026-10-09 00:34:12.923-04	2026-10-09 00:34:12.923-04	\N
8b3bde58-85bf-4717-b738-c6f68df0083f	48aa7abf-0acb-47b5-bd73-172aaec874f1	a34195fe6c55afa3f10a473f9a89bf0dc50b02d0937d571726f398ca6806934b	2026-10-09 01:24:11-04	\N	activo	2026-10-09 01:09:11.818-04	2026-10-09 01:09:11.818-04	\N
0a68c6bb-af94-429b-9ad5-3ac9e2df5176	48aa7abf-0acb-47b5-bd73-172aaec874f1	b129808578a22daa8c3af106935509e438012a83f87fc54149ceaa5cf6d550e8	2026-10-09 01:47:21-04	\N	activo	2026-10-09 01:32:21.935-04	2026-10-09 01:32:21.935-04	\N
2b6ebb7c-5783-4598-a5d9-022ece374f55	48aa7abf-0acb-47b5-bd73-172aaec874f1	14a98ee11532a1534035fa85dd9fbfaf07c2239a01e99bacb043925297b5ed24	2026-10-09 03:04:58-04	\N	activo	2026-10-09 02:49:58.747-04	2026-10-09 02:49:58.747-04	\N
2cc613d3-d75c-4dcb-8f99-14e26e81490d	48aa7abf-0acb-47b5-bd73-172aaec874f1	5fbe482c1b17f5058d020e39b237c3bc2d3ca9d01be54afe2cef17b4d3913922	2026-10-09 03:21:11-04	\N	activo	2026-10-09 03:06:11.484-04	2026-10-09 03:06:11.484-04	\N
6c357cf0-c6ae-46f0-81e6-4a100cebf72c	48aa7abf-0acb-47b5-bd73-172aaec874f1	25286342d85b2e771b62f202a91ce10e6f7fc5e5ceb08528b5a1d2616355b6e8	2026-10-09 04:25:32-04	\N	activo	2026-10-09 04:10:32.985-04	2026-10-09 04:10:32.985-04	\N
d6d65212-8080-41d1-bda8-f340db7f9057	48aa7abf-0acb-47b5-bd73-172aaec874f1	2f52e28459f477cecb8b473b954e3fb475f3c72ea30e571000d67e50fd937d25	2026-10-09 14:25:54-04	\N	activo	2026-10-09 14:10:54.089-04	2026-10-09 14:10:54.089-04	\N
d29e2c23-4690-4236-b6bf-67c2d9136459	48aa7abf-0acb-47b5-bd73-172aaec874f1	f5a0c6a2666fcf45e41a71adb4cb51645433cb3ef950ecdff154fa2e23aa9cde	2026-10-09 14:44:14-04	\N	activo	2026-10-09 14:29:14.491-04	2026-10-09 14:29:14.491-04	\N
9978c52b-aac6-42c7-83da-ed2c09b27300	48aa7abf-0acb-47b5-bd73-172aaec874f1	421342226d65644140d1b63b8b5e57c793ef7734ed61ce0a19ec30f0e2d489ca	2026-10-09 20:58:27-04	\N	activo	2026-10-09 20:43:27.764-04	2026-10-09 20:43:27.764-04	\N
2976075d-c417-44a7-8392-a18fe0f87268	48aa7abf-0acb-47b5-bd73-172aaec874f1	66d9b26d4beccdde58f80a05bd273b903476bfc9f32e7c2ddeb3ec72ca67599e	2026-10-09 21:28:32-04	\N	activo	2026-10-09 21:13:32.688-04	2026-10-09 21:13:32.688-04	\N
03ca07f8-9c81-4e8a-8c13-02e19ab43472	48aa7abf-0acb-47b5-bd73-172aaec874f1	166d49c8b8c4b379b20f78afa3caf1167882629476a653e8686bdcd6aee74958	2026-10-09 22:04:42-04	2026-10-09 21:49:47.499-04	inactivo	2026-10-09 21:49:42.274-04	2026-10-09 21:49:47.499-04	\N
\.


--
-- TOC entry 5372 (class 0 OID 26379)
-- Dependencies: 225
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursales (id, empresa_id, nombre, direccion, telefono, email, horarios, mapa_incrustado, latitud, longitud, es_principal, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	1	Oficina Central	Segundo anillo 5, Santa Cruz de la Sierra	+591 7 7306576	ventas@correascenter.com	Lun - Vie: 8:00 - 18:00 | Sáb: 8:00 - 13:00	https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20802.77187535896!2d-63.22224718533964!3d-17.79752330000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e818129b636f%3A0xb79a33ec5254f60c!2sCORREAS%20CENTER%20LTDA!5e1!3m2!1ses-419!2sbo!4v1780433048739!5m2!1ses-419!2sbo	-17.79752330000001	-63.22224718533964	t	1	activo	\N	2026-09-29 04:29:52.256-04	2026-09-29 04:29:52.256-04
2	1	Sucursal Banzer	Av. Cristo Redentor 2260, Santa Cruz de la Sierra	+591 7 5008216	cajabanzer.correasc@gmail.com	Lun - Vie: 8:00 - 12:00 y 14:00 - 18:00 | Sáb: 8:00 - 13:00	https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20806.27427524379!2d-63.211398785339654!3d-17.76744909999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e7c2698f3d4b%3A0x1d491b56825dba72!2sCorreas%20Center%20Ltda%20Sucursal%201!5e1!3m2!1ses-419!2sbo!4v1780432576106!5m2!1ses-419!2sbo	-17.76744909999999	-63.211398785339654	f	2	activo	\N	2026-09-29 04:31:55.997-04	2026-09-29 04:31:55.997-04
3	1	Sucursal Pampa de la Isla	Av Virgen De Cotoca, Santa Cruz de la Sierra	+591 7 4162510	ronalsanchez@correascenter.com	Lun - Vie: 8:00 - 12:00 y 14:00 - 18:00 | Sáb: 8:00 - 13:00	https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20805.695440343206!2d-63.15496336566989!3d-17.77242280214628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e965c22926a9%3A0xa4a21021c446dd9a!2sCORREAS%20CENTER%20Ltda%20Sucursal%202!5e1!3m2!1ses-419!2sbo!4v1780432463578!5m2!1ses-419!2sbo	-17.77242280214628	-63.15496336566989	f	3	activo	\N	2026-09-29 04:33:37.524-04	2026-09-29 04:33:37.524-04
4	1	Sucursal Montero	Av. Hernando Siles #789, Montero	+591 7 5008215	cajamontero.correasc@gmail.com	Lun - Vie: 8:00 - 12:00 y 14:00 - 18:00 | Sáb: 8:00 - 13:00	https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3188.6736409998502!2d-63.261638324836305!3d-17.336964783541582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDIwJzEzLjEiUyA2M8KwMTUnMzIuNiJX!5e1!3m2!1ses!2sbo!4v1780489828187!5m2!1ses!2sbo	-17.336964783541582	-63.261638324836305	f	4	activo	\N	2026-09-29 04:34:40.938-04	2026-09-29 04:34:46.532-04
\.


--
-- TOC entry 5412 (class 0 OID 26807)
-- Dependencies: 265
-- Data for Name: suscriptores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suscriptores (id, email, nombre, estado, email_verificado_en, eliminado_en, creado_en, actualizado_en, empresa_id) FROM stdin;
\.


--
-- TOC entry 5382 (class 0 OID 26481)
-- Dependencies: 235
-- Data for Name: tipo_atributo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_atributo (id, nombre, slug, descripcion, permite_descripcion, permite_valor_numerico, permite_unidad_medida, icono, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
\.


--
-- TOC entry 5394 (class 0 OID 26609)
-- Dependencies: 247
-- Data for Name: tipo_seccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_seccion (id, nombre, slug, descripcion, campos_metadata, icono, orden, estado, eliminado_en, creado_en, actualizado_en) FROM stdin;
1	Hero	hero	Banner principal de la página de inicio	["badge_text", "cta_primary_text", "cta_primary_href", "cta_secondary_text", "cta_secondary_href"]	Image	1	activo	\N	2026-10-07 00:49:13.758-04	2026-10-07 00:49:20.302-04
2	Diferencial	diferencial	Diferenciales clave de la empresa	["subtitulo"]	Award	2	activo	\N	2026-10-07 00:50:10.068-04	2026-10-07 00:50:10.068-04
3	Por qué elegirnos	por-que-elegirnos	Razones para elegir la empresa	[]	CheckCircle	3	activo	\N	2026-10-07 00:50:56.133-04	2026-10-07 00:50:56.133-04
4	Capacidad de infraestructura	capacidad-de-infraestructura	Capacidades técnicas de la empresa	[]	Factory	4	activo	\N	2026-10-07 00:51:44.506-04	2026-10-07 00:51:44.506-04
5	Característica de infraestructura	caracteristica-de-infraestructura	Características de la infraestructura	["stats"]	Building	5	activo	\N	2026-10-07 00:52:31.712-04	2026-10-07 00:52:31.712-04
\.


--
-- TOC entry 5419 (class 0 OID 26887)
-- Dependencies: 272
-- Data for Name: usuario_rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_rol (usuario_id, rol_id, creado_en, estado) FROM stdin;
48aa7abf-0acb-47b5-bd73-172aaec874f1	1	2026-09-25 05:15:23.327-04	activo
48aa7abf-0acb-47b5-bd73-172aaec874f1	2	2026-09-26 12:47:43.061-04	inactivo
0798a4a0-61af-40b0-a7a3-94b7c602648e	6	2026-09-28 03:14:00.217-04	activo
\.


--
-- TOC entry 5457 (class 0 OID 0)
-- Dependencies: 236
-- Name: atributos_tecnico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.atributos_tecnico_id_seq', 1, false);


--
-- TOC entry 5458 (class 0 OID 0)
-- Dependencies: 273
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_id_seq', 3034, true);


--
-- TOC entry 5459 (class 0 OID 0)
-- Dependencies: 238
-- Name: categoria_atributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_atributo_id_seq', 1, false);


--
-- TOC entry 5460 (class 0 OID 0)
-- Dependencies: 228
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 64, true);


--
-- TOC entry 5461 (class 0 OID 0)
-- Dependencies: 275
-- Name: configuracion_sitio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_sitio_id_seq', 3, true);


--
-- TOC entry 5462 (class 0 OID 0)
-- Dependencies: 262
-- Name: contactos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contactos_id_seq', 1, false);


--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 248
-- Name: contenido_seccion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contenido_seccion_id_seq', 27, true);


--
-- TOC entry 5464 (class 0 OID 0)
-- Dependencies: 222
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_seq', 1, true);


--
-- TOC entry 5465 (class 0 OID 0)
-- Dependencies: 258
-- Name: footers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.footers_id_seq', 17, true);


--
-- TOC entry 5466 (class 0 OID 0)
-- Dependencies: 244
-- Name: industria_asignacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.industria_asignacion_id_seq', 1, false);


--
-- TOC entry 5467 (class 0 OID 0)
-- Dependencies: 240
-- Name: industrias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.industrias_id_seq', 9, true);


--
-- TOC entry 5468 (class 0 OID 0)
-- Dependencies: 230
-- Name: marcas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marcas_id_seq', 23, true);


--
-- TOC entry 5469 (class 0 OID 0)
-- Dependencies: 256
-- Name: menu_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_item_id_seq', 4, true);


--
-- TOC entry 5470 (class 0 OID 0)
-- Dependencies: 254
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menus_id_seq', 30, true);


--
-- TOC entry 5471 (class 0 OID 0)
-- Dependencies: 260
-- Name: pasos_wizard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pasos_wizard_id_seq', 2, true);


--
-- TOC entry 5472 (class 0 OID 0)
-- Dependencies: 269
-- Name: permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisos_id_seq', 53, true);


--
-- TOC entry 5473 (class 0 OID 0)
-- Dependencies: 232
-- Name: producto_marca_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_marca_id_seq', 25, true);


--
-- TOC entry 5474 (class 0 OID 0)
-- Dependencies: 226
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 16, true);


--
-- TOC entry 5475 (class 0 OID 0)
-- Dependencies: 252
-- Name: registro_contenido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registro_contenido_id_seq', 19, true);


--
-- TOC entry 5476 (class 0 OID 0)
-- Dependencies: 250
-- Name: registros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_id_seq', 6, true);


--
-- TOC entry 5477 (class 0 OID 0)
-- Dependencies: 267
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- TOC entry 5478 (class 0 OID 0)
-- Dependencies: 242
-- Name: servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicios_id_seq', 6, true);


--
-- TOC entry 5479 (class 0 OID 0)
-- Dependencies: 224
-- Name: sucursales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sucursales_id_seq', 4, true);


--
-- TOC entry 5480 (class 0 OID 0)
-- Dependencies: 264
-- Name: suscriptores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suscriptores_id_seq', 1, false);


--
-- TOC entry 5481 (class 0 OID 0)
-- Dependencies: 234
-- Name: tipo_atributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_atributo_id_seq', 1, false);


--
-- TOC entry 5482 (class 0 OID 0)
-- Dependencies: 246
-- Name: tipo_seccion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_seccion_id_seq', 5, true);


--
-- TOC entry 5086 (class 2606 OID 26360)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5082 (class 2606 OID 25458)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5111 (class 2606 OID 26525)
-- Name: atributos_tecnico atributos_tecnico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributos_tecnico
    ADD CONSTRAINT atributos_tecnico_pkey PRIMARY KEY (id);


--
-- TOC entry 5176 (class 2606 OID 26910)
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 5115 (class 2606 OID 26545)
-- Name: categoria_atributo categoria_atributo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo
    ADD CONSTRAINT categoria_atributo_pkey PRIMARY KEY (id);


--
-- TOC entry 5097 (class 2606 OID 26443)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 5178 (class 2606 OID 26925)
-- Name: configuracion_sitio configuracion_sitio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sitio
    ADD CONSTRAINT configuracion_sitio_pkey PRIMARY KEY (id);


--
-- TOC entry 5154 (class 2606 OID 26805)
-- Name: contactos contactos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_pkey PRIMARY KEY (id);


--
-- TOC entry 5132 (class 2606 OID 26653)
-- Name: contenido_seccion contenido_seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenido_seccion
    ADD CONSTRAINT contenido_seccion_pkey PRIMARY KEY (id);


--
-- TOC entry 5088 (class 2606 OID 26377)
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- TOC entry 5148 (class 2606 OID 26761)
-- Name: footers footers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footers
    ADD CONSTRAINT footers_pkey PRIMARY KEY (id);


--
-- TOC entry 5125 (class 2606 OID 26607)
-- Name: industria_asignacion industria_asignacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industria_asignacion
    ADD CONSTRAINT industria_asignacion_pkey PRIMARY KEY (id);


--
-- TOC entry 5118 (class 2606 OID 26566)
-- Name: industrias industrias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industrias
    ADD CONSTRAINT industrias_pkey PRIMARY KEY (id);


--
-- TOC entry 5186 (class 2606 OID 26953)
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 26463)
-- Name: marcas marcas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (id);


--
-- TOC entry 5145 (class 2606 OID 26739)
-- Name: menu_item menu_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_pkey PRIMARY KEY (id);


--
-- TOC entry 5141 (class 2606 OID 26719)
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- TOC entry 5151 (class 2606 OID 26784)
-- Name: pasos_wizard pasos_wizard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pasos_wizard
    ADD CONSTRAINT pasos_wizard_pkey PRIMARY KEY (id);


--
-- TOC entry 5160 (class 2606 OID 26838)
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (id);


--
-- TOC entry 5167 (class 2606 OID 26877)
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- TOC entry 5104 (class 2606 OID 26479)
-- Name: producto_marca producto_marca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_marca
    ADD CONSTRAINT producto_marca_pkey PRIMARY KEY (id);


--
-- TOC entry 5094 (class 2606 OID 26422)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 5138 (class 2606 OID 26693)
-- Name: registro_contenido registro_contenido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_contenido
    ADD CONSTRAINT registro_contenido_pkey PRIMARY KEY (id);


--
-- TOC entry 5135 (class 2606 OID 26673)
-- Name: registros registros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros
    ADD CONSTRAINT registros_pkey PRIMARY KEY (id);


--
-- TOC entry 5171 (class 2606 OID 26886)
-- Name: rol_permiso rol_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_pkey PRIMARY KEY (rol_id, permiso_id);


--
-- TOC entry 5163 (class 2606 OID 26858)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5122 (class 2606 OID 26586)
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id);


--
-- TOC entry 5181 (class 2606 OID 26940)
-- Name: sesiones sesiones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones
    ADD CONSTRAINT sesiones_pkey PRIMARY KEY (id);


--
-- TOC entry 5091 (class 2606 OID 26401)
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id);


--
-- TOC entry 5158 (class 2606 OID 26823)
-- Name: suscriptores suscriptores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscriptores
    ADD CONSTRAINT suscriptores_pkey PRIMARY KEY (id);


--
-- TOC entry 5108 (class 2606 OID 26505)
-- Name: tipo_atributo tipo_atributo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_atributo
    ADD CONSTRAINT tipo_atributo_pkey PRIMARY KEY (id);


--
-- TOC entry 5128 (class 2606 OID 26629)
-- Name: tipo_seccion tipo_seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_seccion
    ADD CONSTRAINT tipo_seccion_pkey PRIMARY KEY (id);


--
-- TOC entry 5173 (class 2606 OID 26895)
-- Name: usuario_rol usuario_rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_pkey PRIMARY KEY (usuario_id, rol_id);


--
-- TOC entry 5083 (class 1259 OID 26954)
-- Name: users_email_key; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON auth.users USING btree (email);


--
-- TOC entry 5084 (class 1259 OID 27159)
-- Name: users_email_normalizado_unique; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE UNIQUE INDEX users_email_normalizado_unique ON auth.users USING btree (lower((email)::text)) WHERE (email IS NOT NULL);


--
-- TOC entry 5112 (class 1259 OID 26964)
-- Name: atributos_tecnico_tipo_atributo_id_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX atributos_tecnico_tipo_atributo_id_estado_idx ON public.atributos_tecnico USING btree (tipo_atributo_id, estado);


--
-- TOC entry 5113 (class 1259 OID 26965)
-- Name: categoria_atributo_categoria_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categoria_atributo_categoria_id_estado_orden_idx ON public.categoria_atributo USING btree (categoria_id, estado, orden);


--
-- TOC entry 5098 (class 1259 OID 26959)
-- Name: categorias_producto_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categorias_producto_id_estado_orden_idx ON public.categorias USING btree (producto_id, estado, orden);


--
-- TOC entry 5099 (class 1259 OID 26958)
-- Name: categorias_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categorias_slug_key ON public.categorias USING btree (slug);


--
-- TOC entry 5152 (class 1259 OID 26979)
-- Name: contactos_empresa_id_estado_creado_en_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contactos_empresa_id_estado_creado_en_idx ON public.contactos USING btree (empresa_id, estado, creado_en);


--
-- TOC entry 5130 (class 1259 OID 26972)
-- Name: contenido_seccion_empresa_id_tipo_seccion_id_estado_mostrar_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contenido_seccion_empresa_id_tipo_seccion_id_estado_mostrar_idx ON public.contenido_seccion USING btree (empresa_id, tipo_seccion_id, estado, mostrar, orden);


--
-- TOC entry 5146 (class 1259 OID 26977)
-- Name: footers_empresa_id_estado_mostrar_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX footers_empresa_id_estado_mostrar_orden_idx ON public.footers USING btree (empresa_id, estado, mostrar, orden);


--
-- TOC entry 5123 (class 1259 OID 26969)
-- Name: industria_asignacion_industria_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX industria_asignacion_industria_id_estado_orden_idx ON public.industria_asignacion USING btree (industria_id, estado, orden);


--
-- TOC entry 5116 (class 1259 OID 26967)
-- Name: industrias_empresa_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX industrias_empresa_id_estado_orden_idx ON public.industrias USING btree (empresa_id, estado, orden);


--
-- TOC entry 5119 (class 1259 OID 26966)
-- Name: industrias_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX industrias_slug_key ON public.industrias USING btree (slug);


--
-- TOC entry 5183 (class 1259 OID 26990)
-- Name: leads_contacto_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX leads_contacto_id_key ON public.leads USING btree (contacto_id);


--
-- TOC entry 5184 (class 1259 OID 26991)
-- Name: leads_empresa_id_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_empresa_id_estado_idx ON public.leads USING btree (empresa_id, estado);


--
-- TOC entry 5187 (class 1259 OID 26992)
-- Name: leads_responsable_id_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_responsable_id_estado_idx ON public.leads USING btree (responsable_id, estado);


--
-- TOC entry 5102 (class 1259 OID 26960)
-- Name: marcas_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX marcas_slug_key ON public.marcas USING btree (slug);


--
-- TOC entry 5142 (class 1259 OID 26976)
-- Name: menu_item_menu_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX menu_item_menu_id_estado_orden_idx ON public.menu_item USING btree (menu_id, estado, orden);


--
-- TOC entry 5143 (class 1259 OID 42291)
-- Name: menu_item_menu_orden_vigente_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX menu_item_menu_orden_vigente_key ON public.menu_item USING btree (menu_id, orden) WHERE ((eliminado_en IS NULL) AND (orden > 0));


--
-- TOC entry 5139 (class 1259 OID 26975)
-- Name: menus_empresa_id_estado_mostrar_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX menus_empresa_id_estado_mostrar_orden_idx ON public.menus USING btree (empresa_id, estado, mostrar, orden);


--
-- TOC entry 5149 (class 1259 OID 26978)
-- Name: pasos_wizard_empresa_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pasos_wizard_empresa_id_estado_orden_idx ON public.pasos_wizard USING btree (empresa_id, estado, orden);


--
-- TOC entry 5165 (class 1259 OID 26984)
-- Name: permisos_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permisos_nombre_key ON public.permisos USING btree (nombre);


--
-- TOC entry 5168 (class 1259 OID 26985)
-- Name: permisos_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permisos_slug_key ON public.permisos USING btree (slug);


--
-- TOC entry 5105 (class 1259 OID 26961)
-- Name: producto_marca_producto_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX producto_marca_producto_id_estado_orden_idx ON public.producto_marca USING btree (producto_id, estado, orden);


--
-- TOC entry 5092 (class 1259 OID 26957)
-- Name: productos_empresa_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX productos_empresa_id_estado_orden_idx ON public.productos USING btree (empresa_id, estado, orden);


--
-- TOC entry 5095 (class 1259 OID 26956)
-- Name: productos_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX productos_slug_key ON public.productos USING btree (slug);


--
-- TOC entry 5136 (class 1259 OID 26974)
-- Name: registro_contenido_empresa_id_registro_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX registro_contenido_empresa_id_registro_id_estado_orden_idx ON public.registro_contenido USING btree (empresa_id, registro_id, estado, orden);


--
-- TOC entry 5133 (class 1259 OID 26973)
-- Name: registros_identificador_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX registros_identificador_key ON public.registros USING btree (identificador);


--
-- TOC entry 5169 (class 1259 OID 26986)
-- Name: rol_permiso_permiso_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX rol_permiso_permiso_id_idx ON public.rol_permiso USING btree (permiso_id);


--
-- TOC entry 5161 (class 1259 OID 26982)
-- Name: roles_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_nombre_key ON public.roles USING btree (nombre);


--
-- TOC entry 5164 (class 1259 OID 26983)
-- Name: roles_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_slug_key ON public.roles USING btree (slug);


--
-- TOC entry 5120 (class 1259 OID 26968)
-- Name: servicios_empresa_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX servicios_empresa_id_estado_orden_idx ON public.servicios USING btree (empresa_id, estado, orden);


--
-- TOC entry 5179 (class 1259 OID 26988)
-- Name: sesiones_huella_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sesiones_huella_token_key ON public.sesiones USING btree (huella_token);


--
-- TOC entry 5182 (class 1259 OID 26989)
-- Name: sesiones_usuario_id_estado_expira_en_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sesiones_usuario_id_estado_expira_en_idx ON public.sesiones USING btree (usuario_id, estado, expira_en);


--
-- TOC entry 5089 (class 1259 OID 26955)
-- Name: sucursales_empresa_id_estado_orden_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sucursales_empresa_id_estado_orden_idx ON public.sucursales USING btree (empresa_id, estado, orden);


--
-- TOC entry 5155 (class 1259 OID 26980)
-- Name: suscriptores_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX suscriptores_email_key ON public.suscriptores USING btree (email);


--
-- TOC entry 5156 (class 1259 OID 26981)
-- Name: suscriptores_empresa_id_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX suscriptores_empresa_id_estado_idx ON public.suscriptores USING btree (empresa_id, estado);


--
-- TOC entry 5106 (class 1259 OID 26962)
-- Name: tipo_atributo_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tipo_atributo_nombre_key ON public.tipo_atributo USING btree (nombre);


--
-- TOC entry 5109 (class 1259 OID 26963)
-- Name: tipo_atributo_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tipo_atributo_slug_key ON public.tipo_atributo USING btree (slug);


--
-- TOC entry 5126 (class 1259 OID 26970)
-- Name: tipo_seccion_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tipo_seccion_nombre_key ON public.tipo_seccion USING btree (nombre);


--
-- TOC entry 5129 (class 1259 OID 26971)
-- Name: tipo_seccion_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tipo_seccion_slug_key ON public.tipo_seccion USING btree (slug);


--
-- TOC entry 5174 (class 1259 OID 26987)
-- Name: usuario_rol_rol_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX usuario_rol_rol_id_idx ON public.usuario_rol USING btree (rol_id);


--
-- TOC entry 5193 (class 2606 OID 27018)
-- Name: atributos_tecnico atributos_tecnico_tipo_atributo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributos_tecnico
    ADD CONSTRAINT atributos_tecnico_tipo_atributo_id_fkey FOREIGN KEY (tipo_atributo_id) REFERENCES public.tipo_atributo(id);


--
-- TOC entry 5214 (class 2606 OID 27123)
-- Name: auditoria auditoria_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.perfiles(id);


--
-- TOC entry 5194 (class 2606 OID 27028)
-- Name: categoria_atributo categoria_atributo_atributo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo
    ADD CONSTRAINT categoria_atributo_atributo_id_fkey FOREIGN KEY (atributo_id) REFERENCES public.atributos_tecnico(id);


--
-- TOC entry 5195 (class 2606 OID 27023)
-- Name: categoria_atributo categoria_atributo_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo
    ADD CONSTRAINT categoria_atributo_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- TOC entry 5190 (class 2606 OID 27003)
-- Name: categorias categorias_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- TOC entry 5215 (class 2606 OID 27128)
-- Name: configuracion_sitio configuracion_sitio_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sitio
    ADD CONSTRAINT configuracion_sitio_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5207 (class 2606 OID 27088)
-- Name: contactos contactos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5199 (class 2606 OID 27048)
-- Name: contenido_seccion contenido_seccion_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenido_seccion
    ADD CONSTRAINT contenido_seccion_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5200 (class 2606 OID 27053)
-- Name: contenido_seccion contenido_seccion_tipo_seccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenido_seccion
    ADD CONSTRAINT contenido_seccion_tipo_seccion_id_fkey FOREIGN KEY (tipo_seccion_id) REFERENCES public.tipo_seccion(id);


--
-- TOC entry 5205 (class 2606 OID 27078)
-- Name: footers footers_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footers
    ADD CONSTRAINT footers_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5198 (class 2606 OID 27043)
-- Name: industria_asignacion industria_asignacion_industria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industria_asignacion
    ADD CONSTRAINT industria_asignacion_industria_id_fkey FOREIGN KEY (industria_id) REFERENCES public.industrias(id);


--
-- TOC entry 5196 (class 2606 OID 27033)
-- Name: industrias industrias_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industrias
    ADD CONSTRAINT industrias_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5217 (class 2606 OID 27143)
-- Name: leads leads_contacto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_contacto_id_fkey FOREIGN KEY (contacto_id) REFERENCES public.contactos(id);


--
-- TOC entry 5218 (class 2606 OID 27138)
-- Name: leads leads_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5219 (class 2606 OID 27148)
-- Name: leads leads_responsable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES public.perfiles(id);


--
-- TOC entry 5204 (class 2606 OID 27073)
-- Name: menu_item menu_item_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus(id);


--
-- TOC entry 5203 (class 2606 OID 27068)
-- Name: menus menus_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5206 (class 2606 OID 27083)
-- Name: pasos_wizard pasos_wizard_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pasos_wizard
    ADD CONSTRAINT pasos_wizard_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5209 (class 2606 OID 27098)
-- Name: perfiles perfiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- TOC entry 5191 (class 2606 OID 27013)
-- Name: producto_marca producto_marca_marca_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_marca
    ADD CONSTRAINT producto_marca_marca_id_fkey FOREIGN KEY (marca_id) REFERENCES public.marcas(id);


--
-- TOC entry 5192 (class 2606 OID 27008)
-- Name: producto_marca producto_marca_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_marca
    ADD CONSTRAINT producto_marca_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- TOC entry 5189 (class 2606 OID 26998)
-- Name: productos productos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5201 (class 2606 OID 27058)
-- Name: registro_contenido registro_contenido_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_contenido
    ADD CONSTRAINT registro_contenido_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5202 (class 2606 OID 27063)
-- Name: registro_contenido registro_contenido_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_contenido
    ADD CONSTRAINT registro_contenido_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.registros(id);


--
-- TOC entry 5210 (class 2606 OID 27108)
-- Name: rol_permiso rol_permiso_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(id);


--
-- TOC entry 5211 (class 2606 OID 27103)
-- Name: rol_permiso rol_permiso_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- TOC entry 5197 (class 2606 OID 27038)
-- Name: servicios servicios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5216 (class 2606 OID 27133)
-- Name: sesiones sesiones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesiones
    ADD CONSTRAINT sesiones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id);


--
-- TOC entry 5188 (class 2606 OID 26993)
-- Name: sucursales sucursales_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5208 (class 2606 OID 27093)
-- Name: suscriptores suscriptores_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscriptores
    ADD CONSTRAINT suscriptores_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 5212 (class 2606 OID 27118)
-- Name: usuario_rol usuario_rol_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- TOC entry 5213 (class 2606 OID 27113)
-- Name: usuario_rol usuario_rol_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.perfiles(id);


-- Completed on 2026-10-09 21:48:13

--
-- PostgreSQL database dump complete
--

\unrestrict VX4HPD1ONRPtl3PzLfiYwF1nCc5DcxCsnWo7FCcIBDeeaNCOTqSgrClajCYSnLT

