<template>
    <div class="circle-table">
        <div class="circle-container" :style="computedSize">
        </div>            
        <!-- <div class="circle-arrow" :style="computedStyle"></div> -->
        <div class="circle-slot" v-for="(i, index) in iterList" :key="index" 
            :style="calcTranslate(index)">
            {{i}}
        </div>
        <!-- <div class="circle-slot" v-for="i in freeSlots" :key="slots - i" 
            :style="calcTranslate(slots - freeSlots() - i)">
            #
        </div> -->
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
        },
        pointTo: {
            type: Number,
            required: false,
            default: 1,
        },
        iterableList: {
            type: Array as () => string[],
            required: true,
        }
    },
    setup(props) {

        const _offset = ref(0);

        onMounted(() => {
            //@ts-ignore
            _offset.value = (180 - (360 / props.slots));
        })

        const calcDegrees = (index: number): number => {
            //@ts-ignore
            // return ((360 / props.slots) * index + props.offset) * (Math.PI / 180);
            console.log(_offset.value);
            //@ts-ignore
            return ((360 / props.slots) * index - 90) * (Math.PI / 180);
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

        const toDeg = (deg: number) => {
            return (deg * 180) / Math.PI;
        }

        const computedSize = computed(() => {
            return {
                //@ts-ignore
                width: `${props.radius * 2}px`,
                //@ts-ignore
                height: `${props.radius * 2}px`
            }
        });

        const computedStyle = computed(() => {
            return {
                // @ts-ignore
                height: `calc(${props.radius}px / 2)`,
                // @ts-ignore
                transform: `rotateZ(${toDeg(calcDegrees(props.pointTo) + calcDegrees(20))}deg`
            }
        });

        const freeSlots = () => {
            //@ts-ignore 
            return props.slots - props.iterableList.length;
        }

        const iterList = computed(()  => {
            const iter: string[] = [];
            // @ts-ignore
            for(let i = 0; i < props.iterableList.length; i++)
            //@ts-ignore
                iter.push(props.iterableList[i]);
            const limit = freeSlots();
            for(let i = 0; i < limit; i++)
                iter.push(' ');
            return iter;
        })

        return {
            calcTranslate,
            computedSize,
            computedStyle,
            freeSlots,
            iterList,
        }
    }
})
</script>

<style lang="scss">
@import './circletable';
</style>