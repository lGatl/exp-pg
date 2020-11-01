-- Table: public.CAR

-- DROP TABLE public."CAR";

CREATE TABLE public."CAR"
(
    "ID" integer NOT NULL DEFAULT nextval('"CAR_ID_seq"'::regclass),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    order_id integer NOT NULL,
    CONSTRAINT "CAR_pkey" PRIMARY KEY ("ID")
)

ALTER TABLE public."CAR"
    OWNER to lgatl;

-- Table: public.CUSTOMER

-- DROP TABLE public."CUSTOMER";

CREATE TABLE public."CUSTOMER"
(
    id integer NOT NULL DEFAULT nextval('customer_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT customer_pkey PRIMARY KEY (id)
)

ALTER TABLE public."CUSTOMER"
    OWNER to lgatl;

-- Table: public.ORDER

-- DROP TABLE public."ORDER";

CREATE TABLE public."ORDER"
(
    "ID" integer NOT NULL DEFAULT nextval('"ORDER_ID_seq"'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    customer_id integer NOT NULL DEFAULT nextval('"ORDER_clientId_seq"'::regclass),
    CONSTRAINT "ORDER_pkey" PRIMARY KEY ("ID")
)

ALTER TABLE public."ORDER"
    OWNER to lgatl;

-- Table: public.USER

-- DROP TABLE public."USER";

CREATE TABLE public."USER"
(
    "ID" integer NOT NULL DEFAULT nextval('"USER_ID_seq"'::regclass),
    email character varying(128) COLLATE pg_catalog."default" NOT NULL,
    password character varying(128) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "USER_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE public."USER"
    OWNER to lgatl;











