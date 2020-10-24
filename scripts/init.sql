create table if not exists owners
(
    id         integer not null
        constraint owners_pk
            primary key,
    avatar_url text,
    html_url   text,
    type       text,
    site_admin boolean
);

create unique index if not exists owners_id_uindex
    on owners (id);

create table if not exists github_info
(
    id          integer not null
        constraint github_info_pk
            primary key,
    name        text,
    html_url    text,
    description text,
    created_at  text,
    open_issues integer,
    watchers    integer,
    owner       integer
        constraint github_info_owners_id_fk
            references owners
);

create unique index if not exists github_info_id_uindex
    on github_info (id);

