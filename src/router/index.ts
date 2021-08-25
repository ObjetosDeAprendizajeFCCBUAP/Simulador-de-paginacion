import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import ProcessForm from '@/views/ProcessForm.vue';
import Form from '@/views/Form.vue';
import Fifo from '@/views/Fifo.vue';
import Test from '@/views/Test.vue';
import Clock from '@/views/Clock.vue';
import Home from '@/views/Home.vue'
import Set from '@/views/Set.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/form',
    name: 'Form',
    component: Form,
    props: true,
    beforeEnter: (t, f, n) => {
      if(t.params.algorithm) n();
      else n({name: 'Home'})
    },
  },
  // {
  //   path: '/form-fifo',
  //   name: 'FormFifo',
  //   component: FormFifo,
  // },
  {
    path: '/fifo',
    name: 'Fifo',
    component: Fifo, 
    props: true,
  },
  {
    path: '/set',
    name: 'Set',
    component: Set, 
    props: true,
  },
  {
    path: '/wsclock',
    name: 'Clock',
    component: Clock,
    props: true,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
