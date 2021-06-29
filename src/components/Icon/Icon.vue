<template>
    <div>
        <svg
            :width="`${width}px`"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <g>
                <path :fill="color" :d="path" />
            </g>
        </svg>
    </div>
</template>

<script lang="ts">
/* @ts-ignore */
import { computed, defineComponent } from 'vue';
import ICONS from './icons';

export default defineComponent({
    props: {
        icon: {
            type: String as () => string,
            requierd: true,
            default: () => 'code',
        },
        color: {
            type: String,
            required: false,
            default: 'currentColor',
        },
        width: {
            type: Number, String,
            required: false,
            default: 16,
        },
        height: {
            type: Number, String,
            required: false,
            default: 16,
        }
    },
    setup(props) {
        const iconStyle = computed(() => {
            return props.width && props.height ? {
                width: `${ props.width }px`,
                height: `${ props.height }px`,
            } : '';
        });

        const path = computed((): string => {
            // @ts-ignore
            return ICONS[props.icon];
        })
        return {
            iconStyle,
            path
        }
    }
});
</script>

<style >

</style>