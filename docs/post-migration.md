# Blog post migration

Migrated from `../blog_2/content/posts`: 22 public posts and one unpublished draft.

The three existing posts (Math Academy, language-model patterns, and the geography game) were retained. The duplicate `index.es.markdown` copy of Gobierno Electrónico en Corea was omitted.

Precomputed Markdown/HTML was converted to Quarto without executing historical R/Python code. Dates come from source front matter, even where directory dates differ. Images, downloads, and map dependencies live under `assets/posts/`. The map retains its original interactive data; external map tiles still require a network connection. Post-specific legacy font overrides were removed so the shared site styling applies.

The mortality draft lives under `drafts/posts/`, explicitly excluded from the public render.

| Source | Destination |
| --- | --- |
| `content/posts/2015-08-01-gobierno-electronico-en-corea/index.markdown` | `posts/gobierno-electronico.qmd` |
| `content/posts/2016-08-01-ciudades-inteligentes/index.markdown` | `posts/ciudades-inteligentes.qmd` |
| `content/posts/2017-08-16-geometria-con-ggplot/index.markdown` | `posts/geometria-con-ggplot.qmd` |
| `content/posts/2017-12-20-tidy-vargas-llosa/index.markdown` | `posts/tidy-vargas-llosa.qmd` |
| `content/posts/2018-01-20-mining-hamlet/index.markdown` | `posts/mining-hamlet.qmd` |
| `content/posts/2018-03-17-un-mapa-de-montevideo-con-leaflet/index.markdown` | `posts/un-mapa-de-montevideo-con-leaflet.qmd` |
| `content/posts/2018-03-25-scraping-nba-data-with-rvest-and-purrr/index.markdown` | `posts/scraping-nba-data.qmd` |
| `content/posts/2019-04-13-barrios-ricos-y-pobres-de-montevideo/index.markdown` | `posts/barrios-ricos-y-pobres-de-montevideo.qmd` |
| `content/posts/2019-06-16-prediciendo-precios-propiedades.html` | `posts/predicting-house-prices.qmd` |
| `content/posts/2019-10-15-personas-y-lugares-en-vargas-llosa.html` | `posts/personas-y-lugares-vargas-llosa.qmd` |
| `content/posts/2020-01-16-el-estilo-de-metallica-a-lo-largo-de-los-discos/index.html` | `posts/el-estilo-de-metallica-a-lo-largo-de-los-discos.qmd` |
| `content/posts/2020-03-25-las-vacunas-salvan-vidas/index.html` | `posts/vacunas.qmd` |
| `content/posts/2020-04-25-homicidios/index.markdown` | `posts/homicidios.qmd` |
| `content/posts/2021-05-06-causas-de-muerte-en-uruguay/index.html` | `drafts/posts/causas-de-muerte-en-uruguay.qmd` |
| `content/posts/2021-05-06-feriados-en-uruguay/index.html` | `posts/feriados-en-uruguay.qmd` |
| `content/posts/2021-05-06-flujo-de-trabajo-en-git/index.html` | `posts/flujo-de-trabajo-en-git.qmd` |
| `content/posts/2021-08-25-examenes-un-grafico-de-barras-anotado/index.html` | `posts/examenes-un-grafico-de-barras-anotado.qmd` |
| `content/posts/2022-03-17-curvas-de-demanda/index.markdown` | `posts/curvas-de-demanda.qmd` |
| `content/posts/2022-04-13-fabrica-de-funciones-trigonometricas/index.markdown` | `posts/fabrica-de-funciones-trigonometricas.qmd` |
| `content/posts/2025-02-17-using-ai-to-create-movie-subtitles/index.html` | `posts/using-ai-to-create-movie-subtitles.qmd` |
| `content/posts/2025-03-25-como-correr-tu-propio-llm-en-aws/index.html` | `posts/como-correr-tu-propio-llm-en-aws.qmd` |
| `content/posts/2025-04-22-plotting-function-transformations/index.html` | `posts/plotting-function-transformations.qmd` |
| `content/posts/2026-01-02-horse-kick-data/index.html` | `posts/horse-kick-data.qmd` |
