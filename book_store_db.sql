--
-- PostgreSQL database dump
--

\restrict lerJxiofB0xzUKLqmweEhvKqpdrdulRUx8gyb4KoqC4G0ozoYAWzFeMMFjcy7wQ

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-23 12:08:46

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
-- TOC entry 2 (class 3079 OID 19281)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 5658 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- TOC entry 975 (class 1247 OID 25959)
-- Name: enum_messages_sender_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_messages_sender_type AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.enum_messages_sender_type OWNER TO postgres;

--
-- TOC entry 915 (class 1247 OID 16410)
-- Name: enum_orders_trang_thai_don_hang; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_orders_trang_thai_don_hang AS ENUM (
    'pending',
    'pending_payment',
    'confirmed',
    'shipping',
    'delivered',
    'cancelled'
);


ALTER TYPE public.enum_orders_trang_thai_don_hang OWNER TO postgres;

--
-- TOC entry 912 (class 1247 OID 16404)
-- Name: enum_products_product_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_products_product_type AS ENUM (
    'printed',
    'ebook'
);


ALTER TYPE public.enum_products_product_type OWNER TO postgres;

--
-- TOC entry 906 (class 1247 OID 16390)
-- Name: enum_promotions_loai_giam_gia; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_promotions_loai_giam_gia AS ENUM (
    'percentage',
    'fixed_amount'
);


ALTER TYPE public.enum_promotions_loai_giam_gia OWNER TO postgres;

--
-- TOC entry 909 (class 1247 OID 16396)
-- Name: enum_promotions_pham_vi_ap_dung; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_promotions_pham_vi_ap_dung AS ENUM (
    'all',
    'category',
    'product'
);


ALTER TYPE public.enum_promotions_pham_vi_ap_dung OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 257 (class 1259 OID 19240)
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSettings" (
    id integer NOT NULL,
    ten_website character varying(255) DEFAULT 'BookZone'::character varying NOT NULL,
    dia_chi character varying(255) DEFAULT 'Quận 5, TP. Hồ Chí Minh'::character varying NOT NULL,
    email character varying(255) DEFAULT 'bookzone@gmail.com'::character varying NOT NULL,
    so_dien_thoai character varying(255) DEFAULT '0339 945 345'::character varying NOT NULL,
    facebook character varying(255),
    instagram character varying(255),
    twitter character varying(255),
    linkedin character varying(255),
    nam_ban_quyen integer DEFAULT 2025 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."SiteSettings" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 19239)
-- Name: SiteSettings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SiteSettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SiteSettings_id_seq" OWNER TO postgres;

--
-- TOC entry 5659 (class 0 OID 0)
-- Dependencies: 256
-- Name: SiteSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SiteSettings_id_seq" OWNED BY public."SiteSettings".id;


--
-- TOC entry 243 (class 1259 OID 17137)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL,
    so_luong integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17136)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 5660 (class 0 OID 0)
-- Dependencies: 242
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 237 (class 1259 OID 17077)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17076)
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO postgres;

--
-- TOC entry 5661 (class 0 OID 0)
-- Dependencies: 236
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 239 (class 1259 OID 17095)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    ten_danh_muc character varying(255) NOT NULL,
    mo_ta text,
    danh_muc_cha_id bigint,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    img character varying(255)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 17094)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5662 (class 0 OID 0)
-- Dependencies: 238
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 245 (class 1259 OID 17161)
-- Name: combo_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.combo_items (
    id bigint NOT NULL,
    combo_id bigint NOT NULL,
    product_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    so_luong integer DEFAULT 1
);


ALTER TABLE public.combo_items OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 17160)
-- Name: combo_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.combo_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.combo_items_id_seq OWNER TO postgres;

--
-- TOC entry 5663 (class 0 OID 0)
-- Dependencies: 244
-- Name: combo_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.combo_items_id_seq OWNED BY public.combo_items.id;


--
-- TOC entry 247 (class 1259 OID 17173)
-- Name: combos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.combos (
    id bigint NOT NULL,
    ten_combo character varying(255) NOT NULL,
    mo_ta text,
    img character varying(255),
    gia_combo numeric(15,2) NOT NULL,
    trang_thai boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.combos OWNER TO postgres;

--
-- TOC entry 5664 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN combos.img; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.combos.img IS 'Ảnh đại diện cho gói combo';


--
-- TOC entry 5665 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN combos.gia_combo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.combos.gia_combo IS 'Giá bán của cả gói sản phẩm này';


--
-- TOC entry 246 (class 1259 OID 17172)
-- Name: combos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.combos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.combos_id_seq OWNER TO postgres;

--
-- TOC entry 5666 (class 0 OID 0)
-- Dependencies: 246
-- Name: combos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.combos_id_seq OWNED BY public.combos.id;


--
-- TOC entry 267 (class 1259 OID 25986)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id bigint NOT NULL,
    ho_ten character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    chu_de character varying(255),
    noi_dung text NOT NULL,
    trang_thai character varying(255) DEFAULT 'new'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 25985)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 5667 (class 0 OID 0)
-- Dependencies: 266
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 249 (class 1259 OID 17188)
-- Name: ebook_download_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ebook_download_links (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    product_id bigint NOT NULL,
    order_id bigint NOT NULL,
    download_token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ebook_download_links OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 17187)
-- Name: ebook_download_links_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ebook_download_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ebook_download_links_id_seq OWNER TO postgres;

--
-- TOC entry 5668 (class 0 OID 0)
-- Dependencies: 248
-- Name: ebook_download_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ebook_download_links_id_seq OWNED BY public.ebook_download_links.id;


--
-- TOC entry 261 (class 1259 OID 19392)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 19391)
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- TOC entry 5669 (class 0 OID 0)
-- Dependencies: 260
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- TOC entry 265 (class 1259 OID 25964)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    user_id integer NOT NULL,
    sender_type public.enum_messages_sender_type DEFAULT 'user'::public.enum_messages_sender_type NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 25963)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 5670 (class 0 OID 0)
-- Dependencies: 264
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 269 (class 1259 OID 40466)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    so_luong_dat integer DEFAULT 1 NOT NULL,
    don_gia numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 40465)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5671 (class 0 OID 0)
-- Dependencies: 268
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 259 (class 1259 OID 19339)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    trang_thai_don_hang public.enum_orders_trang_thai_don_hang DEFAULT 'pending'::public.enum_orders_trang_thai_don_hang,
    phuong_thuc_thanh_toan character varying(255) DEFAULT 'COD'::character varying,
    trang_thai_thanh_toan boolean DEFAULT false,
    ten_nguoi_nhan character varying(255) NOT NULL,
    email_nguoi_nhan character varying(255) NOT NULL,
    so_dt_nguoi_nhan character varying(255) DEFAULT ''::character varying NOT NULL,
    dia_chi_giao_hang character varying(255) NOT NULL,
    ghi_chu_khach_hang text,
    tong_tien_hang numeric(10,2) DEFAULT 0,
    phi_van_chuyen numeric(10,2) DEFAULT 0,
    tong_thanh_toan numeric(10,2) DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    sdt_nguoi_nhan character varying(20)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 19338)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 5672 (class 0 OID 0)
-- Dependencies: 258
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 227 (class 1259 OID 16805)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    tieu_de character varying(255) NOT NULL,
    noi_dung text NOT NULL,
    trang_thai boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    tom_tat character varying(500),
    slug character varying(255),
    hinh_anh character varying(255),
    user_id integer
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16804)
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- TOC entry 5673 (class 0 OID 0)
-- Dependencies: 226
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- TOC entry 241 (class 1259 OID 17113)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    ten_sach character varying(255) NOT NULL,
    mo_ta_ngan text,
    gia_bia numeric(12,2) NOT NULL,
    so_luong_ton_kho integer DEFAULT 0 NOT NULL,
    tac_gia character varying(255),
    nha_xuat_ban character varying(255),
    nam_xuat_ban integer,
    img character varying(255),
    so_trang integer,
    product_type character varying(255) DEFAULT 'print_book'::character varying NOT NULL,
    ebook_url character varying(255),
    danh_muc_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    da_ban integer DEFAULT 0 NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    trang_thai boolean DEFAULT true NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 5674 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN products.img; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.img IS 'URL hình ảnh sản phẩm';


--
-- TOC entry 5675 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN products.product_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.product_type IS 'print_book | ebook';


--
-- TOC entry 5676 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN products.ebook_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.ebook_url IS 'Link tải ebook';


--
-- TOC entry 5677 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN products.da_ban; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.da_ban IS 'Số lượng sản phẩm đã bán (Top bán chạy)';


--
-- TOC entry 5678 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN products.trang_thai; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.trang_thai IS 'true = đang bán, false = ẩn / ngừng bán';


--
-- TOC entry 240 (class 1259 OID 17112)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5679 (class 0 OID 0)
-- Dependencies: 240
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 251 (class 1259 OID 17274)
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id bigint NOT NULL,
    ngay_bat_dau timestamp with time zone,
    ngay_ket_thuc timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    ten_km character varying(255),
    code character varying(255),
    giam_gia_percent integer DEFAULT 0
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 17273)
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promotions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promotions_id_seq OWNER TO postgres;

--
-- TOC entry 5680 (class 0 OID 0)
-- Dependencies: 250
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promotions_id_seq OWNED BY public.promotions.id;


--
-- TOC entry 231 (class 1259 OID 16843)
-- Name: receipt_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipt_items (
    id bigint NOT NULL,
    receipt_id integer NOT NULL,
    product_id integer NOT NULL,
    so_luong integer DEFAULT 1,
    don_gia_nhap numeric(15,2) DEFAULT 0
);


ALTER TABLE public.receipt_items OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16842)
-- Name: receipt_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receipt_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receipt_items_id_seq OWNER TO postgres;

--
-- TOC entry 5681 (class 0 OID 0)
-- Dependencies: 230
-- Name: receipt_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receipt_items_id_seq OWNED BY public.receipt_items.id;


--
-- TOC entry 229 (class 1259 OID 16823)
-- Name: receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipts (
    id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    nha_cung_cap character varying(255),
    tong_tien numeric(15,2) DEFAULT 0,
    nguoi_nhap_id integer
);


ALTER TABLE public.receipts OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16822)
-- Name: receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receipts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receipts_id_seq OWNER TO postgres;

--
-- TOC entry 5682 (class 0 OID 0)
-- Dependencies: 228
-- Name: receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receipts_id_seq OWNED BY public.receipts.id;


