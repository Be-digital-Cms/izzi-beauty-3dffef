import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LocaleLink } from '@/components/LocaleLink'
import { Media } from '@/components/Media'
import { Shell } from '@/components/Shell'
import { DetailPage, LocationPage, PageHero } from '@/components/sections'
import { getPosts, getPostSlugs } from '@/content/blog'
import { getLocaties, getLocatieSlugs } from '@/content/locaties'
import { getServices, getServiceSlugs } from '@/content/services'
import { getTrainingsDetail, getTrainingSlugs } from '@/content/trainings-detail'
import { activeLocales } from '@/lib/i18n'

/**
 * Flat, content-driven detail route: /<locale>/<slug>.
 *
 * Every detail page (treatments, trainings, city-landing pages, blog posts) lives directly under the
 * locale — NO category prefix (so /nl/lip-blush instead of /nl/behandelingen/lip-blush). A slug is
 * resolved by looking it up, in order, across the content collections; the first match decides how it
 * renders. Static pages (prijzen, contact, over-izzi, the behandelingen/opleidingen/blog hubs, …) keep
 * their own named folders and always win over this dynamic segment.
 *
 * Because there is now a single flat namespace, every slug must be GLOBALLY UNIQUE and must not equal a
 * reserved static-route name. `generateStaticParams` enforces this at build time (it throws with a
 * clear message) so a collision can never silently serve the wrong page.
 */

/** Top-level static route segments — a content slug may never collide with one (Next resolves the
 *  static folder first, which would make the content page unreachable). */
const RESERVED = new Set([
  'behandelingen',
  'opleidingen',
  'blog',
  'online-trainingen',
  'prijzen',
  'over-izzi',
  'portfolio',
  'contact',
  'veelgestelde-vragen',
  'algemene-voorwaarden',
  'privacy-verklaring',
  'opleidingen-voorwaarden',
  'uwv-subsidie',
  'ggd-gecertificeerd',
  'werken-bij-izzi-beauty',
  'media',
])

type Resolved =
  | { kind: 'detail'; data: ReturnType<typeof getServices>[string] }
  | { kind: 'location'; data: ReturnType<typeof getLocaties>[string] }
  | { kind: 'post'; data: ReturnType<typeof getPosts>[string] }

/** Find which collection owns `slug` (first match wins; slugs are guaranteed unique by the guard). */
function resolvePage(locale: string, slug: string): Resolved | null {
  const svc = getServices(locale)[slug]
  if (svc) return { kind: 'detail', data: svc }
  const trn = getTrainingsDetail(locale)[slug]
  if (trn) return { kind: 'detail', data: trn }
  const loc = getLocaties(locale)[slug]
  if (loc) return { kind: 'location', data: loc }
  const post = getPosts(locale)[slug]
  if (post) return { kind: 'post', data: post }
  return null
}

export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string }> = []
  for (const locale of activeLocales()) {
    const groups: Array<[string, string[]]> = [
      ['behandeling', getServiceSlugs(locale)],
      ['opleiding', getTrainingSlugs(locale)],
      ['locatie', getLocatieSlugs(locale)],
      ['blog', getPostSlugs(locale)],
    ]
    const seen = new Map<string, string>()
    for (const [kind, slugs] of groups) {
      for (const slug of slugs) {
        if (RESERVED.has(slug)) {
          throw new Error(
            `[flat-routes] Slug "${slug}" (${kind}, ${locale}) collides with a reserved static route. ` +
              `Rename it in the content so flat URLs stay unambiguous.`,
          )
        }
        const prev = seen.get(slug)
        if (prev) {
          throw new Error(
            `[flat-routes] Duplicate slug "${slug}" in "${locale}": used by both ${prev} and ${kind}. ` +
              `With flat URLs (/<locale>/<slug>) every slug must be globally unique — rename one of them ` +
              `(and add a redirect from the old URL).`,
          )
        }
        seen.set(slug, kind)
        out.push({ locale, slug })
      }
    }
  }
  return out
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = resolvePage(locale, slug)
  if (!page) return { title: 'Niet gevonden — IZZI Beauty' }
  if (page.kind === 'post') return { title: `${page.data.title} — IZZI Beauty`, description: page.data.excerpt }
  return { title: `${page.data.hero.title} — IZZI Beauty`, description: page.data.hero.text }
}

export default async function FlatDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const page = resolvePage(locale, slug)
  if (!page) notFound()

  if (page.kind === 'detail') {
    return (
      <Shell locale={locale}>
        <DetailPage data={page.data} />
      </Shell>
    )
  }
  if (page.kind === 'location') {
    return (
      <Shell locale={locale}>
        <LocationPage data={page.data} />
      </Shell>
    )
  }

  // Blog post — same markup as the former /blog/<slug> route.
  const post = page.data
  return (
    <Shell locale={locale}>
      <PageHero eyebrow={post.category || 'Blog'} title={post.title} text={post.excerpt} breadcrumb={post.title} />
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="prose">
            <div className="detail-figure" style={{ marginBottom: 30 }}>
              <Media src={post.image} alt={post.title} shape="wide" label={post.title} />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              {post.author} · {post.date}
            </p>
            {post.body.map((b, i) => (
              <div key={i}>
                {b.heading && <h2>{b.heading}</h2>}
                {b.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <LocaleLink className="btn btn-ghost" href="/blog">
              Terug naar de blog
            </LocaleLink>
          </div>
        </div>
      </section>
    </Shell>
  )
}
