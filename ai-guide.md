# AI-guide — IZZI Beauty template

> ⚠️ Dit bestand is SPECIFIEK voor het izzi-beauty template (Nederlandstalig). **Bij het kopiëren naar
> een nieuw template moet je de volledige routes-tabel, de collectie-lijst én de types hieronder
> vervangen** door die van het nieuwe template — anders zoekt de agent naar niet-bestaande routes.

Dit bestand beschrijft de structuur van **deze** website (het izzi-beauty template) voor de
AI Website-agent. Lees dit eerst. Het is leidend voor routes, content-bestanden en hoe je een
nieuwe pagina toevoegt. Structuur bewerk je door de juiste `content/<locale>/*.json` te editen —
niet door nieuwe route-bestanden te maken (behalve bij een écht nieuw paginatype).

> Kernregel: tekst/data staat in `content/<locale>/*.json`; layout/componenten in `components/*.tsx` +
> `app/[locale]/**`. Bij alleen tekst/beeld wijzigen → alleen de JSON editen. Beeldpaden leeg (`""`)
> laten tenzij er een echt geüpload `/media/...` pad is (leeg → nette placeholder via `<Media>`).

## 🔗 VLAKKE URLs — LEES DIT EERST

Deze site gebruikt **vlakke URLs**: elke detailpagina staat DIRECT onder de taal, ZONDER
categorie-segment. Dus `/lip-blush` (niet `/behandelingen/lip-blush`), `/microblading` (niet
`/opleidingen/microblading`), `/amsterdam` (niet `/wenkbrauwen/amsterdam`), `/mijn-artikel` (niet
`/blog/mijn-artikel`).

- **Eén dynamische route** rendert alle detailpagina's: `app/[locale]/[slug]/page.tsx`. Die zoekt de
  slug op in de collecties (services → trainings → locaties → blog) en rendert de juiste renderer.
  **Maak nooit een nieuw route-bestand voor een detailpagina** — voeg alleen een key toe aan de JSON.