--
-- TOC entry 253 (class 1259 OID 17331)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    product_id bigint NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    parent_id bigint,
    trang_thai boolean DEFAULT true
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 17330)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5683 (class 0 OID 0)
-- Dependencies: 252
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 233 (class 1259 OID 17037)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    ten_quyen character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17036)
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
-- TOC entry 5684 (class 0 OID 0)
-- Dependencies: 232
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 263 (class 1259 OID 19434)
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    ten_website character varying(255) DEFAULT 'BookZone'::character varying NOT NULL,
    dia_chi character varying(255) DEFAULT 'Quận 5, TP. Hồ Chí Minh'::character varying NOT NULL,
    email character varying(255) DEFAULT 'bookzone@gmail.com'::character varying NOT NULL,
    so_dien_thoai character varying(255) DEFAULT '0339 945 345'::character varying NOT NULL,
    facebook character varying(255),
    instagram character varying(255),
    twitter character varying(255),
    linkedin character varying(255),
    nam_ban_quyen integer DEFAULT 2025 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    mo_ta text DEFAULT 'Nơi tri thức bắt đầu. Khám phá hàng ngàn đầu sách hấp dẫn, ebook, truyện tranh và các combo ưu đãi đặc biệt.'::text
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 19433)
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO postgres;

--
-- TOC entry 5685 (class 0 OID 0)
-- Dependencies: 262
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- TOC entry 255 (class 1259 OID 17360)
-- Name: slideshows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.slideshows (
    id bigint NOT NULL,
    image_url character varying(255) NOT NULL,
    tieu_de character varying(255),
    phu_de character varying(255),
    link_to character varying(255),
    thu_tu_hien_thi integer DEFAULT 0,
    trang_thai boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.slideshows OWNER TO postgres;

--
-- TOC entry 5686 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN slideshows.image_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.slideshows.image_url IS 'Đường dẫn đến ảnh của slide, ';


--
-- TOC entry 5687 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN slideshows.tieu_de; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.slideshows.tieu_de IS 'Tiêu đề chính trên slide, ví dụ: "Sách Mới Ra Mắt"';


--
-- TOC entry 5688 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN slideshows.phu_de; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.slideshows.phu_de IS 'Tiêu đề phụ hoặc mô tả ngắn, ví dụ: "Giảm giá đến 50%"';


--
-- TOC entry 5689 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN slideshows.link_to; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.slideshows.link_to IS 'Đường dẫn khi click vào slide, ví dụ: /products/123 hoặc /categories/4';


--
-- TOC entry 5690 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN slideshows.thu_tu_hien_thi; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.slideshows.thu_tu_hien_thi IS 'Dùng để sắp xếp thứ tự các slide, số nhỏ hơn hiển thị trước';


--
-- TOC entry 254 (class 1259 OID 17359)
-- Name: slideshows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.slideshows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slideshows_id_seq OWNER TO postgres;

--
-- TOC entry 5691 (class 0 OID 0)
-- Dependencies: 254
-- Name: slideshows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.slideshows_id_seq OWNED BY public.slideshows.id;


--
-- TOC entry 235 (class 1259 OID 17050)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    role_id bigint DEFAULT 2 NOT NULL,
    email character varying(255) NOT NULL,
    mat_khau character varying(255) NOT NULL,
    ho_ten character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    trang_thai boolean DEFAULT true,
    ten_dang_nhap character varying(255),
    img character varying(255) DEFAULT 'default_avatar.png'::character varying,
    dia_chi character varying(255),
    ngay_sinh date,
    "resetPasswordToken" character varying(255),
    "resetPasswordExpire" timestamp with time zone,
    so_dien_thoai character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17049)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5692 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 5026 (class 2604 OID 19243)
-- Name: SiteSettings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSettings" ALTER COLUMN id SET DEFAULT nextval('public."SiteSettings_id_seq"'::regclass);


--
-- TOC entry 5009 (class 2604 OID 17140)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 5001 (class 2604 OID 17080)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 5002 (class 2604 OID 17098)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 5013 (class 2604 OID 17164)
-- Name: combo_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_items ALTER COLUMN id SET DEFAULT nextval('public.combo_items_id_seq'::regclass);


--
-- TOC entry 5015 (class 2604 OID 17176)
-- Name: combos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combos ALTER COLUMN id SET DEFAULT nextval('public.combos_id_seq'::regclass);


--
-- TOC entry 5051 (class 2604 OID 25989)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 5017 (class 2604 OID 17191)
-- Name: ebook_download_links id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ebook_download_links ALTER COLUMN id SET DEFAULT nextval('public.ebook_download_links_id_seq'::regclass);


--
-- TOC entry 5040 (class 2604 OID 19395)
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- TOC entry 5048 (class 2604 OID 25967)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 5053 (class 2604 OID 40469)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 5032 (class 2604 OID 19342)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4989 (class 2604 OID 16808)
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- TOC entry 5003 (class 2604 OID 17116)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 5019 (class 2604 OID 17277)
-- Name: promotions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions ALTER COLUMN id SET DEFAULT nextval('public.promotions_id_seq'::regclass);


--
-- TOC entry 4993 (class 2604 OID 16846)
-- Name: receipt_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt_items ALTER COLUMN id SET DEFAULT nextval('public.receipt_items_id_seq'::regclass);


--
-- TOC entry 4991 (class 2604 OID 16826)
-- Name: receipts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts ALTER COLUMN id SET DEFAULT nextval('public.receipts_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 17334)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4996 (class 2604 OID 17040)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 5041 (class 2604 OID 19437)
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- TOC entry 5023 (class 2604 OID 17363)
-- Name: slideshows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slideshows ALTER COLUMN id SET DEFAULT nextval('public.slideshows_id_seq'::regclass);


--
-- TOC entry 4997 (class 2604 OID 17053)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5640 (class 0 OID 19240)
-- Dependencies: 257
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSettings" (id, ten_website, dia_chi, email, so_dien_thoai, facebook, instagram, twitter, linkedin, nam_ban_quyen, "createdAt", "updatedAt") FROM stdin;
1	BookZone	Quận 7, TP. Hồ Chí Minh	bookzonestore07@gmail.com	0969 671 344	https://facebook.com	https://instagram.com	https://twitter.com	https://linkedin.com	2026	2026-01-15 13:54:58.61+07	2026-01-17 13:44:05.664+07
\.


--
-- TOC entry 5626 (class 0 OID 17137)
-- Dependencies: 243
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, so_luong, "createdAt", "updatedAt") FROM stdin;
2	1	4	1	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07
6	2	3	5	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07
76	6	59	4	2026-01-22 15:40:38.610849+07	2026-01-22 15:40:46.973588+07
80	5	49	1	2026-01-22 16:11:02.229362+07	2026-01-22 16:11:02.229362+07
81	6	51	5	2026-01-22 16:33:04.962654+07	2026-01-22 16:33:04.962654+07
\.


--
-- TOC entry 5620 (class 0 OID 17077)
-- Dependencies: 237
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, user_id, "createdAt", "updatedAt") FROM stdin;
1	3	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07
2	4	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07
5	1	2026-01-16 15:26:36.944+07	2026-01-16 15:26:36.944+07
6	5	2026-01-16 16:17:27.432+07	2026-01-16 16:17:27.432+07
\.


--
-- TOC entry 5622 (class 0 OID 17095)
-- Dependencies: 239
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, ten_danh_muc, mo_ta, danh_muc_cha_id, "createdAt", "updatedAt", img) FROM stdin;
5	Văn học Nước ngoài	\N	\N	2026-01-14 13:37:50.927227+07	2026-01-14 13:37:50.927227+07	\N
31	Văn học Việt Nam	\N	\N	2026-01-15 10:37:45.323+07	2026-01-15 10:37:45.323+07	\N
1	Sách Kinh Tế		\N	2026-01-08 10:31:01.238935+07	2026-01-22 02:37:47.304+07	\N
3	Phát triển bản thâ	eqwe	\N	2026-01-08 10:31:01.238935+07	2026-01-22 15:57:31.655+07	\N
37	Sách K		1	2026-01-22 16:42:23.698+07	2026-01-22 16:42:23.698+07	\N
\.


--
-- TOC entry 5628 (class 0 OID 17161)
-- Dependencies: 245
-- Data for Name: combo_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.combo_items (id, combo_id, product_id, "createdAt", "updatedAt", so_luong) FROM stdin;
1	1	2	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
2	1	3	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
3	2	1	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
4	2	2	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
5	3	4	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
6	3	1	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
7	4	3	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
8	4	2	2026-01-08 10:39:52.271753+07	2026-01-08 10:39:52.271753+07	1
\.


--
-- TOC entry 5630 (class 0 OID 17173)
-- Dependencies: 247
-- Data for Name: combos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.combos (id, ten_combo, mo_ta, img, gia_combo, trang_thai, "createdAt", "updatedAt") FROM stdin;
1	Combo Tinh Hoa Văn Học	Tuyển tập các tác phẩm văn học kinh điển Việt Nam và Thế giới	combo5sach-vhvn.png	150000.00	t	2026-01-08 10:49:15.708017+07	2026-01-08 10:49:15.708017+07
2	Combo Phát Triển Bản Thân	Bộ đôi thay đổi tư duy: Đắc Nhân Tâm + Nhà Giả Kim	dac-nhan-tam.png	160000.00	t	2026-01-08 10:49:15.708017+07	2026-01-08 10:49:15.708017+07
3	Combo Tâm Lý Học Ứng Dụng	Hiểu mình hiểu người: Tư Duy Nhanh Chậm + Đắc Nhân Tâm	tu-duy-nhanh-cham.png	250000.00	t	2026-01-08 10:49:15.708017+07	2026-01-08 10:49:15.708017+07
4	Combo Văn Học Chọn Lọc	Những tác phẩm để đời: Chí Phèo + Nhà Giả Kim	nha-gia-kim.png	130000.00	t	2026-01-08 10:49:15.708017+07	2026-01-08 10:49:15.708017+07
\.


--
-- TOC entry 5650 (class 0 OID 25986)
-- Dependencies: 267
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, ho_ten, email, chu_de, noi_dung, trang_thai, "createdAt", "updatedAt") FROM stdin;
1	Trần Văn Quốc Khánh	tranvanquockhanh123@gmail.com	j	hgf	new	2026-01-21 05:38:10.745+07	2026-01-21 05:38:10.745+07
3	Quản Trị Viên	admin@bookstore.com	chủ đề sách	tôi muốn mua sách kinh doanh\n	new	2026-01-21 13:16:56.312+07	2026-01-21 13:16:56.312+07
4	Trần Văn Quốc Khánh	tranvanquockhanh123@gmail.com	chủ đề sách	gh	new	2026-01-22 01:36:06.418+07	2026-01-22 01:36:06.418+07
5	Quản Trị Viên	admin@bookstore.com	Hello	a	new	2026-01-22 15:49:59.917+07	2026-01-22 15:49:59.917+07
\.


--
-- TOC entry 5632 (class 0 OID 17188)
-- Dependencies: 249
-- Data for Name: ebook_download_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ebook_download_links (id, user_id, product_id, order_id, download_token, expires_at, is_used, "createdAt", "updatedAt") FROM stdin;
1	4	4	3	token-xyz-123	2026-02-01 00:00:00+07	f	2026-01-08 10:50:51.730897+07	2026-01-08 10:50:51.730897+07
\.


