<template>
  <div class="awesome-shell">
    <header class="site-header">
      <a class="brand" href="https://devschile.cl" aria-label="Ir a devsChile.cl">
        <span class="brand__mark" aria-hidden="true">⌘</span>
        <span>devsChile</span>
      </a>
      <div class="site-header__content">
        <p class="eyebrow">archivo comunitario</p>
        <p class="site-header__intro">
          Recomendaciones que han sobrevivido a la conversación.
        </p>
        <a
          class="repository-link"
          href="https://github.com/devschile/awesome-devschile"
        >
          Ver repositorio <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>

    <nav
      v-if="sections.length"
      class="category-nav"
      aria-label="Categorías"
    >
      <a
        v-for="section in sections"
        :key="section.id"
        :href="`#${section.id}`"
      >
        {{ section.label }}
      </a>
    </nav>

    <main class="content-card" :aria-busy="loading ? 'true' : 'false'">
      <p v-if="loading" class="status" role="status">
        Cargando recomendaciones de la comunidad…
      </p>
      <p v-else-if="loadError" class="status status--error" role="status">
        {{ loadError }}
        <a href="https://github.com/devschile/awesome-devschile">Ver el README en GitHub</a>.
      </p>
      <vue-markdown
        v-else
        class="markdown-body"
        :source="content"
        @rendered="setSectionAnchors"
      />
    </main>

    <footer class="site-footer">
      <span>Hecho por la comunidad devsChile.</span>
      <a href="https://github.com/devschile/awesome-devschile#contributing">
        Sugerir un recurso
      </a>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import VueMarkdown from 'vue-markdown'

const {
  decodeGitHubReadme,
  extractSections,
  stripLegacyNavigation,
  assignSectionAnchors
} = require('../utils/readme')

export default {
  name: 'AppHome',
  components: {
    VueMarkdown
  },
  data () {
    return {
      content: '',
      sections: [],
      loading: true,
      loadError: ''
    }
  },
  methods: {
    setSectionAnchors: function () {
      this.$nextTick(() => {
        assignSectionAnchors(this.$el)
      })
    },
    getDataFromGithub: function () {
      axios.get('https://api.github.com/repos/devschile/awesome-devschile/readme')
        .then(response => {
          const markdown = decodeGitHubReadme(response.data.content)
          this.content = stripLegacyNavigation(markdown)
          this.sections = extractSections(markdown)
        })
        .catch(() => {
          this.loadError = 'No pudimos cargar el listado ahora mismo.'
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  created: function () {
    this.getDataFromGithub()
  }
}
</script>

<style lang="scss">
:root {
  color-scheme: dark;
  --background: #07111f;
  --surface: #0c1b2f;
  --surface-muted: #10253d;
  --border: rgba(171, 214, 255, .18);
  --text: #f3f7fb;
  --text-muted: #b9c7d7;
  --accent: #73e4c2;
  --accent-strong: #34c99f;
  --danger: #ffb4ab;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  margin: 0;
  background:
    radial-gradient(circle at 10% 0%, rgba(52, 201, 159, .12), transparent 32rem),
    radial-gradient(circle at 100% 20%, rgba(84, 143, 255, .12), transparent 34rem),
    var(--background);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

a {
  color: var(--accent);
  overflow-wrap: anywhere;
  text-decoration-thickness: 1px;
  text-underline-offset: .16em;
}

a:hover,
 a:focus-visible {
  color: #b2f5e1;
}

a:focus-visible {
  outline: 3px solid rgba(115, 228, 194, .7);
  outline-offset: 3px;
}

.awesome-shell {
  width: min(100% - 3rem, 72rem);
  margin: 0 auto;
  padding: 2.5rem 0 3rem;
}

.site-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 0 0 2rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 750;
  letter-spacing: -.025em;
  text-decoration: none;
  white-space: nowrap;
}

.brand__mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: .65rem;
  background: linear-gradient(135deg, var(--accent), #73a9ff);
  color: #06201b;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.25rem;
  font-weight: 900;
}

.site-header__content {
  max-width: 33rem;
  text-align: right;
}

.eyebrow {
  margin: 0 0 .25rem;
  color: var(--accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
}

.site-header__intro {
  margin: 0 0 .55rem;
  color: var(--text-muted);
  font-size: .95rem;
}

.repository-link {
  font-size: .9rem;
  font-weight: 700;
}

.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: .55rem;
  margin: 0 0 1.5rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: rgba(12, 27, 47, .7);
  backdrop-filter: blur(10px);
}

.category-nav a {
  padding: .3rem .6rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: .8rem;
  text-decoration: none;
}

.category-nav a:hover,
.category-nav a:focus-visible {
  border-color: rgba(115, 228, 194, .55);
  background: rgba(115, 228, 194, .12);
  color: var(--accent);
}

.content-card {
  min-height: 20rem;
  padding: clamp(1.25rem, 4vw, 3.25rem);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: rgba(12, 27, 47, .88);
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, .22);
}

.status {
  margin: 0;
  color: var(--text-muted);
}

.status--error {
  color: var(--danger);
}

.markdown-body {
  color: var(--text-muted);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  color: var(--text);
  line-height: 1.2;
  scroll-margin-top: 1rem;
}

.markdown-body h1 {
  margin: 0 0 1.5rem;
  font-size: clamp(2rem, 5vw, 3.25rem);
  letter-spacing: -.045em;
}

.markdown-body h2 {
  margin: 3.5rem 0 1rem;
  padding-bottom: .65rem;
  border-bottom: 1px solid var(--border);
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  letter-spacing: -.025em;
}

.markdown-body h3 {
  margin-top: 2rem;
  font-size: 1.15rem;
}

.markdown-body h2:first-of-type {
  margin-top: 2.5rem;
}

.markdown-body p,
.markdown-body li {
  max-width: 75ch;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.25rem;
}

.markdown-body li + li {
  margin-top: .6rem;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
}

.markdown-body code {
  padding: .15em .35em;
  border-radius: .3rem;
  background: rgba(115, 228, 194, .1);
  color: #c9f7e9;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: .88em;
}

.markdown-body pre {
  max-width: 100%;
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: .75rem;
  background: #06101d;
}

.markdown-body pre code {
  padding: 0;
  background: transparent;
}

.markdown-body table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem .25rem 0;
  color: var(--text-muted);
  font-size: .875rem;
}

@media (max-width: 640px) {
  .awesome-shell {
    width: min(100% - 1.5rem, 72rem);
    padding-top: 1.25rem;
  }

  .site-header {
    display: block;
    padding-bottom: 1.25rem;
  }

  .site-header__content {
    margin-top: 1.25rem;
    text-align: left;
  }

  .category-nav {
    max-height: 10.5rem;
    overflow-y: auto;
    padding: .75rem;
    border-radius: .85rem;
  }

  .content-card {
    min-height: 18rem;
    border-radius: .9rem;
  }

  .markdown-body h1 {
    font-size: 2rem;
  }

  .markdown-body h2 {
    margin-top: 2.75rem;
  }

  .markdown-body ul,
  .markdown-body ol {
    padding-left: 1.1rem;
  }

  .site-footer {
    display: block;
  }

  .site-footer a {
    display: inline-block;
    margin-top: .35rem;
  }
}
</style>
