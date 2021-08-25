<template>
    <div class="card-wrapper">
        <div class="pid" :style="{color: settings.getters.getColor() }">{{process.pid}}</div>
        <div class="content">
           <div class="section">
               <Icon 
                :icon="'clocktimeline'"
                :width="settings.getters.getFontSize() * 1.2"
                :height="settings.getters.getFontSize() * 1.2"
                class="section-icon"
               />
               <span>Tiempo de arrivo</span>
           </div>
           <div class="arrival-time" :style="{color: settings.getters.getColor() }">{{process.arrival_time}}</div>
           <div class="section">
               <Icon 
                :icon="'list'"
                :width="settings.getters.getFontSize() * 1.2"
                :height="settings.getters.getFontSize() * 1.2"
                class="section-icon"
               />
               <span>Referencias</span>
           </div>
           <span class="references" :style="{color: settings.getters.getColor() }">{{process.references.join(', ')}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import { IProcessInput } from '@/model/loader';

export default defineComponent({
    components: {
        Icon,
    },
    props: {
        process: {
            type: Object as () => IProcessInput,
            requiered: true
        },
    },
    setup () {
        const settings = inject('settings');
        return {
            settings,
        }
    }
});
</script>

<style lang="scss">
@import './processcard'
</style>