--
-- TOC entry 5644 (class 0 OID 19392)
-- Dependencies: 261
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, product_id, "createdAt", "updatedAt") FROM stdin;
3	1	48	2026-01-16 15:48:23.786+07	2026-01-16 15:48:23.786+07
8	1	33	2026-01-16 16:03:12.63+07	2026-01-16 16:03:12.63+07
9	1	54	2026-01-16 16:05:22.758+07	2026-01-16 16:05:22.758+07
30	1	57	2026-01-17 14:32:58.315+07	2026-01-17 14:32:58.315+07
31	1	3	2026-01-17 15:41:32.385+07	2026-01-17 15:41:32.385+07
33	1	38	2026-01-17 15:44:37.006+07	2026-01-17 15:44:37.006+07
34	1	45	2026-01-17 15:44:47.213+07	2026-01-17 15:44:47.213+07
35	1	56	2026-01-17 15:44:57.224+07	2026-01-17 15:44:57.224+07
57	5	3	2026-01-18 16:19:17.053+07	2026-01-18 16:19:17.053+07
59	5	59	2026-01-19 13:08:02.424+07	2026-01-19 13:08:02.424+07
60	5	39	2026-01-19 18:16:44.838+07	2026-01-19 18:16:44.838+07
61	1	37	2026-01-19 21:51:56.99+07	2026-01-19 21:51:56.99+07
64	1	47	2026-01-21 23:55:10.608+07	2026-01-21 23:55:10.608+07
67	5	46	2026-01-22 13:21:38.864+07	2026-01-22 13:21:38.864+07
\.


--
-- TOC entry 5648 (class 0 OID 25964)
-- Dependencies: 265
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, user_id, sender_type, message, is_read, "createdAt", "updatedAt") FROM stdin;
23	1	admin	xin chào	t	2026-01-21 04:16:42.416+07	2026-01-21 04:16:42.433+07
1	5	user	hi	t	2026-01-19 12:36:02.355+07	2026-01-21 04:21:00.413+07
2	5	user	hello	t	2026-01-20 08:34:04.286+07	2026-01-21 04:21:00.413+07
3	5	user	hello	t	2026-01-20 08:34:41.403+07	2026-01-21 04:21:00.413+07
4	5	user	how are zu	t	2026-01-20 08:34:53.994+07	2026-01-21 04:21:00.413+07
5	5	user	you	t	2026-01-20 08:56:29.905+07	2026-01-21 04:21:00.413+07
6	5	user	you	t	2026-01-20 08:56:32.776+07	2026-01-21 04:21:00.413+07
7	5	user	you	t	2026-01-20 08:56:33.728+07	2026-01-21 04:21:00.413+07
8	5	user	hello	t	2026-01-21 03:34:28.372+07	2026-01-21 04:21:00.413+07
9	5	user	fdfd	t	2026-01-21 03:36:16.768+07	2026-01-21 04:21:00.413+07
10	5	user	dfsd	t	2026-01-21 03:42:54.607+07	2026-01-21 04:21:00.413+07
11	5	user	fdfs	t	2026-01-21 03:45:40.024+07	2026-01-21 04:21:00.413+07
12	5	user	xâs	t	2026-01-21 03:49:16.47+07	2026-01-21 04:21:00.413+07
13	5	user	fdsfsd	t	2026-01-21 04:03:51.164+07	2026-01-21 04:21:00.413+07
14	5	user	chào bạn	t	2026-01-21 04:04:06.162+07	2026-01-21 04:21:00.413+07
15	5	user	ds	t	2026-01-21 04:08:00.701+07	2026-01-21 04:21:00.413+07
16	5	user	dá	t	2026-01-21 04:10:51.203+07	2026-01-21 04:21:00.413+07
17	5	user	dá	t	2026-01-21 04:11:54.823+07	2026-01-21 04:21:00.413+07
21	5	user	gfd	t	2026-01-21 04:14:38.654+07	2026-01-21 04:21:00.413+07
22	5	user	chào bạn	t	2026-01-21 04:14:58.555+07	2026-01-21 04:21:00.413+07
18	1	user	dsa	t	2026-01-21 04:12:55.864+07	2026-01-21 04:21:00.487+07
19	1	user	fd	t	2026-01-21 04:13:25.698+07	2026-01-21 04:21:00.487+07
20	1	user	dsa	t	2026-01-21 04:13:51.016+07	2026-01-21 04:21:00.487+07
24	11	user	chào	t	2026-01-21 04:43:38.618+07	2026-01-21 04:43:58.888+07
25	11	admin	chào bạn	t	2026-01-21 04:44:03.113+07	2026-01-21 04:44:05.771+07
26	11	user	tôi muốn mua bánh	t	2026-01-21 04:49:25.46+07	2026-01-21 04:53:21.854+07
27	11	user	vậy ra tạp hóa nha bạn	t	2026-01-21 04:49:38.735+07	2026-01-21 04:53:21.854+07
28	11	admin	dgdf	t	2026-01-21 04:53:24.494+07	2026-01-21 04:53:37.102+07
29	11	admin	fgdf	t	2026-01-21 04:53:28.443+07	2026-01-21 04:53:37.102+07
30	11	admin	fgdf	t	2026-01-21 04:53:29.709+07	2026-01-21 04:53:37.102+07
31	11	user	cvxf	t	2026-01-21 04:53:39.564+07	2026-01-21 04:53:40.32+07
32	11	admin	fdsf	t	2026-01-21 05:18:12.78+07	2026-01-21 05:34:21.104+07
33	11	admin	chào	t	2026-01-21 05:33:59.796+07	2026-01-21 05:34:21.104+07
34	11	user	chào	t	2026-01-21 05:34:24.183+07	2026-01-21 05:34:24.317+07
35	11	admin	dfsdsdasdddddddd	t	2026-01-22 03:02:57.42+07	2026-01-22 03:03:09.948+07
36	11	user	hi	t	2026-01-22 03:03:16.547+07	2026-01-22 03:03:32.592+07
37	11	admin	bạn tên gì	t	2026-01-22 03:03:38.053+07	2026-01-22 03:03:39.95+07
38	11	user	tên gì kệ tôi	t	2026-01-22 03:03:53.039+07	2026-01-22 03:03:53.942+07
39	5	user	chaof ksjdsaa	t	2026-01-22 15:37:12.677+07	2026-01-22 15:37:33.314+07
40	5	admin	efniwhfwehoido[sdopsd	t	2026-01-22 15:37:42.351+07	2026-01-22 15:37:44.904+07
41	5	user	he	t	2026-01-22 16:07:06.071+07	2026-01-22 16:07:08.083+07
\.


--
-- TOC entry 5652 (class 0 OID 40466)
-- Dependencies: 269
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, so_luong_dat, don_gia, "createdAt", "updatedAt") FROM stdin;
1	12	3	2	65000.00	2026-01-19 22:07:42.406+07	2026-01-19 22:07:42.406+07
2	12	39	1	135000.00	2026-01-19 22:07:42.409+07	2026-01-19 22:07:42.409+07
3	12	47	1	120000.00	2026-01-19 22:07:42.41+07	2026-01-19 22:07:42.41+07
4	13	38	1	75000.00	2026-01-19 22:08:53.395+07	2026-01-19 22:08:53.395+07
5	14	47	1	120000.00	2026-01-19 22:13:22.715+07	2026-01-19 22:13:22.715+07
6	15	37	1	120000.00	2026-01-19 22:16:45.205+07	2026-01-19 22:16:45.205+07
7	16	37	1	120000.00	2026-01-19 22:19:27.965+07	2026-01-19 22:19:27.965+07
8	17	37	1	120000.00	2026-01-19 22:21:28.188+07	2026-01-19 22:21:28.188+07
9	18	37	1	120000.00	2026-01-19 22:22:16.391+07	2026-01-19 22:22:16.391+07
10	19	37	1	120000.00	2026-01-19 22:36:59.6+07	2026-01-19 22:36:59.6+07
11	20	33	1	55000.00	2026-01-19 23:37:31.918+07	2026-01-19 23:37:31.918+07
12	21	37	1	120000.00	2026-01-19 23:52:26.525+07	2026-01-19 23:52:26.525+07
13	21	47	1	120000.00	2026-01-19 23:52:26.528+07	2026-01-19 23:52:26.528+07
14	22	59	1	80000.00	2026-01-20 09:31:22.365+07	2026-01-20 09:31:22.365+07
15	22	37	2	120000.00	2026-01-20 09:31:22.369+07	2026-01-20 09:31:22.369+07
16	23	37	4	120000.00	2026-01-20 16:34:52.11+07	2026-01-20 16:34:52.11+07
17	24	58	1	60000.00	2026-01-21 13:59:22.819+07	2026-01-21 13:59:22.819+07
18	24	33	1	55000.00	2026-01-21 13:59:22.822+07	2026-01-21 13:59:22.822+07
19	24	55	2	90000.00	2026-01-21 13:59:22.823+07	2026-01-21 13:59:22.823+07
20	24	57	1	145000.00	2026-01-21 13:59:22.824+07	2026-01-21 13:59:22.824+07
21	25	47	3	120000.00	2026-01-22 01:36:35.607+07	2026-01-22 01:36:35.607+07
22	26	37	1	120000.00	2026-01-22 01:38:36.59+07	2026-01-22 01:38:36.59+07
23	27	45	2	120000.00	2026-01-22 02:27:02.371+07	2026-01-22 02:27:02.371+07
24	28	37	1	120000.00	2026-01-22 11:08:21.623+07	2026-01-22 11:08:21.623+07
25	29	37	3	120000.00	2026-01-22 13:23:47.165+07	2026-01-22 13:23:47.165+07
26	29	38	1	75000.00	2026-01-22 13:23:47.168+07	2026-01-22 13:23:47.168+07
27	29	45	1	120000.00	2026-01-22 13:23:47.169+07	2026-01-22 13:23:47.169+07
28	30	37	2	120000.00	2026-01-22 14:20:22.242+07	2026-01-22 14:20:22.242+07
29	30	59	2	80000.00	2026-01-22 14:20:22.245+07	2026-01-22 14:20:22.245+07
30	31	37	1	120000.00	2026-01-22 14:25:55.879+07	2026-01-22 14:25:55.879+07
31	32	55	1	90000.00	2026-01-22 14:28:02.716+07	2026-01-22 14:28:02.716+07
32	33	57	1	145000.00	2026-01-22 15:54:03.2+07	2026-01-22 15:54:03.2+07
33	34	59	1	80000.00	2026-01-22 16:06:00.319+07	2026-01-22 16:06:00.319+07
\.


