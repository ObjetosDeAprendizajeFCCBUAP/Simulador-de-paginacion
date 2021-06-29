<template>
    <div class="horiz-table">
        <div class="horiz-table__title">{{title}}</div>
        <div class="horiz-table__content">
            <div class="table-slot" v-for="(item, index) in listIterable" :key="index">
                {{item}}
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        listIterable: {
            type: Array as () => string[],
            required: true
        },
        title: {
            type: String,
            required: false,
        }
    },
    setup () {
        return {}
    }
})
</script>

<style lang="scss">
@import './horizontaltable';
</style>