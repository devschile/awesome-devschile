const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js',
      }
    }
  }
})
