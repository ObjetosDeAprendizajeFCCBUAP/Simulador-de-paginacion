<template>
  <div class="input-num">
    <div class="decrement" @click="decrement" :class="{inactive: !canDecrement }">-</div>
    <input class="input-field" type="text" v-model.number="input_val" :style="{ color: settings.getters.getColor() }"/>
    <div class="increment" @click="increment" :class="{inactive: !canIncrement}">+</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';

export default defineComponent({
  props: {
    mini : {
      type: [Number, String],
      required: false,
    },
    max : {
      type: Number,
      required: false,
    },
    start: {
      type: Number,
      required: false,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  setup (props, { emit }) {
    const settings  = inject('settings');

    const valueHandler = {
      get() {
        return props.value.valueOf();
      }, 
      set(val: number) {
        emit('update:modelValue', val);
      },
    }
    
    // @ts-ignore
    const input_val = computed(valueHandler);

    const canIncrement = computed(() : boolean => {
      if(props.max)
        // @ts-ignore
        return props.value.valueOf() + 1 <= props.max;
      return true;
    });

    const canDecrement = computed(() : boolean => {
      if(props.mini)
        // @ts-ignore
        return props.value.valueOf() - 1 >= props.mini;
      return true;
    });

    const increment = () => { 
      if(canIncrement.value)
      // @ts-ignore
        emit('update:modelValue', props.value + 1);
    }

    const decrement = () => { 
      if(canDecrement.value)
      // @ts-ignore
        emit('update:modelValue', props.value - 1);
    }

    return {
      settings,
      input_val,
      increment,
      decrement,
      canIncrement,
      canDecrement,
    }
  }
});
</script>

<style lang="scss">
@import "./inputnumber";
</style>