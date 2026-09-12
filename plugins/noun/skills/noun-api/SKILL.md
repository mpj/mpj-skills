---
name: noun-api
description: Call the Noun Project icon API (api.thenounproject.com/v2) from an app or script — search icons by term and style, fetch one icon, download it as SVG or PNG in a colour, and read the monthly quota. Use when asked to put a Noun Project icon on a page, look up an icon id, sign a request with the Noun keys, or budget API calls. Assumes NOUN_API_KEY and NOUN_API_SECRET in the environment; never asks for them and never prints them.
---

# noun-api

The Noun Project sells one thing through its API: a signed request comes back
with icons, and every icon comes with the sentence you owe its maker. This skill
is the shape of that request, checked live against the API on 12 September 2026,
so an agent can write the call once and get it right. Two credentials live in
the environment as `NOUN_API_KEY` and `NOUN_API_SECRET`, both 32 hex characters.
Read them; do not echo them, log them, write them into a file that is committed,
or put them in a URL. If they are missing, say so and stop; do not ask the
person to paste them into the chat.

## The request

Base URL `https://api.thenounproject.com/v2`. Every call is a GET with an
OAuth 1.0a `Authorization` header signed HMAC-SHA1 with the key as consumer key
and the secret as consumer secret. There is no token step and no user: the
signing key is the percent-encoded secret followed by a bare `&`. The signature
base string is `GET`, the URL without its query, and the query parameters plus
the `oauth_*` parameters sorted by name, each of the three percent-encoded and
joined by `&`. Percent-encoding is RFC 3986 strict: `!`, `'`, `(`, `)` and `*`
are encoded too, which `encodeURIComponent` alone does not do. A wrong signature
comes back as `401`, so if the API says so, the encoding is the first suspect.

This is the whole of it, in Web Crypto so it runs the same in a browser, a
Cloudflare Worker, Deno, Bun and Node 20 or later:

```ts
const enc = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, c => "%" + c.charCodeAt(0).toString(16).toUpperCase())

async function noun(path: string, params: Record<string, string> = {}, key = process.env.NOUN_API_KEY!, secret = process.env.NOUN_API_SECRET!) {
  const url = new URL("https://api.thenounproject.com/v2" + path)
  const oauth: Record<string, string> = {
    oauth_consumer_key: key,
    oauth_nonce: crypto.randomUUID().replace(/-/g, ""),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_version: "1.0",
  }
  const all = { ...params, ...oauth }
  const query = Object.keys(all).sort().map(k => enc(k) + "=" + enc(all[k]!)).join("&")
  const base = ["GET", enc(url.origin + url.pathname), enc(query)].join("&")
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(enc(secret) + "&"), { name: "HMAC", hash: "SHA-1" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(base))
  oauth.oauth_signature = btoa(String.fromCharCode(...new Uint8Array(sig)))
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value)
  const header = "OAuth " + Object.keys(oauth).sort().map(n => enc(n) + '="' + enc(oauth[n]!) + '"').join(", ")
  const r = await fetch(url, { headers: { Authorization: header } })
  if (!r.ok) throw new Error(`Noun ${r.status}: ${(await r.json().catch(() => ({})) as { message?: string }).message ?? r.statusText}`)
  return r.json()
}
```

In a Cloudflare Worker the keys are not on `process.env`; they are secrets on
the binding, set with `wrangler secret put NOUN_API_KEY` and read from `env`,
with a `.dev.vars` file for local runs. Pass them in as the last two arguments.
They never belong in `wrangler.jsonc`, which is committed.

## What to ask for

**Search.** `GET /icon?query=coffee` with `limit` (how many),
`styles` (`line` or `solid`; anything else is a 400 that names the allowed
values), `thumbnail_size` (`42`, `84` or `200`, pixels), and `include_svg=1`
to get an SVG URL on each hit without a second call. Pages are walked with the
`next` and `prev` values the response carries. Every hit is an object with
`id` (a string of digits), `term`, `attribution`, `permalink`, `thumbnail_url`,
`license_description`, `tags`, `styles`, `creator` and `collections`, plus
`icon_url` when SVG was asked for.

**One icon.** `GET /icon/{id}` returns `{ icon, generated_at, total, usage_limits }`
where `icon` is the same object as a search hit, always with `icon_url`.

**Download.** `GET /icon/{id}/download?filetype=svg&color=4e6b5a` returns the
file inline as `{ base64_encoded_file, ... }`, not as bytes. `color` is a hex
triplet without the hash. `filetype` is `svg` or `png`; `size` in pixels, 20
to 1200, is for PNG only and is a 400 on SVG. Decode the base64 and serve or
store the result yourself.

**Suggestions.** `GET /icon/autocomplete?query=hou&limit=3` returns
`{ suggestions: [...] }`, ten at most.

**Nearby.** `GET /icon/{id}/more-like-this` for icons in the same style;
`GET /collection?query=` and `GET /collection/{id}` for collections and the
icons in them.

**Quota.** `GET /client/usage` returns the month so far as counts of `icon`
and `service` calls and a `total_monthly_percentage`. The same block rides
along as `usage_limits` on most responses, so a long-running caller can watch
it without a separate call. The free tier is 5 000 calls a month; searches
and detail calls are counted, and a search is cheaper than an icon fetch.

## What to remember

- **The URLs expire.** `icon_url` and any signed static URL carry an
  `Expires` about an hour out. Fetch the bytes and keep those; never persist
  the URL, and never hand it to a page that will be open tomorrow.
- **Attribution is a string the API gives you.** Every icon comes with
  `attribution`, like "Coffee by Yudhi Restu Pebriyanto from Noun Project".
  Show it, or check the licence first: `license_description` is
  `creative-commons-attribution` for most icons, and the credit is not
  optional for those. Keep the attribution next to wherever the icon bytes
  are kept, so the credit travels with the file.
- **Cache on your side.** An icon does not change. Once chosen by id, store
  the SVG and its attribution in the repo or the app's storage and stop
  calling the API for it. Search interactively while choosing, then commit
  the choice as an id, so a rebuild costs nothing.
- **Errors are plain.** A bad parameter is a 400 with a `message` that says
  what was wrong and what is allowed; a bad signature is a 401. Read the
  message before guessing.
