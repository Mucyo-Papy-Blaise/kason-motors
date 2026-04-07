alter table public.cars
  add column if not exists title text,
  add column if not exists brand text,
  add column if not exists model text,
  add column if not exists condition text,
  add column if not exists body_type text,
  add column if not exists engine_size text,
  add column if not exists drive_type text,
  add column if not exists horsepower integer,
  add column if not exists exterior_color text,
  add column if not exists interior_color text,
  add column if not exists doors integer,
  add column if not exists seats integer,
  add column if not exists negotiable boolean not null default false,
  add column if not exists description text,
  add column if not exists image_urls jsonb not null default '[]'::jsonb,
  add column if not exists video_url text,
  add column if not exists features jsonb not null default '[]'::jsonb;

update public.cars
set
  title = coalesce(title, name),
  brand = coalesce(brand, category),
  model = coalesce(model, ''),
  condition = coalesce(condition, 'Used'),
  body_type = coalesce(body_type, type),
  engine_size = coalesce(engine_size, ''),
  drive_type = coalesce(drive_type, ''),
  horsepower = coalesce(horsepower, 0),
  description = coalesce(description, ''),
  image_urls = case
    when image_urls = '[]'::jsonb and image is not null and image <> '' then jsonb_build_array(image)
    else image_urls
  end
where true;
