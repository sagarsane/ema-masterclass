/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Rockstar Adventures rebrand.
 * The legacy source site (wknd-adventures.com) still carries the old
 * "WKND Adventures" brand. This rewrites brand names and brand email
 * domains in imported text, alt/title attributes, mailto links, and the
 * page metadata so every imported page ships with the new brand.
 *
 * Image URLs are intentionally left untouched — assets are still fetched
 * from the legacy host during import.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export const BRAND_NAME = 'Rockstar Adventures';

const TEXT_RULES = [
  [/wknd-adventures\.com/gi, 'rockstar-adventures.com'],
  [/WKND Adventures/gi, BRAND_NAME],
  [/\bWKND\b/g, 'Rockstar'],
];

/**
 * Apply brand replacements to a string.
 * @param {string} value
 * @returns {string}
 */
export function rebrandText(value) {
  if (!value) return value;
  return TEXT_RULES.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), value);
}

/**
 * Rebrand all text nodes and brand-bearing attributes under a root element.
 * @param {Element} root
 * @param {Document} document
 */
export function rebrandElement(root, document) {
  if (!root) return;
  const SHOW_TEXT = 4;
  const walker = document.createTreeWalker(root, SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const next = rebrandText(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
    node = walker.nextNode();
  }

  root.querySelectorAll('[alt], [title]').forEach((el) => {
    ['alt', 'title'].forEach((attr) => {
      if (el.hasAttribute(attr)) el.setAttribute(attr, rebrandText(el.getAttribute(attr)));
    });
  });

  root.querySelectorAll('a[href^="mailto:" i]').forEach((a) => {
    a.setAttribute('href', rebrandText(a.getAttribute('href')));
  });
}

/**
 * Rebrand the document title and head meta tags (read later by createMetadata).
 * @param {Document} document
 */
function rebrandHead(document) {
  if (document.title) document.title = rebrandText(document.title);
  document.querySelectorAll('head meta[content]').forEach((meta) => {
    meta.setAttribute('content', rebrandText(meta.getAttribute('content')));
  });
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;
  const { document } = payload;
  rebrandElement(element, document);
  rebrandHead(document);
}
