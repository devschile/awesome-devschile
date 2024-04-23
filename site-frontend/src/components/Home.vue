<template>
  <main>
    <vue-markdown :source="content"></vue-markdown>
  </main>
</template>

<script>
import axios from 'axios'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'AppHome',
  data () {
    return {
      content: '',
      errors: []
    }
  },
  components: {
    VueMarkdown
  },
  methods: {
    getDataFromGithub: function () {
      axios.get('https://api.github.com/repos/devschile/awesome-devschile/readme')
      .then(response => {
        this.content = atob(response.data.content)
      })
      .catch(error => {
        this.errors = error
      })
    }
  },
  created: function () {
    this.getDataFromGithub()
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  box-sizing: border-box; 
}
html {
  overflow-x: hidden;
}
body {
  background: #000;
  color: #ddd;
  font-size: 14px;
}
body,
pre,
code {
  font-family: 'Inconsolata', monospace;
}
h1,
h2,
h3,
pre,
code {
  color: #fff;
  font-weight: normal;
}
code {
  background-color: rgba(255,255,255,.15);
}
a {
  color: #5ce6cd;
}
main {
  padding: 5em 1.5em;
}

h1 {
  font-size: 18px;
}
h2 {
}
h3 {
  margin-top: 20px;
}
h2,
h3 {
  font-size: 16px;
}
hr {
  opacity: .4;
}
.btn {
  display: inline-block;
  padding: .2em .6em;
  color: #5ce6cd;
  border: 1px solid #5ce6cd;
  text-decoration: none;
  text-transform: uppercase;
}
button.btn {
  margin: 0 .4em;
  background-color: transparent;
  cursor: pointer;
  color: #2980B9;
  border-color: #2980B9;
}

</style>
