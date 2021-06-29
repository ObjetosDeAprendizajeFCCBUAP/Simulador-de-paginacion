<template>
    <div class="clock">
        <div class="clock__content">
            <InfoPanel
                :processes="['A', 'B', 'C']"
                :completed="'2/2'"
                :current="'A-1'"
                :pageFaults="3"
            />
        </div>
        <nav class="clock__btns">

        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue';

export default defineComponent({
    components: {
        InfoPanel,
    },
    setup () {
        return {}
    }
})
</script>

<style lang="scss">

</style>