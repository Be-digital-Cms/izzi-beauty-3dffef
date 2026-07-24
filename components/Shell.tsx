import type { ReactNode } from 'react'

import { getSite } from '@/content/site'
import { defaultLocale, hideDefaultPrefix } from '@/lib/i18n'

import { Footer } from './Footer'
import { Header } from './Header'
import { LocaleProvider } from './LocaleLink'

/** Standard page frame: sticky header + page content + footer. Interior pages wrap their
 *  sections in <Shell locale={locale}>…</Shell>. (The home page composes Header/Footer itself
 *  for its bespoke hero layout.) The LocaleProvider makes the locale + routing config available to
 *  every LocaleLink below, so nav/footer/section links get the right prefix (or none, for the
 *  default language when hideDefaultPrefix is on). */
export function Shell({ locale, children }: { locale: string; children: ReactNode }) {
  const site = getSite(locale)
  return (
    <LocaleProvider locale={locale} defaultLocale={defaultLocale()} hideDefaultPrefix={hideDefaultPrefix()}>
      <Header site={site} locale={locale} />
      <main>{children}</main>
      <Footer site={site} />
    </LocaleProvider>
  )
}
