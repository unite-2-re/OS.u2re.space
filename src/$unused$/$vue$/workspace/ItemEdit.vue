<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

//
import { UIState } from "../../$state$/UIState.ts";
import { removeItem } from "../../$state$/GridState.ts";

//
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";

//
import TextField from "./TextField.vue";

//
const fields = ["label", "icon", "href", "action", "id"];
const fieldTypes = new Map([
    ["text", TextField]
]);

//
const targetItem = ref();
const stateOnEdit = makeObjectAssignable(makeReactive({
    id: "",
    label: "",
    icon: "",
    href: "",
    action: ""
}));

//
const props = defineProps<{
    //loadState: () => any,
    confirmState: (S: any, KV?: [any, any]) => any,
    form: any[]
}>();

//
subscribe([UIState, "currentItem"], (value, _) => targetItem.value = value)

// when changing target, set another field values
computed(() => {
    const state = targetItem?.value;
    if (state) {
        for (const k of fields) {
            if (stateOnEdit[k] != state?.[k]) { stateOnEdit[k] = state?.[k] || ""; };
        }
    }
});

//
const confirm = (ev) => {
    const modal = ev?.target?.closest?.(".adl-modal");
    if (modal) {
        props.confirmState(stateOnEdit);
        modal.dataset.hidden = "";
    };
};

//
const deleteA = (ev) => {
    const modal = ev?.target?.closest?.(".adl-modal");
    if (modal) {
        removeItem(stateOnEdit?.id);
        modal.dataset.hidden = "";
    };
};

//
const content = ref<HTMLElement|null>(null);
onMounted(() => { if (content.value) synchronizeInputs(stateOnEdit, ".u2-input", content.value, subscribe); });
</script>

<template>
    <ui-modal class="adl-modal" data-hidden data-alpha="1" data-scheme="solid">
        <form data-alpha="0" data-highlight="0" class="adl-item-edit" ref="content" style="background-color: transparent;">
            <label v-for="input in form" style="background-color: transparent;">
                <div class="adl-label" style="background-color: transparent;">{{ input?.label }}</div>
                <div class="adl-input" data-scheme="solid" data-alpha="0" data-highlight="2">
                    <!-- Use dynamic component mapping from fieldTypes -->
                    <component :is="fieldTypes.get(input?.type)" v-bind:input="input" />
                </div>
            </label>
        </form>
        <div data-alpha="0" data-highlight="0" class="adl-buttons" style="background-color: transparent;">
            <button @click="deleteA" class="adl-delete" data-scheme="inverse" data-chroma="0.05">Delete</button>
            <button @click="confirm" class="adl-confirm" data-scheme="inverse" data-chroma="0.05">Confirm</button>
        </div>
    </ui-modal>
</template>

<style scoped>
/* Добавьте необходимые стили */
</style>
