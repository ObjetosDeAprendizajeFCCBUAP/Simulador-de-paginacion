<template>
    <div class="fifo">
        <div class="fifo-blur" :class="{ blur: modal_open || settings_modal }">
            <div class="fifo__main">
                <div class="fifo__main__info">
                    <div class="info-panel">
                        <InfoPanel
                            :current="current"
                            :completed="completed"
                            :pageFaults="faults"
                        />
                    </div>
                    <Table class="process-queue"
                        :title="'Procesos'"
                        :listIterable="processQueue"
                    />
                </div>
                <div class="fifo__main__center">
                    <div class="message" v-if="message.length > 0">{{message}}</div>
                    <Table class="fifo-physic-mem"
                        :title="'Memoria fisica'"
                        :listIterable="physicalMemory"
                        :slots="physicalSize"
                    />
                    <HorizontalTable class="fifo-ref-queue"
                        :listIterable="workingSet"
                        :title="'Conjunto de trabajo'"
                    />
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
                    :icon="'leave'"
                    :onClickFunction="openModal"
                    :expand="true"
                    :round="true"
                    :size="settings.getters.getFontSize() * 1.2"
                />
                <div class="action-btns">
                    <!-- <Button
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
                    /> -->
                    <Button
                        :onClickFunction="nextStep"
                        :icon="'next'"
                        :round="true"
                        :expand="true"
                        :size="settings.getters.getFontSize() * 1.2"
                    />
                </div>
                <Button class="btn-sett"
                    :icon="'settings'"
                    :round="true"
                    :expand="true"
                    :size="settings.getters.getFontSize() * 1.2"
                    :onClickFunction="openSettings"
                />
            </div>
        </div>
        <ConfirmModal 
            :showing="modal_open"
            @update:showing="modal_open"
            @close="closeModal"
        >
            ¿Esta seguro que desea salir <br>
            Al salir perdera el estado actual del simulador al igual que al informacion de los procesos de entrada
        </ConfirmModal>
        <Modal
            :showing="settings_modal"
            @update:showing="settings_modal"
            @close="closeSettings"
        >
            <Settings />
        </Modal>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import Button from '@/components/Button/Button.vue';
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue';
import Table from '@/components/Table/Table.vue';
import HorizontalTable from '@/components/HorizontalTable/HorizontalTable.vue';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal.vue';
import Modal from '@/components/Modal/Modal.vue'
import Settings from '@/components/Settings/Settings.vue'

import CPU from '@/model/cpu';

export default defineComponent({
    components:{
        Button,
        InfoPanel,
        Table,
        HorizontalTable,
        ConfirmModal,
        Modal,
        Settings,
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
        },
    },
    setup(props) {
        const settings = inject('settings');

        const lista: string[] = [];
        const cpu = ref<CPU>();

        const message = ref<string>('');

        const modal_open = ref(false);
        const settings_modal = ref(false);

        const openModal = () => { 
            modal_open.value = true;
        }

        const closeModal = () => { 
            modal_open.value = false 
        }

        const openSettings = () => settings_modal.value = true;
        const closeSettings = () => {
            settings_modal.value = false;
            //@ts-ignore
            localStorage.setItem('settings', JSON.stringify(settings.settings));
            console.log('Si se pudo o puro pedo?')
        }

        const faults = computed(() => {
            if(cpu.value === undefined) return 0;
            if(cpu.value.faults !== null) 
                return cpu.value.faults;
            return 0;
        });

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

        const workingSet = computed((): string[] => {
            if(cpu.value === undefined) return [];
            return cpu.value.mmu.working_set;
        });

        const nextStep = () => {
            cpu.value.next();
            const temp = cpu.value.getError();
            if(temp.length > 0){
                message.value = temp;
                setTimeout(() => {
                    message.value = '';
                }, 3000);
            }
        }

        function initCPU(){
            //@ts-ignore
            cpu.value = new CPU(JSON.parse(props.inputArray), props.physicalSize, props.virtualSize, 
            //@ts-ignore
                                settings.getters.getQuantum(), 'Set', props.opt1, props.opt2);
            console.log('___', cpu.value);
            console.log('___', cpu.value);
        }       
         
        onMounted(initCPU);

        return {
            settings,
            lista,
            cpu,
            message,
            modal_open,
            settings_modal,
            openModal,
            closeModal,
            openSettings,
            closeSettings,
            faults,
            current,
            nextStep,
            completed,
            processQueue,
            virtualMemory,
            physicalMemory,
            workingSet,
        }
    }
});
</script>

<style lang="scss">
@import './fifo';
</style>