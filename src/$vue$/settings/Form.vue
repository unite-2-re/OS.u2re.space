<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { preferences } from '../../$state$/Preferences.ts';

//
import { subscribe } from '/externals/lib/object.js';
import { synchronizeInputs } from '/externals/lib/dom.js';

//
interface FormProps {
    form: any;
    tab: () => any;
}

const props = defineProps<FormProps>();

const contentRef = ref<HTMLElement | null>(null);

onMounted(() => {
    if (contentRef.value) {
        synchronizeInputs(preferences, '.u2-input', contentRef.value, subscribe);
    }
});
</script>

<template>
    <form data-alpha="0" data-scheme="solid" data-chroma="0" data-highlight="0" ref="contentRef">
        <span class="adl-form-label">{{ form?.label }}</span>
        <ui-block v-for="(input, index) in form?.inputs" :key="index">
            <ui-icon slot="icon" :icon="input?.icon" />
            <span slot="label">{{ input?.label }}</span>
            <component :is="input?.component" :input="input" slot="element" />
        </ui-block>
    </form>
</template>