--
-- TOC entry 5642 (class 0 OID 19339)
-- Dependencies: 259
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, trang_thai_don_hang, phuong_thuc_thanh_toan, trang_thai_thanh_toan, ten_nguoi_nhan, email_nguoi_nhan, so_dt_nguoi_nhan, dia_chi_giao_hang, ghi_chu_khach_hang, tong_tien_hang, phi_van_chuyen, tong_thanh_toan, "createdAt", "updatedAt", "deletedAt", sdt_nguoi_nhan) FROM stdin;
1	\N	pending	COD	f	Hứa Thành Nhất	huathanhnhat@gmail.com	0123456789	123 Đường ABC, HCM	Giao giờ hành chính	189000.00	30000.00	219000.00	2026-01-16 12:50:52.363+07	2026-01-16 12:50:52.363+07	\N	\N
2	\N	confirmed	Banking	f	Hứa Thành Nhất	huathanhnhat@gmail.com	0123456789	123 Đường ABC, HCM	Gọi trước khi giao	538000.00	30000.00	568000.00	2026-01-16 12:50:52.37+07	2026-01-16 12:50:52.37+07	\N	\N
3	\N	delivered	Momo	t	Hứa Thành Nhất	huathanhnhat@gmail.com	0123456789	123 Đường ABC, HCM	Để ở lễ tân	378000.00	30000.00	408000.00	2026-01-16 12:50:52.374+07	2026-01-16 12:50:52.374+07	\N	\N
4	5	pending	COD	f	khanh	tranvanquockhanh123@gmail.com	0969671344	502 lê hòng phong, Xã Ya Hội, Huyện Đăk Pơ, Tỉnh Gia Lai	fdsfs	80000.00	30000.00	110000.00	2026-01-19 17:08:21.534+07	2026-01-19 17:08:21.534+07	\N	\N
6	1	pending	COD	f	khanh	tranvanquockhanh123@gmail.com	0969671344	502 lê hòng phong, Xã Đồng Du, Huyện Bình Lục, Tỉnh Hà Nam	e	120000.00	30000.00	150000.00	2026-01-19 18:54:47.603+07	2026-01-19 18:54:47.603+07	\N	\N
7	1	pending	COD	f	khanh	tranvanquockhanh123@gmail.com	0969671344	2, Xã Đông Minh, Huyện Yên Minh, Tỉnh Hà Giang	e	320000.00	30000.00	350000.00	2026-01-19 18:55:36.69+07	2026-01-19 18:55:36.69+07	\N	\N
12	5	pending	COD	f	Test User	test@example.com		123 Test Street	Test order debug	385000.00	30000.00	415000.00	2026-01-19 22:07:42.402+07	2026-01-19 22:07:42.402+07	\N	\N
13	1	pending	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Đức Liên, Huyện Vũ Quang, Tỉnh Hà Tĩnh	s	75000.00	30000.00	105000.00	2026-01-19 22:08:53.389+07	2026-01-19 22:08:53.389+07	\N	\N
14	1	pending	COD	f	khanh	tranvanquockhanh123@gmail.com		2, Xã Đồn Xá, Huyện Bình Lục, Tỉnh Hà Nam	ư	120000.00	30000.00	150000.00	2026-01-19 22:13:22.705+07	2026-01-19 22:13:22.705+07	\N	\N
15	1	pending	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Vĩnh Phúc, Huyện Bắc Quang, Tỉnh Hà Giang	s	120000.00	30000.00	150000.00	2026-01-19 22:16:45.201+07	2026-01-19 22:16:45.201+07	\N	\N
16	1	pending	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Đăk Sơmei, Huyện Đăk Đoa, Tỉnh Gia Lai	s	120000.00	30000.00	150000.00	2026-01-19 22:19:27.961+07	2026-01-19 22:19:27.961+07	\N	\N
18	5	cancelled	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Phường Bưởi, Quận Tây Hồ, Thành phố Hà Nội	sa	120000.00	30000.00	150000.00	2026-01-19 22:22:16.388+07	2026-01-19 22:31:52.187+07	\N	\N
17	1	delivered	COD	t	khanh	tranvanquockhanh123@gmail.com		2, Xã Vân Nam, Huyện Phúc Thọ, Thành phố Hà Nội	s	120000.00	30000.00	150000.00	2026-01-19 22:21:28.182+07	2026-01-19 22:34:12.265+07	\N	\N
30	1	pending	COD	f	Quản Trị Viên	admin@bookstore.com		fsdf, Xã Tân Thành, Thành phố Cà Mau, Tỉnh Cà Mau	xz	400000.00	0.00	400000.00	2026-01-22 14:20:22.239+07	2026-01-22 15:58:14.364+07	2026-01-22 15:58:14.364+07	096 967 13 44
19	5	delivered	COD	t	new	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Đức Đồng, Huyện Đức Thọ, Tỉnh Hà Tĩnh	e	120000.00	30000.00	150000.00	2026-01-19 22:36:59.595+07	2026-01-19 22:37:19.539+07	\N	\N
25	5	delivered	COD	t	Trần Văn Quốc Khánh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Yên Sơn, Huyện Quốc Oai, Thành phố Hà Nội	fg	360000.00	0.00	360000.00	2026-01-22 01:36:35.602+07	2026-01-22 01:37:56.991+07	\N	0969671344
20	5	delivered	COD	t	new	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Yên Nam, Thị xã Duy Tiên, Tỉnh Hà Nam	da	55000.00	30000.00	85000.00	2026-01-19 23:37:31.912+07	2026-01-19 23:38:19.606+07	\N	0969671344
26	5	delivered	momo	t	Trần Văn Quốc Khánh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Xuân Sơn, Thị xã Sơn Tây, Thành phố Hà Nội	fgh	120000.00	30000.00	150000.00	2026-01-22 01:38:36.587+07	2026-01-22 01:39:25.435+07	\N	096 967 13 44
21	5	cancelled	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Việt Hồng, Huyện Thanh Hà, Tỉnh Hải Dương	gf	240000.00	30000.00	270000.00	2026-01-19 23:52:26.517+07	2026-01-22 16:33:40.607+07	\N	0969671344
24	1	delivered	COD	t	Quản Trị Viên	admin@bookstore.com		ê, Phường Đồng Văn, Thị xã Duy Tiên, Tỉnh Hà Nam	s	440000.00	30000.00	470000.00	2026-01-21 13:59:22.815+07	2026-01-22 01:40:45.876+07	\N	096 967 13 44
27	5	cancelled	COD	f	Trần Văn Quốc Khánh	tranvanquockhanh123@gmail.com		43 43, Xã Đức Lĩnh, Huyện Vũ Quang, Tỉnh Hà Tĩnh	43	240000.00	30000.00	270000.00	2026-01-22 02:27:02.367+07	2026-01-22 02:27:54.201+07	\N	123456789
23	5	confirmed	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Vân Nam, Huyện Phúc Thọ, Thành phố Hà Nội	c	480000.00	30000.00	510000.00	2026-01-20 16:34:52.105+07	2026-01-22 02:51:54.431+07	\N	0969671344
22	5	cancelled	COD	f	khanh	tranvanquockhanh123@gmail.com		502 lê hòng phong, Xã Đồng Du, Huyện Bình Lục, Tỉnh Hà Nam	ds	320000.00	30000.00	350000.00	2026-01-20 09:31:22.356+07	2026-01-22 02:53:03.501+07	\N	0969671344
28	1	delivered	COD	t	Quản Trị Viên	admin@bookstore.com		502 lê hòng phong, Thị trấn An Phú, Huyện An Phú, Tỉnh An Giang	s	120000.00	30000.00	150000.00	2026-01-22 11:08:21.617+07	2026-01-22 14:46:39.587+07	\N	096 967 13 44
32	1	confirmed	COD	f	Quản Trị Viên	admin@bookstorecom		65456 lê duy khương, Thị trấn Thanh Miện, Huyện Thanh Miện, Tỉnh Hải Dương		90000.00	30000.00	120000.00	2026-01-22 14:28:02.713+07	2026-01-22 14:54:44.457+07	2026-01-22 14:54:44.456+07	096 967 13 44
31	1	pending	COD	f	Quản Trị Viên	admin@bookstore		65 huỳnh thúca kháng, Xã Bình Ba, Huyện Châu Đức, Tỉnh Bà Rịa - Vũng Tàu	1231	120000.00	30000.00	150000.00	2026-01-22 14:25:55.876+07	2026-01-22 14:54:51.489+07	2026-01-22 14:54:51.489+07	096 9
33	1	pending	momo	f	Quản Trị Viên	admin@bookstore.com		5200, Xã Hùng Sơn, Huyện Kim Bôi, Tỉnh Hoà Bình		145000.00	30000.00	175000.00	2026-01-22 15:54:03.198+07	2026-01-22 15:57:14.224+07	2026-01-22 15:57:14.224+07	096 967 13 44
29	5	confirmed	COD	f	Trần Văn Quốc Khánh	tranvanquockhanh123@gmail.com		hufhd, Xã Trần Hưng Đạo, Huyện Lý Nhân, Tỉnh Hà Nam	dd	555000.00	0.00	555000.00	2026-01-22 13:23:47.161+07	2026-01-22 15:57:39.641+07	2026-01-22 15:57:39.641+07	05489487778
34	1	cancelled	COD	f	Quản Trị	admin@bookstore.com		jnu, Xã Lạc Nông, Huyện Bắc Mê, Tỉnh Hà Giang		80000.00	30000.00	110000.00	2026-01-22 16:06:00.316+07	2026-01-22 16:43:37.282+07	\N	096 967 13 44
\.


