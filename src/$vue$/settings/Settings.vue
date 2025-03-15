<script lang="ts" setup>
import { ref, computed, onMounted, defineProps } from "vue";
import type { Task } from "../../$core$/Types";


//
import Form from "./Form.vue";

//
import { forms, tabs } from "./Fields.ts"

//
const currentTab = ref("display");
const cTab = computed<any|null>(() => tabs.find((t) => t?.id === currentTab.value));
const contentRef = ref<HTMLElement | null>(null);
const props = defineProps < Task > ();

//
/*const handleClick = () => {
    if (contentRef.value) {
        $hideMenu(contentRef.value);
    }
};*/

//
/*const observeArgs = [
    "data-tab",
    (value: any) => {
        currentTab.value = value;
    }
];*/

onMounted(() => {
    // v-for="tab in tabs" :data-tab="tab?.id"
});
</script>

<template>
    <div id="settings" data-alpha="0" data-scheme="solid" class="ui-content" :data-tab="currentTab" ref="contentRef">
        <!-- TODO: support titlebar-inline menu button support -->
        <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar"></div>
        <div data-scheme="solid" data-alpha="0" class="adl-main">
            <ui-scrollbox data-scheme="solid" data-alpha="1" data-highlight="0.5" data-chroma="0.01" class="adl-tab-box">
                <div class="adl-tabs" data-alpha="0">
                    <!--<ui-select-row v-for="tab in tabs" :key="tab.id" data-alpha="0" name="s-tab" @click="handleClick"
                        @change="($event) => (currentTab = $event.target.value)" :value="tab.id"
                        :checked="currentTab === tab.id">
                        <ui-icon :icon="tab.icon" style="padding: 0.5rem;"></ui-icon>
                        <span>{{ tab.content }}</span>
                    </ui-select-row>-->
                </div>
            </ui-scrollbox>
            <ui-scrollbox data-scheme="solid" data-alpha="1" class="adl-content-box">
                <div class="adl-content" >
                    <Form v-for="form in forms" v-bind:form="form" v-bind:tab="cTab" />
                </div>
            </ui-scrollbox>
        </div>
    </div>
</template>
