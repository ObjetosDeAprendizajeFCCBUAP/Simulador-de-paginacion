<template>
    <div class="form-fifo">
		<div class="blur-content" :class="{ blur : showModal}">
            <div class="back">
                <router-link to="/" class="btn expand round back-home">
                    <Icon 
                        :icon="'back'"
                        :width="settings.getters.getFontSize() * 1.2"
                        :height="settings.getters.getFontSize() * 1.2"
                        :color="settings.getters.getColor()"
                    />
                </router-link>
            </div>
            <div class="process-section">
                <div class="section-title" :style="{ color: settings.getters.getColor() }">Procesos de entrada</div>
                <div class="processes-list" v-if="inputProcesses.length > 0">
                    <ProcessCard v-for="process in inputProcesses" class="process-item"
                        :key="process.pid"
                        :process="process"
                    />
                </div>
                <div class="processes-list" v-else>
                    Sin procesos de entrada
                </div>
                <Button
                    :icon="'plus'"
                    :size="settings.getters.getFontSize() * 1.2"
                    :onClickFunction="openModal"
                    :round="true"
                    :expand="true"
                    :color="settings.getters.getColor()"
                />
            </div>
            <div class="options-section">
                <div class="section-title" :style="{ color: settings.getters.getColor() }">Opciones</div>
                <div class="options">
                    <div class="opt">
                        <p># de marcos: <span :style="{ color: settings.getters.getColor() }">{{physical_size}}</span></p>
                        <input type="range"
                            class="range-input"
                            min="3"
                            max="8"
                            step="1"
                            v-model.number="physical_size"
                        >
                    </div>
                    <div class="opt">
                        <p># de paginas: <span :style="{ color: settings.getters.getColor() }">{{virtual_size}}</span></p>
                        <input type="range"
                            class="range-input"
                            min="3"
                            max="16"
                            step="1"
                            v-model.number="virtual_size"
                        >
                    </div>
                    <div class="opt" v-if="view == 'Set'">
                        <p>Conjunto de trabajo: <span :style="{ color: settings.getters.getColor() }">{{opt1}}</span></p>
                        <input type="range"
                            class="range-input"
                            min="2"
                            :max="virtual_size - 2"
                            step="1"
                            v-model.number="opt1"
                        >
                    </div>
                    <div class="opt" v-if="view == 'Clock'">
                        <p>Tasa de refresco: <span :style="{ color: settings.getters.getColor() }">{{opt1}}</span></p>
                        <input type="range"
                            class="range-input"
                            min="2"
                            max="5"
                            step="1"
                            v-model.number="opt1"
                        >
                    </div>
                    <div class="opt" v-if="view == 'Clock'">
                        <p>T: <span :style="{ color: settings.getters.getColor() }">{{opt2}}</span></p>
                        <input type="range"
                            class="range-input"
                            min="2"
                            max="5"
                            step="1"
                            v-model.number="opt2"
                        >
                    </div>
                </div>
            </div>
            <p v-if="inputProcesses.length <= 0">Se require al menos un proceso para iniciar</p>
            <router-link v-else
                :disable="true"
                class="btn start-section" :to="{
                        name: view,
                        params: { 
                            inputArray : JSON.stringify(inputProcesses), 
                            virtualSize: virtual_size, 
                            physicalSize: physical_size,
                            algorithm: view,
                            opt1: opt1,
                            opt2: opt2,
                        }
                    }" :style="{ color: settings.getters.getColor() }">Iniciar</router-link>
        </div>
        <Modal :showing="showModal" 
            @update:showing="showModal"
            @close="closeModal()"
        >
            <div class="process-form">
                <Dropdown 
                    :placeholder="'PID'"
                    :iterable="pid_list"
                    :selected="selected_pid"
                    v-model="selected_pid"
                />
                <span>Tiempo de arribo</span>
                <InputNumber
                    :max="20"
                    :mini="'0'"
                    :value="arrival_time"
                    v-model.number="arrival_time"
                />
                <span>Número de páginas</span>
                <InputNumber
                    :max="settings.getters.getPagesPerProcess()"
                    :mini="1"
                    :value="pages"
                    v-model.number="pages"
                />
                <span>Referencias a páginas</span>
                <Radio 
                    :optionsList="refs_options"
                    :value="refs_opt"
                    v-model="refs_opt"
                />
                <span v-if="refs_opt === 'Manual'">Ingrese las referencias a página separadas por una coma (,)</span>
                <span v-else-if="refs_opt === 'Aleatorio'">Ingrese el numero total de referencias a realizar</span>
                <span v-else>Seleccione el modo de captura de referencias</span>
                <InputText 
                    :placeholder="'Ingrese las referencias'"
                    :value="input_refs"
                    v-model="input_refs"
                />
                <Button 
                    :onClickFunction="addProcess"
                    :text="'Agregar'"
                    :size="16"
                    :icon="'plus'"
                    :expand="false"
                    :active="formValidation"
                    :color="settings.getters.getColor()"
                />
            </div>   
        </Modal>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue';
