import type {
  CtaBlock,
  DetailContent,
  Faq,
  HubContent,
  InfoContent,
  LegalContent,
  LinkCard,
  Location,
  LocationPageContent,
  PriceGroup,
  Review,
  Step,
} from '@/lib/types'

import { Icon } from './icons'
import { LocaleLink } from './LocaleLink'
import { Media } from './Media'

/** Star row (filled ★ up to `n`). */
export function Stars({ n = 5 }: { n?: number }) {
  return <div className="stars" aria-label={`${n} van 5 sterren`}>{'★★★★★'.slice(0, n)}</div>
}

/** Internal-vs-external link that always renders a small "read more" arrow link. */
export function ArrowLink({ url, label = 'Lees meer' }: { url: string; label?: string }) {
  const inner = (
    <>
      {label}
      <Icon name="arrow" size={16} />
    </>
  )
  return url.startsWith('/') ? (
    <LocaleLink className="link-arrow" href={url}>{inner}</LocaleLink>
  ) : (
    <a className="link-arrow" href={url}>{inner}</a>
  )
}

/** Grid of image cards that link to a treatment / training / product page. */
export function CardGrid({ items }: { items: LinkCard[] }) {
  return (
    <div className="grid-3">
      {items.map((c) => (
        <article className="card" key={c.title}>
          <div className="card-media">
            <Media src={c.image} alt={c.title} shape="free" label={c.title} />
          </div>
          <div className="card-body">
            <h3>{c.title}</h3>
            {c.meta && <div className="card-meta"><span>{c.meta}</span></div>}
            <p>{c.text}</p>
            <ArrowLink url={c.url} label={c.linkLabel || 'Meer info'} />
          </div>
        </article>
      ))}
    </div>
  )
}

/** Single review card (shared by the grid + the marquee). */
function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="review-card">
      <Stars n={r.stars} />
      <p>&ldquo;{r.quote}&rdquo;</p>
      <div className="who">{r.who}</div>
      <div className="what">{r.what}</div>
    </article>
  )
}

/** Reviews grid (static). */
export function ReviewGrid({ items }: { items: Review[] }) {
  return (
    <div className="grid-3">
      {items.map((r) => (
        <ReviewCard key={r.who} r={r} />
      ))}
    </div>
  )
}

/**
 * Reviews as a continuous right-to-left marquee with fade-in/out edges.
 * The item list is duplicated once so the CSS animation can loop seamlessly (translateX(-50%)
 * lands exactly on the start of the second copy). Pauses on hover; respects reduced-motion
 * (falls back to a static, wrapping row). Full-bleed so the edge fade sits at the viewport sides.
 */
