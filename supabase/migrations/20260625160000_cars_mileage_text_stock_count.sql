alter table public.cars
  alter column mileage type text using mileage::text,
  add column if not exists stock_count integer not null default 1;

alter table public.cars
  add constraint cars_stock_count_nonnegative check (stock_count >= 0);