import Button from '@/components/Button/Button.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import InputNumber from '@/components/InputNumber/InputNumber.vue';
import InputText from '@/components/InputText/InputText.vue';
import Radio from '@/components/Radio/Radio.vue';
import ProcessCard from '@/components/ProcessCard/ProcessCard.vue';
import Icon from '@/components/Icon/Icon.vue';
import { IProcessInput } from '@/model/loader';

export default defineComponent({
    components: {
        Modal,
        Button,
        Dropdown,
        InputNumber,
        InputText,
        Radio,
		ProcessCard,
        Icon,
    },
    props: {
        algorithm: {
            type: String,
            required: true,
        }
    },
    setup(props) {

        const settings = inject('settings');
        const showModal = ref(false);

        const openModal = () => {
            showModal.value = true;
        }

        const closeModal = () => {
            showModal.value = false;
            console.log('SE cerro jejeje');
        }

        const pid_list = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
        const selected_pid = ref('');
        const arrival_time = ref(0);
        const pages = ref(1);
        const refs_options = ['Manual', 'Aleatorio'];
        const refs_opt = ref('');
        const input_refs = ref('');
        const inputProcesses = ref<IProcessInput []>([]);

		const physical_size = ref(4);
		const virtual_size = ref(6);

        const opt1 = ref(3);
        const opt2 = ref(3);

        function addProcess() {
            pid_list.value = pid_list.value.filter((e) => e !== selected_pid.value);
            if (refs_opt.value === 'Manual') {
                let cad: string[] = input_refs.value.replaceAll(' ', '').split(',');
                cad = cad.map((x) => x.trim());
                const algo = cad.map((x) => parseInt(x, 10));
                inputProcesses.value.push({
                    pid: selected_pid.value,
                    arrival_time: arrival_time.value,
                    pages: pages.value,
                    total_time: input_refs.value.length,
                    references: algo,
                });
            } else {
                const refs_arr: number[] = [];
                const limite = parseInt(input_refs.value, 10);
                console.log(input_refs.value);
                for (let i = 0; i < limite; i += 1) 
                    refs_arr.push(Math.round(Math.random() * (pages.value - 1)));
                inputProcesses.value.push({
                    pid: selected_pid.value,
                    arrival_time: arrival_time.value,
                    pages: pages.value,
                    total_time: refs_arr.length,
                    references: refs_arr,
                });
            }
		console.log(inputProcesses.value);
            selected_pid.value = '';
            arrival_time.value = 0;
            pages.value = 1;
            refs_opt.value = '';
            input_refs.value = '';
            console.log(inputProcesses.value);
			closeModal();
        }

        const view = ref('');
        onMounted(() => {
            switch(props.algorithm){
                case 'fifo':
                    view.value = 'Fifo'
                    break;
                case 'ws':
                    view.value = 'Set'
                    break;
                case 'wsclock':
                    view.value = 'Clock'
                    break;
                default:
            }
        });

        const formValidation = computed(() => {
            
            if(selected_pid.value.length <= 0 || input_refs.value.length <= 0){ 
                console.log('JolissjsjsA');
                return true;
            }
            return false;
        });

        return {
            showModal,
            openModal,
            closeModal,
            settings,

            pid_list,
            selected_pid,
            arrival_time,
            pages,
            refs_options,
            refs_opt,
            input_refs,
            inputProcesses,
            addProcess,

			physical_size,
			virtual_size,
            opt1,
            opt2,

            view,
            formValidation, 
        }
    }
})
</script>

<style lang="scss">
@import './formfifo';
@import './views';
</style>