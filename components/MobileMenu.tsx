'use client'

import { useEffect, useState } from 'react'

import type { NavItem } from '@/lib/types'

import { LanguageSwitcher } from './LanguageSwitcher'
import { LocaleLink } from './LocaleLink'

/**
 * Mobile navigation: a hamburger button that opens a full-height drawer with the nav tree.
 * Top-level items that have mega-menu columns are ACCORDIONS (tap to expand/collapse; all collapsed
 * by default, one open at a time) so a big menu isn't one endless scroll. Plain items are simple
 * links. Client component; driven by the same site.json nav data.
 */
export function MobileMenu({ nav, ctaLabel, ctaUrl, locales }: { nav: NavItem[]; ctaLabel: string; ctaUrl: string; locales?: string[] }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null) // label of the currently-open accordion
  const close = () => { setOpen(false); setExpanded(null) }

  // Lock body scroll while the drawer is open so the background can't scroll behind it.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="mobilenav">
      <button
        className="hamburger"
        aria-label={open ? 'Menu sluiten' : 'Menu openen'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      {open && <div className="drawer-overlay" onClick={close} />}

      <aside className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <span className="drawer-title">Menu</span>
          <button className="drawer-close" aria-label="Sluiten" onClick={close}>&times;</button>
        </div>
        <nav className="drawer-nav">
          {nav.map((item) => {
            const hasColumns = !!item.columns && item.columns.length > 0
            // Plain item (no sub-menu) → simple link.
            if (!hasColumns) {
              return (
                <div className="drawer-group" key={item.label}>
                  <LocaleLink className="drawer-link" href={item.url} onClick={close}>{item.label}</LocaleLink>
                </div>
              )
            }
            // Item with columns → accordion toggle.
            const isOpen = expanded === item.label
            return (
              <div className={`drawer-group${isOpen ? ' is-open' : ''}`} key={item.label}>
                <button
                  type="button"
                  className="drawer-acc"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                >
                  <span>{item.label}</span>
                  <span className="drawer-acc-caret" aria-hidden="true" />
                </button>
                {isOpen && (
                  <div className="drawer-acc-body">
                    {/* Direct link to the section's own overview page. */}
                    <LocaleLink className="drawer-sublink drawer-sublink--all" href={item.url} onClick={close}>
                      Alle {item.label.toLowerCase()}
                    </LocaleLink>
                    {item.columns!.map((col) => (
                      <div className="drawer-sub" key={col.heading}>
                        <span className="drawer-sub-head">{col.heading}</span>
                        {col.links.map((l) => (
                          <LocaleLink key={l.label} className="drawer-sublink" href={l.url} onClick={close}>{l.label}</LocaleLink>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        {locales && locales.length > 1 && (
          <div className="drawer-lang">
            <span className="drawer-sub-head">Taal / Language</span>
            <LanguageSwitcher locales={locales} variant="mobile" />
          </div>
        )}
        <LocaleLink className="btn btn-gold drawer-cta" href={ctaUrl} onClick={close}>{ctaLabel}</LocaleLink>
      </aside>
    </div>
  )
}
