PGDMP      5                |         	   ecodolie2    16.3    16.3 f    3           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            4           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            5           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            6           1262    141428 	   ecodolie2    DATABASE     }   CREATE DATABASE ecodolie2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Europe.1251';
    DROP DATABASE ecodolie2;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            7           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    141513    circle    TABLE     �   CREATE TABLE public.circle (
    cricleid integer NOT NULL,
    namecricel character varying(50) NOT NULL,
    quantityuser integer NOT NULL,
    userclass character varying(2) NOT NULL,
    photopath text,
    descriptors character varying(1000)
);
    DROP TABLE public.circle;
       public         heap    postgres    false    4            �            1259    141512    circle_cricleid_seq    SEQUENCE     �   CREATE SEQUENCE public.circle_cricleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.circle_cricleid_seq;
       public          postgres    false    4    228            8           0    0    circle_cricleid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.circle_cricleid_seq OWNED BY public.circle.cricleid;
          public          postgres    false    227            �            1259    141485 	   interests    TABLE     m   CREATE TABLE public.interests (
    interestsid integer NOT NULL,
    name character varying(70) NOT NULL
);
    DROP TABLE public.interests;
       public         heap    postgres    false    4            �            1259    141484    interests_interestsid_seq    SEQUENCE     �   CREATE SEQUENCE public.interests_interestsid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.interests_interestsid_seq;
       public          postgres    false    4    224            9           0    0    interests_interestsid_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.interests_interestsid_seq OWNED BY public.interests.interestsid;
          public          postgres    false    223            �            1259    141494    interestsuser    TABLE     x   CREATE TABLE public.interestsuser (
    userinterestid integer NOT NULL,
    userid integer,
    interestsid integer
);
 !   DROP TABLE public.interestsuser;
       public         heap    postgres    false    4            �            1259    141493     interestsuser_userinterestid_seq    SEQUENCE     �   CREATE SEQUENCE public.interestsuser_userinterestid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.interestsuser_userinterestid_seq;
       public          postgres    false    226    4            :           0    0     interestsuser_userinterestid_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.interestsuser_userinterestid_seq OWNED BY public.interestsuser.userinterestid;
          public          postgres    false    225            �            1259    141524    interestsСircle    TABLE     �   CREATE TABLE public."interestsСircle" (
    "Сircleinterestid" integer NOT NULL,
    cricleid integer,
    interestsid integer
);
 &   DROP TABLE public."interestsСircle";
       public         heap    postgres    false    4            �            1259    141523 &   interestsСircle_Сircleinterestid_seq    SEQUENCE     �   CREATE SEQUENCE public."interestsСircle_Сircleinterestid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public."interestsСircle_Сircleinterestid_seq";
       public          postgres    false    230    4            ;           0    0 &   interestsСircle_Сircleinterestid_seq    SEQUENCE OWNED BY     w   ALTER SEQUENCE public."interestsСircle_Сircleinterestid_seq" OWNED BY public."interestsСircle"."Сircleinterestid";
          public          postgres    false    229            �            1259    141573    meetings    TABLE     =  CREATE TABLE public.meetings (
    meetingsid integer NOT NULL,
    heading character varying(100) NOT NULL,
    eventdata date NOT NULL,
    eventtime time without time zone NOT NULL,
    addiinfo character varying(200),
    creatednews timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cricleid integer
);
    DROP TABLE public.meetings;
       public         heap    postgres    false    4            �            1259    141572    meetings_meetingsid_seq    SEQUENCE     �   CREATE SEQUENCE public.meetings_meetingsid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.meetings_meetingsid_seq;
       public          postgres    false    4    236            <           0    0    meetings_meetingsid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.meetings_meetingsid_seq OWNED BY public.meetings.meetingsid;
          public          postgres    false    235            �            1259    141543    news    TABLE     �   CREATE TABLE public.news (
    newid integer NOT NULL,
    description character varying(2000) NOT NULL,
    photopath text,
    creatednews timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    userid integer
);
    DROP TABLE public.news;
       public         heap    postgres    false    4            �            1259    141542    news_newid_seq    SEQUENCE     �   CREATE SEQUENCE public.news_newid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.news_newid_seq;
       public          postgres    false    232    4            =           0    0    news_newid_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.news_newid_seq OWNED BY public.news.newid;
          public          postgres    false    231            �            1259    141558 
   newscircle    TABLE     �   CREATE TABLE public.newscircle (
    newid integer NOT NULL,
    description character varying(2000) NOT NULL,
    photopathimg text,
    creatednews timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cricleid integer
);
    DROP TABLE public.newscircle;
       public         heap    postgres    false    4            �            1259    141557    newscircle_newid_seq    SEQUENCE     �   CREATE SEQUENCE public.newscircle_newid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.newscircle_newid_seq;
       public          postgres    false    4    234            >           0    0    newscircle_newid_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.newscircle_newid_seq OWNED BY public.newscircle.newid;
          public          postgres    false    233            �            1259    141459    role    TABLE     g   CREATE TABLE public.role (
    roleid integer NOT NULL,
    namerole character varying(70) NOT NULL
);
    DROP TABLE public.role;
       public         heap    postgres    false    4            �            1259    141458    role_roleid_seq    SEQUENCE     �   CREATE SEQUENCE public.role_roleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.role_roleid_seq;
       public          postgres    false    4    220            ?           0    0    role_roleid_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.role_roleid_seq OWNED BY public.role.roleid;
          public          postgres    false    219            �            1259    141466    roleuser    TABLE     j   CREATE TABLE public.roleuser (
    userroleid integer NOT NULL,
    userid integer,
    roleid integer
);
    DROP TABLE public.roleuser;
       public         heap    postgres    false    4            �            1259    141465    roleuser_userroleid_seq    SEQUENCE     �   CREATE SEQUENCE public.roleuser_userroleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.roleuser_userroleid_seq;
       public          postgres    false    222    4            @           0    0    roleuser_userroleid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.roleuser_userroleid_seq OWNED BY public.roleuser.userroleid;
          public          postgres    false    221            �            1259    141430 	   secritkey    TABLE     l   CREATE TABLE public.secritkey (
    idsecritkey integer NOT NULL,
    key character varying(70) NOT NULL
);
    DROP TABLE public.secritkey;
       public         heap    postgres    false    4            �            1259    141429    secritkey_idsecritkey_seq    SEQUENCE     �   CREATE SEQUENCE public.secritkey_idsecritkey_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.secritkey_idsecritkey_seq;
       public          postgres    false    4    216            A           0    0    secritkey_idsecritkey_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.secritkey_idsecritkey_seq OWNED BY public.secritkey.idsecritkey;
          public          postgres    false    215            �            1259    141437    users    TABLE     �  CREATE TABLE public.users (
    userid integer NOT NULL,
    fio character varying(100) NOT NULL,
    email character varying(70) NOT NULL,
    tel character varying(12) NOT NULL,
    classuser character varying(2),
    passwordhash character varying(100) NOT NULL,
    role integer NOT NULL,
    idcircle integer,
    photopathuser text,
    creator integer,
    idsecritkey integer
);
    DROP TABLE public.users;
       public         heap    postgres    false    4            �            1259    141436    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    218    4            B           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    217            R           2604    141516    circle cricleid    DEFAULT     r   ALTER TABLE ONLY public.circle ALTER COLUMN cricleid SET DEFAULT nextval('public.circle_cricleid_seq'::regclass);
 >   ALTER TABLE public.circle ALTER COLUMN cricleid DROP DEFAULT;
       public          postgres    false    228    227    228            P           2604    141488    interests interestsid    DEFAULT     ~   ALTER TABLE ONLY public.interests ALTER COLUMN interestsid SET DEFAULT nextval('public.interests_interestsid_seq'::regclass);
 D   ALTER TABLE public.interests ALTER COLUMN interestsid DROP DEFAULT;
       public          postgres    false    224    223    224            Q           2604    141497    interestsuser userinterestid    DEFAULT     �   ALTER TABLE ONLY public.interestsuser ALTER COLUMN userinterestid SET DEFAULT nextval('public.interestsuser_userinterestid_seq'::regclass);
 K   ALTER TABLE public.interestsuser ALTER COLUMN userinterestid DROP DEFAULT;
       public          postgres    false    226    225    226            S           2604    141527 "   interestsСircle Сircleinterestid    DEFAULT     �   ALTER TABLE ONLY public."interestsСircle" ALTER COLUMN "Сircleinterestid" SET DEFAULT nextval('public."interestsСircle_Сircleinterestid_seq"'::regclass);
 U   ALTER TABLE public."interestsСircle" ALTER COLUMN "Сircleinterestid" DROP DEFAULT;
       public          postgres    false    229    230    230            X           2604    141576    meetings meetingsid    DEFAULT     z   ALTER TABLE ONLY public.meetings ALTER COLUMN meetingsid SET DEFAULT nextval('public.meetings_meetingsid_seq'::regclass);
 B   ALTER TABLE public.meetings ALTER COLUMN meetingsid DROP DEFAULT;
       public          postgres    false    235    236    236            T           2604    141546 
   news newid    DEFAULT     h   ALTER TABLE ONLY public.news ALTER COLUMN newid SET DEFAULT nextval('public.news_newid_seq'::regclass);
 9   ALTER TABLE public.news ALTER COLUMN newid DROP DEFAULT;
       public          postgres    false    231    232    232            V           2604    141561    newscircle newid    DEFAULT     t   ALTER TABLE ONLY public.newscircle ALTER COLUMN newid SET DEFAULT nextval('public.newscircle_newid_seq'::regclass);
 ?   ALTER TABLE public.newscircle ALTER COLUMN newid DROP DEFAULT;
       public          postgres    false    234    233    234            N           2604    141462    role roleid    DEFAULT     j   ALTER TABLE ONLY public.role ALTER COLUMN roleid SET DEFAULT nextval('public.role_roleid_seq'::regclass);
 :   ALTER TABLE public.role ALTER COLUMN roleid DROP DEFAULT;
       public          postgres    false    219    220    220            O           2604    141469    roleuser userroleid    DEFAULT     z   ALTER TABLE ONLY public.roleuser ALTER COLUMN userroleid SET DEFAULT nextval('public.roleuser_userroleid_seq'::regclass);
 B   ALTER TABLE public.roleuser ALTER COLUMN userroleid DROP DEFAULT;
       public          postgres    false    221    222    222            L           2604    141433    secritkey idsecritkey    DEFAULT     ~   ALTER TABLE ONLY public.secritkey ALTER COLUMN idsecritkey SET DEFAULT nextval('public.secritkey_idsecritkey_seq'::regclass);
 D   ALTER TABLE public.secritkey ALTER COLUMN idsecritkey DROP DEFAULT;
       public          postgres    false    216    215    216            M           2604    141440    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    218    217    218            (          0    141513    circle 
   TABLE DATA           g   COPY public.circle (cricleid, namecricel, quantityuser, userclass, photopath, descriptors) FROM stdin;
    public          postgres    false    228   �y       $          0    141485 	   interests 
   TABLE DATA           6   COPY public.interests (interestsid, name) FROM stdin;
    public          postgres    false    224   �       &          0    141494    interestsuser 
   TABLE DATA           L   COPY public.interestsuser (userinterestid, userid, interestsid) FROM stdin;
    public          postgres    false    226   ��       *          0    141524    interestsСircle 
   TABLE DATA           X   COPY public."interestsСircle" ("Сircleinterestid", cricleid, interestsid) FROM stdin;
    public          postgres    false    230   "�       0          0    141573    meetings 
   TABLE DATA           n   COPY public.meetings (meetingsid, heading, eventdata, eventtime, addiinfo, creatednews, cricleid) FROM stdin;
    public          postgres    false    236   c�       ,          0    141543    news 
   TABLE DATA           R   COPY public.news (newid, description, photopath, creatednews, userid) FROM stdin;
    public          postgres    false    232   �       .          0    141558 
   newscircle 
   TABLE DATA           ]   COPY public.newscircle (newid, description, photopathimg, creatednews, cricleid) FROM stdin;
    public          postgres    false    234   6�                  0    141459    role 
   TABLE DATA           0   COPY public.role (roleid, namerole) FROM stdin;
    public          postgres    false    220   ��       "          0    141466    roleuser 
   TABLE DATA           >   COPY public.roleuser (userroleid, userid, roleid) FROM stdin;
    public          postgres    false    222   φ                 0    141430 	   secritkey 
   TABLE DATA           5   COPY public.secritkey (idsecritkey, key) FROM stdin;
    public          postgres    false    216   �                 0    141437    users 
   TABLE DATA           �   COPY public.users (userid, fio, email, tel, classuser, passwordhash, role, idcircle, photopathuser, creator, idsecritkey) FROM stdin;
    public          postgres    false    218   B�       C           0    0    circle_cricleid_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.circle_cricleid_seq', 4, true);
          public          postgres    false    227            D           0    0    interests_interestsid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.interests_interestsid_seq', 10, true);
          public          postgres    false    223            E           0    0     interestsuser_userinterestid_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.interestsuser_userinterestid_seq', 31, true);
          public          postgres    false    225            F           0    0 &   interestsСircle_Сircleinterestid_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public."interestsСircle_Сircleinterestid_seq"', 8, true);
          public          postgres    false    229            G           0    0    meetings_meetingsid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.meetings_meetingsid_seq', 4, true);
          public          postgres    false    235            H           0    0    news_newid_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.news_newid_seq', 1, false);
          public          postgres    false    231            I           0    0    newscircle_newid_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.newscircle_newid_seq', 7, true);
          public          postgres    false    233            J           0    0    role_roleid_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.role_roleid_seq', 2, true);
          public          postgres    false    219            K           0    0    roleuser_userroleid_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.roleuser_userroleid_seq', 1, false);
          public          postgres    false    221            L           0    0    secritkey_idsecritkey_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.secritkey_idsecritkey_seq', 10, true);
          public          postgres    false    215            M           0    0    users_userid_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_userid_seq', 11, true);
          public          postgres    false    217            u           2606    141522    circle circle_namecricel_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.circle
    ADD CONSTRAINT circle_namecricel_key UNIQUE (namecricel);
 F   ALTER TABLE ONLY public.circle DROP CONSTRAINT circle_namecricel_key;
       public            postgres    false    228            w           2606    141520    circle circle_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.circle
    ADD CONSTRAINT circle_pkey PRIMARY KEY (cricleid);
 <   ALTER TABLE ONLY public.circle DROP CONSTRAINT circle_pkey;
       public            postgres    false    228            m           2606    141492    interests interests_name_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.interests
    ADD CONSTRAINT interests_name_key UNIQUE (name);
 F   ALTER TABLE ONLY public.interests DROP CONSTRAINT interests_name_key;
       public            postgres    false    224            o           2606    141490    interests interests_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.interests
    ADD CONSTRAINT interests_pkey PRIMARY KEY (interestsid);
 B   ALTER TABLE ONLY public.interests DROP CONSTRAINT interests_pkey;
       public            postgres    false    224            q           2606    141499     interestsuser interestsuser_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_pkey PRIMARY KEY (userinterestid);
 J   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_pkey;
       public            postgres    false    226            s           2606    141501 2   interestsuser interestsuser_userid_interestsid_key 
   CONSTRAINT     |   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_userid_interestsid_key UNIQUE (userid, interestsid);
 \   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_userid_interestsid_key;
       public            postgres    false    226    226            y           2606    141531 :   interestsСircle interestsСircle_cricleid_interestsid_key 
   CONSTRAINT     �   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_cricleid_interestsid_key" UNIQUE (cricleid, interestsid);
 h   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_cricleid_interestsid_key";
       public            postgres    false    230    230            {           2606    141529 &   interestsСircle interestsСircle_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_pkey" PRIMARY KEY ("Сircleinterestid");
 T   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_pkey";
       public            postgres    false    230            �           2606    141579    meetings meetings_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (meetingsid);
 @   ALTER TABLE ONLY public.meetings DROP CONSTRAINT meetings_pkey;
       public            postgres    false    236            }           2606    141551    news news_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (newid);
 8   ALTER TABLE ONLY public.news DROP CONSTRAINT news_pkey;
       public            postgres    false    232                       2606    141566    newscircle newscircle_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.newscircle
    ADD CONSTRAINT newscircle_pkey PRIMARY KEY (newid);
 D   ALTER TABLE ONLY public.newscircle DROP CONSTRAINT newscircle_pkey;
       public            postgres    false    234            g           2606    141464    role role_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (roleid);
 8   ALTER TABLE ONLY public.role DROP CONSTRAINT role_pkey;
       public            postgres    false    220            i           2606    141471    roleuser roleuser_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_pkey PRIMARY KEY (userroleid);
 @   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_pkey;
       public            postgres    false    222            k           2606    141473 #   roleuser roleuser_userid_roleid_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_userid_roleid_key UNIQUE (userid, roleid);
 M   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_userid_roleid_key;
       public            postgres    false    222    222            [           2606    141435    secritkey secritkey_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.secritkey
    ADD CONSTRAINT secritkey_pkey PRIMARY KEY (idsecritkey);
 B   ALTER TABLE ONLY public.secritkey DROP CONSTRAINT secritkey_pkey;
       public            postgres    false    216            ]           2606    141448    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            _           2606    141446    users users_fio_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_fio_key UNIQUE (fio);
 =   ALTER TABLE ONLY public.users DROP CONSTRAINT users_fio_key;
       public            postgres    false    218            a           2606    141452    users users_idsecritkey_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_idsecritkey_key UNIQUE (idsecritkey);
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_idsecritkey_key;
       public            postgres    false    218            c           2606    141444    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            e           2606    141450    users users_tel_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tel_key UNIQUE (tel);
 =   ALTER TABLE ONLY public.users DROP CONSTRAINT users_tel_key;
       public            postgres    false    218            �           2606    141507 ,   interestsuser interestsuser_interestsid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_interestsid_fkey FOREIGN KEY (interestsid) REFERENCES public.interests(interestsid);
 V   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_interestsid_fkey;
       public          postgres    false    4719    224    226            �           2606    141502 '   interestsuser interestsuser_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 Q   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_userid_fkey;
       public          postgres    false    218    226    4707            �           2606    141532 /   interestsСircle interestsСircle_cricleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_cricleid_fkey" FOREIGN KEY (cricleid) REFERENCES public.circle(cricleid);
 ]   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_cricleid_fkey";
       public          postgres    false    230    228    4727            �           2606    141537 2   interestsСircle interestsСircle_interestsid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_interestsid_fkey" FOREIGN KEY (interestsid) REFERENCES public.interests(interestsid);
 `   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_interestsid_fkey";
       public          postgres    false    4719    224    230            �           2606    141580    meetings meetings_cricleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_cricleid_fkey FOREIGN KEY (cricleid) REFERENCES public.circle(cricleid);
 I   ALTER TABLE ONLY public.meetings DROP CONSTRAINT meetings_cricleid_fkey;
       public          postgres    false    236    4727    228            �           2606    141552    news news_userid_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 ?   ALTER TABLE ONLY public.news DROP CONSTRAINT news_userid_fkey;
       public          postgres    false    218    4707    232            �           2606    141567 #   newscircle newscircle_cricleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.newscircle
    ADD CONSTRAINT newscircle_cricleid_fkey FOREIGN KEY (cricleid) REFERENCES public.circle(cricleid);
 M   ALTER TABLE ONLY public.newscircle DROP CONSTRAINT newscircle_cricleid_fkey;
       public          postgres    false    4727    234    228            �           2606    141479    roleuser roleuser_roleid_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.role(roleid);
 G   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_roleid_fkey;
       public          postgres    false    4711    220    222            �           2606    141474    roleuser roleuser_userid_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 G   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_userid_fkey;
       public          postgres    false    4707    222    218            �           2606    141453    users users_idsecritkey_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_idsecritkey_fkey FOREIGN KEY (idsecritkey) REFERENCES public.secritkey(idsecritkey);
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_idsecritkey_fkey;
       public          postgres    false    216    4699    218            (   N  x��X�nU]���.ci���8,Y��8^AH��$���`�C���`�!����=���ˢ��Ꜫ�/�ɖݷ�:�<u{���K�t��巓���4Ȏ]�I�\����q֕ǈY�xh,�5����������>���ޣ�___�X����vsssm�F뻇�4ғ����]��x���y��A:���4H��'�����t"��i$ˡ���и�<i:9��Ӗ��w�����������¥��4���(��?�W�������<Y�kQf��|ZR��Y�����N�B�E�<��f/{.՛ciscU��X9��� ��'�ڙ���bn%|e�� P����A>E��Ӕȯ�Dƾ؅�X�v��ȥəi������֝Gw��o��2˽�!�UIv ���G̭|x�� BsU؁�ۂ �s�E��V��Ab{v$�#��� sm�[.})�KGD�){*Ž>���#Y�z
�p*;���@����1��ԭ�q*�ۣ�̕}Ga����?�#�2$S���1Atj�p�5_�+�B�r��cfʐИ7�7Q��S	��3�jzAa�49��w���:E�(>���&V�3S����l�2,WF� ==��@64o2r�R@B��I�[.��8��Bg��#�MW���2̉��K9!D���>W��_5��_�9�ԗH<Cl4�C���iK�����������|da���x&C�QoU�R
�7�E�����Y�g����F�Y���8�����{j�z��Zn�yrK�W�l�k�E]Y�kCf'��P��%�_��(�M�t
Sk�RA�]6�T�Ot ��V韲k|��4��?En�k7n�xr��Ԃy�F$�zkl��C�A���~���-ݢ^P�뫟i���h��1� 9l�C�<ɆCO+lM}��e��c�t"�5�iMǴ�����Q�u{��VL$n�]l�W���X��m �Z�.X�EE$�1]���aZ�C¬��5����<�^cdD%�\,u��;��o,��EV��Py5fZ�#��%�g�XRS��j�����e[���`���>F�g�p
�MQ�ʿ �'��L۴�扎��"@j��C߶�f6CfhL ��iHz�T+o@��_����Q�ޯ� ۸�u��!QPS+5���Kr�fbcA�/�.v���ZX���(��JT���0	Hc��';�����Ʀv�w��aN��C�D����nJX�qn��9&���!�@[��gd_n�;�ʮ.9&6iՠ,�DF6z���:����1K�ɤmv��Z`832�
��{J�r���[��U9�r��RԆ��X�UnA�FS���0�	�+d��O�^L �p;N����k����x��H�m�d|3ǚ�Hx��N[����l���"�8:gL�l{��A�H���,��V�ƜPxE�~羼}�do��`^�]�	@��Ƙ��fŝ�.{֠�-�{p�>�%��#��[�S�^X1#Zc��2�oc\[�rR��f��>`���6��E���vv��X%.ڕ�#3�n���z�����CP�L�PK_�͡/�Ǟu%�~7NB�@p��3V��$�3Λ���߁�N�}l��QQ^N*X���"����H;���g�0�u��א�V��^���u��I���1N��σ#��ĺ�y6�̚9�u���~*p��j׍�ux����~�"�u�'�9���fbͦf}� 	_�ڪ|?FV|�ZXmH3兂��Ǐ���agcyM�k]��&�c�#���d)��H#W���� /��r�v��>���tqH7n-m7ˋ%[����f�i�E�n?sJ|<5)FbNB�4V�oF�b����a���_j���`�OT��t��{��}`�B/�����>�L�&��5��v�#H�_�u���Ji��2���9m+]�E
�؆4�\K�6�'v���I��f�#��@Z�zF���A6����	[���Z��'��܏�t�BX�!�,p�����{лT�N���J�4�u�@�2�o�w���<Qj�+�v��z��[�!\w��M3ٰЋ�M=^[�T��������X�����.wZ�b��      $   �   x�5�K
�PE��b��g/.���"�(��R)>��[8ّyE	��rOnF�%��X8Y��
J�g�-���w�SE��N���^ZJKzq&ܣץ@�s�����n���E��M,�a)�G��㝮�+%�m�ɟ������>g=P�/��x�      &   y   x���!�3)f���鿎M��(�Oie.�W|�v0&�Mᘍk���@�U�> K�D��*8q�B	�Վ7�ڥz:����
f	�n	�;�9�-yD!5H}J�Ќ�Xx �b      *   1   x�ȱ  ��?GH���s�F�B�`i)I۔ҳ���Mۘ�|���      0   �  x��RKR�0];�0����Is�60d��{��
��p�F<9-�M&�����d=Ҋ��R�w�Z^��/�V�8j��6S���(����4����:ڡvI+M��"�� �|A=��ǔT[X_$Y��i���F�_�Qfv �(�iEk���?z����5�����ǤQ��I��ָ_r'C�/��9@o����2	��m��\���L��&�?9?+R{�dY�\����Y���";d?aN�w�WO��A���F��+��/h��R��V�);�D۰ɴ����%ɥ���S�e�WI�hMo�%�臵	���zz���pt*��;�?�Z��dw�1�6|��|;3#�Ro+H�F�jY�ޱ&�wY�\�6��.��N��a:�V�+��#o�7�3���YE�'_���      ,      x������ � �      .   Q  x�͑MN�0���)|����8ٲ���*(�Ԋ��ς%G�#���Q�
�1�(�����of���z�U�Ђ��(i�a�r���A�Sz��{ZIڄ9ˊE)��[����p��/G����uo�?���t!��Sf���Bh�MG�X�� ,�
sc��D��8������<y���z�1?y�QҺ��a��r�w�-�p��X�mξP&�ޣA��+����Ε��*�^�nF-�?'��W�d���bx�T5����m��9��r'�-�J��xV<�#yt�ʭ��r[Җ1�|��H�Q�	]D2��0Iv\$�{�L�,#��I�|\/ՠ          (   x�3��|���M�^��e�n�����b���� h��      "      x������ � �         F  x��I�k@  �1��G5��T(���$H�V��e��ğB|dc�����۪��٭�Ɉ�k��K#�Ø��'O�$+xֶ3H$�����(�-��E?W,-n��y���N9����[�{��Vb.��Z��$�=�Ah/�Î��<e����ժ��
�:�9F}[<�6����J��f�{���Vݯ����#�G/w̘}ʄ�S`�M�}��
�� �"�e�u1�l�=׋� s=���z#���ت�+19c/�B�����֎�o�?��}�o/�)�eϘu��$��Y,{��>nj$z���D�����>#���>�&�>�7ȭ60 �]Uv���%��o!{����E��gǡ�'-Q_�&�G.h����4Ƹ+_��N�]��u6H������Ь�ro�k�����2�qK�?pҩ��y4�� �����׫e,��]�yB�W�i�#K������^>Z�f;1�/����NN��ILB�T���K�*���Ž}_�i�F��'�VhX."�f*�~P��@V���dY�5�0^c��k���b���V�`��	 ��O�!��c	�������?��_         8  x���Ko�V���W�������`���@�����8�*����R�QU5ӪR���h2�f~����ԕP!�9�z�{��`�~�����ϣ�?�v{����U���~��
����b �2Ų��`�������vD�G�8�(uo��پ+k�tf�X\�f�Bg=]S�噦��9�<3�WUz�h�� z��y�P
��%I��� ��7�/�H���6�>~����+��Җ����,�%������ Y���f��h%T�r���&�K��b�t��n����ᭀd�z�Y!�iX�r��7��۫�a��Vw��`9��)d`�1���,�;�Eu!L5�)iW]�(�Ϛ��7�=�&;�K���z�����?ѕ�_��������Ck�b�u��~�I����D2�/tad\�V�-��o��I0h�("�GN���駙i�ɱ	��ؽ�;g�ߠ��y�=�y��ɑʇ�H��1�٣[�C��咳�F�'�Z��U�$%Fv���"Tu����`���x8��.�zt�'����V�ď�J�6y�;���~H�o��2�{��|%��X9w�t:<�������6�c�ݴ� 쳔4-�9ъu��vm*�=���������̓������V�oG��6��<�!����p��ʧ��0��Ni�Zz�Y܉�e[��8�5�*;4ꥊ����HzCZ�����q�}��Q�۟��¾C����8~}�
�&%���>�z��c:&����E���I��Ƴ��@l+�Ry��&��8�F�����Nfx�^����69AҪ7���}<�ݚ>�] @�f�.3���>U4z�J�k�T�꒢R��+]��H�Sl������j�u�?3SpC�n�&�;�o��ߢ�$�=;Ó�c%�lK;�9r>4Yt�RL=��.�9n��"�X�Ю�}�>���8űZ��c��������r���~o�5��'�l'����բ�-���d�M�\/��.�b�1]�4�za ��q�4"锠̳Y��5à��������r��Lx     