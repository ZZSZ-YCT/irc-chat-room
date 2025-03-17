// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Nuxt3 聊天室',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '基于 Nuxt3 的聊天室示例' }
      ]
    }
  },
  css: [
    // 可在此处添加全局样式文件
  ],
  modules: [
    // 根据需要添加 Nuxt 模块
  ]
})
