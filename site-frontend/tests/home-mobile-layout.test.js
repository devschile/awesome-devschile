const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const homeComponent = fs.readFileSync(
  path.join(__dirname, '../src/components/Home.vue'),
  'utf8'
)

test('Home provides semantic category navigation for the generated README sections', () => {
  assert.match(homeComponent, /<nav[^>]+aria-label="Categorías"/)
  assert.match(homeComponent, /class="category-nav"/)
  assert.match(homeComponent, /v-for="section in sections"/)
})

test('Home declares a mobile breakpoint and accessible loading status', () => {
  assert.match(homeComponent, /@media \(max-width: 640px\)/)
  assert.match(homeComponent, /role="status"/)
  assert.match(homeComponent, /aria-busy/)
})

test('Home assigns category anchors after vue-markdown emits rendered', () => {
  assert.match(homeComponent, /@rendered="setSectionAnchors"/)
  assert.match(homeComponent, /setSectionAnchors: function \(\)/)
  assert.match(homeComponent, /assignSectionAnchors\(this\.\$el\)/)
})
