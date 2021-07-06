<template>
    <div class="form-fifo">
		<div class="process-section">
			<div class="section-title">Procesos de entrada</div>
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
				:size="32"
				:onClickFunction="openModal"
				:round="true"
				:expand="true"
			/>
		</div>
		<div class="options-section">
			<div class="section-title">Opciones</div>
			<div class="options">
				<div class="opt">
					<p># de marcos: {{physical_size}}</p>
					<input type="range"
						class="range-input"
						min="3"
						max="8"
						step="1"
						v-model="physical_size"
					>
				</div>
				<div class="opt">
					<p># de marcos: {{virtual_size}}</p>
					<input type="range"
						class="range-input"
						min="5"
						max="16"
						step="1"
						v-model="virtual_size"
					>
				</div>
			</div>
		</div>
		<router-link to="/" class="btn">Iniciar</router-link>
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
                <span>Tiempo de arrivo</span>
                <InputNumber
                    :max="20"
                    :mini="'0'"
                    :value="arrival_time"
                    v-model.number="arrival_time"
                />
                <span>Numero de paginas</span>
                <InputNumber
                    :max="5"
                    :mini="1"
                    :value="pages"
                    v-model.number="pages"
                />
                <span>Referencias a paginas</span>
                <Radio 
                    :optionsList="refs_options"
                    :value="refs_opt"
                    v-model="refs_opt"
                />
                <span v-if="refs_opt === 'Manual'">Ingrese las referencias a pagina separadas por una ,</span>
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
                />
            </div>   
        </Modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue';
import Button from '@/components/Button/Button.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import InputNumber from '@/components/InputNumber/InputNumber.vue';
import InputText from '@/components/InputText/InputText.vue';
import Radio from '@/components/Radio/Radio.vue';
import ProcessCard from '@/components/ProcessCard/ProcessCard.vue';
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
    },
    setup() {

        const showModal = ref(false);

        const openModal = () => {
            showModal.value = true;
        }

        const closeModal = () => {
            showModal.value = false;
            console.log('SE cerro jejeje');
        }

        const pid_list = ref(['A', 'B', 'C', 'D']);
        const selected_pid = ref('');
        const arrival_time = ref(0);
        const pages = ref(1);
        const refs_options = ['Manual', 'Aleatorio'];
        const refs_opt = ref('');
        const input_refs = ref('');
        const inputProcesses = ref<IProcessInput []>([]);

		const physical_size = ref(4);
		const virtual_size = ref(6);

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
                    refs_arr.push(Math.round(Math.random() * pages.value));
                inputProcesses.value.push({
                    pid: selected_pid.value,
                    arrival_time: arrival_time.value,
                    pages: pages.value,
                    total_time: refs_arr.length,
                    references: refs_arr,
                });
            }
            selected_pid.value = '';
            arrival_time.value = 0;
            pages.value = 1;
            refs_opt.value = '';
            input_refs.value = '';
            console.log(inputProcesses.value);
			closeModal();
        }


        return {
            showModal,
            openModal,
            closeModal,

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
            
        }
    }
})
</script>

<style lang="scss">
@import './formfifo';
</style>