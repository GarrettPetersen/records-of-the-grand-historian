import {
  normalizePersonPageSlug,
  personPageShardName,
  personPageSlugSuffix,
} from '../lib/people-shards.js';

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/u;

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': status === 200 ? 'public, max-age=3600, s-maxage=86400' : 'public, max-age=300',
      'x-content-type-options': 'nosniff',
    },
  });
}

function permanentRedirect(requestUrl, canonicalSlug) {
  return new Response(null, {
    status: 301,
    headers: {
      location: new URL(`/people/${canonicalSlug}.html`, requestUrl).href,
      'cache-control': 'public, max-age=3600, s-maxage=86400',
      'x-content-type-options': 'nosniff',
    },
  });
}

async function personResponse(context) {
  const slug = normalizePersonPageSlug(context.params.slug);
  if (!SLUG_PATTERN.test(slug)) return htmlResponse('<h1>Person not found</h1>', 404);

  const shardUrl = new URL(
    `/data/people/pages/${personPageShardName(slug)}.json`,
    context.request.url,
  );
  const shardResponse = await context.env.ASSETS.fetch(new Request(shardUrl));
  if (!shardResponse.ok) {
    console.error(JSON.stringify({ event: 'people-shard-missing', slug, status: shardResponse.status }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  let shard;
  try {
    shard = await shardResponse.json();
  } catch (error) {
    console.error(JSON.stringify({ event: 'people-shard-invalid-json', slug, error: String(error) }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  if (shard.v !== 2 || !shard.pages || typeof shard.pages !== 'object') {
    console.error(JSON.stringify({ event: 'people-shard-invalid', slug }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  {
    const response = await context.env.ASSETS.fetch(new Request(new URL('/data/people/site-status.json', context.request.url)));
    if (!response.ok) return htmlResponse('<h1>People certification unavailable</h1>', 503);
    let status;
    try { status = await response.json(); }
    catch { return htmlResponse('<h1>People certification unavailable</h1>', 503); }
    if (!status.published || status.preview || status.publication?.mode !== 'certified-scope' || status.certificate?.kind !== 'certified-website-people' ||
        !shard.certification?.inputs || !shard.certification?.projection ||
        shard.certification.inputs !== status.certificate.inputs ||
        shard.certification.projection !== status.certificate.projection) {
      return htmlResponse('<h1>People certification unavailable</h1>', 503);
    }
  }
  const html = shard.pages[slug];
  if (typeof html === 'string') return htmlResponse(html);

  const personIdSuffix = personPageSlugSuffix(slug);
  if (!personIdSuffix) return htmlResponse('<h1>Person not found</h1>', 404);
  const redirectShardUrl = new URL(
    `/data/people/redirects/${personPageShardName(personIdSuffix)}.json`,
    context.request.url,
  );
  const redirectShardResponse = await context.env.ASSETS.fetch(new Request(redirectShardUrl));
  if (!redirectShardResponse.ok) return htmlResponse('<h1>Person not found</h1>', 404);
  let redirectShard;
  try {
    redirectShard = await redirectShardResponse.json();
  } catch (error) {
    console.error(JSON.stringify({ event: 'people-redirect-shard-invalid-json', slug, error: String(error) }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  if (redirectShard.v !== 1 || !redirectShard.redirects || typeof redirectShard.redirects !== 'object') {
    console.error(JSON.stringify({ event: 'people-redirect-shard-invalid', slug }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  const canonicalSlug = redirectShard.redirects[personIdSuffix];
  if (typeof canonicalSlug !== 'string') return htmlResponse('<h1>Person not found</h1>', 404);
  if (!SLUG_PATTERN.test(canonicalSlug) || canonicalSlug === slug) {
    console.error(JSON.stringify({ event: 'people-redirect-target-invalid', slug, canonicalSlug }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  {
    const targetResponse = await context.env.ASSETS.fetch(new Request(new URL(
      `/data/people/pages/${personPageShardName(canonicalSlug)}.json`, context.request.url)));
    if (!targetResponse.ok) return htmlResponse('<h1>People redirect target unavailable</h1>', 503);
    let target;
    try { target = await targetResponse.json(); }
    catch { return htmlResponse('<h1>People redirect target unavailable</h1>', 503); }
    if (target.v !== 2 || typeof target.pages?.[canonicalSlug] !== 'string' ||
        target.certification?.inputs !== shard.certification.inputs ||
        target.certification?.projection !== shard.certification.projection) {
      return htmlResponse('<h1>People redirect target unavailable</h1>', 503);
    }
  }
  return permanentRedirect(context.request.url, canonicalSlug);
}

export function onRequestGet(context) {
  return personResponse(context);
}

export async function onRequestHead(context) {
  const response = await personResponse(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
