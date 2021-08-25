<template>
    <div class="info">
        <div class="info__screen">
            <!-- <Icon class="info__icon" :icon="'screen'"/> -->
            <p class="info__current" :style="{color: settings.getters.getColor() }">{{current}}</p>
        </div>
        <p>Procesos completados</p>
        <p class="info__completed" :style="{color: settings.getters.getColor() }">{{completed}}</p>
        <p>Fallos de pagina</p>
        <p class="info__page-faults" :style="{color: '#db1919'}">{{pageFaults}}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
// import Icon from '@/components/Icon/Icon.vue';

export default defineComponent({
    components: {
        // Icon,
    },
    props: {
        current: {
            type: String,
            required: true,
        },
        completed: {
            type: String,
            required: true,
        },
        pageFaults: {
            type: Number,
            required: false,
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
@import './infopanel';
</style>