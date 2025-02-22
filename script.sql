create type cart_status as enum ('OPEN', 'ORDERED');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table carts (
	id uuid primary key default uuid_generate_v4(),
    user_id uuid not null,
    created_at DATE default current_date not null,
    updated_at DATE not null,
    status cart_status not null
)

create table cart_items (
	cart_id uuid,
    product_id uuid,
    count integer,
    foreign key ("cart_id") references "carts" ("id")
)

INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('3d3e980e-3b6c-4c02-9d3e-6c161289bea7', '7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4);
    ('3b7d476d-3fb9-4b87-b09e-ee2d8e47032b', '57ab57ae-40a9-47a4-9ea3-16dabea95690', 56);
    ('45f931bb-0d19-4a7d-aa58-0a14e20a45d8', 'f1758552-cd10-4f0f-bd08-085b7c5bc2e1', 47);

INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
    ('3d3e980e-3b6c-4c02-9d3e-6c141289bea7', '1c90e5f8-23d5-4229-9e43-0515d8d5c439', '2023-11-01', '2023-11-02', 'OPEN'),
    ('99c5d5f8-0874-4e6e-88bf-2574d4e4e0b9', 'f79d3e3e-ced3-4bea-84c1-5cf9056d61a9', '2023-11-02', '2023-11-02', 'ORDERED'),
    ('3b7d476d-3fb9-4b87-b09e-ee2d8e47032b', 'f79d3e3e-ced3-4bea-84c1-5cf9056d61a9', '2023-11-03', '2023-11-04', 'OPEN'),
    ('45f931bb-0d19-4a7d-aa58-0a14e20a45d8', '9fa24c5b-8145-4f5e-94e6-727c690e4a51', '2023-11-04', '2023-11-05', 'OPEN'),
    ('a6fb14af-63de-43e8-bf8d-ff6c89018ce1', '9fa24c5b-8145-4f5e-94e6-727c690e4a51', '2023-11-05', '2023-11-05', 'ORDERED'),
    ('3d3e980e-3b6c-4c02-9d3e-6c161289bea7', '9fa24c5b-8145-4f5e-94e6-727c690e4a51', '2023-11-05', '2023-11-05', 'ORDERED');

;