--
-- TOC entry 5610 (class 0 OID 16805)
-- Dependencies: 227
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, tieu_de, noi_dung, trang_thai, "createdAt", "updatedAt", tom_tat, slug, hinh_anh, user_id) FROM stdin;
1	Top 5 Cuốn Sách Hay Nhất 2026	\n        <p>Đọc sách là một thói quen tuyệt vời giúp mở mang kiến thức và nuôi dưỡng tâm hồn. Dưới đây là những lợi ích của việc đọc sách mỗi ngày:</p>\n        <ul>\n            <li><strong>Mở rộng kiến thức:</strong> Sách là kho tàng tri thức vô tận của nhân loại viao.</li>\n            <li><strong>Cải thiện khả năng tập trung:</strong> Khi đọc sách, bạn phải tập trung vào cốt truyện và ngôn từ.</li>\n            <li><strong>Giảm căng thẳng:</strong> Một cuốn sách hay có thể đưa bạn đến một thế giới khác, giúp quên đi lo âu.</li>\n            <li><strong>Cải thiện trí nhớ:</strong> Việc ghi nhớ nhân vật và tình tiết giúp rèn luyện não bộ.</li>\n        </ul>\n        <p>Hãy dành ít nhất 30 phút mỗi ngày để đọc sách nhé!</p>\n      	t	2026-01-08 10:55:31.839908+07	2026-01-21 02:59:18.447+07	Đọc sách không chỉ giúp mở mang kiến thức mà còn giảm căng thẳng, cải thiện trí nhớ và tăng khả năng tập trung.	\N	/images/blog/dac-nhan-tam.jpg	\N
2	Lợi ích của việc đọc sách mỗi ngày	<p>Năm 2026 chứng kiến sự l&ecirc;n ng&ocirc;i của nhiều t&aacute;c phẩm văn học xuất sắc. Dưới đ&acirc;y l&agrave; top 5 cuốn s&aacute;ch bạn kh&ocirc;ng n&ecirc;n bỏ qua:</p>\n<ol>\n<li><strong>Nh&agrave; Giả Kim:</strong> Một c&acirc;u chuyện về h&agrave;nh tr&igrave;nh theo đuổi ước mơ.</li>\n<li><strong>Đắc Nh&acirc;n T&acirc;m:</strong> Nghệ thuật thu phục l&ograve;ng người.</li>\n<li><strong>Tư Duy Nhanh V&agrave; Chậm:</strong> Hiểu về c&aacute;ch n&atilde;o bộ ra quyết định.</li>\n<li><strong>Sapiens: Lược Sử Lo&agrave;i Người:</strong> C&acirc;u chuyện về lịch sử nh&acirc;n loại.</li>\n<li><strong>Atomic Habits:</strong> Thay đổi t&oacute;i quen, thay đổi cuộc đời.</li>\n</ol>\n<p>Bạn đ&atilde; đọc bao nhi&ecirc;u cuốn trong danh s&aacute;ch n&agrave;y? H&atilde;y gh&eacute; BookZone để t&igrave;m mua ngay nh&eacute;!!!!</p>	t	2026-01-08 10:55:31.839908+07	2026-01-21 03:07:54.069+07	Khám phá những cuốn sách bán chạy nhất năm 2026, từ văn học, kinh tế đến kỹ năng sống, được độc giả yêu thích.	\N	/images/blog/nha-gia-kim.jpg	\N
4	Sách phát triển  bản thân	<p><strong>s&aacute;ch hay</strong></p>	t	2026-01-21 03:59:35.151+07	2026-01-21 03:59:35.151+07	sách tư duy tiền bạc	\N	/images/hinh_anh-1768942775140-103280662.png	5
5	Lợi ích của việc đọc sách mỗi ngày	<p>a</p>	t	2026-01-22 15:51:40.16+07	2026-01-22 15:51:40.16+07	T	\N	/images/hinh_anh-1769071900150-810096411.png	1
\.


--
-- TOC entry 5624 (class 0 OID 17113)
-- Dependencies: 241
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, ten_sach, mo_ta_ngan, gia_bia, so_luong_ton_kho, tac_gia, nha_xuat_ban, nam_xuat_ban, img, so_trang, product_type, ebook_url, danh_muc_id, "createdAt", "updatedAt", da_ban, views, trang_thai) FROM stdin;
68	Quẳng Gánh Lo Đi Và Vui 	<p>a</p>	1100000.00	100	Dale Carnegie	NXB First News	2022	/images/img-1769069032100-846544411.png	300	print_book	\N	1	2026-01-22 15:03:52.102+07	2026-01-22 15:07:03.152+07	0	0	f
3	Chí Phèo	<p>T&aacute;c phẩm văn học hiện thực xuất sắc của Nam Cao.</p>	65000.00	720	Nam Cao	NXB Văn Học	2020	/images/chi-pheo.png	200	printed	\N	31	2026-01-08 10:31:01.238935+07	2026-01-22 15:08:34.284+07	966	86	t
57	7 Thói Quen Để Thành Đạt	Những nguyên tắc vàng giúp bạn đạt được hiệu quả cá nhân và nghề nghiệp.	145000.00	68	Stephen R. Covey	NXB Trẻ	2019	/images/bay-thoi-quen-de-thanh-dat.png	480	print_book	\N	3	2026-01-15 16:17:53.308+07	2026-01-22 15:54:03.196+07	286	3	t
65	Test Product 1769068699930	<p>Short description</p>	100000.00	1	Author Test	Publisher Test	2022	/images/placeholder.png	300	print_book	\N	1	2026-01-22 14:58:19.931+07	2026-01-22 16:05:17.719+07	0	0	t
4	Tư Duy Nhanh và Chậm	Sách tâm lý học hành vi kinh điển.	189000.00	40	Daniel Kahneman	NXB Trẻ	2023	/images/tu-duy-nhanh-va-cham.png	222	ebook	tu-duy-nhanh-va-cham.pdf	1	2026-01-08 10:31:01.238935+07	2026-01-15 17:14:03.765+07	537	0	t
51	Đồi Gió Hú	Một câu chuyện tình yêu dữ dội, hoang dại và đầy ám ảnh trên vùng đồng cỏ nước Anh.	95000.00	60	Emily Brontë	NXB Văn Học	2021	/images/doi-gio-hu.png	400	print_book	\N	5	2026-01-15 15:50:39.67+07	2026-01-22 16:32:40.156+07	657	2	t
38	Dế Mèn Phiêu Lưu Ký	Tác phẩm thiếu nhi kinh điển của văn học Việt Nam.	75000.00	78	Tô Hoài	NXB Kim Đồng	2017	/images/de-men-phieu-luu-ky.png	200	print_book	\N	31	2026-01-14 13:50:17.25+07	2026-01-22 13:23:47.16+07	372	4	t
39	Bố Già	Tiểu thuyết nổi tiếng về thế giới mafia Ý tại Mỹ.	135000.00	29	Mario Puzo	NXB Văn Học	2019	/images/bo-gia.png	448	print_book	\N	5	2026-01-14 13:50:17.25+07	2026-01-21 05:22:51.541+07	571	4	t
55	Tỷ Phú Bán Giày	Câu chuyện về Zappos và văn hóa doanh nghiệp hướng tới hạnh phúc.	90000.00	47	Tony Hsieh	NXB Thái Hà	2018	/images/ty-phu-ban-giay.png	300	print_book	\N	1	2026-01-15 16:17:53.302+07	2026-01-22 14:28:02.711+07	326	3	t
59	Quẳng Gánh Lo Đi Và Vui Sống	<p><strong>Cẩm nang gi&uacute;p bạn đ&aacute;nh bại nỗi lo &acirc;u để tận hưởng cuộc sống trọn vẹn cuộc sống bản th&acirc;n.</strong></p>	80000.00	12	Dale Carnegie	NXB First News	2018	/images/quang-ganh-lo-di-va-vui-song.png	320	print_book	\N	3	2026-01-15 16:17:53.314+07	2026-01-22 16:35:53.617+07	422	9	t
37	Cha Giàu Cha Nghèo	Tư duy tài chính cá nhân và con đường tự do tài chính.	120000.00	37	Robert T. Kiyosaki	NXB Trẻ	2020	/images/cha-giau-cha-ngheo.png	336	print_book	\N	1	2026-01-14 13:50:17.25+07	2026-01-22 16:39:43.055+07	970	107	t
46	Hoàng Tử Bé	Một cuốn sách diệu kỳ dành cho trẻ em và những ai từng là trẻ em, về tình yêu và trách nhiệm.	75000.00	150	Antoine de Saint-Exupéry	NXB Kim Đồng	2022	/images/hoang-tu-be.png	100	print_book	\N	5	2026-01-15 15:50:39.634+07	2026-01-22 13:21:33.687+07	344	4	t
35	Nhà Giả Kim	Hành trình theo đuổi ước mơ và khám phá chính mình.	99000.00	70	Paulo Coelho	NXB Lao Động	2021	/images/nha-gia-kim.png	228	print_book	\N	5	2026-01-14 13:50:17.25+07	2026-01-21 23:14:54.312+07	675	4	t
53	Nhà Đầu Tư Thông Minh	Cuốn sách "gối đầu giường" cho mọi nhà đầu tư chứng khoán giá trị.	180000.00	60	Benjamin Graham	NXB Trẻ	2019	/images/nha-dau-tu-thong-minh.png	640	print_book	\N	1	2026-01-15 16:17:53.297+07	2026-01-15 17:14:03.751+07	104	0	t
56	Đánh Thức Con Người Phi Thường Trong Bạn	Phương pháp kiểm soát cảm xúc, cơ thể, các mối quan hệ và tài chính.	160000.00	88	Anthony Robbins	NXB Tổng Hợp TP.HCM	2020	/images/danh-thuc-con-nguoi-phi-thuong-trong-ban.png	520	print_book	\N	3	2026-01-15 16:17:53.305+07	2026-01-22 03:04:13.632+07	329	1	t
33	Lão Hạc	Câu chuyện cảm động về người nông dân nghèo giàu lòng tự trọng.	55000.00	38	Nam Cao	NXB Văn Học	2019	/images/lao-hac.png	140	print_book	\N	31	2026-01-14 13:50:17.25+07	2026-01-22 16:28:17.624+07	531	4	t
54	Chiến Tranh Tiền Tệ	Những âm mưu tài chính đằng sau các sự kiện lịch sử thế giới.	115000.00	100	Song Hongbing	NXB Lao Động Xã Hội	2021	/images/chien-tranh-tien-te.png	450	print_book	\N	1	2026-01-15 16:17:53.3+07	2026-01-15 17:14:03.731+07	181	0	t
48	Hai Số Phận	Câu chuyện đầy kịch tính về hai người đàn ông sinh ra cùng này khác nhau về số phận nhưng cuộc đời họ đan xen.	165000.00	100	Jeffrey Archer	NXB Văn Học	2020	/images/hai-so-phan.png	700	print_book	\N	5	2026-01-15 15:50:39.654+07	2026-01-15 17:14:03.744+07	422	0	t
47	Rừng Na Uy	<p>Tiểu thuyết l&atilde;ng mạn pha lẫn u sầu, kể về những mất m&aacute;t v&agrave; sự trưởng th&agrave;nh của tuổi trẻ.</p>	120000.00	1	Haruki Murakami	NXB Hội Nhà Văn	2021	/images/rung-na-uy.png	550	print_book	\N	5	2026-01-15 15:50:39.65+07	2026-01-22 16:40:48.858+07	887	22	t
52	Kinh Tế Học Hài Hước	Cuốn sách lật tẩy những mặt khuất của thế giới thực bằng lăng kính kinh tế học đầy thú vị.	135000.00	80	Steven D. Levitt, Stephen J. Dubner	NXB Nhã Nam	2020	/images/kinh-te-hoc-hai-huoc.png	300	print_book	\N	1	2026-01-15 16:17:53.284+07	2026-01-15 17:14:03.749+07	35	0	t
44	Tắt Đèn		70000.00	1000	Ngô Tất Tố	NXB Văn Học	2021	/images/tat-den.png	303	print_book	\N	31	2026-01-15 10:37:45.369+07	2026-01-22 15:08:00.369+07	360	5	t
49	Không Gia Đình	Cuộc phiêu lưu đầy gian nan nhưng cũng đầy tình người của cậu bé Remi và gánh xiếc rong.	110000.00	90	Hector Malot	NXB Văn Học	2020	/images/khong-gia-dinh.png	600	print_book	\N	5	2026-01-15 15:50:39.662+07	2026-01-22 16:10:58.051+07	366	2	t
43	Số Đỏ		85000.00	500	Vũ Trọng Phụng	NXB Văn Học	2023	/images/so-do.png	485	print_book	\N	31	2026-01-15 10:37:45.339+07	2026-01-22 15:08:14.296+07	326	2	t
58	Đời Thay Đổi Khi Chúng Ta Thay Đổi	Những bài học nhẹ nhàng nhưng sâu sắc giúp bạn sống vui vẻ và tích cực hơn.	60000.00	119	Andrew Matthews	NXB Trẻ	2021	/images/doi-thay-doi-khi-chung-ta-thay-doi.png	180	print_book	\N	3	2026-01-15 16:17:53.311+07	2026-01-22 14:47:05.923+07	313	3	t
45	Tuổi Thơ Dữ Dội		120000.00	200	Phùng Quán	NXB Kim Đồng	2023	/images/tuoi-tho-du-doi.png	221	print_book	\N	31	2026-01-15 10:37:45.38+07	2026-01-22 15:08:21.903+07	798	75	t
34	Đắc Nhân Tâm	Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử.	150000.00	60	Dale Carnegie	NXB Tổng Hợp TP.HCM	2020	/images/dac-nhan-tam.png	320	print_book	\N	3	2026-01-14 13:50:17.25+07	2026-01-15 17:14:03.76+07	6	0	t
\.


