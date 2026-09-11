-- ============================================================================
-- GyanMarg AI: Supabase PostgreSQL pgvector Schema & Match Function
-- Migration: 20260911_rag_pgvector_setup.sql
-- ============================================================================

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create courses table with 384-dimensional vector embedding column
create table if not exists public.courses (
  id text primary key,
  code text,
  title text not null,
  description text,
  domain text,
  sub_domain text,
  area text,
  org text,
  duration numeric default 2,
  level text default 'Beginner',
  rating numeric default 4.5,
  url text,
  keywords text[] default '{}',
  learning_outcomes text[] default '{}',
  prerequisites text[] default '{}',
  embedding vector(384),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Create HNSW vector cosine similarity index for sub-millisecond retrieval
create index if not exists courses_embedding_hnsw_idx
on public.courses using hnsw (embedding vector_cosine_ops);

-- 4. Enable Row Level Security (RLS)
alter table public.courses enable row level security;

-- 5. Create RLS Policies
-- Allow anyone (anon + authenticated) to query courses
create policy "Allow public read access to courses"
on public.courses for select
to anon, authenticated
using (true);

-- Allow service_role and authenticated administrators to insert/update/delete
create policy "Allow authenticated admins to insert courses"
on public.courses for insert
to authenticated, service_role
with check (true);

create policy "Allow authenticated admins to update courses"
on public.courses for update
to authenticated, service_role
using (true)
with check (true);

create policy "Allow authenticated admins to delete courses"
on public.courses for delete
to authenticated, service_role
using (true);

-- 6. RPC Function for Vector Similarity Search
create or replace function public.match_courses (
  query_embedding vector(384),
  match_threshold float default 0.20,
  match_count int default 8,
  filter_domain text default null,
  filter_level text default null
)
returns table (
  id text,
  code text,
  title text,
  description text,
  domain text,
  sub_domain text,
  area text,
  org text,
  duration numeric,
  level text,
  rating numeric,
  url text,
  keywords text[],
  learning_outcomes text[],
  similarity float
)
language plpgsql
security invoker
as $$
begin
  return query
  select
    c.id,
    c.code,
    c.title,
    c.description,
    c.domain,
    c.sub_domain,
    c.area,
    c.org,
    c.duration,
    c.level,
    c.rating,
    c.url,
    c.keywords,
    c.learning_outcomes,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.courses c
  where (filter_domain is null or c.domain ilike filter_domain)
    and (filter_level is null or filter_level = 'all' or c.level ilike filter_level)
    and (1 - (c.embedding <=> query_embedding)) >= match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- Grant execution permissions
grant execute on function public.match_courses to anon, authenticated, service_role;
