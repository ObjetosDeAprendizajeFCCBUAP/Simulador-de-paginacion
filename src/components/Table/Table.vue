<template>
    <div class="table">
        <div class="table__title" v-if="title">{{title}}</div>
        <div class="table__content">
            <div class="table__item used" 
                v-for="(item, index) in listIterable" 
                :key="index"
                :style="index === selected ? `color: ${settings.getters.getColor()}`  : `color: inhered`"
            >
                {{item}}
            </div>
            <div class="table__item" v-for="i in slots - listIterable.length" :key="i">
                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String,
            required: false
        },
        listIterable: {
            type: Array as () => string[],
            required: true,
        },
        slots: {
            type: Number,
            required: false,
            default: 4
        },
        selected: {
            type: Number,
            required: false,
            default: -1
        }
    },
    setup(props) {
        const settings = inject('settings');

        // const freeSlots = computed(() => {
        const freeSlots = () => {
            // @ts-ignore
            return props.listIterable.length - props.slots;
        };

        return {
            settings,
            freeSlots,
        }
    }
});
</script>

<style lang="scss">
@import './table';
</style>