--
-- TOC entry 5634 (class 0 OID 17274)
-- Dependencies: 251
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (id, ngay_bat_dau, ngay_ket_thuc, "createdAt", "updatedAt", ten_km, code, giam_gia_percent) FROM stdin;
1	2026-01-01 00:00:00+07	2026-12-31 00:00:00+07	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07	\N	\N	0
2	2026-01-01 00:00:00+07	2026-12-31 00:00:00+07	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07	\N	\N	0
3	2026-01-01 00:00:00+07	2026-02-28 00:00:00+07	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07	\N	\N	0
4	2026-01-01 00:00:00+07	2026-06-30 00:00:00+07	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07	\N	\N	0
\.


--
-- TOC entry 5614 (class 0 OID 16843)
-- Dependencies: 231
-- Data for Name: receipt_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipt_items (id, receipt_id, product_id, so_luong, don_gia_nhap) FROM stdin;
3	1	3	1	0.00
5	2	4	1	0.00
\.


--
-- TOC entry 5612 (class 0 OID 16823)
-- Dependencies: 229
-- Data for Name: receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipts (id, "createdAt", "updatedAt", nha_cung_cap, tong_tien, nguoi_nhap_id) FROM stdin;
1	2026-01-08 11:02:57.52669+07	2026-01-08 11:02:57.52669+07	\N	0.00	\N
2	2026-01-08 11:02:57.52669+07	2026-01-08 11:02:57.52669+07	\N	0.00	\N
\.


--
-- TOC entry 5636 (class 0 OID 17331)
-- Dependencies: 253
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, product_id, rating, comment, "createdAt", "updatedAt", parent_id, trang_thai) FROM stdin;
2	3	3	4	Sách in đẹp, giấy xốp nhẹ.	2026-01-08 10:42:44.889054+07	2026-01-08 10:42:44.889054+07	\N	t
3	4	4	5	Kiến thức tâm lý học rất hay.	2026-01-08 10:42:44.889054+07	2026-01-08 10:42:44.889054+07	\N	t
6	5	37	5	sách rất hay	2026-01-22 02:53:55.921+07	2026-01-22 02:53:55.921+07	\N	t
8	1	37	5	hhhh	2026-01-22 14:49:36.258+07	2026-01-22 14:49:53.286+07	\N	f
5	5	37	4	sản phẩm đẹp, sách hay	2026-01-19 22:37:56.55+07	2026-01-19 22:37:56.55+07	\N	t
7	1	37	5	tốt	2026-01-22 14:49:20.67+07	2026-01-22 16:36:13.897+07	\N	f
\.


--
-- TOC entry 5616 (class 0 OID 17037)
-- Dependencies: 233
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, ten_quyen, "createdAt", "updatedAt") FROM stdin;
1	admin	2026-01-19 23:15:57.008178+07	2026-01-19 23:15:57.008178+07
2	user	2026-01-19 23:15:57.008178+07	2026-01-19 23:15:57.008178+07
\.


--
-- TOC entry 5646 (class 0 OID 19434)
-- Dependencies: 263
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, ten_website, dia_chi, email, so_dien_thoai, facebook, instagram, twitter, linkedin, nam_ban_quyen, "createdAt", "updatedAt", mo_ta) FROM stdin;
1	Book	Quận 7, TP. Hồ Chí Minh	bookzonestore07@gmail.com	065498712	https://facebook.com	https://instagram.com	https://twitter.com	https://linkedin.com	2025	2026-01-17 15:05:15.22+07	2026-01-22 16:41:33.48+07	Nơi tri thức bắt đầu. Khám phá hàng ngàn đầu sách hấp dẫn, ebook, truyện tranh và các combo ưu đãi đặc biệt.
\.


--
-- TOC entry 5638 (class 0 OID 17360)
-- Dependencies: 255
-- Data for Name: slideshows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.slideshows (id, image_url, tieu_de, phu_de, link_to, thu_tu_hien_thi, trang_thai, "createdAt", "updatedAt") FROM stdin;
1	slider_item_1_image.png	Tuần lễ Sách Văn Học	Giảm giá lên đến 50%	/categories/2	0	t	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07
2	slider_item_2_image.png	Top Sách Bán Chạy Nhất	Đừng bỏ lỡ những siêu phẩm	/products/1	0	t	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07
3	slider_item_3_image.png	Mừng Xuân Ất Tỵ 2026	Lì xì đầu năm - Freeship mọi đơn	/promotions	3	t	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07
4	slider_item_5_image.png	Combo Sách Kinh Tế	Mua 3 tặng 1 - Tích lũy kiến thức	/combos	4	t	2026-01-08 10:31:01.238935+07	2026-01-08 10:31:01.238935+07
\.


--
-- TOC entry 5618 (class 0 OID 17050)
-- Dependencies: 235
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, role_id, email, mat_khau, ho_ten, "createdAt", "updatedAt", trang_thai, ten_dang_nhap, img, dia_chi, ngay_sinh, "resetPasswordToken", "resetPasswordExpire", so_dien_thoai) FROM stdin;
7	2	an.nguyen.vpp@gmail.com	$2b$10$.PS2uWCpE3CA5KjTpQVRT.RxLj.mOqyQGzhzsPeumheZds7IWVmuq	Nguyễn Văn An	2026-01-08 10:31:01.238935+07	2026-01-21 02:28:38.04+07	t	an.nguyen.vpp	default_avatar.png	\N	\N	\N	\N	\N
8	2	mod.support@bookstore.com	$2b$10$.PS2uWCpE3CA5KjTpQVRT.RxLj.mOqyQGzhzsPeumheZds7IWVmuq	Trần Bích Hằng	2026-01-08 10:31:01.238935+07	2026-01-21 02:28:38.044+07	t	mod.support	default_avatar.png	\N	\N	\N	\N	\N
11	2	vi@gmail.com	$2b$10$gOzxCq8kpp7qvJ/J.kmUI.3Z9W72iVY3Sv7RfANdk7muCYgDDh7hq	mai	2026-01-21 04:43:20.283+07	2026-01-21 04:43:20.283+07	t	vi	default_avatar.png	\N	\N	\N	\N	\N
5	2	tranvanquockhanh123@gmail.com	$2b$10$.PS2uWCpE3CA5KjTpQVRT.RxLj.mOqyQGzhzsPeumheZds7IWVmuq	Trần Văn Quốc Khánh	2026-01-08 10:31:01.238935+07	2026-01-22 01:41:34.995+07	t	tranvanquockhanh123	default_avatar.png	\N	\N	\N	\N	\N
1	1	admin@bookstore.com	$2b$10$W4V2BKcg5oFo.//ckr.FYe.leOPRdVQdkbM51N3sYwuUbH0/lIby2	Quản Trị	2026-01-08 10:31:01.238935+07	2026-01-22 15:54:33.172+07	t	admin	default_avatar.png	Quận 1, TP. Hồ Chí Minh	2002-01-07	\N	\N	096 967 13 44
3	2	luunguyen6752@gmail.com	$2b$10$.PS2uWCpE3CA5KjTpQVRT.RxLj.mOqyQGzhzsPeumheZds7IWVmuq	Lưu Nguyên	2026-01-08 10:31:01.238935+07	2026-01-21 02:28:38.017+07	t	luunguyen6752	default_avatar.png	\N	\N	\N	\N	\N
4	2	luonganhduy1002@gmail.com	$2b$10$.PS2uWCpE3CA5KjTpQVRT.RxLj.mOqyQGzhzsPeumheZds7IWVmuq	Lương Anh Duy	2026-01-08 10:31:01.238935+07	2026-01-21 02:28:38.038+07	t	luonganhduy1002	default_avatar.png	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5693 (class 0 OID 0)
-- Dependencies: 256
-- Name: SiteSettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SiteSettings_id_seq"', 1, true);


--
-- TOC entry 5694 (class 0 OID 0)
-- Dependencies: 242
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 81, true);


--
-- TOC entry 5695 (class 0 OID 0)
-- Dependencies: 236
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 6, true);


--
-- TOC entry 5696 (class 0 OID 0)
-- Dependencies: 238
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 37, true);


--
-- TOC entry 5697 (class 0 OID 0)
-- Dependencies: 244
-- Name: combo_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.combo_items_id_seq', 8, true);


--
-- TOC entry 5698 (class 0 OID 0)
-- Dependencies: 246
-- Name: combos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.combos_id_seq', 4, true);


--
-- TOC entry 5699 (class 0 OID 0)
-- Dependencies: 266
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 6, true);


--
-- TOC entry 5700 (class 0 OID 0)
-- Dependencies: 248
-- Name: ebook_download_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ebook_download_links_id_seq', 1, true);


--
-- TOC entry 5701 (class 0 OID 0)
-- Dependencies: 260
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 68, true);


--
-- TOC entry 5702 (class 0 OID 0)
-- Dependencies: 264
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 41, true);


--
-- TOC entry 5703 (class 0 OID 0)
-- Dependencies: 268
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 33, true);


--
-- TOC entry 5704 (class 0 OID 0)
-- Dependencies: 258
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 34, true);


--
-- TOC entry 5705 (class 0 OID 0)
-- Dependencies: 226
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 5, true);


--
-- TOC entry 5706 (class 0 OID 0)
-- Dependencies: 240
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 68, true);


--
-- TOC entry 5707 (class 0 OID 0)
-- Dependencies: 250
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_id_seq', 4, true);


--
-- TOC entry 5708 (class 0 OID 0)
-- Dependencies: 230
-- Name: receipt_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipt_items_id_seq', 5, true);


--
-- TOC entry 5709 (class 0 OID 0)
-- Dependencies: 228
-- Name: receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipts_id_seq', 2, true);


--
-- TOC entry 5710 (class 0 OID 0)
-- Dependencies: 252
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 8, true);


--
-- TOC entry 5711 (class 0 OID 0)
-- Dependencies: 232
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 5712 (class 0 OID 0)
-- Dependencies: 262
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, true);


