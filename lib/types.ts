/** Content types for the IZZI Beauty template. Kept flat + descriptive so the BE Digital CMS
 *  Content Editor (and the AI agent) can edit every field through a recursive form. */

/* ---------- shared ---------- */
export type NavChild = { label: string; url: string; tag?: string }
export type NavColumn = { heading: string; url?: string; links: NavChild[] }
export type NavItem = { label: string; url: string; columns?: NavColumn[] }
export type SocialLink = { label: string; url: string; icon: string }
export type Location = { name: string; city: string; address: string; postcode: string; phone: string; hours: string; mapUrl: string }
export type FooterLink = { label: string; url: string }
export type FooterColumn = { heading: string; links: FooterLink[] }

export type SiteContent = {
  brandName: string
  tagline: string
  /** Optional logo image path (e.g. "/media/logo/izzi-logo.svg"). Empty → the brand name is
   *  shown as a text logo instead. Set this to use an uploaded logo image. */
  logo: string
  nav: NavItem[]
  ctaLabel: string
  ctaUrl: string
  bookingUrl: string
  footer: {
    about: string
    locations: Location[]
    email: string
    phone: string
    columns: FooterColumn[]
    socials: SocialLink[]
    rightsText: string
    legalLabel: string
    legalUrl: string
  }
}

/* ---------- reusable section pieces ---------- */
export type Stat = { num: string; lbl: string }
export type Feature = { icon: string; title: string; text: string }
export type Review = { stars: number; quote: string; who: string; what: string }
export type Step = { title: string; text: string }
export type Faq = { q: string; a: string }
export type CtaBlock = { script?: string; title: string; text: string; primaryLabel: string; primaryUrl: string; secondaryLabel?: string; secondaryUrl?: string }

/** A card that links to a treatment/training/other page. */
export type LinkCard = { title: string; meta?: string; text: string; image: string; url: string; linkLabel?: string }

/* ---------- landing ---------- */
export type HomeContent = {
  hero: {
    eyebrow: string
    titleLead: string
    titleEm: string
    titleTail: string
    text: string
    primaryLabel: string
    primaryUrl: string
    secondaryLabel: string
    secondaryUrl: string
    image: string
    /** Optional hero background video (e.g. "/media/video/hero.mp4"). Empty → the image is used. */
    videoUrl: string
    meta: Stat[]
  }
  reviewStrip: { text: string; linkLabel: string; linkUrl: string }
  intro: { eyebrow: string; title: string; text: string; checklist: string[]; image: string; badgeNum: string; badgeLabel: string; buttonLabel: string; buttonUrl: string }
  treatments: { eyebrow: string; title: string; text: string; items: LinkCard[]; buttonLabel: string; buttonUrl: string }
  trainings: { eyebrow: string; title: string; text: string; items: LinkCard[]; buttonLabel: string; buttonUrl: string }
  usps: { eyebrow: string; title: string; text: string; items: Feature[] }
  stats: Stat[]
  reviewsSection: { eyebrow: string; title: string; items: Review[] }
  locationsSection: { eyebrow: string; title: string; text: string }
  /** Contact section (before footer). All fields — including the contact details on the left —
   *  are edited here via the Content Editor, independent of the footer. */
  contactSection: {
    eyebrow: string
    title: string
    text: string
    email: string
    phone: string
    locations: { name: string; address: string; hours: string }[]
  }
  cta: CtaBlock
}

/* ---------- generic hub page (behandelingen, opleidingen, online-trainingen) ---------- */
export type HubContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  intro?: { title: string; text: string }
  groups: { heading: string; text?: string; items: LinkCard[] }[]
  cta: CtaBlock
}

/* ---------- treatment / training detail page ---------- */
export type DetailFact = { k: string; v: string }
export type DetailContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  image: string
  intro: string
  body: { heading: string; paragraphs: string[]; checklist?: string[] }[]
  steps?: { title: string; items: Step[] }
  faq?: { title: string; items: Faq[] }
  aside: { factsTitle: string; facts: DetailFact[]; ctaTitle: string; ctaText: string; ctaLabel: string; ctaUrl: string }
  cta: CtaBlock
}

/** A keyed collection of detail pages (services.json / trainings-detail.json). Each key is a
 *  URL slug ("powder-brows") → its DetailContent. Add a new key to publish a new detail page;
 *  the [slug] route renders it and the hub link-cards point to it. This is the canonical
 *  pattern the CMS Content Editor + AI agent use to add pages. */
export type DetailCollection = Record<string, DetailContent>

/* ---------- prijzen ---------- */
export type PriceItem = { name: string; desc?: string; amount: string }
export type PriceGroup = { heading: string; items: PriceItem[] }
export type PrijzenContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  groups: PriceGroup[]
  note?: string
  cta: CtaBlock
}

/* ---------- over-izzi (about) ---------- */
export type OverContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  story: { eyebrow: string; title: string; paragraphs: string[]; image: string; badgeNum: string; badgeLabel: string }
  values: { eyebrow: string; title: string; text: string; items: Feature[] }
  stats: Stat[]
  founder: { eyebrow: string; title: string; paragraphs: string[]; image: string; name: string; role: string }
  cta: CtaBlock
}

/* ---------- portfolio ---------- */
export type PortfolioContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  intro?: string
  images: string[]
  cta: CtaBlock
}

/* ---------- contact ---------- */
export type ContactContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  intro: { title: string; text: string }
  locations: Location[]
  bookingLabel: string
  bookingUrl: string
  cta: CtaBlock
}

/* ---------- webshop ---------- */
export type WebshopContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  intro?: string
  products: LinkCard[]
  cta: CtaBlock
}

/* ---------- legal (algemene-voorwaarden, privacy, opleidingen-voorwaarden) ---------- */
export type LegalContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  sections: { heading: string; paragraphs: string[] }[]
}
/** Keyed by slug ("algemene-voorwaarden") so one [slug] route serves every legal/plain page. */
export type LegalCollection = Record<string, LegalContent>

/* ---------- info page (Werken Bij, UWV Subsidie, GGD, FAQ hub) — flexible content page ---------- */
export type InfoContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  image?: string
  body?: { heading: string; paragraphs: string[]; checklist?: string[] }[]
  faq?: { title: string; items: Faq[] }
  cta: CtaBlock
}
export type InfoCollection = Record<string, InfoContent>

/* ---------- SEO location page (Wenkbrauwen Amsterdam, Permanente Make-up Almere, …) ---------- */
export type LocationPageContent = {
  city: string
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  image: string
  intro: string
  body: { heading: string; paragraphs: string[]; checklist?: string[] }[]
  faq?: { title: string; items: Faq[] }
  location: Location
  cta: CtaBlock
}
export type LocationPageCollection = Record<string, LocationPageContent>

/* ---------- blog ---------- */
export type BlogPost = {
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  category?: string
  body: { heading?: string; paragraphs: string[] }[]
}
export type BlogCollection = Record<string, BlogPost>
export type BlogIndexContent = {
  hero: { eyebrow: string; title: string; text: string; breadcrumb: string }
  cta: CtaBlock
}
