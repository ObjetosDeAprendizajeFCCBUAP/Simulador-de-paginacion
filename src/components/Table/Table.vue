<template>
    <div class="table">
        <div class="table__title" v-if="title">{{title}}</div>
        <div class="table__content">
            <div class="table__item" v-for="(item, index) in listIterable" :key="index">
                {{item}}
            </div>
            <div class="table__item" v-for="i in slots - listIterable.length" :key="i">
                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
        }
    },
    setup(props) {

        // const freeSlots = computed(() => {
        const freeSlots = () => {
            // @ts-ignore
            return props.listIterable.length - props.slots;
        };

        return {
            freeSlots,
        }
    }
});
</script>

<style lang="scss">
@import './table';
</style>