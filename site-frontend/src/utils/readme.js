function decodeGitHubReadme (content) {
  if (!content) return ''

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(content, 'base64').toString('utf8')
  }

  const binary = window.atob(content)
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

function anchorId (label) {
  return label
    .replace(/^#/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractSections (markdown) {
  return markdown
    .split(/\r?\n/)
    .map(line => line.match(/^##\s+(#[^\s]+)\s*$/))
    .filter(Boolean)
    .map(match => ({
      label: match[1],
      id: anchorId(match[1])
    }))
}

function stripLegacyNavigation (markdown) {
  return markdown.replace(
    /\n--\r?\n\r?\n\[repo\]\([^)]*\)\r?\n\r?\n--\r?\n\r?\n(?:- \[[^\]]+\]\(#[^)]+\)\r?\n)+(?=\r?\n##\s)/,
    '\n'
  )
}

function assignSectionAnchors (root) {
  if (!root) return

  root.querySelectorAll('.markdown-body h2').forEach(heading => {
    heading.id = anchorId(heading.textContent.trim())
  })
}

module.exports = {
  decodeGitHubReadme,
  extractSections,
  stripLegacyNavigation,
  assignSectionAnchors
}
