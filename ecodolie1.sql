PGDMP  /                    |         	   ecodolie1    16.3    16.3 f    3           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            4           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            5           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            6           1262    141271 	   ecodolie1    DATABASE     }   CREATE DATABASE ecodolie1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Europe.1251';
    DROP DATABASE ecodolie1;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            7           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    141356    circle    TABLE     �   CREATE TABLE public.circle (
    cricleid integer NOT NULL,
    namecricel character varying(50) NOT NULL,
    quantityuser integer NOT NULL,
    userclass character varying(2) NOT NULL,
    photopath text,
    descriptors character varying(1000)
);
    DROP TABLE public.circle;
       public         heap    postgres    false    4            �            1259    141355    circle_cricleid_seq    SEQUENCE     �   CREATE SEQUENCE public.circle_cricleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.circle_cricleid_seq;
       public          postgres    false    4    228            8           0    0    circle_cricleid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.circle_cricleid_seq OWNED BY public.circle.cricleid;
          public          postgres    false    227            �            1259    141328 	   interests    TABLE     m   CREATE TABLE public.interests (
    interestsid integer NOT NULL,
    name character varying(70) NOT NULL
);
    DROP TABLE public.interests;
       public         heap    postgres    false    4            �            1259    141327    interests_interestsid_seq    SEQUENCE     �   CREATE SEQUENCE public.interests_interestsid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.interests_interestsid_seq;
       public          postgres    false    4    224            9           0    0    interests_interestsid_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.interests_interestsid_seq OWNED BY public.interests.interestsid;
          public          postgres    false    223            �            1259    141337    interestsuser    TABLE     x   CREATE TABLE public.interestsuser (
    userinterestid integer NOT NULL,
    userid integer,
    interestsid integer
);
 !   DROP TABLE public.interestsuser;
       public         heap    postgres    false    4            �            1259    141336     interestsuser_userinterestid_seq    SEQUENCE     �   CREATE SEQUENCE public.interestsuser_userinterestid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.interestsuser_userinterestid_seq;
       public          postgres    false    226    4            :           0    0     interestsuser_userinterestid_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.interestsuser_userinterestid_seq OWNED BY public.interestsuser.userinterestid;
          public          postgres    false    225            �            1259    141367    interestsСircle    TABLE     �   CREATE TABLE public."interestsСircle" (
    "Сircleinterestid" integer NOT NULL,
    cricleid integer,
    interestsid integer
);
 &   DROP TABLE public."interestsСircle";
       public         heap    postgres    false    4            �            1259    141366 &   interestsСircle_Сircleinterestid_seq    SEQUENCE     �   CREATE SEQUENCE public."interestsСircle_Сircleinterestid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public."interestsСircle_Сircleinterestid_seq";
       public          postgres    false    230    4            ;           0    0 &   interestsСircle_Сircleinterestid_seq    SEQUENCE OWNED BY     w   ALTER SEQUENCE public."interestsСircle_Сircleinterestid_seq" OWNED BY public."interestsСircle"."Сircleinterestid";
          public          postgres    false    229            �            1259    141416    meetings    TABLE     =  CREATE TABLE public.meetings (
    meetingsid integer NOT NULL,
    heading character varying(100) NOT NULL,
    eventdata date NOT NULL,
    eventtime time without time zone NOT NULL,
    addiinfo character varying(200),
    creatednews timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cricleid integer
);
    DROP TABLE public.meetings;
       public         heap    postgres    false    4            �            1259    141415    meetings_meetingsid_seq    SEQUENCE     �   CREATE SEQUENCE public.meetings_meetingsid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.meetings_meetingsid_seq;
       public          postgres    false    4    236            <           0    0    meetings_meetingsid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.meetings_meetingsid_seq OWNED BY public.meetings.meetingsid;
          public          postgres    false    235            �            1259    141386    news    TABLE     �   CREATE TABLE public.news (
    newid integer NOT NULL,
    description character varying(2000) NOT NULL,
    photopath text,
    creatednews timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    userid integer
);
    DROP TABLE public.news;
       public         heap    postgres    false    4            �            1259    141385    news_newid_seq    SEQUENCE     �   CREATE SEQUENCE public.news_newid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.news_newid_seq;
       public          postgres    false    232    4            =           0    0    news_newid_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.news_newid_seq OWNED BY public.news.newid;
          public          postgres    false    231            �            1259    141401 
   newscircle    TABLE     �   CREATE TABLE public.newscircle (
    newid integer NOT NULL,
    description character varying(2000) NOT NULL,
    photopathimg text,
    creatednews timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cricleid integer
);
    DROP TABLE public.newscircle;
       public         heap    postgres    false    4            �            1259    141400    newscircle_newid_seq    SEQUENCE     �   CREATE SEQUENCE public.newscircle_newid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.newscircle_newid_seq;
       public          postgres    false    4    234            >           0    0    newscircle_newid_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.newscircle_newid_seq OWNED BY public.newscircle.newid;
          public          postgres    false    233            �            1259    141302    role    TABLE     g   CREATE TABLE public.role (
    roleid integer NOT NULL,
    namerole character varying(70) NOT NULL
);
    DROP TABLE public.role;
       public         heap    postgres    false    4            �            1259    141301    role_roleid_seq    SEQUENCE     �   CREATE SEQUENCE public.role_roleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.role_roleid_seq;
       public          postgres    false    4    220            ?           0    0    role_roleid_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.role_roleid_seq OWNED BY public.role.roleid;
          public          postgres    false    219            �            1259    141309    roleuser    TABLE     j   CREATE TABLE public.roleuser (
    userroleid integer NOT NULL,
    userid integer,
    roleid integer
);
    DROP TABLE public.roleuser;
       public         heap    postgres    false    4            �            1259    141308    roleuser_userroleid_seq    SEQUENCE     �   CREATE SEQUENCE public.roleuser_userroleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.roleuser_userroleid_seq;
       public          postgres    false    222    4            @           0    0    roleuser_userroleid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.roleuser_userroleid_seq OWNED BY public.roleuser.userroleid;
          public          postgres    false    221            �            1259    141273 	   secritkey    TABLE     l   CREATE TABLE public.secritkey (
    idsecritkey integer NOT NULL,
    key character varying(70) NOT NULL
);
    DROP TABLE public.secritkey;
       public         heap    postgres    false    4            �            1259    141272    secritkey_idsecritkey_seq    SEQUENCE     �   CREATE SEQUENCE public.secritkey_idsecritkey_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.secritkey_idsecritkey_seq;
       public          postgres    false    4    216            A           0    0    secritkey_idsecritkey_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.secritkey_idsecritkey_seq OWNED BY public.secritkey.idsecritkey;
          public          postgres    false    215            �            1259    141280    users    TABLE     �  CREATE TABLE public.users (
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
       public         heap    postgres    false    4            �            1259    141279    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    218    4            B           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    217            R           2604    141359    circle cricleid    DEFAULT     r   ALTER TABLE ONLY public.circle ALTER COLUMN cricleid SET DEFAULT nextval('public.circle_cricleid_seq'::regclass);
 >   ALTER TABLE public.circle ALTER COLUMN cricleid DROP DEFAULT;
       public          postgres    false    228    227    228            P           2604    141331    interests interestsid    DEFAULT     ~   ALTER TABLE ONLY public.interests ALTER COLUMN interestsid SET DEFAULT nextval('public.interests_interestsid_seq'::regclass);
 D   ALTER TABLE public.interests ALTER COLUMN interestsid DROP DEFAULT;
       public          postgres    false    224    223    224            Q           2604    141340    interestsuser userinterestid    DEFAULT     �   ALTER TABLE ONLY public.interestsuser ALTER COLUMN userinterestid SET DEFAULT nextval('public.interestsuser_userinterestid_seq'::regclass);
 K   ALTER TABLE public.interestsuser ALTER COLUMN userinterestid DROP DEFAULT;
       public          postgres    false    226    225    226            S           2604    141370 "   interestsСircle Сircleinterestid    DEFAULT     �   ALTER TABLE ONLY public."interestsСircle" ALTER COLUMN "Сircleinterestid" SET DEFAULT nextval('public."interestsСircle_Сircleinterestid_seq"'::regclass);
 U   ALTER TABLE public."interestsСircle" ALTER COLUMN "Сircleinterestid" DROP DEFAULT;
       public          postgres    false    229    230    230            X           2604    141419    meetings meetingsid    DEFAULT     z   ALTER TABLE ONLY public.meetings ALTER COLUMN meetingsid SET DEFAULT nextval('public.meetings_meetingsid_seq'::regclass);
 B   ALTER TABLE public.meetings ALTER COLUMN meetingsid DROP DEFAULT;
       public          postgres    false    235    236    236            T           2604    141389 
   news newid    DEFAULT     h   ALTER TABLE ONLY public.news ALTER COLUMN newid SET DEFAULT nextval('public.news_newid_seq'::regclass);
 9   ALTER TABLE public.news ALTER COLUMN newid DROP DEFAULT;
       public          postgres    false    231    232    232            V           2604    141404    newscircle newid    DEFAULT     t   ALTER TABLE ONLY public.newscircle ALTER COLUMN newid SET DEFAULT nextval('public.newscircle_newid_seq'::regclass);
 ?   ALTER TABLE public.newscircle ALTER COLUMN newid DROP DEFAULT;
       public          postgres    false    234    233    234            N           2604    141305    role roleid    DEFAULT     j   ALTER TABLE ONLY public.role ALTER COLUMN roleid SET DEFAULT nextval('public.role_roleid_seq'::regclass);
 :   ALTER TABLE public.role ALTER COLUMN roleid DROP DEFAULT;
       public          postgres    false    219    220    220            O           2604    141312    roleuser userroleid    DEFAULT     z   ALTER TABLE ONLY public.roleuser ALTER COLUMN userroleid SET DEFAULT nextval('public.roleuser_userroleid_seq'::regclass);
 B   ALTER TABLE public.roleuser ALTER COLUMN userroleid DROP DEFAULT;
       public          postgres    false    221    222    222            L           2604    141276    secritkey idsecritkey    DEFAULT     ~   ALTER TABLE ONLY public.secritkey ALTER COLUMN idsecritkey SET DEFAULT nextval('public.secritkey_idsecritkey_seq'::regclass);
 D   ALTER TABLE public.secritkey ALTER COLUMN idsecritkey DROP DEFAULT;
       public          postgres    false    216    215    216            M           2604    141283    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    218    217    218            (          0    141356    circle 
   TABLE DATA           g   COPY public.circle (cricleid, namecricel, quantityuser, userclass, photopath, descriptors) FROM stdin;
    public          postgres    false    228   �y       $          0    141328 	   interests 
   TABLE DATA           6   COPY public.interests (interestsid, name) FROM stdin;
    public          postgres    false    224   ~       &          0    141337    interestsuser 
   TABLE DATA           L   COPY public.interestsuser (userinterestid, userid, interestsid) FROM stdin;
    public          postgres    false    226   �~       *          0    141367    interestsСircle 
   TABLE DATA           X   COPY public."interestsСircle" ("Сircleinterestid", cricleid, interestsid) FROM stdin;
    public          postgres    false    230   O       0          0    141416    meetings 
   TABLE DATA           n   COPY public.meetings (meetingsid, heading, eventdata, eventtime, addiinfo, creatednews, cricleid) FROM stdin;
    public          postgres    false    236   �       ,          0    141386    news 
   TABLE DATA           R   COPY public.news (newid, description, photopath, creatednews, userid) FROM stdin;
    public          postgres    false    232   ��       .          0    141401 
   newscircle 
   TABLE DATA           ]   COPY public.newscircle (newid, description, photopathimg, creatednews, cricleid) FROM stdin;
    public          postgres    false    234   р                  0    141302    role 
   TABLE DATA           0   COPY public.role (roleid, namerole) FROM stdin;
    public          postgres    false    220   ʁ       "          0    141309    roleuser 
   TABLE DATA           >   COPY public.roleuser (userroleid, userid, roleid) FROM stdin;
    public          postgres    false    222   �                 0    141273 	   secritkey 
   TABLE DATA           5   COPY public.secritkey (idsecritkey, key) FROM stdin;
    public          postgres    false    216   �                 0    141280    users 
   TABLE DATA           �   COPY public.users (userid, fio, email, tel, classuser, passwordhash, role, idcircle, photopathuser, creator, idsecritkey) FROM stdin;
    public          postgres    false    218   ��       C           0    0    circle_cricleid_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.circle_cricleid_seq', 3, true);
          public          postgres    false    227            D           0    0    interests_interestsid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.interests_interestsid_seq', 10, true);
          public          postgres    false    223            E           0    0     interestsuser_userinterestid_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.interestsuser_userinterestid_seq', 48, true);
          public          postgres    false    225            F           0    0 &   interestsСircle_Сircleinterestid_seq    SEQUENCE SET     W   SELECT pg_catalog.setval('public."interestsСircle_Сircleinterestid_seq"', 10, true);
          public          postgres    false    229            G           0    0    meetings_meetingsid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.meetings_meetingsid_seq', 3, true);
          public          postgres    false    235            H           0    0    news_newid_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.news_newid_seq', 1, false);
          public          postgres    false    231            I           0    0    newscircle_newid_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.newscircle_newid_seq', 3, true);
          public          postgres    false    233            J           0    0    role_roleid_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.role_roleid_seq', 2, true);
          public          postgres    false    219            K           0    0    roleuser_userroleid_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.roleuser_userroleid_seq', 1, false);
          public          postgres    false    221            L           0    0    secritkey_idsecritkey_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.secritkey_idsecritkey_seq', 20, true);
          public          postgres    false    215            M           0    0    users_userid_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_userid_seq', 14, true);
          public          postgres    false    217            u           2606    141365    circle circle_namecricel_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.circle
    ADD CONSTRAINT circle_namecricel_key UNIQUE (namecricel);
 F   ALTER TABLE ONLY public.circle DROP CONSTRAINT circle_namecricel_key;
       public            postgres    false    228            w           2606    141363    circle circle_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.circle
    ADD CONSTRAINT circle_pkey PRIMARY KEY (cricleid);
 <   ALTER TABLE ONLY public.circle DROP CONSTRAINT circle_pkey;
       public            postgres    false    228            m           2606    141335    interests interests_name_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.interests
    ADD CONSTRAINT interests_name_key UNIQUE (name);
 F   ALTER TABLE ONLY public.interests DROP CONSTRAINT interests_name_key;
       public            postgres    false    224            o           2606    141333    interests interests_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.interests
    ADD CONSTRAINT interests_pkey PRIMARY KEY (interestsid);
 B   ALTER TABLE ONLY public.interests DROP CONSTRAINT interests_pkey;
       public            postgres    false    224            q           2606    141342     interestsuser interestsuser_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_pkey PRIMARY KEY (userinterestid);
 J   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_pkey;
       public            postgres    false    226            s           2606    141344 2   interestsuser interestsuser_userid_interestsid_key 
   CONSTRAINT     |   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_userid_interestsid_key UNIQUE (userid, interestsid);
 \   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_userid_interestsid_key;
       public            postgres    false    226    226            y           2606    141374 :   interestsСircle interestsСircle_cricleid_interestsid_key 
   CONSTRAINT     �   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_cricleid_interestsid_key" UNIQUE (cricleid, interestsid);
 h   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_cricleid_interestsid_key";
       public            postgres    false    230    230            {           2606    141372 &   interestsСircle interestsСircle_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_pkey" PRIMARY KEY ("Сircleinterestid");
 T   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_pkey";
       public            postgres    false    230            �           2606    141422    meetings meetings_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (meetingsid);
 @   ALTER TABLE ONLY public.meetings DROP CONSTRAINT meetings_pkey;
       public            postgres    false    236            }           2606    141394    news news_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (newid);
 8   ALTER TABLE ONLY public.news DROP CONSTRAINT news_pkey;
       public            postgres    false    232                       2606    141409    newscircle newscircle_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.newscircle
    ADD CONSTRAINT newscircle_pkey PRIMARY KEY (newid);
 D   ALTER TABLE ONLY public.newscircle DROP CONSTRAINT newscircle_pkey;
       public            postgres    false    234            g           2606    141307    role role_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (roleid);
 8   ALTER TABLE ONLY public.role DROP CONSTRAINT role_pkey;
       public            postgres    false    220            i           2606    141314    roleuser roleuser_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_pkey PRIMARY KEY (userroleid);
 @   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_pkey;
       public            postgres    false    222            k           2606    141316 #   roleuser roleuser_userid_roleid_key 
   CONSTRAINT     h   ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_userid_roleid_key UNIQUE (userid, roleid);
 M   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_userid_roleid_key;
       public            postgres    false    222    222            [           2606    141278    secritkey secritkey_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.secritkey
    ADD CONSTRAINT secritkey_pkey PRIMARY KEY (idsecritkey);
 B   ALTER TABLE ONLY public.secritkey DROP CONSTRAINT secritkey_pkey;
       public            postgres    false    216            ]           2606    141291    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            _           2606    141289    users users_fio_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_fio_key UNIQUE (fio);
 =   ALTER TABLE ONLY public.users DROP CONSTRAINT users_fio_key;
       public            postgres    false    218            a           2606    141295    users users_idsecritkey_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_idsecritkey_key UNIQUE (idsecritkey);
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_idsecritkey_key;
       public            postgres    false    218            c           2606    141287    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            e           2606    141293    users users_tel_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tel_key UNIQUE (tel);
 =   ALTER TABLE ONLY public.users DROP CONSTRAINT users_tel_key;
       public            postgres    false    218            �           2606    141350 ,   interestsuser interestsuser_interestsid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_interestsid_fkey FOREIGN KEY (interestsid) REFERENCES public.interests(interestsid);
 V   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_interestsid_fkey;
       public          postgres    false    4719    224    226            �           2606    141345 '   interestsuser interestsuser_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.interestsuser
    ADD CONSTRAINT interestsuser_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 Q   ALTER TABLE ONLY public.interestsuser DROP CONSTRAINT interestsuser_userid_fkey;
       public          postgres    false    218    226    4707            �           2606    141375 /   interestsСircle interestsСircle_cricleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_cricleid_fkey" FOREIGN KEY (cricleid) REFERENCES public.circle(cricleid);
 ]   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_cricleid_fkey";
       public          postgres    false    230    228    4727            �           2606    141380 2   interestsСircle interestsСircle_interestsid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."interestsСircle"
    ADD CONSTRAINT "interestsСircle_interestsid_fkey" FOREIGN KEY (interestsid) REFERENCES public.interests(interestsid);
 `   ALTER TABLE ONLY public."interestsСircle" DROP CONSTRAINT "interestsСircle_interestsid_fkey";
       public          postgres    false    4719    224    230            �           2606    141423    meetings meetings_cricleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_cricleid_fkey FOREIGN KEY (cricleid) REFERENCES public.circle(cricleid);
 I   ALTER TABLE ONLY public.meetings DROP CONSTRAINT meetings_cricleid_fkey;
       public          postgres    false    236    4727    228            �           2606    141395    news news_userid_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 ?   ALTER TABLE ONLY public.news DROP CONSTRAINT news_userid_fkey;
       public          postgres    false    218    4707    232            �           2606    141410 #   newscircle newscircle_cricleid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.newscircle
    ADD CONSTRAINT newscircle_cricleid_fkey FOREIGN KEY (cricleid) REFERENCES public.circle(cricleid);
 M   ALTER TABLE ONLY public.newscircle DROP CONSTRAINT newscircle_cricleid_fkey;
       public          postgres    false    4727    234    228            �           2606    141322    roleuser roleuser_roleid_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.role(roleid);
 G   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_roleid_fkey;
       public          postgres    false    4711    220    222            �           2606    141317    roleuser roleuser_userid_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT roleuser_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 G   ALTER TABLE ONLY public.roleuser DROP CONSTRAINT roleuser_userid_fkey;
       public          postgres    false    4707    222    218            �           2606    141296    users users_idsecritkey_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_idsecritkey_fkey FOREIGN KEY (idsecritkey) REFERENCES public.secritkey(idsecritkey);
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_idsecritkey_fkey;
       public          postgres    false    216    4699    218            (   h  x��V�NG}��b��V"L
��"U���>�E-
����1A�Z�R�*�*����Ż���/�Kzι�k7�RE8�ٙ;��s�^k���Y���?�k?�c�s��4���:��������޳��^m���?�t;ݭ���V��}����{�?��S�z�������g��|�Ⱛ
g������x������#>g�_��!R�x9�f��II��%\9��w�s��<Tؚb!G�����V��_���ܯZJ]��c_��s�';';/���`�ȅ׺/�=%ʾ�qqeED��QA�^h����[��u:�j���GT��2m� M�t����n�"..��v,�H���z���\K���@ �_���e��S�T���P�* �ƥBcQ��0�n�K#�$a�����T!r�hN�4¹R̛������@��� u%�QLc��X�E!?D���D�v����g�Q|!E�� ).�53*��3�M�
fI��4�k	���}r�O��u�I��T����(C��3Y�2�J�R��,�Ȅ��Q2��B	,�$y�N�An`�Aɺ|;�byi�� �Se5?91�
�x'���u��Kcjp3ޓѝ����;����p�Z���YSwu}�������oqZ��� @�̌ku�py��j�Gy���ģgN�9��`�}qxt���姦�<�Ff��@���^ɚI��4��)�s�,�d��Ix�"Rr#�K>�R�y�!�kL/�f�l�p��jb`�Kg��RB�A�S�@�Ŋ�Z&'�D����S\7[���.5頔g�}>a�Ɵ��^���ڰ*
�5�Z��}^CVd��m�|��|l���-J�|?�	c�m�4��D�|an���f4�S,�d��Z��X���^��3IB�3��E4m�ǌ���r�妛��j�=`Y�9	�
���KDȝ�����K���3�ՕglM�Xļ�~��5]0��r��g4W��ce�7� /��nL �]�M�TB�j�3���&y����&NY��̌c�*�Y�fAj����m���5��+g�-�SY����2�.S��y��������G+ml�v�ַ6WeH����c�ˑdW�_g�$)흤�n���G�      $   �   x�5�K
�PE��b��g/.���"�(��R)>��[8ّyE	��rOnF�%��X8Y��
J�g�-���w�SE��N���^ZJKzq&ܣץ@�s�����n���E��M,�a)�G��㝮�+%�m�ɟ������>g=P�/��x�      &   �   x��� Eѵ���|�%�בK6A�.[�"��Xz��2_�7��Jv��.���F��)�p�-�+'Y@���ߢE��GዙL��C)r�����*jtE�O�冣�%/P�,ͤL(偧��J�f�������(<$[      *   3   x�ǹ  ��x]�x���`I�rW(*�I�R�.�lu-��Du� �x�      0     x�]�QN�0���S�wV9nZJϲ3p�/CL� �#���m�
����ntBr�r>�7�K}�A6N:';���0q�Q>��PQ!P��O}���Z����\���bJ~d�������C6Z��&9�|��$\�°e#k4��N]9}��!9�8�DȌ����z9D�\���|K�8$���.��%S�����5�M��E@���C���1 �g�py�f��(���?.�,ֹ@a�hO���8�ڀcUZōb���ե%s��8�q�o牵�d���      ,      x������ � �      .   �   x���MJA�u�)��tU���ֽ'p�0h$���Mf���@�0G4b�Pu#[�BtU�G��@���G��N�z�[�Q���!WE;n�)?7ZkQ�&��t\_,�'���:���1D�e�CD�/�s��Ȅe0�j�PX/P���*n��w���[㖛�������}���[
+�����y�]�/4����s��?��8 Kz]M�c1�"��K�W� y������          (   x�3��|���M�^��e�n�����b���� h��      "      x������ � �         m  x�����r@  �c.��%�����%�"͐%K\�w�kx3��}��Y_�%���<i�a6�q��-���P�K�'0�)�"+�
o��t2���6PfyF�Σ3~�ϕ
���Æ�֤Q�:}N����ν��#�+����G��x�� +0vʩ8p�6)� )3�紧%x�k/�_Qq�>��\^�O���:�k��^�1�)��M��Yj}���xY 
%�(��`&�{���[���,���
��p�ӗ� ���ޭ��ұ��o&hs��K�ANP�rfyoJ"r��K�F>�J,wz���D���쁁���F��m�U�Mm�9n�[u`@z>i`��Ӑd�\�!X��嵕�G�,d��+3���Q�\<��ǟ���xL�;��s+b�Y'��h�^Z�a5�ꥎN��0O��*LÏ�%I���͵"'�����d��V+b��­K���I�*���jx~���U���W�K�Q��$�cM~ş�ˮ&�鷉[�2�C�	�(E�wt��a��,��T�!���;��nKM 4`a<�\Owrm����w�5�j�BX��$���^� *Y v�*�:�J�Z�j�z������5��?�e� ���         o  x���K��V���Sx�m1�k��o<��=X�`�0�1`���kQ�I�E�&�Z��I�Q&i'�
����3�J-d�{@�w���Ϲ8�<O�'W��)y��������|�:��ѿ���-|�Ȗ������P�dc�NmaX
����<�����:%t&k�#fq�ǭ�e��w��g�(���?Ҫ-AO�S%pP�˙پ=��e� P8NP4�a 5=}!��g��'���"��\n��e�!�N����-8���j2K?̠�d�q��I�D���z)��f����d��"�#'�F=e8���Q�jK0�^����/#x
L�ƴp����,��:��#!G�վ�]���ݕ��'�q�� CP�6��"F���;���륆ߦѴ̟��݉�,�PG-�Ѥ��*RM�jj�儠�-�}��[�"���y�q��uZ�;��uz��}U��a 9����P~�F��������D��hX�;tҬ��Ym��N<YphҒ�N��6�[x��蠜��>jk�h%:�D ���)TC���E~?�)�Q������"��=Y;^�jYJnh5S&h3,t��S�
J��N�?ZK���݀e�T���q����@!_%�O;��e������>�2���H�'�T��d��Fʩ^�Z���{�D%��z��897G�`^��B��&6G#���b�$m��2�AM������|�c��4�G({��P�#EG�;u���b)���U�5�)v�\��W�v%�a�W�ئ����Z��
u�:X������m�_g�W��iwMe�Gvh��8�4������h���=�BG[�����.���C�L*JՕ�m���K�k��Gσ����o��~�HخS�t�¿Ls���d��[P0�C�����6����ZSkM�Bk��+]
m39��+���w|*4ŨA����A��`�}�b_�ϳQ�j�b�����(J�zu�	�zX�p`s��1�����<�@d��	���%Mo�]�G!1-H����X
�|
Lj�lT���]� z�}��p�3���8@��������t�h%&|�rA]�+X`���-�]-��!K��*ʹ@[��Qs%��\{S���̫���?e��g�2$X������ �S���"���G����6uf\��n �)�j�٦	�:Y�M���y�dZSzMB�ـC�eY�d�����d#�����[hދt�^ )��,%��H��Lqg܂���s�icŢ]j���jp�(W��̒�.���q�$c1��g�����ԧ�G����wn�'d�$ۢ/o���٨���8�`A�/vy��qZD�x��U��q�m.g�8>�-���H���*G8����yt��\.�/\	m     