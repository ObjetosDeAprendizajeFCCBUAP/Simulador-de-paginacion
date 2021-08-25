<template>
    <div class="test-container">
        <Table
            :listIterable="['1', '2', '3', '4']"
            :selected="2"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Table from "@/components/Table/Table.vue";

export default defineComponent({
    components: {
        Table,
    },
    setup() {
        return {
        }
    }
})
</script>

<style scoped>
.test-container {
    width: 70%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>