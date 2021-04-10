<template>
    <div class="card-wrapper">
        <div class="pid">A</div>
        <div class="content">
           <div class="section">
               <Icon 
                :type="'clocktimeline'"
                :width="16"
                :height="16"
                class="section-icon"
               />
               <span>Tiempo de arrivo</span>
           </div>
           <div class="arrival-time">2</div>
           <div class="section">
               <Icon 
                :type="'list'"
                :width="16"
                :height="16"
                class="section-icon"
               />
               <span>Referencias</span>
           </div>
           <span class="references">1, 2, 5, 3, 2, 2</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/Icon/Icon.vue';

export default defineComponent({
    components: {
        Icon,
    },
    setup () {
        return {}
    }
});
</script>

<style lang="scss">
@import './processcard'
</style>