- **De hub/overzicht-pagina's houden hun eigen pad:** `/behandelingen`, `/opleidingen`, `/blog`
  (lijstpagina's met eigen mapje). Alleen de DETAILpagina's zijn vlak.
- **⭐ SLUGS MOETEN GLOBAAL UNIEK ZIJN.** Omdat alles onder één vlakke namespace valt, mag dezelfde
  slug niet in twee collecties voorkomen (bv. een behandeling én een opleiding `lip-blush`), en mag
  een slug niet gelijk zijn aan een vaste routenaam (`behandelingen`, `opleidingen`, `blog`,
  `contact`, `prijzen`, `over-izzi`, `portfolio`, …). Een build-time guard in `[slug]/page.tsx` faalt
  met een duidelijke melding als er een botsing is — hernoem er dan één (en zet een redirect van de
  oude URL). Verzin bij twijfel een onderscheidende slug (bv. een opleiding → `lip-blush-opleiding`).
- **Oude geneste URLs → vlak:** `content/redirects.json` bevat generieke 301-regels
  (`/behandelingen/:slug` → `/:slug`, idem voor opleidingen/blog/wenkbrauwen). Verander die niet;
  voeg bij een hernoemde botsende slug een SPECIFIEKE regel toe vóór de generieke.

## 🌐 Meertalig (i18n)

Deze site is **i18n-ready**. Houd je hieraan:

- **Content staat per taal in `content/<locale>/`** — bv. `content/nl/home.json`. Er is GEEN plat
  `content/home.json`. De standaardtaal is **`nl`** (zie `content/i18n.json`). Maak nooit een plat
  `content/<bestand>.json` aan — `content/load.ts` leest enkel `content/<locale>/<naam>.json`.
- **Routes staan onder `app/[locale]/`.** In de routes-tabel hieronder staan de **publieke URLs
  zonder taalprefix** (`/lip-blush`); de site serveert ze onder `/nl/lip-blush` (de `[locale]`-prefix
  wordt automatisch toegevoegd).
- **Links in content zijn prefix-vrij én vlak** (`/contact`, `/lip-blush`). De taalprefix wordt bij
  het renderen toegevoegd (`<LocaleLink>`). Zet dus NOOIT `/nl/...` of een categorie-segment in
  content-JSON.
- **Nieuwe taal toevoegen = data, geen code** (tenant-toggle schrijft `content/i18n.json`; content
  wordt per taal gekopieerd/vertaald naar `content/<code>/`).
- **Systeembestanden staan plat in `content/` (taal-neutraal):** `content/i18n.json`,
  `content/forms.json`, `content/redirects.json`, `content/editable.json`. Niet in taalmappen zetten.

## Routes → content-bestand

> URLs hieronder zijn prefix-vrij; de echte URL is `/<locale>/<pad>`. Detailpagina's zijn VLAK
> (`/<slug>`), gerenderd door de ene route `app/[locale]/[slug]/page.tsx`.

| Route (publiek, prefix-vrij) | Type | Content-bestand | Renderer |
|---|---|---|---|
| `/` | homepage | `content/<locale>/home.json` | `app/[locale]/page.tsx` (eigen secties) |
| — | site (logo/nav/footer/locaties) | `content/<locale>/site.json` | `Header.tsx` / `Footer.tsx` |
| `/behandelingen` | hub/overzicht | `content/<locale>/behandelingen.json` | `app/[locale]/behandelingen/page.tsx` → `HubPage` |
| `/<slug>` | behandeling-detail (collectie) | `content/<locale>/services.json` | `app/[locale]/[slug]` → `DetailPage` |
| `/opleidingen` | hub/overzicht | `content/<locale>/opleidingen.json` | `app/[locale]/opleidingen/page.tsx` → `HubPage` |
| `/<slug>` | opleiding-detail (collectie) | `content/<locale>/trainings-detail.json` | `app/[locale]/[slug]` → `DetailPage` |
| `/online-trainingen` | hub/overzicht | `content/<locale>/online-trainingen.json` | `HubPage` |
| `/<slug>` | SEO-locatie/stad (collectie) | `content/<locale>/locaties.json` | `app/[locale]/[slug]` → `LocationPage` |
| `/blog` | index | `content/<locale>/blog.json` (`index`) | `app/[locale]/blog/page.tsx` |
| `/<slug>` | blog-artikel (collectie) | `content/<locale>/blog.json` (`posts`) | `app/[locale]/[slug]` |
| `/prijzen` | prijzen | `content/<locale>/prijzen.json` | `PriceList` |
| `/over-izzi` | over | `content/<locale>/over.json` | `app/[locale]/over-izzi/page.tsx` |
| `/portfolio` | galerij | `content/<locale>/portfolio.json` | `Gallery` |
| `/contact` | contact + formulier | `content/<locale>/contact.json` + `forms.json` | `app/[locale]/contact/page.tsx` |
| `/veelgestelde-vragen`, `/werken-bij-izzi-beauty`, `/uwv-subsidie`, `/ggd-gecertificeerd` | info (collectie) | `content/<locale>/info.json` | eigen routes → `InfoPage` |
| `/algemene-voorwaarden`, `/privacy-verklaring`, `/opleidingen-voorwaarden` | juridisch (collectie) | `content/<locale>/legal.json` | eigen routes → `LegalPage` |

> Behandeling-, opleiding-, locatie- en blogdetails delen ALLEMAAL de ene route `app/[locale]/[slug]`.
> `[slug]/page.tsx` beslist per slug welke renderer draait. Vaste pagina's (prijzen, contact, de
> hubs, …) houden hun eigen mapje en winnen altijd van de dynamische `[slug]`.

## Content laden (loaders)

Content wordt NIET statisch geïmporteerd. Elke `content/<naam>.ts` exporteert een functie die de
taal meekrijgt en via `content/load.ts` het juiste bestand leest:
`getHome(locale)`, `getSite(locale)`, `getServices(locale)` + `getServiceSlugs(locale)`, enz.
De vlakke route `app/[locale]/[slug]/page.tsx` haalt `locale`+`slug` uit `params`, zoekt de slug op
en rendert de juiste renderer. `generateStaticParams` bundelt alle slugs van alle collecties per taal
en werpt bij een dubbele/gereserveerde slug een build-fout (de uniciteitsguard).

## Keyed collections (⭐ zo voeg je pagina's toe zónder nieuwe route)

Deze bestanden zijn `{ "<slug>": {…} }` (per taal). Een nieuwe key = een nieuwe pagina op `/<slug>`.
**Maak GEEN nieuw route-bestand** — de vlakke `[slug]`-route rendert elke key automatisch. Kopieer de
vorm van een bestaande entry. Voeg de key toe in **elke actieve taal** (`content/<locale>/…`), of
minstens in de standaardtaal (`content/nl/…`). ⭐ Kies een slug die nog NERGENS bestaat (uniek over
alle collecties + geen vaste routenaam) — anders faalt de build-guard.

