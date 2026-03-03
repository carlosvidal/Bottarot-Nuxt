#!/usr/bin/env node
/**
 * Generate static sitemap XML files from blog content at build time.
 * Run automatically via npm's "prebuild" hook.
 *
 * Output (all in public/):
 *   sitemap.xml           – sitemap index
 *   sitemap-pages.xml     – static pages (home, blog indexes, legal)
 *   sitemap-blog-en.xml   – English blog posts
 *   sitemap-blog-es.xml   – Spanish blog posts
 *   sitemap-blog-it.xml   – Italian blog posts
 *   sitemap-blog-pt.xml   – Portuguese blog posts
 *   sitemap-blog-fr.xml   – French blog posts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const CONTENT_DIR = join(__dirname, '..', 'content', 'blog')
const PUBLIC_DIR = join(__dirname, '..', 'public')
const SITE_URL = (process.env.NUXT_PUBLIC_SITE_URL || 'https://freetarot.fun').replace(/\/$/, '')

// i18n strategy: prefix_except_default (en has no URL prefix)
const LOCALES = { en: '', es: '/es', it: '/it', pt: '/pt', fr: '/fr' }

// Parse scalar (non-nested) frontmatter fields only
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split('\n')) {
    if (!line || line[0] === ' ' || line[0] === '\t') continue
    const c = line.indexOf(':')
    if (c === -1) continue
    out[line.slice(0, c).trim()] = line.slice(c + 1).trim().replace(/^["']|["']$/g, '')
  }
  return out
}

function readMarkdownFiles(dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) out.push(...readMarkdownFiles(p))
    else if (e.endsWith('.md')) out.push(p)
  }
  return out
}

// Map file path to URL path using locale prefix rules
function fileToUrl(filePath, locale) {
  const rel = filePath
    .slice(join(CONTENT_DIR, locale).length)
    .replace(/\.md$/, '')
    .split(sep)
    .join('/')
  return `${LOCALES[locale]}/blog${rel}/`
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildBlogSitemap(posts) {
  const urls = posts
    .map(({ url, lastmod, image, title }) => {
      const img = image
        ? `    <image:image>\n      <image:loc>${esc(image)}</image:loc>\n      <image:title>${esc(title)}</image:title>\n    </image:image>`
        : ''
      return [
        '  <url>',
        `    <loc>${SITE_URL}${esc(url)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.7</priority>',
        img || null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    urls,
    '</urlset>',
  ].join('\n')
}

function buildPagesSitemap() {
  const pages = [
    // Homepages (all locales)
    { url: '/', p: '1.0', c: 'weekly' },
    { url: '/es/', p: '1.0', c: 'weekly' },
    { url: '/it/', p: '1.0', c: 'weekly' },
    { url: '/pt/', p: '1.0', c: 'weekly' },
    { url: '/fr/', p: '1.0', c: 'weekly' },
    // Blog indexes
    { url: '/blog/', p: '0.9', c: 'daily' },
    { url: '/es/blog/', p: '0.9', c: 'daily' },
    { url: '/it/blog/', p: '0.9', c: 'daily' },
    { url: '/pt/blog/', p: '0.9', c: 'daily' },
    { url: '/fr/blog/', p: '0.9', c: 'daily' },
    // Legal pages (all locales)
    ...['', '/es', '/it', '/pt', '/fr'].flatMap((pfx) => [
      { url: `${pfx}/terms/`, p: '0.3', c: 'yearly' },
      { url: `${pfx}/privacy/`, p: '0.3', c: 'yearly' },
      { url: `${pfx}/cookies/`, p: '0.3', c: 'yearly' },
    ]),
  ]

  const urls = pages
    .map(
      ({ url, p, c }) =>
        `  <url>\n    <loc>${SITE_URL}${url}</loc>\n    <changefreq>${c}</changefreq>\n    <priority>${p}</priority>\n  </url>`,
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n')
}

function buildSitemapIndex(entries) {
  const items = entries
    .map(
      ({ url, lastmod }) =>
        `  <sitemap>\n    <loc>${SITE_URL}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items,
    '</sitemapindex>',
  ].join('\n')
}

// ── Main ─────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10)
const indexEntries = []

// 1. Pages sitemap
writeFileSync(join(PUBLIC_DIR, 'sitemap-pages.xml'), buildPagesSitemap())
indexEntries.push({ url: '/sitemap-pages.xml', lastmod: today })
console.log('✓ sitemap-pages.xml')

// 2. Blog sitemaps (one per locale)
for (const locale of Object.keys(LOCALES)) {
  const dir = join(CONTENT_DIR, locale)
  const files = readMarkdownFiles(dir)

  const posts = files.map((f) => {
    const fm = parseFrontmatter(readFileSync(f, 'utf-8'))
    const rawDate = fm.updatedAt || fm.publishedAt
    return {
      url: fileToUrl(f, locale),
      lastmod: rawDate ? rawDate.slice(0, 10) : undefined,
      image: fm.image || undefined,
      title: fm.title || '',
    }
  })

  const name = `sitemap-blog-${locale}.xml`
  writeFileSync(join(PUBLIC_DIR, name), buildBlogSitemap(posts))
  indexEntries.push({ url: `/${name}`, lastmod: today })
  console.log(`✓ ${name} (${posts.length} posts)`)
}

// 3. Sitemap index
writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapIndex(indexEntries))
console.log(`✓ sitemap.xml (index, ${indexEntries.length} sitemaps)`)
console.log(`\n→ Submit to Google Search Console: ${SITE_URL}/sitemap.xml`)
