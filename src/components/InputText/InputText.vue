<template>
  <div class="input-wrapper">
    <input
      type="text"
      :placeholder="placeholder"
      v-model="input_val"
      :style="`color: ${settings.getters.getColor()}`"
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { emit }) {
    const settings = inject('settings');

    const value_handler = {
      get() {
        return props.value;
      },
      set(val: string) {
        emit('update:modelValue', val);
      },
    };

    // @ts-ignore
    const input_val = computed(value_handler);

    return {
      settings,
      input_val,
    };
  },
});
</script>

<style lang="scss">
@import './inputtext';
</style>