export function ReviewMarquee({ items }: { items: Review[] }) {
  if (items.length === 0) return null
  const loop = [...items, ...items]
  return (
    <div className="review-marquee" aria-label="Klantbeoordelingen">
      <div className="review-marquee-track">
        {loop.map((r, i) => (
          <div className="review-marquee-item" key={`${r.who}-${i}`} aria-hidden={i >= items.length}>
            <ReviewCard r={r} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Location cards. */
export function LocationCards({ items }: { items: Location[] }) {
  return (
    <div className="grid-2">
      {items.map((l) => (
        <article className="loc-card" key={l.name}>
          <div className="city">{l.city}</div>
          <h3>{l.name}</h3>
          <ul>
            <li><Icon name="pin" size={18} /><span>{l.address}, {l.postcode}</span></li>
            <li><Icon name="phone" size={18} /><span>{l.phone}</span></li>
            <li><Icon name="clock" size={18} /><span>{l.hours}</span></li>
          </ul>
          <div style={{ marginTop: 22 }}>
            <a className="link-arrow" href={l.mapUrl} target="_blank" rel="noreferrer">
              Bekijk op de kaart <Icon name="arrow" size={16} />
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

/** Dark CTA band used at the bottom of most pages. */
export function CtaBand({ cta }: { cta: CtaBlock }) {
  return (
    <section className="section cta-band">
      <div className="container">
        <div className="cta-inner">
          {cta.script && <span className="script">{cta.script}</span>}
          <h2>{cta.title}</h2>
          <p>{cta.text}</p>
          <div className="cta-actions">
            <LocaleLink className="btn btn-gold" href={cta.primaryUrl}>{cta.primaryLabel}</LocaleLink>
            {cta.secondaryLabel && cta.secondaryUrl && (
              <LocaleLink className="btn btn-light" href={cta.secondaryUrl}>{cta.secondaryLabel}</LocaleLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Interior-page hero (breadcrumb + title + intro), dark band. */
export function PageHero({ eyebrow, title, text, breadcrumb }: { eyebrow: string; title: string; text: string; breadcrumb: string }) {
  return (
    <section className="pagehero">
      <div className="container">
        <div className="pagehero-inner">
          <div className="breadcrumb"><LocaleLink href="/">Home</LocaleLink><span>/</span><span>{breadcrumb}</span></div>
          <span className="eyebrow" style={{ marginTop: 14 }}>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </section>
  )
}

/** Numbered step list (treatment/training "hoe werkt het"). */
export function Steps({ title, items }: { title: string; items: Step[] }) {
  return (
    <div>
      {title && <h2 style={{ marginBottom: 20 }}>{title}</h2>}
      <div className="steps">
        {items.map((s, i) => (
          <div className="step" key={s.title}>
            <div className="n">{i + 1}</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** FAQ accordion-style list (rendered open — no JS needed, SEO-friendly). */
export function FaqList({ title, items }: { title: string; items: Faq[] }) {
  return (
    <div>
      {title && <h2 style={{ marginBottom: 12 }}>{title}</h2>}
      {items.map((f) => (
        <div className="faq-item" key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  )
}

/** Price groups → clean price rows. */
export function PriceList({ groups }: { groups: PriceGroup[] }) {
  return (
    <div style={{ display: 'grid', gap: 46 }}>
      {groups.map((g) => (
        <div key={g.heading}>
          <h2 style={{ marginBottom: 18 }}>{g.heading}</h2>
          <div className="pricelist">
            {g.items.map((it) => (
              <div className="price-row" key={it.name}>
                <div>
                  <div className="name">{it.name}</div>
                  {it.desc && <div className="desc">{it.desc}</div>}
                </div>
                <div className="amount">{it.amount}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Masonry gallery. Empty entries render a blank placeholder tile (never a broken image). */
export function Gallery({ images }: { images: string[] }) {
  return (
    <div className="gallery">
      {images.map((src, i) =>
        (src ?? '').trim() ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" />
        ) : (
          <Media key={i} src="" shape="square" label="Foto" />
        ),
      )}
    </div>
  )
}

/**
 * Generic hub page (Behandelingen / Opleidingen / Online Trainingen). Driven by HubContent:
 * a page hero, optional intro, one or more titled groups of link-cards, and a closing CTA.
 */
export function HubPage({ data }: { data: HubContent }) {
  return (
    <>
      <PageHero {...data.hero} />
      <section className="section">
        <div className="container">
          {data.intro && (
            <div className="section-head center" style={{ marginBottom: 50 }}>
              <h2>{data.intro.title}</h2>
              <p>{data.intro.text}</p>
            </div>
          )}
          <div style={{ display: 'grid', gap: 70 }}>
            {data.groups.map((g) => (
              <div key={g.heading}>
                <div className="section-head" style={{ marginBottom: 30 }}>
                  <h2>{g.heading}</h2>
                  {g.text && <p>{g.text}</p>}
                </div>
                <CardGrid items={g.items} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand cta={data.cta} />
    </>
  )
}

/**
 * Generic treatment/training detail page. Driven by DetailContent: hero, lead image, prose
 * body sections, optional steps + FAQ, and a sticky aside with facts + a booking CTA.
 */
export function DetailPage({ data }: { data: DetailContent }) {
  return (
    <>
      <PageHero {...data.hero} />
      <section className="section">
        <div className="container">
          <div className="detail-grid">
            <div className="prose">
              <div className="detail-figure">
                <Media src={data.image} alt={data.hero.title} shape="wide" label={data.hero.title} />
              </div>
              {data.intro && <p className="lead" style={{ marginBottom: 8 }}>{data.intro}</p>}
              {data.body.map((b) => (
                <div key={b.heading}>
                  <h2>{b.heading}</h2>
                  {b.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {b.checklist && b.checklist.length > 0 && (
                    <ul className="checklist">
                      {b.checklist.map((c) => (
                        <li key={c}>
                          <span className="tick"><Icon name="check" size={13} /></span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {data.steps && data.steps.items.length > 0 && (
                <div style={{ marginTop: 44 }}>
                  <Steps title={data.steps.title} items={data.steps.items} />
                </div>
              )}
              {data.faq && data.faq.items.length > 0 && (
                <div style={{ marginTop: 44 }}>
                  <FaqList title={data.faq.title} items={data.faq.items} />
                </div>
              )}
            </div>

            <aside className="aside">
              <div className="aside-card">
                <h4>{data.aside.factsTitle}</h4>
                <ul className="aside-facts">
                  {data.aside.facts.map((f) => (
                    <li key={f.k}>
                      <span className="k">{f.k}</span>
                      <span className="v">{f.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aside-card dark">
                <h4>{data.aside.ctaTitle}</h4>
                <p>{data.aside.ctaText}</p>
                <LocaleLink className="btn btn-gold" href={data.aside.ctaUrl}>{data.aside.ctaLabel}</LocaleLink>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <CtaBand cta={data.cta} />
    </>
  )
}

/** Legal / plain-text page (voorwaarden, privacy). Simple prose sections under a page hero. */
export function LegalPage({ data }: { data: LegalContent }) {
  return (
    <>
      <PageHero {...data.hero} />
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="prose">
            {data.sections.map((s) => (
              <div key={s.heading}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/** Flexible info page (Werken Bij, UWV Subsidie, GGD, FAQ). Hero + optional image + prose
 *  body + optional FAQ + CTA. */
export function InfoPage({ data }: { data: InfoContent }) {
  return (
    <>
      <PageHero {...data.hero} />
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          {data.image !== undefined && (
            <div className="detail-figure" style={{ marginBottom: 30 }}>
              <Media src={data.image} alt={data.hero.title} shape="wide" label={data.hero.title} />
            </div>
          )}
          <div className="prose">
            {(data.body ?? []).map((b) => (
              <div key={b.heading}>
                <h2>{b.heading}</h2>
                {b.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {b.checklist && b.checklist.length > 0 && (
                  <ul className="checklist">
                    {b.checklist.map((c) => (
                      <li key={c}>
                        <span className="tick"><Icon name="check" size={13} /></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {data.faq && data.faq.items.length > 0 && (
            <div style={{ marginTop: 44 }}>
              <FaqList title={data.faq.title} items={data.faq.items} />
            </div>
          )}
        </div>
      </section>
      <CtaBand cta={data.cta} />
    </>
  )
}

/** SEO location page (Wenkbrauwen <stad>, Permanente Make-up <stad>). Locale-specific hero +
 *  prose + a single location card + FAQ + CTA. */
export function LocationPage({ data }: { data: LocationPageContent }) {
  return (
    <>
      <PageHero {...data.hero} />
      <section className="section">
        <div className="container">
          <div className="detail-grid">
            <div className="prose">
              <div className="detail-figure">
                <Media src={data.image} alt={data.hero.title} shape="wide" label={data.hero.title} />
              </div>
              {data.intro && <p className="lead" style={{ marginBottom: 8 }}>{data.intro}</p>}
              {data.body.map((b) => (
                <div key={b.heading}>
                  <h2>{b.heading}</h2>
                  {b.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {b.checklist && b.checklist.length > 0 && (
                    <ul className="checklist">
                      {b.checklist.map((c) => (
                        <li key={c}>
                          <span className="tick"><Icon name="check" size={13} /></span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {data.faq && data.faq.items.length > 0 && (
                <div style={{ marginTop: 44 }}>
                  <FaqList title={data.faq.title} items={data.faq.items} />
                </div>
              )}
            </div>
            <aside className="aside">
              <div className="aside-card">
                <h4>{data.location.name}</h4>
                <ul className="aside-facts">
                  <li><span className="k">Adres</span><span className="v">{data.location.address}</span></li>
                  <li><span className="k">Plaats</span><span className="v">{data.location.postcode}</span></li>
                  <li><span className="k">Telefoon</span><span className="v">{data.location.phone}</span></li>
                  <li><span className="k">Openingstijden</span><span className="v">{data.location.hours}</span></li>
                </ul>
                <div style={{ marginTop: 18 }}>
                  <a className="link-arrow" href={data.location.mapUrl} target="_blank" rel="noreferrer">
                    Bekijk op de kaart <Icon name="arrow" size={16} />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <CtaBand cta={data.cta} />
    </>
  )
}

/** Blog index grid — cards linking to each post. */
export function BlogGrid({ posts }: { posts: { slug: string; title: string; excerpt: string; image: string; date: string; category?: string }[] }) {
  return (
    <div className="grid-3">
      {posts.map((p) => (
        <article className="card" key={p.slug}>
          <div className="card-media">
            <Media src={p.image} alt={p.title} shape="free" label={p.title} />
          </div>
          <div className="card-body">
            {p.category && <div className="card-meta"><span>{p.category}</span></div>}
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <ArrowLink url={`/${p.slug}`} label="Lees artikel" />
          </div>
        </article>
      ))}
    </div>
  )
}
