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
				<div class="info-modal__title" :style="computedTitleColor" aria-hidden="true">
					{{type}}
				</div>
				<div class="modal__content">
					<slot></slot>
				</div>
				<button class="btn expand" @click.prevent="close">Aceptar</button>
			</div>
		</div>
		<!-- </transition> -->
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
	props: {
		showing: {
			type: Boolean,
			required: true,
			default: false,
		},
		type: {
			type: String,
			required: false,
			defualt: 'info'
		}
	},
	setup(props, { emit }) {

		const computedTitleColor = computed(() => {
			let color = '';
			switch(props.type){
				case 'info': 
					color = 'green'; break;
				case 'error':
					color = 'red'; break;
			}
			return `color: ${color}`;
		});

		const close = () => {
			console.log('Modal closed');
			emit('update:showing', false);
			emit('close');
		}

		return {
			close,
			computedTitleColor,
		}
	}
})
</script>

<style lang="scss">
@import './infomodal';
</style>