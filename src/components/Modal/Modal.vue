<template>
	<div>
		<!-- <transition
			enter-active-class="transition ease-out duration-300"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition ease-in duration-200"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		> -->
		<div v-show="showing" class="modal">
			<div class="modal__container">
				<div class="modal__header" aria-hidden="true">
					<button
						aria-label="close"
						class="btn"
						@click.prevent="close"
					>x
						<svg class=""
							xmlns="http://www.w3.org/2000/svg"
							fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</button>
				</div>
				<div class="modal__content">
					<slot></slot>
				</div>
			</div>
		</div>
		<!-- </transition> -->

	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		showing: {
			type: Boolean,
			required: true,
			default: false,
		}
	},
	setup(_, { emit }) {

		const close = () => {
			console.log('Modal closed');
			emit('update:showing', false);
			emit('close');
			console.log('Que pasa')
		}
		return {
			close
		}
	}
})
</script>

<style lang="scss">
@import './modal';
</style>