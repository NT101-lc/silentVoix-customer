import { fetchTrendingSigns, listSignSources, lookupSigns } from '../services/signSourceService.js';

function parseSources(rawSources) {
  if (!rawSources) {
    return ['signasl', 'anysign'];
  }

  return String(rawSources)
    .split(',')
    .map((source) => source.trim().toLowerCase())
    .filter(Boolean);
}

function parseLimit(rawLimit, fallback = 12) {
  const value = Number(rawLimit);
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(value), 1), 30);
}

export function listSourcesController(_req, res) {
  res.status(200).json({
    sources: listSignSources()
  });
}

export async function trendingSignsController(req, res, next) {
  try {
    const limit = parseLimit(req.query.limit);
    const data = await fetchTrendingSigns(limit);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function lookupSignsController(req, res, next) {
  try {
    const results = await lookupSigns(req.query.term, parseSources(req.query.sources));
    res.status(200).json({
      term: String(req.query.term || '').trim(),
      results
    });
  } catch (error) {
    next(error);
  }
}
