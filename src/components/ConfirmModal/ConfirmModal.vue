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
		<div v-show="showing" class="info-modal">
			<div class="info-modal__container">
				<div class="modal__content">
					<slot></slot>
				</div>
				<div class="confirm-btns">
					<router-link to="/" class="btn expand" :style="{ color: '#98c949' }">Aceptar</router-link>
					<button class="btn expand" @click.prevent="close" :style="{ color: '#db1919' }">Cancelar</button>
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
		},
	},
	setup(props, { emit }) {

		const close = () => {
			console.log('Modal closed');
			emit('update:showing', false);
			emit('close');
		}

		return {
			close,
		}
	}
})
</script>

<style lang="scss">
@import './confirmmodal';
</style>