- `content/<locale>/services.json` → `/<slug>` (type `DetailContent`). Voeg ook een kaart toe in
  `content/<locale>/behandelingen.json` (een `groups[].items` met `url: "/<slug>"` — prefix-vrij én
  vlak) en, indien in het menu, een link in `content/<locale>/site.json` (`nav[].columns[].links`).
- `content/<locale>/trainings-detail.json` → `/<slug>` (type `DetailContent`). Kaart in
  `content/<locale>/opleidingen.json`, evt. nav in `site.json`.
- `content/<locale>/locaties.json` → `/<slug>` (type `LocationPageContent`). Voeg de stad toe aan de
  footerkolom in `site.json` indien gewenst.
- `content/<locale>/blog.json` → posts onder de key `posts` (`{ "posts": { "<slug>": {…} } }`, type
  `BlogPost`). De blogindex (`/blog`) toont ze automatisch en linkt naar `/<slug>` — geen kaart nodig.
- `content/<locale>/info.json` en `content/<locale>/legal.json` → keyed per slug, maar deze hebben WÉL
  een eigen klein route-bestand per pagina (bv. `app/[locale]/uwv-subsidie/page.tsx`) dat één key
  rendert. Voor een geheel nieuwe info/juridische pagina: voeg de key toe (in elke taal) én maak een
  klein route-bestand naar het patroon van een bestaande (bv. kopieer `app/[locale]/uwv-subsidie/page.tsx`).

## Herbruikbare renderers (in `components/sections.tsx`)

`HubPage`, `DetailPage`, `LocationPage`, `InfoPage`, `LegalPage`, `PageHero`, `CardGrid`,
`PriceList`, `Steps`, `FaqList`, `Gallery`, `ReviewGrid`, `ReviewMarquee`, `CtaBand`, `BlogGrid`.
Nieuwe pagina van een bestaand type heeft doorgaans GEEN nieuwe renderer nodig — alleen nieuwe data.
Interne links in renderers gebruiken `<LocaleLink>` (niet `<Link>`), zodat de taalprefix klopt.

## Types

Alle content-types staan in `lib/types.ts` (o.a. `HomeContent`, `SiteContent`, `HubContent`,
`DetailContent`, `DetailCollection`, `LocationPageContent`, `BlogPost`, `PrijzenContent`,
`OverContent`, `PortfolioContent`, `ContactContent`, `InfoContent`, `LegalContent`). Types zijn
taal-neutraal (elke taal heeft dezelfde vorm). Kopieer de vorm; verzin geen nieuwe velden tenzij nodig.

## Media

Gebruik `<Media src={…} shape="card|wide|portrait|square|free" label="…" />` voor content-beelden
(geen kale `<img src="">`). Laat `image`/`images` velden **leeg** bij nieuwe content — de placeholder
verschijnt vanzelf; de klant vult later beeld via de CMS. Mediapaden zijn `/media/<bestand>` — taal-neutraal (nooit `/nl/media/...`).

## editable.json

`content/editable.json` (plat, taal-neutraal) bepaalt welke content-bestanden in de CMS Content
Editor verschijnen. `file` is enkel de basisnaam (`home.json`). De collecties met detailpagina's
(`services.json`, `trainings-detail.json`, `locaties.json`) staan er al in met `"itemsArePages": true`
en **`"itemBase": ""`** (leeg = vlakke URLs, dus key `x` → `/x`). Voeg een regel toe alléén voor een
écht nieuw content-bestand (nieuw paginatype), niet voor een nieuwe key in een bestaande collectie.
Zet er GEEN systeembestanden in (`forms.json`, `redirects.json`, `i18n.json`).

## Forms & redirects

Zie de universele conventies in de system-prompt: `content/forms.json` (+ `<Form slug="…"/>`) en
`content/redirects.json` — beide **plat in `content/`, taal-neutraal**. Niet zelf een submit-handler
of `next.config` redirect schrijven. Redirect-`source`/`destination` zijn prefix-vrij; de site
verzorgt de taalprefix. `redirects.json` bevat al generieke regels die oude geneste detail-URLs naar
de vlakke URLs sturen — laat die staan.
