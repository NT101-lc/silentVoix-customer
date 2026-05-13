const DEFAULT_TIMEOUT_MS = 8000;

const SOURCES = {
  signasl: {
    id: 'signasl',
    name: 'Sign ASL',
    baseUrl: 'https://www.signasl.org',
    type: 'asl'
  },
  anysign: {
    id: 'anysign',
    name: 'Anysign',
    baseUrl: 'https://www.anysign.app',
    type: 'asl'
  }
};

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ');
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function sanitizeTerm(term) {
  return normalizeWhitespace(term || '');
}

function slugifyTerm(term) {
  return sanitizeTerm(term)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractMetaContent(html, attribute, key) {
  const patterns = [
    new RegExp(`<meta[^>]+${attribute}=(["'])${escapeRegExp(key)}\\1[^>]+content=(["'])([\\s\\S]*?)\\2[^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=(["'])([\\s\\S]*?)\\1[^>]+${attribute}=(["'])${escapeRegExp(key)}\\3[^>]*>`, 'i')
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const content = match?.[3] || match?.[2];
    if (content) {
      return decodeHtmlEntities(content);
    }
  }

  return null;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SilentVoix-Customer/1.0 (+https://localhost)'
    },
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw createHttpError(response.status, `Failed to fetch remote source: ${url}`);
  }

  const html = await response.text();
  return { html, finalUrl: response.url };
}

function parseSignAslEntry(html, finalUrl, term) {
  const title = extractMetaContent(html, 'name', 'twitter:title') || extractMetaContent(html, 'property', 'og:title');
  const description =
    extractMetaContent(html, 'name', 'description') || extractMetaContent(html, 'property', 'og:description');
  const videoUrl =
    extractMetaContent(html, 'property', 'og:video') || extractMetaContent(html, 'name', 'twitter:player:stream');
  const imageUrl =
    extractMetaContent(html, 'property', 'og:image') || extractMetaContent(html, 'name', 'twitter:image');

  return {
    source: SOURCES.signasl.id,
    sourceName: SOURCES.signasl.name,
    term,
    slug: finalUrl.split('/sign/')[1] || slugifyTerm(term),
    pageUrl: finalUrl,
    title,
    description,
    videoUrl,
    imageUrl,
    found: Boolean(title && videoUrl)
  };
}

function parseAnysignEntry(html, finalUrl, term) {
  const title = extractMetaContent(html, 'property', 'og:title') || extractMetaContent(html, 'name', 'twitter:title');
  const description =
    extractMetaContent(html, 'name', 'description') || extractMetaContent(html, 'property', 'og:description');
  const videoUrl =
    extractMetaContent(html, 'property', 'og:video') || extractMetaContent(html, 'name', 'twitter:player:stream');
  const imageUrl =
    extractMetaContent(html, 'property', 'og:image') || extractMetaContent(html, 'name', 'twitter:image');

  return {
    source: SOURCES.anysign.id,
    sourceName: SOURCES.anysign.name,
    term,
    slug: finalUrl.split('/dictionary/')[1] || slugifyTerm(term),
    pageUrl: finalUrl,
    title,
    description,
    videoUrl,
    imageUrl,
    found: Boolean(title && videoUrl)
  };
}

function extractChipSection(html, marker) {
  const sectionPattern = new RegExp(`${escapeRegExp(marker)}[\\s\\S]*?<div class="word-grid">([\\s\\S]*?)</div>`, 'i');
  const sectionMatch = html.match(sectionPattern);

  if (!sectionMatch?.[1]) {
    return [];
  }

  const links = [];
  const linkPattern = /<a class="word-chip" href="([^"]+)">([\s\S]*?)<\/a>/gi;

  for (const match of sectionMatch[1].matchAll(linkPattern)) {
    const href = match[1];
    const label = normalizeWhitespace(decodeHtmlEntities(stripTags(match[2])));
    if (!label) {
      continue;
    }

    links.push({
      term: label,
      slug: href.split('/sign/')[1] || slugifyTerm(label),
      pageUrl: new URL(href, SOURCES.signasl.baseUrl).toString()
    });
  }

  return links;
}

export function listSignSources() {
  return Object.values(SOURCES).map(({ id, name, baseUrl, type }) => ({
    id,
    name,
    baseUrl,
    type
  }));
}

export async function fetchTrendingSigns(limit = 12) {
  const { html } = await fetchHtml(`${SOURCES.signasl.baseUrl}/`);

  return {
    source: SOURCES.signasl.id,
    recent: extractChipSection(html, 'Recently searched words').slice(0, limit),
    popular: extractChipSection(html, 'Popular signs today').slice(0, limit)
  };
}

export async function lookupSigns(term, sources = ['signasl', 'anysign']) {
  const normalizedTerm = sanitizeTerm(term);
  if (!normalizedTerm) {
    throw createHttpError(400, 'Query parameter "term" is required');
  }

  const slug = slugifyTerm(normalizedTerm);
  if (!slug) {
    throw createHttpError(400, 'Query parameter "term" is invalid');
  }

  const selectedSources = sources.filter((source) => SOURCES[source]);
  if (selectedSources.length === 0) {
    throw createHttpError(400, 'At least one supported source is required');
  }

  const tasks = selectedSources.map(async (source) => {
    if (source === 'signasl') {
      const { html, finalUrl } = await fetchHtml(`${SOURCES.signasl.baseUrl}/word.php?word=${encodeURIComponent(normalizedTerm)}`);
      return parseSignAslEntry(html, finalUrl, normalizedTerm);
    }

    const { html, finalUrl } = await fetchHtml(`${SOURCES.anysign.baseUrl}/en/dictionary/${slug}`);
    return parseAnysignEntry(html, finalUrl, normalizedTerm);
  });

  const results = await Promise.allSettled(tasks);

  return results.map((result, index) => {
    const source = selectedSources[index];

    if (result.status === 'fulfilled') {
      return result.value;
    }

    return {
      source,
      sourceName: SOURCES[source].name,
      term: normalizedTerm,
      slug,
      found: false,
      error: result.reason?.message || 'Failed to fetch source'
    };
  });
}
