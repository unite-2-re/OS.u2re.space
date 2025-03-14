<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";

//
import TabContent from "../core/TabContent.vue";
import Form from "./Form.vue";

//
import { forms, tabs } from "./Fields.vue";

//
const currentTab = ref("display");
const cTab = computed<any>(() => tabs.find((t) => t?.id === currentTab.value));
const contentRef = ref<HTMLElement | null>(null);

//
/*const handleClick = () => {
    if (contentRef.value) {
        $hideMenu(contentRef.value);
    }
};*/

//
const observeArgs = [
    "data-tab",
    (value: any) => {
        currentTab.value = value;
    }
];

onMounted(() => {
    // Дополнительная логика при монтировании (если требуется)
});
</script>

<template>
    <div id="settings" data-alpha="0" data-scheme="solid" class="ui-content" :data-tab="currentTab" ref="contentRef" v-observe="observeArgs">
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
                <TabContent :tab="cTab">
                    <template v-for="[form, _] in forms" :key="index">
                        <Form :form="form" :tab="cTab" />
                    </template>
                </TabContent>
            </ui-scrollbox>
        </div>
    </div>
</template>
