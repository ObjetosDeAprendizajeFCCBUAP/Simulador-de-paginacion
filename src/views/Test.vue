<template>
    <div>
        <CircleTable 
            :pointTo="4"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CircleTable from '@/components/CircleTable/CircleTable.vue';

export default defineComponent({
    components: {
        CircleTable,
    },
    setup() {
        const rangevalue = ref();

        return {
            rangevalue,
        }
    }
})
</script>

<style scoped>

</style>