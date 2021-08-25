<template>
  <div class="main" 
    :class="{ dark: settings.getters.getTheme() }"
    :style="computedStyles"
  >
    <router-view/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide } from "vue";
import settings from '@/store';

export default defineComponent({
  setup(){
    provide('settings', settings);

    // const computedClasses = computed(() => {
    //   const theme = settings.getters.getTheme();
    //   // const font = settings.ge
    //   const obj = new Object();
    //   return  obj;
    // });

    onMounted(() => {
      const localStorageSettings = localStorage.getItem('app-settings');
      console.log('@', localStorageSettings);
      if(localStorageSettings !== null){
        const settingsObj = JSON.parse(localStorageSettings);
        console.log('Si existe el objeto mano');
        console.table(settingsObj);
        settings.methods.setTheme(settingsObj.darkMode);
        settings.methods.setFontSize(settingsObj.fontSize);
        settings.methods.setColor(settingsObj.themeColor);
        settings.methods.setPagesPerProcess(settingsObj.pages_per_process);
        settings.methods.setQuantum(settingsObj.quantum);
      } else {
        console.log('Pues no esta tu crees?')
        localStorage.setItem('app-settings', JSON.stringify(settings.settings));
        console.log('pero ya lo guarde mano');
      }

    });

    const computedStyles = computed(() => {
      return {
        'fontSize': `${settings.getters.getFontSize()}px`,
      }
    })
    

    return { 
      settings,
      computedStyles,
      // computedClasses,
    }
  }
});

</script>

<style lang="scss">
@import './styles/app';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
