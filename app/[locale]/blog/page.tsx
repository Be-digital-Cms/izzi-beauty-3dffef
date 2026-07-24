import type { Metadata } from 'next'

import { Shell } from '@/components/Shell'
import { BlogGrid, CtaBand, PageHero } from '@/components/sections'
import { getBlogIndex, getPosts, getPostSlugs } from '@/content/blog'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const data = getBlogIndex(locale)
  return { title: `${data.hero.title} — IZZI Beauty`, description: data.hero.text }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const blogIndex = getBlogIndex(locale)
  const posts = getPosts(locale)
  const cards = getPostSlugs(locale).map((slug) => ({
    slug,
    title: posts[slug].title,
    excerpt: posts[slug].excerpt,
    image: posts[slug].image,
    date: posts[slug].date,
    category: posts[slug].category,
  }))
  return (
    <Shell locale={locale}>
      <PageHero {...blogIndex.hero} />
      <section className="section">
        <div className="container">
          <BlogGrid posts={cards} />
        </div>
      </section>
      <CtaBand cta={blogIndex.cta} />
    </Shell>
  )
}
