<template>
    <div class="fifo">
        <div class="fifo__main">
            <div class="fifo__main__info">
                <div class="info-panel">
                    <InfoPanel
                        :current="current"
                        :completed="completed"
                        :pageFaults="3"
                    />
                </div>
                <Table class="process-queue"
                    :title="'Procesos'"
                    :listIterable="processQueue"
                />
            </div>
            <div class="fifo__main__center">
                <Table class="fifo-physic-mem"
                    :title="'Memoria fisica'"
                    :listIterable="physicalMemory"
                    :slots="physicalSize"
                />
                <!-- <HorizontalTable class="fifo-ref-queue"
                    :listIterable="['1', '2']"
                    :title="'Apuntadores de memoria'"
                /> -->
            </div>
            <div class="fifo__main__lat">
                <Table 
                    :listIterable="virtualMemory"
                    :title="'Memoria virtual'"
                    :slots="virtualSize"
                />
            </div>
        </div>
        <div class="fifo__buttons">
            <Button 
                :onClickFunction="nextStep"
                :icon="'prev'"
                :round="true"
                :expand="true"
                :size="24"
            />
            <Button 
                :onClickFunction="nextStep"
                :icon="'play'"
                :round="true"
                :expand="true"
                :size="24"
            />
            <Button 
                :onClickFunction="nextStep"
                :icon="'next'"
                :round="true"
                :expand="true"
                :size="24"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import Button from '@/components/Button/Button.vue';
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue';
import Table from '@/components/Table/Table.vue';
// import HorizontalTable from '@/components/HorizontalTable/HorizontalTable.vue';

import CPU from '@/model/cpu';

export default defineComponent({
    components:{
        Button,
        InfoPanel,
        Table,
        // HorizontalTable,
    },
    props: {
        inputArray: {
            type: String,
            required: true
        },
        virtualSize: {
            type: Number,
            required: true,
        },
        physicalSize: {
            type: Number,
            rquired: true
        },
        opt1: {
            type: Number,
            required: false,
            default: 0,
        },
        opt2: {
            type: Number,
            required: false,
            default: 0,
        }
    },
    setup(props) {
        const lista: string[] = [];
        const cpu = ref<CPU>();

        const current = computed((): string => {
            if(cpu.value === undefined) return ''
            if(cpu.value.computed_process !== null) 
                return `${cpu.value.computed_process.PID}-${cpu.value.current_reference}`;
            return ''
        });

        const completed = computed((): string => {
            if(cpu.value === undefined) return '-/-';
            return `${cpu.value.completed_processes}/${cpu.value.total_processes}`;
        });

        const processQueue = computed((): string[] => {
            if(cpu.value === undefined) return [];
            return cpu.value.scheduler.job_queue.queue.map(x => `${x.PID}`)
        });

        const virtualMemory = computed((): string[] => {
            if(cpu.value === undefined) return [];
            return cpu.value.virtual.pages.map((x) => (!x.free ? `${x.page.process_pid}-${x.page.process_page}` : ' '));
        });

        const physicalMemory = computed((): string[] => {
            if(cpu.value === undefined) return [];
            return cpu.value.physical.frames.map((x) => (!x.free ? `${x.frame.process_pid}-${x.frame.process_page}` : ' '));
        });

        const nextStep = () => {
            cpu.value.next();
        }

        function initCPU(){
            //@ts-ignore
            cpu.value = new CPU(JSON.parse(props.inputArray), props.physicalSize, props.virtualSize, 
                                4, 'Fifo', props.opt1, props.opt2);
            console.log('___', cpu.value);
        }       
         
        onMounted(initCPU);

        return {
            lista,
            cpu,
            current,
            nextStep,
            completed,
            processQueue,
            virtualMemory,
            physicalMemory,
        }
    }
});
</script>

<style lang="scss">
@import './fifo';
</style>