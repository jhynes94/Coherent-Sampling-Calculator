import Vue from 'vue'
import Router from 'vue-router'
import CoherentSamplingCalculator from '@/components/CoherentSamplingCalculator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CoherentSamplingCalculator',
      component: CoherentSamplingCalculator
    },
  ] 
})
