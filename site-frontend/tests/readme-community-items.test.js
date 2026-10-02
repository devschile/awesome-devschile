const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const readme = fs.readFileSync(
  path.join(__dirname, '../../README.md'),
  'utf8'
)

test('community recommendations are present in their relevant categories', () => {
  const expectations = [
    ['#comida', 'Passage to India'],
    ['#comunidad', 'Stremio'],
    ['#juegos', 'SuperMuseum'],
    ['#lifehacks', 'Brita'],
    ['#mascotas', 'Cacttus'],
    ['#moneas', 'Fintual'],
    ['#musiqueria', 'School of Rock'],
    ['#remoto', 'BICE']
  ]

  for (const [category, item] of expectations) {
    const categoryIndex = readme.indexOf(`## ${category}`)
    const itemIndex = readme.indexOf(item)

    assert.notEqual(categoryIndex, -1, `missing ${category}`)
    assert.ok(itemIndex > categoryIndex, `${item} should follow ${category}`)
  }
})

test('community recommendations are regular category items with member consensus', () => {
  const recommendations = readme
    .split(/\r?\n/)
    .filter(line => line.includes('👍🏽👍🏽'))

  assert.ok(recommendations.length >= 16, 'expected the curated community recommendations')
  assert.doesNotMatch(readme, /^### Recomendaciones de la comunidad$/m)

  for (const recommendation of recommendations) {
    assert.match(recommendation, /^- /, recommendation)
    assert.match(recommendation, /\(\d+\+? miembros\) 👍🏽👍🏽\.$/, recommendation)
    assert.doesNotMatch(recommendation, /2026-\d{2}(?:-\d{2})?/, recommendation)
    if (recommendation.includes('](')) {
      assert.match(recommendation, /utm_source=devschile/, recommendation)
    }
  }
})
