<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { Component } from 'vue';

//
import { preferences } from '../../$state$/Preferences.ts';
import type { TabType } from "../../$core$/Types";

//
import { subscribe } from '/externals/lib/object.js';
import { synchronizeInputs } from '/externals/lib/dom.js';

//
interface InputDesc {
    component?: Component;
    icon?: string;
    label?: string;
};

//
interface FormDesc {
    inputs?: InputDesc[];
    label?: string;
};

//
interface FormProps {
    form?: FormDesc;
    tab?: TabType|null;
};

//
const props = defineProps<FormProps>();
const contentRef = ref<HTMLElement | null>(null);
console.log(props?.form?.inputs);

//
onMounted(() => {
    if (contentRef.value) {
        synchronizeInputs(preferences, '.u2-input', contentRef.value, subscribe);
    }
});
</script>

<template>
    <form data-alpha="0" data-scheme="solid" data-chroma="0" data-highlight="0" ref="contentRef">
        <span class="adl-form-label">{{ props?.form?.label }}</span>
        <ui-block v-for="input in props?.form?.inputs" style="content-visibility: visible;">
            <ui-icon slot="icon" v-bind:icon="input?.icon" />
            <span slot="label">{{ input?.label||"" }}</span>
            <component :is="input?.component" v-bind:input="input" />
        </ui-block>
    </form>
</template>
