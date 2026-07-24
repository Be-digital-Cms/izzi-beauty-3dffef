# Media & afbeeldingen — IZZI Beauty template

Alle afbeeldingen/media zijn **content**, geen code. Ze staan als velden in `content/*.json`
en zijn dus volledig bewerkbaar via het **admin-dashboard (Content Editor)** — daar vervang
je een afbeelding door een nieuwe te uploaden en het pad aan te passen. Geen enkele
afbeelding is hardcoded in een component.

De echte bestanden liggen in `public/media/`. De huidige beelden zijn **tijdelijke
placeholders** (premium stock) zodat het ontwerp er meteen goed uitziet — vervang ze door
de echte IZZI-beelden via het dashboard.

## Welk mediaveld hoort waar (landingspagina)

Alle onderstaande velden staan in **`content/home.json`** en zijn bewerkbaar in de
Content Editor onder **"Home"**:

| Sectie | Veld (JSON-pad) | Huidig pad | Aanbevolen formaat |
|--------|-----------------|-----------|--------------------|
| Hero (grote achtergrond) | `hero.image` | `/media/hero/hero.jpg` | 1600×1000, liggend |
| Hero achtergrondvideo (optioneel) | `hero.videoUrl` | `""` (leeg) | mp4/webm, ≤1080p. Leeg = afbeelding wordt gebruikt. |
| Intro / over-ons beeld | `intro.image` | `/media/about/studio.jpg` | 1200×1500, staand |
| Behandeling-kaart 1 | `treatments.items[0].image` | `/media/treatments/powder-brows.jpg` | 1200×900 |
| Behandeling-kaart 2 | `treatments.items[1].image` | `/media/treatments/lip-blush.jpg` | 1200×900 |
| Behandeling-kaart 3 | `treatments.items[2].image` | `/media/treatments/eyeliner.jpg` | 1200×900 |
| Opleiding-kaart 1 | `trainings.items[0].image` | `/media/trainings/allround.jpg` | 1200×900 |
| Opleiding-kaart 2 | `trainings.items[1].image` | `/media/trainings/powder-brows.jpg` | 1200×900 |
| Opleiding-kaart 3 | `trainings.items[2].image` | `/media/trainings/lip-blush.jpg` | 1200×900 |

In **`content/site.json`** (Content Editor → **"Site"**):

| Onderdeel | Veld (JSON-pad) | Huidig | Opmerking |
|-----------|-----------------|--------|-----------|
| Logo (header + footer) | `logo` | `""` (leeg) | Leeg = merknaam als tekst-logo. Vul `/media/logo/izzi-logo.svg` in om een logo-afbeelding te tonen. |
| Kaart Amsterdam | `footer.locations[0].mapUrl` | Google Maps-link | link, geen afbeelding |
| Kaart Den Bosch | `footer.locations[1].mapUrl` | Google Maps-link | link, geen afbeelding |

## Zo vervang je een afbeelding
1. Open het **admin-dashboard → Content Editor → Home** (of Site voor het logo).
2. Zoek het afbeeldingveld, upload je nieuwe beeld en/of pas het pad aan.
3. Opslaan — de website toont direct het nieuwe beeld.

> Tip: houd de mapstructuur in `public/media/` aan (`hero/`, `about/`, `treatments/`,
> `trainings/`, `portfolio/`, `logo/`, `video/`). Zie `public/media/README.txt`.

## Video
De hero heeft een optioneel videoveld `hero.videoUrl` (in `content/home.json`, Content Editor →
Home → Hero). Dit veld toont in het dashboard **hetzelfde upload-/mediapaneel als een afbeelding**,
maar dan voor video's (mp4/webm): uploaden, kiezen uit de mediabibliotheek, of een URL plakken.

- Leeg → de hero gebruikt `hero.image`.
- Gevuld (bv. `/media/video/hero.mp4`) → de video speelt als achtergrond (autoplay, muted, loop),
  met `hero.image` als poster/fallback.

Videobestanden horen in `public/media/video/`. Elk contentveld met een naam die eindigt op
`video`/`videoUrl` krijgt automatisch het video-upload-paneel — zo kun je later eenvoudig
videovelden aan andere secties toevoegen.
