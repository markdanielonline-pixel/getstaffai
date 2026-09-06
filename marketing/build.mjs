import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('.', import.meta.url);
const dist = new URL('dist/', root);
await mkdir(dist, { recursive: true });
for (const entry of ['index.html', 'about.html', 'acceptable-use.html', 'ai-disclosure.html', 'communications.html', 'cookies.html', 'dpa.html', 'employees.html', 'roadmap.html', 'faq.html', 'how-it-works.html', 'legal.html', 'pricing.html', 'privacy.html', 'refund.html', 'security.html', 'signup.html', 'favicon.ico', 'favicon.png', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'staffai-logo.png', 'staffai-mark.png', 'workflow-showcase.jpg', 'teams.html', 'terms.html', 'copy', 'public', 'src']) {
  await cp(new URL(entry, root), new URL(entry, dist), { recursive: true, force: true });
}
const read = (name) => readFile(new URL(name, root), 'utf8');
const html = await read('index.html');
const js = await read('src/main.js');
const css = await read('src/style.css');
await mkdir(new URL('dist/server/', root), { recursive: true });
await mkdir(new URL('dist/.openai/', root), { recursive: true });
const payload = JSON.stringify({
  '/': html.replace('<script src="/src/main.js"></script>', '<script>' + js.replaceAll('</script>', '<\\/script>') + '</script>').replace('<link rel="stylesheet" href="/src/style.css" />', '<style>' + css + '</style>'),
  '/index.html': html,
  '/src/main.js': js,
  '/src/style.css': css
});
const server = `const assets=${payload};\nexport default {fetch(request){const url=new URL(request.url);const body=assets[url.pathname]??assets['/'];const type=url.pathname.endsWith('.css')?'text/css':url.pathname.endsWith('.js')?'text/javascript':'text/html';return new Response(body,{headers:{'content-type':type+'; charset=utf-8'}})}};\n`;
await writeFile(new URL('dist/server/index.js', root), server);
await writeFile(new URL('dist/.openai/hosting.json', root), await read('.openai/hosting.json'));
