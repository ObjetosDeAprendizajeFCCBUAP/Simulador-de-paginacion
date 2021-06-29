<template>
    <div>
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
            <pages 
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
        <div class="processes-list" v-if="inputProcesses.length > 0">
            <ProcessCard v-for="process in inputProcesses" class="process-item"
                :key="process.pid"
                :process="process"
            />
        </div>
        <router-link class="btn" :to="{
            name: view,
            params: { inputArray : JSON.stringify(inputProcesses) }
        }">Iniciar</router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import InputNumber from '@/components/InputNumber/InputNumber.vue';
import Radio from '@/components/Radio/Radio.vue';
import pages from '@/components/InputText/InputText.vue';
import Button from '@/components/Button/Button.vue';
import ProcessCard from '@/components/ProcessCard/ProcessCard.vue';
import { IProcessInput } from '@/model/loader';

export default defineComponent({
    props: {
        algorithm : {
            type: String,
            required: true,
            // validator: (value: string) => {
            //     return ['fifo', 'ws', 'wsclock'].indexOf(value) !== -1;
            // },
        }
    },
    components: {
        Dropdown,
        InputNumber,
        Radio,
        ProcessCard,
        pages,
        Button,
    },
    setup(props) {
        const pid_list = ref(['A', 'B', 'C', 'D']);
        const selected_pid = ref('');
        const arrival_time = ref(0);
        const pages = ref(1);
        const refs_options = ['Manual', 'Aleatorio'];
        const refs_opt = ref('');
        const input_refs = ref('');
        const inputProcesses = ref<IProcessInput []>([]);

        function addProcess() {
            console.log('Holis jejejej');
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

        return {
            pid_list,
            selected_pid,
            arrival_time,
            pages,
            refs_options,
            refs_opt,
            input_refs,
            inputProcesses,
            addProcess,
            view
        }
    }
});
</script>

<style lang="scss">
@import './views';

</style>