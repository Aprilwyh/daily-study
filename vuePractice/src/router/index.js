import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Slot from '@/components/slot/slot'
import Render from '@/components/render/render'
import Other from '@/components/slot/other'
import Vuex from '@/components/vuex/what.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/slot',
      name: 'slot',
      component: Slot,
      children: [{
        path: 'other',
        component: Other
      }]
    },
    {
      path: '/render',
      name: 'render',
      component: Render
    },
    {
      path: '/vuex',
      name: 'vuex',
      component: Vuex
    }
  ]
})
