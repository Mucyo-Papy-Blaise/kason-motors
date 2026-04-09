-- Track whether a test-drive booking has been seen in admin notifications.
alter table public.book_test_driver
  add column if not exists read boolean not null default false;
