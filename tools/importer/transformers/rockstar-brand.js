/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Rockstar Adventures rebrand.
 * The source site (wknd-adventures.com) is still branded "WKND Adventures".
 * Rewrites brand names and contact email domains in text, attributes and
 * page metadata so imported content ships with the Rockstar Adventures brand.
 *
 * Image URLs are intentionally left pointing at the source host — they are
 * ingested as assets on upload and must stay resolvable.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const BRAND_RULES = [
  [/WKND\s+Adventures/g, 'Rockstar Adventures'],
  [/\bWKND\b/g, 'Rockstar'],
  [/wknd-?adventures\.com/gi, 'rockstar-adventures.com'],
];

// Attributes that carry user-facing text (never img src/srcset)
const TEXT_ATTRS = ['alt', 'title', 'aria-label'];

// Textual head metadata only — og:image etc. must keep the source image host
const TEXT_META = 'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]';

export function rebrandText(text) {
  if (!text) return text;
  return BRAND_RULES.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}

function rebrandTree(root, document) {
  const walker = document.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  let node = walker.nextNode();
  while (node) {
    const next = rebrandText(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
    node = walker.nextNode();
  }

  root.querySelectorAll('*').forEach((el) => {
    TEXT_ATTRS.forEach((attr) => {
      const value = el.getAttribute(attr);
      if (value) {
        const next = rebrandText(value);
        if (next !== value) el.setAttribute(attr, next);
      }
    });
    // Contact links (mailto:) carry the brand domain; page links are rewritten elsewhere
    if (el.tagName === 'A') {
      const href = el.getAttribute('href') || '';
      if (href.startsWith('mailto:')) el.setAttribute('href', rebrandText(href));
    }
  });
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;
  const { document } = payload;

  // Head metadata is read later by WebImporter.rules.createMetadata
  if (document.title) document.title = rebrandText(document.title);
  document.querySelectorAll(TEXT_META).forEach((meta) => {
    meta.setAttribute('content', rebrandText(meta.getAttribute('content')));
  });

  rebrandTree(element, document);
}