--
-- TOC entry 5713 (class 0 OID 0)
-- Dependencies: 254
-- Name: slideshows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.slideshows_id_seq', 4, true);


--
-- TOC entry 5714 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- TOC entry 5432 (class 2606 OID 19260)
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- TOC entry 5338 (class 2606 OID 17149)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5328 (class 2606 OID 17086)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 5330 (class 2606 OID 17088)
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- TOC entry 5332 (class 2606 OID 17106)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5340 (class 2606 OID 17171)
-- Name: combo_items combo_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_items
    ADD CONSTRAINT combo_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5342 (class 2606 OID 17186)
-- Name: combos combos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combos
    ADD CONSTRAINT combos_pkey PRIMARY KEY (id);


--
-- TOC entry 5443 (class 2606 OID 26000)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 5344 (class 2606 OID 17204)
-- Name: ebook_download_links ebook_download_links_download_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ebook_download_links
    ADD CONSTRAINT ebook_download_links_download_token_key UNIQUE (download_token);


--
-- TOC entry 5346 (class 2606 OID 17202)
-- Name: ebook_download_links ebook_download_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ebook_download_links
    ADD CONSTRAINT ebook_download_links_pkey PRIMARY KEY (id);


--
-- TOC entry 5436 (class 2606 OID 19402)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 5441 (class 2606 OID 25979)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 5445 (class 2606 OID 40477)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5434 (class 2606 OID 19359)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5058 (class 2606 OID 16819)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 40771)
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- TOC entry 5062 (class 2606 OID 40773)
-- Name: posts posts_slug_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key1 UNIQUE (slug);


--
-- TOC entry 5064 (class 2606 OID 40785)
-- Name: posts posts_slug_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key10 UNIQUE (slug);


--
-- TOC entry 5066 (class 2606 OID 40763)
-- Name: posts posts_slug_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key11 UNIQUE (slug);


--
-- TOC entry 5068 (class 2606 OID 40787)
-- Name: posts posts_slug_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key12 UNIQUE (slug);


--
-- TOC entry 5070 (class 2606 OID 40789)
-- Name: posts posts_slug_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key13 UNIQUE (slug);


--
-- TOC entry 5072 (class 2606 OID 40791)
-- Name: posts posts_slug_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key14 UNIQUE (slug);


--
-- TOC entry 5074 (class 2606 OID 40761)
-- Name: posts posts_slug_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key15 UNIQUE (slug);


--
-- TOC entry 5076 (class 2606 OID 40759)
-- Name: posts posts_slug_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key16 UNIQUE (slug);


--
-- TOC entry 5078 (class 2606 OID 40793)
-- Name: posts posts_slug_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key17 UNIQUE (slug);


--
-- TOC entry 5080 (class 2606 OID 40795)
-- Name: posts posts_slug_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key18 UNIQUE (slug);


--
-- TOC entry 5082 (class 2606 OID 40797)
-- Name: posts posts_slug_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key19 UNIQUE (slug);


--
-- TOC entry 5084 (class 2606 OID 40775)
-- Name: posts posts_slug_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key2 UNIQUE (slug);


--
-- TOC entry 5086 (class 2606 OID 40799)
-- Name: posts posts_slug_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key20 UNIQUE (slug);


--
-- TOC entry 5088 (class 2606 OID 40757)
-- Name: posts posts_slug_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key21 UNIQUE (slug);


--
-- TOC entry 5090 (class 2606 OID 40801)
-- Name: posts posts_slug_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key22 UNIQUE (slug);


--
-- TOC entry 5092 (class 2606 OID 40755)
-- Name: posts posts_slug_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key23 UNIQUE (slug);


--
-- TOC entry 5094 (class 2606 OID 40803)
-- Name: posts posts_slug_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key24 UNIQUE (slug);


--
-- TOC entry 5096 (class 2606 OID 40753)
-- Name: posts posts_slug_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key25 UNIQUE (slug);


--
-- TOC entry 5098 (class 2606 OID 40805)
-- Name: posts posts_slug_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key26 UNIQUE (slug);


--
-- TOC entry 5100 (class 2606 OID 40769)
-- Name: posts posts_slug_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key3 UNIQUE (slug);


--
-- TOC entry 5102 (class 2606 OID 40777)
-- Name: posts posts_slug_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key4 UNIQUE (slug);


--
-- TOC entry 5104 (class 2606 OID 40779)
-- Name: posts posts_slug_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key5 UNIQUE (slug);


--
-- TOC entry 5106 (class 2606 OID 40767)
-- Name: posts posts_slug_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key6 UNIQUE (slug);


--
-- TOC entry 5108 (class 2606 OID 40781)
-- Name: posts posts_slug_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key7 UNIQUE (slug);


--
-- TOC entry 5110 (class 2606 OID 40765)
-- Name: posts posts_slug_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key8 UNIQUE (slug);


--
-- TOC entry 5112 (class 2606 OID 40783)
-- Name: posts posts_slug_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key9 UNIQUE (slug);


--
-- TOC entry 5334 (class 2606 OID 17130)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 5348 (class 2606 OID 41002)
-- Name: promotions promotions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key UNIQUE (code);


--
-- TOC entry 5350 (class 2606 OID 40994)
-- Name: promotions promotions_code_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key1 UNIQUE (code);


--
-- TOC entry 5352 (class 2606 OID 40990)
-- Name: promotions promotions_code_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key10 UNIQUE (code);


--
-- TOC entry 5354 (class 2606 OID 40980)
-- Name: promotions promotions_code_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key11 UNIQUE (code);


--
-- TOC entry 5356 (class 2606 OID 40988)
-- Name: promotions promotions_code_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key12 UNIQUE (code);


--
-- TOC entry 5358 (class 2606 OID 40982)
-- Name: promotions promotions_code_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key13 UNIQUE (code);


--
-- TOC entry 5360 (class 2606 OID 40984)
-- Name: promotions promotions_code_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key14 UNIQUE (code);


--
-- TOC entry 5362 (class 2606 OID 40986)
-- Name: promotions promotions_code_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key15 UNIQUE (code);


--
-- TOC entry 5364 (class 2606 OID 41006)
-- Name: promotions promotions_code_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key16 UNIQUE (code);


--
-- TOC entry 5366 (class 2606 OID 40970)
-- Name: promotions promotions_code_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key17 UNIQUE (code);


--
-- TOC entry 5368 (class 2606 OID 41008)
-- Name: promotions promotions_code_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key18 UNIQUE (code);


--
-- TOC entry 5370 (class 2606 OID 41010)
-- Name: promotions promotions_code_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key19 UNIQUE (code);


--
-- TOC entry 5372 (class 2606 OID 41000)
-- Name: promotions promotions_code_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key2 UNIQUE (code);


--
-- TOC entry 5374 (class 2606 OID 40968)
-- Name: promotions promotions_code_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key20 UNIQUE (code);


--
-- TOC entry 5376 (class 2606 OID 40966)
-- Name: promotions promotions_code_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key21 UNIQUE (code);


--
-- TOC entry 5378 (class 2606 OID 41012)
-- Name: promotions promotions_code_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key22 UNIQUE (code);


--
-- TOC entry 5380 (class 2606 OID 41014)
-- Name: promotions promotions_code_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key23 UNIQUE (code);


--
-- TOC entry 5382 (class 2606 OID 40964)
-- Name: promotions promotions_code_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key24 UNIQUE (code);


--
-- TOC entry 5384 (class 2606 OID 41016)
-- Name: promotions promotions_code_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key25 UNIQUE (code);


--
-- TOC entry 5386 (class 2606 OID 41020)
-- Name: promotions promotions_code_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key26 UNIQUE (code);


--
-- TOC entry 5388 (class 2606 OID 40962)
-- Name: promotions promotions_code_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key27 UNIQUE (code);


--
-- TOC entry 5390 (class 2606 OID 41022)
-- Name: promotions promotions_code_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key28 UNIQUE (code);


--
-- TOC entry 5392 (class 2606 OID 41024)
-- Name: promotions promotions_code_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key29 UNIQUE (code);


--
-- TOC entry 5394 (class 2606 OID 40996)
-- Name: promotions promotions_code_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key3 UNIQUE (code);


--
-- TOC entry 5396 (class 2606 OID 41026)
-- Name: promotions promotions_code_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key30 UNIQUE (code);


--
-- TOC entry 5398 (class 2606 OID 41004)
-- Name: promotions promotions_code_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key31 UNIQUE (code);


--
-- TOC entry 5400 (class 2606 OID 41028)
-- Name: promotions promotions_code_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key32 UNIQUE (code);


--
-- TOC entry 5402 (class 2606 OID 40960)
-- Name: promotions promotions_code_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key33 UNIQUE (code);


--
-- TOC entry 5404 (class 2606 OID 41030)
-- Name: promotions promotions_code_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key34 UNIQUE (code);


--
-- TOC entry 5406 (class 2606 OID 40958)
-- Name: promotions promotions_code_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key35 UNIQUE (code);


--
-- TOC entry 5408 (class 2606 OID 41032)
-- Name: promotions promotions_code_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key36 UNIQUE (code);


--
-- TOC entry 5410 (class 2606 OID 40956)
-- Name: promotions promotions_code_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key37 UNIQUE (code);


--
-- TOC entry 5412 (class 2606 OID 41018)
-- Name: promotions promotions_code_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key38 UNIQUE (code);


--
-- TOC entry 5414 (class 2606 OID 40998)
-- Name: promotions promotions_code_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key4 UNIQUE (code);


--
-- TOC entry 5416 (class 2606 OID 40972)
-- Name: promotions promotions_code_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key5 UNIQUE (code);


--
-- TOC entry 5418 (class 2606 OID 40974)
-- Name: promotions promotions_code_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key6 UNIQUE (code);


--
-- TOC entry 5420 (class 2606 OID 40976)
-- Name: promotions promotions_code_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key7 UNIQUE (code);


--
-- TOC entry 5422 (class 2606 OID 40992)
-- Name: promotions promotions_code_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key8 UNIQUE (code);


--
-- TOC entry 5424 (class 2606 OID 40978)
-- Name: promotions promotions_code_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key9 UNIQUE (code);


--
-- TOC entry 5426 (class 2606 OID 17298)
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- TOC entry 5116 (class 2606 OID 16859)
-- Name: receipt_items receipt_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt_items
    ADD CONSTRAINT receipt_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5114 (class 2606 OID 16836)
-- Name: receipts receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);


--
-- TOC entry 5428 (class 2606 OID 17343)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5118 (class 2606 OID 17046)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5120 (class 2606 OID 41229)
-- Name: roles roles_ten_quyen_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key UNIQUE (ten_quyen);


--
-- TOC entry 5122 (class 2606 OID 41231)
-- Name: roles roles_ten_quyen_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key1 UNIQUE (ten_quyen);


--
-- TOC entry 5124 (class 2606 OID 41221)
-- Name: roles roles_ten_quyen_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key10 UNIQUE (ten_quyen);


