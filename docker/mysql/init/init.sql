create table article_keys
(
    id         bigint unsigned auto_increment
        primary key,
    article_id varchar(15)                        not null,
    data       json                               null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    updated_at datetime                           null on update CURRENT_TIMESTAMP
);

create index article_keys_article_id_index
    on article_keys (article_id);

create table articles
(
    id                      bigint unsigned auto_increment
        primary key,
    article_no              varchar(50)                                                                                                                                              not null,
    atcl_nm                 varchar(255)                                                                                                                                             not null,
    rlet_tp_nm              enum ('아파트', '오피스텔', '빌라', '아파트분양권', '오피스텔분양권', '재건축', '전원주택', '단독/다가구', '상가주택', '한옥주택', '재개발', '원룸', '고시원', '상가', '사무실', '공장/창고', '건물', '토지', '지식산업센터') not null,
    trad_tp_cd              enum ('A1', 'B1', 'B2', 'B3')                                                                                                                            not null,
    region1                 varchar(20)                                                                                                                                              null,
    region2                 varchar(20)                                                                                                                                              null,
    region3                 varchar(20)                                                                                                                                              null,
    address                 varchar(500)                                                                                                                                             null,
    price                   int unsigned     default '0'                                                                                                                             null,
    rent_price              int unsigned                                                                                                                                             null,
    total_rent_price        int unsigned                                                                                                                                             null comment '보증금 변환 월세',
    spc1                    decimal(8, 2)    default 0.00                                                                                                                            null,
    spc2                    decimal(8, 2)    default 0.00                                                                                                                            null,
    spc_ratio               decimal(5, 2)    default 0.00                                                                                                                            not null,
    spc_price               decimal(8, 2)    default 0.00                                                                                                                            null,
    room_count              tinyint unsigned default '0'                                                                                                                             null,
    household               int unsigned     default '0'                                                                                                                             not null,
    parking_count           int              default 0                                                                                                                               not null,
    parking_ratio           decimal(8, 2)    default 0.00                                                                                                                            not null,
    is_duplex               enum ('Y', 'N')  default 'N'                                                                                                                             not null,
    floor                   tinyint unsigned default '0'                                                                                                                             null,
    max_floor               int unsigned     default '0'                                                                                                                             null,
    direction               enum ('동향', '서향', '남향', '북향', '북동향', '남동향', '북서향', '남서향')                                                                                                null,
    completion_year         tinyint unsigned default '0'                                                                                                                             null,
    building_coverage_ratio decimal(8, 2) unsigned                                                                                                                                   null,
    floor_area_ratio        decimal(8, 2) unsigned                                                                                                                                   null,
    summary                 text                                                                                                                                                     null comment 'Article Summary',
    description             text                                                                                                                                                     null comment 'Article Description',
    tags                    longtext collate utf8mb4_bin                                                                                                                             null,
    lat                     decimal(10, 7)                                                                                                                                           null,
    lng                     decimal(10, 7)                                                                                                                                           null,
    is_bookmark             enum ('Y', 'N')  default 'N'                                                                                                                             null,
    is_hidden               enum ('Y', 'N')  default 'N'                                                                                                                             null,
    created_at              datetime         default CURRENT_TIMESTAMP                                                                                                               null,
    updated_at              datetime                                                                                                                                                 null on update CURRENT_TIMESTAMP,
    constraint articles_article_no_uindex
        unique (article_no)
);

create index articles_address_index
    on articles (address);

create index articles_atcl_nm_created_at_index
    on articles (atcl_nm, created_at);

create index articles_created_at_index
    on articles (created_at);

create index articles_is_hidden_index
    on articles (is_hidden);

create index articles_trad_tp_cd_created_at_index
    on articles (trad_tp_cd, created_at);

create table basic_infos
(
    id               bigint unsigned auto_increment
        primary key,
    article_id       varchar(15)                                                                                                                                                            not null,
    real_estate_type enum ('A01', 'A02', 'A03', 'A04', 'B01', 'B02', 'B03', 'C01', 'C02', 'C03', 'C04', 'C06', 'D01', 'D02', 'D03', 'D04', 'D05', 'E01', 'E02', 'E03', 'E04', 'F01', 'Z00') not null,
    trade_type       enum ('A1', 'B1', 'B2', 'B3')                                                                                                                                          not null,
    data             json                                                                                                                                                                   null,
    created_at       datetime default CURRENT_TIMESTAMP                                                                                                                                     not null,
    updated_at       datetime                                                                                                                                                               null on update CURRENT_TIMESTAMP
);

create index basic_infos_article_id_index
    on basic_infos (article_id, real_estate_type, trade_type);

create table complexes
(
    id             bigint unsigned auto_increment
        primary key,
    complex_number varchar(15)                        not null,
    data           json                               null,
    created_at     datetime default CURRENT_TIMESTAMP not null,
    updated_at     datetime                           null on update CURRENT_TIMESTAMP
);

create index complexes_article_id_index
    on complexes (complex_number);

create table kakao_geo_addresses
(
    id         bigint unsigned auto_increment
        primary key,
    latitude   decimal(13, 10)                    not null,
    longitude  decimal(13, 10)                    null,
    data       longtext collate utf8mb4_bin       null,
    created_at datetime default CURRENT_TIMESTAMP null,
    updated_at datetime                           null on update CURRENT_TIMESTAMP
);

create index kakao_geo_addresses_latitude_longitude_index
    on kakao_geo_addresses (latitude, longitude);