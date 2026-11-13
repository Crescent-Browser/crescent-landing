import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = 'https://crescentbrowser.com';
const pages = new Map([
  ['index.html', origin + '/'],
  ['privacy.html', origin + '/privacy.html'],
  ['notices.html', origin + '/notices.html'],
]);
const titles = new Set();
const descriptions = new Set();
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function meta(html, key) {
  return html.match(new RegExp('<meta (?:name|property)="' + key + '" content="([^"]+)"'))?.[1];
}
for (const [path, canonical] of pages) {
  const html = await readFile(resolve('public', path), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = meta(html, 'description');
  assert(title && title.length <= 65 && !titles.has(title), path + ': missing, long, or duplicate title');
  assert(description && description.length >= 70 && description.length <= 170 && !descriptions.has(description), path + ': missing or duplicate description');
  titles.add(title); descriptions.add(description);
  assert(html.includes('<link rel="canonical" href="' + canonical + '">'), path + ': canonical origin/path mismatch');
  assert(meta(html, 'robots')?.includes('index,follow'), path + ': page is not indexable');
  assert(meta(html, 'og:url') === canonical && meta(html, 'og:title') === title, path + ': Open Graph identity mismatch');
  assert(meta(html, 'og:image') === origin + '/assets/crescent-social.png', path + ': missing social image');
  assert(meta(html, 'twitter:card') === 'summary_large_image' && meta(html, 'twitter:image') === meta(html, 'og:image'), path + ': missing large social card');
  assert([...html.matchAll(/<h1(?:\s|>)/g)].length === 1, path + ': expected one main heading');
  assert(!/<(?:img|link|script)[^>]+(?:src|href)="http:\/\//i.test(html), path + ': insecure asset reference');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert(json, path + ': missing structured data');
  const graph = JSON.parse(json)['@graph'];
  assert(graph.some(node => node['@type'] === 'Organization' && node.url === origin + '/'), path + ': missing project identity');
  assert(graph.some(node => node['@type'] === 'WebSite' && node.url === origin + '/'), path + ': missing site identity');
  assert(graph.some(node => node['@type'] === 'WebPage' && node.url === canonical), path + ': missing page identity');
  assert(graph.every(node => !node.aggregateRating && !node.offers), path + ': unexpected unverified reviews/offers');
}
const sitemap = await readFile('public/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert(urls.length === pages.size && [...pages.values()].every(url => urls.includes(url)), 'Sitemap must match the canonical pages');
const robots = await readFile('public/robots.txt', 'utf8');
assert(robots.includes('Allow: /') && robots.includes('Sitemap: ' + origin + '/sitemap.xml') && !/^Disallow:\s*\/\s*$/m.test(robots), 'Robots rules prevent discovery');
assert((await readFile('public/CNAME', 'utf8')).trim() === new URL(origin).hostname, 'Custom-domain intent mismatch');
assert(meta(await readFile('public/404.html', 'utf8'), 'robots') === 'noindex,follow', '404 must not be indexed');
for (const [path, width, height] of [
  ['assets/crescent-social.png', 1200, 630],
  ['assets/favicon-96.png', 96, 96],
  ['assets/icon-192.png', 192, 192],
  ['assets/apple-touch-icon.png', 180, 180],
]) {
  const png = await readFile(resolve('public', path));
  assert(png.toString('hex', 0, 8) === '89504e470d0a1a0a' && png.readUInt32BE(16) === width && png.readUInt32BE(20) === height, path + ': invalid image size/format');
}
console.log('Verified canonical URLs, unique metadata, structured data, sitemap, robots rules, social images, and 404 indexing.');
