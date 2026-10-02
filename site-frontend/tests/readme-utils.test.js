const test = require('node:test')
const assert = require('node:assert/strict')
const {
  decodeGitHubReadme,
  extractSections,
  stripLegacyNavigation,
  assignSectionAnchors
} = require('../src/utils/readme')

test('decodeGitHubReadme preserves UTF-8 community text', () => {
  const content = Buffer.from('## #comida\nRecomendación: café', 'utf8').toString('base64')

  assert.equal(decodeGitHubReadme(content), '## #comida\nRecomendación: café')
})

test('extractSections creates stable mobile navigation anchors', () => {
  const markdown = '# Awesome\n\n## #comida\n\n## #lifehacks\n\n## #oficialDevsChile\n'

  assert.deepEqual(extractSections(markdown), [
    { label: '#comida', id: 'comida' },
    { label: '#lifehacks', id: 'lifehacks' },
    { label: '#oficialDevsChile', id: 'oficialdevschile' }
  ])
})

test('stripLegacyNavigation removes only the duplicated README menu', () => {
  const markdown = [
    '# Awesome devsChile',
    '',
    'Texto introductorio',
    '',
    '--',
    '',
    '[repo](https://github.com/devschile/awesome-devschile/)',
    '',
    '--',
    '',
    '- [#comida](#comida)',
    '- [#lifehacks](#lifehacks)',
    '',
    '## #comida',
    '',
    'Contenido'
  ].join('\n')

  const cleaned = stripLegacyNavigation(markdown)

  assert.match(cleaned, /Texto introductorio/)
  assert.match(cleaned, /## #comida/)
  assert.doesNotMatch(cleaned, /\[repo\]/)
  assert.doesNotMatch(cleaned, /\[#lifehacks\]/)
})

test('assignSectionAnchors makes the mobile navigation target rendered headings', () => {
  const headings = [
    { textContent: '#comida', id: '' },
    { textContent: '#lifehacks', id: '' }
  ]
  const root = {
    querySelectorAll: selector => {
      assert.equal(selector, '.markdown-body h2')
      return headings
    }
  }

  assignSectionAnchors(root)

  assert.deepEqual(headings.map(heading => heading.id), ['comida', 'lifehacks'])
})
