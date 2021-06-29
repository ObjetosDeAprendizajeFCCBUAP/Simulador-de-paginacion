<template>
    <div class="info">
        <div class="info__screen">
            <!-- <Icon class="info__icon" :icon="'screen'"/> -->
            <p class="info__current">{{current}}</p>
        </div>
        <p>Procesos completados</p>
        <p class="info__completed">{{completed}}</p>
        <p>Fallos de pagina</p>
        <p class="info__page-faults">{{pageFaults}}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
        return {}
    }
});
</script>

<style lang="scss">
@import './infopanel';
</style>