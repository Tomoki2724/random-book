[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/books"
  to = "/.netlify/functions/books"
  status = 200