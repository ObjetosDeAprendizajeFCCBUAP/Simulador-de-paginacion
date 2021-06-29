<template>
    <div>
        <CircleTable 
            :slots="6"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CircleTable from '@/components/CircleTable/CircleTable.vue';

export default defineComponent({
    components: {
        CircleTable,
    },
    setup () {
        return {
        }
    }
})
</script>

<style scoped>

</style>