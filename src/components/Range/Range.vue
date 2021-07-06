<template>
	<input type="range" class="range-input"
		:min="min"
		:max="max"
		:step="steps"
		v-model.number="range_val"
	>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
	props: {
		value: { 
			type: Number,
			required: true,
		},
		min: {
			type: Number,
			required: false,
			default: 4,
		},
		max: {
			type: Number,
			required: false,
			default: 16,
		},
		steps: {
			type: Number,
			required: false,
			defualt: 1,
		}
	},
	setup(props, { emit }) {

		const value_handler = {
			get(){ return props.value; },
			set(val: number){ emit('update:modelValue', val); }
		}

		// @ts-ignore
		const range_val = computed(value_handler);
		return {
			range_val,
		}
	}
})
</script>

<style lang="scss">

</style>