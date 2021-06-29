<template>
    <div class="circle-table">
        <div class="circle-container" :style="computedSize">
        </div>            
        <div class="circle-slot" v-for="i in slots" :key="i" 
            :style="calcTranslate(i)">
            {{i}}
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
    props: {
        slots: {
            type: Number,
            required: false,
            default: 6,
        },
        radius: {
            type: Number,
            required: false,
            default: 300,
        },
        offset: {
            type: Number,
            required: false,
            default: 90,
        }
    },
    setup(props) {

        const _offset = ref(0);

        onMounted(() => {
            //@ts-ignore
            _offset.value = (-90 - (360 / props.slots));
        })

        const calcDegrees = (index: number): number => {
            //@ts-ignore
            // return ((360 / props.slots) * index + props.offset) * (Math.PI / 180);
            console.log(_offset.value);
            //@ts-ignore
            return ((360 / props.slots) * index + _offset.value) * (Math.PI / 180);
        }
        
        const calcCoords = (index: number) => {
            //@ts-ignore
            const xCoord = Math.cos(calcDegrees(index)) * (props.radius - 70);
            //@ts-ignore(
            const yCoord = Math.sin(calcDegrees(index)) * (props.radius - 70);
            return [xCoord, yCoord];
        }

        const calcTranslate = (index: number) => {
            const [xCoord, yCoord] = calcCoords(index);
            return `transform: translate(${xCoord}px, ${yCoord}px);`
        }

        const computedSize = computed(() => {
            return {
                //@ts-ignore
                width: `${props.radius * 2}px`,
                //@ts-ignore
                height: `${props.radius * 2}px`
            }
        });

        return {
            calcTranslate,
            computedSize,
        }
    }
})
</script>

<style lang="scss">
@import './circletable';
</style>