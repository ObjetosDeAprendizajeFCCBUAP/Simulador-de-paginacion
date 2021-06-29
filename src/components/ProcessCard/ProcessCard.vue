<template>
    <div class="card-wrapper">
        <div class="pid">{{process.pid}}</div>
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
           <div class="arrival-time">{{process.arrival_time}}</div>
           <div class="section">
               <Icon 
                :type="'list'"
                :width="16"
                :height="16"
                class="section-icon"
               />
               <span>Referencias</span>
           </div>
           <span class="references">{{process.references.join(', ')}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
        return {}
    }
});
</script>

<style lang="scss">
@import './processcard'
</style>