--
-- TOC entry 5126 (class 2606 OID 41217)
-- Name: roles roles_ten_quyen_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key11 UNIQUE (ten_quyen);


--
-- TOC entry 5128 (class 2606 OID 41219)
-- Name: roles roles_ten_quyen_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key12 UNIQUE (ten_quyen);


--
-- TOC entry 5130 (class 2606 OID 41243)
-- Name: roles roles_ten_quyen_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key13 UNIQUE (ten_quyen);


--
-- TOC entry 5132 (class 2606 OID 41245)
-- Name: roles roles_ten_quyen_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key14 UNIQUE (ten_quyen);


--
-- TOC entry 5134 (class 2606 OID 41215)
-- Name: roles roles_ten_quyen_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key15 UNIQUE (ten_quyen);


--
-- TOC entry 5136 (class 2606 OID 41247)
-- Name: roles roles_ten_quyen_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key16 UNIQUE (ten_quyen);


--
-- TOC entry 5138 (class 2606 OID 41213)
-- Name: roles roles_ten_quyen_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key17 UNIQUE (ten_quyen);


--
-- TOC entry 5140 (class 2606 OID 41249)
-- Name: roles roles_ten_quyen_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key18 UNIQUE (ten_quyen);


--
-- TOC entry 5142 (class 2606 OID 41251)
-- Name: roles roles_ten_quyen_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key19 UNIQUE (ten_quyen);


--
-- TOC entry 5144 (class 2606 OID 41233)
-- Name: roles roles_ten_quyen_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key2 UNIQUE (ten_quyen);


--
-- TOC entry 5146 (class 2606 OID 41211)
-- Name: roles roles_ten_quyen_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key20 UNIQUE (ten_quyen);


--
-- TOC entry 5148 (class 2606 OID 41253)
-- Name: roles roles_ten_quyen_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key21 UNIQUE (ten_quyen);


--
-- TOC entry 5150 (class 2606 OID 41209)
-- Name: roles roles_ten_quyen_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key22 UNIQUE (ten_quyen);


--
-- TOC entry 5152 (class 2606 OID 41255)
-- Name: roles roles_ten_quyen_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key23 UNIQUE (ten_quyen);


--
-- TOC entry 5154 (class 2606 OID 41257)
-- Name: roles roles_ten_quyen_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key24 UNIQUE (ten_quyen);


--
-- TOC entry 5156 (class 2606 OID 41207)
-- Name: roles roles_ten_quyen_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key25 UNIQUE (ten_quyen);


--
-- TOC entry 5158 (class 2606 OID 41205)
-- Name: roles roles_ten_quyen_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key26 UNIQUE (ten_quyen);


--
-- TOC entry 5160 (class 2606 OID 41259)
-- Name: roles roles_ten_quyen_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key27 UNIQUE (ten_quyen);


--
-- TOC entry 5162 (class 2606 OID 41227)
-- Name: roles roles_ten_quyen_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key3 UNIQUE (ten_quyen);


--
-- TOC entry 5164 (class 2606 OID 41225)
-- Name: roles roles_ten_quyen_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key4 UNIQUE (ten_quyen);


--
-- TOC entry 5166 (class 2606 OID 41235)
-- Name: roles roles_ten_quyen_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key5 UNIQUE (ten_quyen);


--
-- TOC entry 5168 (class 2606 OID 41237)
-- Name: roles roles_ten_quyen_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key6 UNIQUE (ten_quyen);


--
-- TOC entry 5170 (class 2606 OID 41239)
-- Name: roles roles_ten_quyen_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key7 UNIQUE (ten_quyen);


--
-- TOC entry 5172 (class 2606 OID 41223)
-- Name: roles roles_ten_quyen_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key8 UNIQUE (ten_quyen);


--
-- TOC entry 5174 (class 2606 OID 41241)
-- Name: roles roles_ten_quyen_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_ten_quyen_key9 UNIQUE (ten_quyen);


--
-- TOC entry 5439 (class 2606 OID 19454)
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5430 (class 2606 OID 17373)
-- Name: slideshows slideshows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slideshows
    ADD CONSTRAINT slideshows_pkey PRIMARY KEY (id);


--
-- TOC entry 5336 (class 2606 OID 41170)
-- Name: products unique_ten_sach; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT unique_ten_sach UNIQUE (ten_sach);


--
-- TOC entry 5176 (class 2606 OID 40669)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5178 (class 2606 OID 40671)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 5180 (class 2606 OID 40661)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 5182 (class 2606 OID 40685)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 5184 (class 2606 OID 40659)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 5186 (class 2606 OID 40687)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 5188 (class 2606 OID 40657)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 5190 (class 2606 OID 40593)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 5192 (class 2606 OID 40655)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 5194 (class 2606 OID 40595)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 5196 (class 2606 OID 40653)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 5198 (class 2606 OID 40597)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 5200 (class 2606 OID 40675)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 5202 (class 2606 OID 40647)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 5204 (class 2606 OID 40599)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 5206 (class 2606 OID 40645)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 5208 (class 2606 OID 40601)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 5210 (class 2606 OID 40643)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 5212 (class 2606 OID 40603)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 5214 (class 2606 OID 40641)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 5216 (class 2606 OID 40605)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 5218 (class 2606 OID 40639)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 5220 (class 2606 OID 40607)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 5222 (class 2606 OID 40667)
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- TOC entry 5224 (class 2606 OID 40609)
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- TOC entry 5226 (class 2606 OID 40637)
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- TOC entry 5228 (class 2606 OID 40611)
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- TOC entry 5230 (class 2606 OID 40613)
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- TOC entry 5232 (class 2606 OID 40635)
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- TOC entry 5234 (class 2606 OID 40615)
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- TOC entry 5236 (class 2606 OID 40633)
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- TOC entry 5238 (class 2606 OID 40617)
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- TOC entry 5240 (class 2606 OID 40619)
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- TOC entry 5242 (class 2606 OID 40631)
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- TOC entry 5244 (class 2606 OID 40677)
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- TOC entry 5246 (class 2606 OID 40621)
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- TOC entry 5248 (class 2606 OID 40629)
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- TOC entry 5250 (class 2606 OID 40673)
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- TOC entry 5252 (class 2606 OID 40627)
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- TOC entry 5254 (class 2606 OID 40625)
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- TOC entry 5256 (class 2606 OID 40623)
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- TOC entry 5258 (class 2606 OID 40689)
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- TOC entry 5260 (class 2606 OID 40651)
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- TOC entry 5262 (class 2606 OID 40691)
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- TOC entry 5264 (class 2606 OID 40693)
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- TOC entry 5266 (class 2606 OID 40679)
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- TOC entry 5268 (class 2606 OID 40649)
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- TOC entry 5270 (class 2606 OID 40695)
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- TOC entry 5272 (class 2606 OID 40591)
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- TOC entry 5274 (class 2606 OID 40697)
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- TOC entry 5276 (class 2606 OID 40589)
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- TOC entry 5278 (class 2606 OID 40699)
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- TOC entry 5280 (class 2606 OID 40587)
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- TOC entry 5282 (class 2606 OID 40701)
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- TOC entry 5284 (class 2606 OID 40665)
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- TOC entry 5286 (class 2606 OID 40681)
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- TOC entry 5288 (class 2606 OID 40663)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 5290 (class 2606 OID 40683)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 5292 (class 2606 OID 17066)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5294 (class 2606 OID 40725)
-- Name: users users_ten_dang_nhap_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key UNIQUE (ten_dang_nhap);


--
-- TOC entry 5296 (class 2606 OID 40727)
-- Name: users users_ten_dang_nhap_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key1 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5298 (class 2606 OID 40737)
-- Name: users users_ten_dang_nhap_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key10 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5300 (class 2606 OID 40715)
-- Name: users users_ten_dang_nhap_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key11 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5302 (class 2606 OID 40739)
-- Name: users users_ten_dang_nhap_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key12 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5304 (class 2606 OID 40713)
-- Name: users users_ten_dang_nhap_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key13 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5306 (class 2606 OID 40741)
-- Name: users users_ten_dang_nhap_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key14 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5308 (class 2606 OID 40711)
-- Name: users users_ten_dang_nhap_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key15 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5310 (class 2606 OID 40743)
-- Name: users users_ten_dang_nhap_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key16 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5312 (class 2606 OID 40729)
-- Name: users users_ten_dang_nhap_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key2 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5314 (class 2606 OID 40723)
-- Name: users users_ten_dang_nhap_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key3 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5316 (class 2606 OID 40721)
-- Name: users users_ten_dang_nhap_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key4 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5318 (class 2606 OID 40731)
-- Name: users users_ten_dang_nhap_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key5 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5320 (class 2606 OID 40719)
-- Name: users users_ten_dang_nhap_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key6 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5322 (class 2606 OID 40733)
-- Name: users users_ten_dang_nhap_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key7 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5324 (class 2606 OID 40735)
-- Name: users users_ten_dang_nhap_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key8 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5326 (class 2606 OID 40717)
-- Name: users users_ten_dang_nhap_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ten_dang_nhap_key9 UNIQUE (ten_dang_nhap);


--
-- TOC entry 5437 (class 1259 OID 19413)
-- Name: favorites_user_id_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX favorites_user_id_product_id ON public.favorites USING btree (user_id, product_id);


--
-- TOC entry 5452 (class 2606 OID 40887)
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5453 (class 2606 OID 40892)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;


--
-- TOC entry 5449 (class 2606 OID 40880)
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5450 (class 2606 OID 41162)
-- Name: categories categories_danh_muc_cha_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_danh_muc_cha_id_fkey FOREIGN KEY (danh_muc_cha_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5457 (class 2606 OID 40911)
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;


--
-- TOC entry 5458 (class 2606 OID 40906)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5459 (class 2606 OID 41035)
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5460 (class 2606 OID 40855)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5461 (class 2606 OID 40861)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5456 (class 2606 OID 40830)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5446 (class 2606 OID 40806)
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5451 (class 2606 OID 41179)
-- Name: products products_danh_muc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_danh_muc_id_fkey FOREIGN KEY (danh_muc_id) REFERENCES public.categories(id) ON UPDATE CASCADE;


--
-- TOC entry 5447 (class 2606 OID 40942)
-- Name: receipt_items receipt_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt_items
    ADD CONSTRAINT receipt_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5448 (class 2606 OID 40936)
-- Name: receipt_items receipt_items_receipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt_items
    ADD CONSTRAINT receipt_items_receipt_id_fkey FOREIGN KEY (receipt_id) REFERENCES public.receipts(id) ON UPDATE CASCADE;


--
-- TOC entry 5454 (class 2606 OID 40923)
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5455 (class 2606 OID 40918)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


-- Completed on 2026-01-23 12:08:46

--
-- PostgreSQL database dump complete
--

\unrestrict lerJxiofB0xzUKLqmweEhvKqpdrdulRUx8gyb4KoqC4G0ozoYAWzFeMMFjcy7wQ

