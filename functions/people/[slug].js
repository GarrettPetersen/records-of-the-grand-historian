import { normalizePersonPageSlug, personPageShardName } from '../lib/people-shards.js';

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
  if (shard.v !== 1 || !shard.pages || typeof shard.pages !== 'object') {
    console.error(JSON.stringify({ event: 'people-shard-invalid', slug }));
    return htmlResponse('<h1>People index temporarily unavailable</h1>', 503);
  }
  const html = shard.pages[slug];
  if (typeof html !== 'string') return htmlResponse('<h1>Person not found</h1>', 404);
  return htmlResponse(html);
}

export function onRequestGet(context) {
  return personResponse(context);
}

export async function onRequestHead(context) {
  const response = await personResponse(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
