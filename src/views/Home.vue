<template>
  <div class="home">
    <main>
      <div class="home__title">
        <div class="title__fac">
          Facultad de Ciencias de la Computacion
        </div>
        <div class="title__sub">
          Sistemas Operativos II
        </div>
        <div class="title__theme">
          Algoritmos de remplazo de paginas
        </div>
      </div>
      <nav class="btns">
        <router-link :to="{
          name: 'Form',
          params: { algorithm: 'fifo' }
        }" class="btn">FIFO</router-link>
        <router-link :to="{
          name: 'Form',
          params: { algorithm: ws }
        }" class="btn">Working Set</router-link>
        <router-link :to="{
          name: 'Form',
          params: { algorithm: 'wsclock' }
        }" class="btn">WSClock</router-link>
      </nav>
    </main>
    <footer>
      <Button class="btn-sett"
        :icon="'settings'"
        :round="true"
        :expand="true"
        :size="24"
        :onClickFunction="() => {}"
      />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/Button/Button.vue';

export default defineComponent({
  components: {
    Button,
  },
  setup() {
    const fifo = 'fifo';
    const ws = 'ws';
    const wsclock = 'wsclock'

    return {
      fifo, ws, wsclock,
    }
  }
});
</script>

<style lang="scss">
@import './home';
</style>
