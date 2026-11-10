export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const src = searchParams.get('src')

  if (!src) return new Response('Missing src', { status: 400 })

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe
    src="${src}"
    allowfullscreen
    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
    referrerpolicy="no-referrer"
  ></iframe>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
