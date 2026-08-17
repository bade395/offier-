-- ============================================================
-- منظومة عروض الأسعار - Supabase + PDF Storage
-- المستخدم العادي: إنشاء عرض + رفع ملف PDF فقط.
-- المدير: قراءة + فتح/تعديل + حذف + فتح PDF.
-- لا توجد صلاحية UPDATE/DELETE للمستخدم العادي على جدول quotes.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.quotes (
    id uuid primary key default gen_random_uuid(),
    quote_ref text not null unique,
    quote_date text,
    client_name text not null,
    items jsonb not null default '[]'::jsonb,
    total_net numeric(14,2) not null default 0,
    total_vat numeric(14,2) not null default 0,
    total_grand numeric(14,2) not null default 0,
    terms_ar text,
    terms_en text,
    device_id text not null,
    device_name text not null,
    device_info jsonb not null default '{}'::jsonb,
    pdf_path text,
    pdf_filename text,
    pdf_size bigint,
    pdf_uploaded_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- في حال كان جدول quotes موجودًا من النسخة السابقة، نضيف أعمدة PDF فقط.
alter table public.quotes add column if not exists pdf_path text;
alter table public.quotes add column if not exists pdf_filename text;
alter table public.quotes add column if not exists pdf_size bigint;
alter table public.quotes add column if not exists pdf_uploaded_at timestamptz;

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists quotes_device_id_idx on public.quotes (device_id);
create index if not exists quotes_client_name_idx on public.quotes (client_name);

-- ============================================================
-- حسابات المدير
-- ============================================================
create table if not exists public.manager_users (
    user_id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'manager' check (role = 'manager'),
    created_at timestamptz not null default now()
);

alter table public.quotes enable row level security;
alter table public.manager_users enable row level security;

create or replace function public.is_manager()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1 from public.manager_users
        where user_id = auth.uid() and role = 'manager'
    );
$$;

revoke all on function public.is_manager() from public;
grant execute on function public.is_manager() to authenticated;

-- ============================================================
-- صلاحيات جدول quotes
-- ============================================================
drop policy if exists "quotes_anon_select" on public.quotes;
drop policy if exists "quotes_anon_insert" on public.quotes;
drop policy if exists "quotes_anon_update" on public.quotes;
drop policy if exists "quotes_anon_delete" on public.quotes;
drop policy if exists "quotes_manager_select" on public.quotes;
drop policy if exists "quotes_manager_update" on public.quotes;
drop policy if exists "quotes_manager_delete" on public.quotes;
drop policy if exists "quotes_manager_insert" on public.quotes;

-- المستخدم العادي: INSERT فقط.
create policy "quotes_anon_insert"
on public.quotes
for insert
to anon
with check (true);

-- المدير: قراءة/إضافة/تعديل/حذف.
create policy "quotes_manager_select"
on public.quotes
for select
to authenticated
using (public.is_manager());

create policy "quotes_manager_insert"
on public.quotes
for insert
to authenticated
with check (public.is_manager());

create policy "quotes_manager_update"
on public.quotes
for update
to authenticated
using (public.is_manager())
with check (public.is_manager());

create policy "quotes_manager_delete"
on public.quotes
for delete
to authenticated
using (public.is_manager());

grant insert on table public.quotes to anon;
grant select, insert, update, delete on table public.quotes to authenticated;
revoke all on table public.manager_users from anon, authenticated;

-- ============================================================
-- Supabase Storage: ملفات PDF
-- ============================================================
-- Bucket خاص Private، وليس Public.
insert into storage.buckets (id, name, public)
values ('quote-pdfs', 'quote-pdfs', false)
on conflict (id) do update set public = false;

-- حذف سياسات النسخ السابقة إن وجدت.
drop policy if exists "quote_pdfs_anon_insert" on storage.objects;
drop policy if exists "quote_pdfs_manager_insert" on storage.objects;
drop policy if exists "quote_pdfs_manager_select" on storage.objects;
drop policy if exists "quote_pdfs_manager_delete" on storage.objects;
drop policy if exists "quote_pdfs_manager_update" on storage.objects;

-- المستخدم العادي يستطيع رفع PDF فقط داخل مجلد quotes/.
-- لا يستطيع قراءة الملفات أو حذفها أو تعديلها.
create policy "quote_pdfs_anon_insert"
on storage.objects
for insert
to anon
with check (
    bucket_id = 'quote-pdfs'
    and (storage.foldername(name))[1] = 'quotes'
);

-- المدير يستطيع رفع/قراءة/حذف/تعديل ملفات PDF.
create policy "quote_pdfs_manager_insert"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'quote-pdfs'
    and public.is_manager()
);

create policy "quote_pdfs_manager_select"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'quote-pdfs'
    and public.is_manager()
);

create policy "quote_pdfs_manager_update"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'quote-pdfs'
    and public.is_manager()
)
with check (
    bucket_id = 'quote-pdfs'
    and public.is_manager()
);

create policy "quote_pdfs_manager_delete"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'quote-pdfs'
    and public.is_manager()
);

-- ============================================================
-- بعد إنشاء حساب المدير من Authentication > Users:
-- استبدل UUID التالي بالـ User UID الحقيقي ثم نفّذ السطر:
--
-- insert into public.manager_users (user_id)
-- values ('PUT-MANAGER-USER-UUID-HERE')
-- on conflict (user_id) do nothing;
-- ============================================================
