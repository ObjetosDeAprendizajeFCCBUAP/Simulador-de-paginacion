<template>
  <div class="home">
    <div class="blur-content-home" :class="{ blur: settings_modal }">
      <div class="bg-icon">
        <Icon 
          :icon="'cpu'"
          :width="settings.getters.getFontSize() * 20"
          :height="settings.getters.getFontSize() * 20"
        />
      </div>
      <div class="bg-icon-s">
        <Icon 
          :icon="'monitor'"
          :width="settings.getters.getFontSize() * 20"
          :height="settings.getters.getFontSize() * 20"
        />
      </div>
      <div class="bg-circle"></div>
      <div class="bg-circle-s"></div>
      <main>
        <div class="home__title">
          <div class="title__fac">
            Facultad de Ciencias de la Computación
          </div>
          <div class="title__sub" :style="{ color: settings.getters.getColor() }">
            Sistemas Operativos II
          </div>
          <div class="title__theme">
            Algoritmos de remplazo de páginas
          </div>
        </div>
        <nav class="btns">
          <router-link :to="{
            name: 'Form',
            params: { algorithm: 'fifo' }
          }" class="btn" :style="{ color: settings.getters.getColor() }">
            FIFO
            <Icon 
              :icon="'fifo'" 
              :width="settings.getters.getFontSize()" 
              :height="settings.getters.getFontSize() * 1.2" 
              class="bt-i"
            />
          </router-link>
          <router-link :to="{
            name: 'Form',
            params: { algorithm: ws }
          }" class="btn" :style="{ color: settings.getters.getColor() }">
            Working Set
            <Icon 
              :icon="'w-set'" 
              :width="settings.getters.getFontSize()" 
              :height="settings.getters.getFontSize() * 1.2" 
              class="bt-i"
            />
          </router-link>
          <router-link :to="{
            name: 'Form',
            params: { algorithm: 'wsclock' }
          }" class="btn" :style="{ color: settings.getters.getColor() }">
            WSClock
            <Icon 
              :icon="'clock'" 
              :width="settings.getters.getFontSize()" 
              :height="settings.getters.getFontSize() * 1.2" 
              class="bt-i"
            />
          </router-link>
        </nav>
      </main>
      <footer>
        <Button class="btn-sett"
          :icon="'settings'"
          :round="true"
          :expand="true"
          :size="settings.getters.getFontSize() * 1.2"
          :onClickFunction="openModal"
          :color="settings.getters.getColor()"
        />
      </footer>
    </div>
    <Modal 
      :showing="settings_modal"
      @update:showing="settings_modal"
      @close="closeModal()"
    >
      <Settings />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import Button from '@/components/Button/Button.vue';
import Modal from '@/components/Modal/Modal.vue';
import Settings from '@/components/Settings/Settings.vue';
import Icon from '@/components/Icon/Icon.vue';

export default defineComponent({
  components: {
    Button,
    Modal,
    Settings,
    Icon,
  },
  setup() {

    const settings = inject('settings') as any;

    const fifo = 'fifo';
    const ws = 'ws';
    const wsclock = 'wsclock'

    const settings_modal = ref(false);
    const openModal = () => settings_modal.value = true;
    const closeModal = () => { 
      settings_modal.value = false;
			//@ts-ignore
			localStorage.setItem('app-settings', JSON.stringify(settings.settings));
      console.log('Configuraciones actualizadas')
    }

    const changeTheme = () => {
      settings.methods.toggleTheme();
    }

    return {
      settings,
      fifo, ws, wsclock,
      changeTheme,
      settings_modal,
      openModal,
      closeModal,
    }
  }
});
</script>

<style lang="scss">
@import './home';
</style>
