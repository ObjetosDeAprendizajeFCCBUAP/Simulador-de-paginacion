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
                v-model="arrival_time"
            />
            <span>Numero de paginas</span>
            <InputNumber
                :max="5"
                :mini="1"
                :value="num_refs"
                v-model.number="num_refs"
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
            />
            <Button 
                :onClickFunction="() => console.log('Jejeje')"
                :text="'Agregar'"
                :size="16"
                :icon="'plus'"
                :expand="false"
            />
        </div>
        <ProcessCard />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import InputNumber from '@/components/InputNumber/InputNumber.vue';
import Radio from '@/components/Radio/Radio.vue';
import ProcessCard from '@/components/ProcessCard/ProcessCard.vue';
import InputText from '@/components/InputText/InputText.vue';
import Button from '@/components/Button/Button.vue';

export default defineComponent({
    components: {
        Dropdown,
        InputNumber,
        Radio,
        ProcessCard,
        InputText,
        Button,
    },
    setup () {
        const pid_list = ref(['A', 'B', 'C', 'D']);
        const selected_pid = ref('');
        const arrival_time = ref(0);
        const num_refs = ref(1);
        const refs_options = ['Manual', 'Aleatorio'];
        const refs_opt = ref('');
        const input_refs = ref('');

        return {
            pid_list,
            selected_pid,
            arrival_time,
            num_refs,
            refs_options,
            refs_opt,
            input_refs,
        }
    }
});
</script>

<style lang="scss">
@import './views';

</style>