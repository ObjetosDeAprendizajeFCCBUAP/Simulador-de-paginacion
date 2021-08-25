<template>
	<div class="settings">
		<div class="sett-title">General</div>
		<div class="sett-opt">
			<div class="sett-opt-title">Tamaño de fuente</div>
			<div class="sett-opt-content">
				<input type="range"
					class="range-input"
					min="12"
					max="20"
					step="2"
					v-model.number="settings.settings.fontSize"
				>
				<p>{{settings.getters.getFontSize()}} pixeles</p>
			</div>
		</div>
		<div class="sett-opt">
			<div class="sett-opt-title">Tema oscuro</div>
			<div class="sett-opt-content">
				<Toggle 
					:value="settings.settings.darkMode"
					v-model="settings.settings.darkMode"
				/>
				<p>{{settings.getters.getTheme() ? 'Activado' : 'Desactivado'}}</p>
			</div>
		</div>
		<div class="sett-opt">
			<div class="sett-opt-title">Color de tema</div>
			<div class="sett-opt-content">
				<input class="color-btn" 
					v-for="item in colorMap" :key="item.id" :style="{ background: item.code}"
					type="radio" :name="item.color" :id="item.color"
					v-model="settings.settings.themeColor" :value="item.code"
				>
				<p :style="{ color: settings.getters.getColor() }">{{searchColorName}}</p>
			</div>
		</div>
		<div class="sett-title">Simulador</div>
		<div class="sett-opt">
			<div class="sett-opt-title">Maximo de paginas por proceso</div>
			<div class="sett-opt-content">
				<input type="range"
					class="range-input"
					min="4"
					max="12"
					step="1"
					v-model.number="settings.settings.pages_per_process"
				>
				<p>{{settings.settings.pages_per_process}} pagina</p>
			</div>
		</div>
		<div class="sett-opt">
			<div class="sett-opt-title">Quantum</div>
			<div class="sett-opt-content">
				<input type="range"
					class="range-input"
					min="3"
					max="8"
					step="1"
					v-model.number="settings.settings.quantum"
				>
				<p>Quantum: {{settings.getters.getQuantum()}}</p>
			</div>
		</div>
		<div class="sett-title">Info</div>
		<div class="sett-opt">
			<a class="github-link" target="_blank"
				href="https://github.com/EdgarCM19"
			>
				<span>Github</span>
				<Icon 
					:icon="'github'"
					:width="settings.getters.getFontSize() * 1.2"
					:height="settings.getters.getFontSize() * 1.2"
				/>
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import Toggle from '@/components/Toggle/Toggle.vue';
import Icon from '@/components/Icon/Icon.vue';

export default defineComponent({
	components: {
		Toggle,
		Icon,
	},
	setup () {

		const settings = inject('settings');

		const font_size = ref(20);
		const dark_theme = ref(true);
		const color = ref('');
		const pages_per_process = ref(5);
		const quantum = ref(4);

		const colorMap = [
			{id: 0, color: 'Default', code: 'var(--fg-color)'},
			{id: 1, color: 'Aqua', code: '#6f6cde'},
			{id: 2, color: 'Azul', code :'#062af2'},
			{id: 3, color: 'Rosa', code :'#dd4774'},
			{id: 4, color: 'Naranja', code :'#ce792b'},
		];

		const searchColorName = computed(() => {
			for(const temp of colorMap)
			//@ts-ignore
				if(temp.code === settings.getters.getColor())
					return temp.color;
			return ''
		});

		return {
			font_size,
			dark_theme,
			color,
			pages_per_process,
			quantum,

			colorMap,
			settings,
			searchColorName,
		};
	}
});
</script>

<style lang="scss">
@import './settings';
</style>