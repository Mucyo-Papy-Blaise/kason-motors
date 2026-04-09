-- Test-drive booking requests from the public site (writes via API + service role).
create table if not exists public.book_test_driver (
  id bigint generated always as identity primary key,
  car_id integer not null references public.cars (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists book_test_driver_car_id_idx
  on public.book_test_driver (car_id);

create index if not exists book_test_driver_created_at_idx
  on public.book_test_driver (created_at desc);

alter table public.book_test_driver enable row level security;
