create schema inventory_db collate utf8mb3_general_ci;

create table categories
(
    id          int auto_increment
        primary key,
    title       varchar(255)              not null,
    description varchar(255) default null null
);

INSERT INTO inventory_db.categories (title, description) VALUES ('as', 'nenewn');
SELECT * FROM inventory_db.categories


create table locations
(
    id          int auto_increment
        primary key,
    title       varchar(255) not null,
    description varchar(255) null
);

INSERT INTO inventory_db.locations (title, description) VALUES ('storage', null);
SELECT * FROM inventory_db.locations


create table items
(
    id          int auto_increment
        primary key,
    category_id int                    not null,
    location_id int                    not null,
    title       varchar(255)           not null,
    description varchar(255)           null,
    image       varchar(255)           null,
    create_at   datetime default now() null,
    constraint items_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint items_locations_id_fk
        foreign key (location_id) references locations (id)
);

SELECT * FROM inventory_db.items;
INSERT INTO inventory_db.items (category_id, location_id, title, description, image, create_at) VALUES (4, 3, 'qwerty', null, 'images/imagesf95c9444-d2ed-4096-99ac-32408490c50f.jpg', DEFAULT);
DELETE FROM items WHERE id = 3;
