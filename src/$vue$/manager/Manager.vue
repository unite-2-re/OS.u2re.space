<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

//
import { tabs as importedTabs } from "../settings/Fields.vue";
import { observe } from "../core/Utils.ts";

//
import { addItemEv, downloadItemEv, dropItemEv, removeItemEv } from "../../$core$/FileOps.ts";
import { FileManagment } from "../../$core$/FileManage.ts";
import type { Task } from "../../$core$/Types";

//
import { subscribe } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";

//
const props = defineProps < { task: Task } > ();
const currentTab = ref("display");
const directoryValue = ref("/user/images/");

//
const manager = new FileManagment(props.task.args);
const current = manager.getCurrent();
manager.navigate(props.task.args?.directory || directoryValue.value);

//
const files = ref(current);

// Subscribe to changes on current so that files is updated.
subscribe(current, (_value: any, _prop: string) => { files.value = current; });

// When task.args changes (e.g. its directory property), navigate.
subscribe(props.task.args, (value: any, prop: string) => { if (prop === "directory") manager.navigate(value); });

// Refs for some DOM elements.
const contentEl = ref < HTMLElement | null > (null);
const inputEl = ref < HTMLInputElement | null > (null);
const contentBoxEl = ref < HTMLElement | null > (null);

//
onMounted(() => {
    if (contentEl.value) {
        FileManagment.bindManager(contentEl.value, manager);
        synchronizeInputs(props.task.args, ".u2-input", contentEl.value, subscribe);
    }
    manager.navigate(manager.currentDir());
});

//
const handleAddClick = (_: Event) => { addItemEv(manager.currentDir(), current); };
const handleDownloadClick = (_: Event) => { downloadItemEv(FileManagment.fileOf(contentEl.value)); };
const handleDeleteClick = (_: Event) => { removeItemEv(FileManagment.fileOf(contentEl.value), current); };
const goDirectory = (_: Event) => { manager.navigate(manager.currentDir()); };
const handlePlayClick = (_: Event) => { manager.navigate(FileManagment.fileOf(contentEl.value)); };
const handleTabChange = (ev: Event, _: string) => { currentTab.value = (ev.target as HTMLInputElement).value; };
const dragOverHandle = (ev: DragEvent) => { ev.preventDefault(); };
const navigateFile = (ev: Event, _: string) => { manager.navigate(FileManagment.fileOf(contentEl.value), ev); };
const getFilename = (path: string) => { const parts = path.split("/"); return parts.at(-1) || parts.at(-2) || path; };

//
const dropHandle = (ev: DragEvent) => {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0];
    if (file) {
        dropItemEv(file, manager.currentDir(), current);
    }
};

// Convert the files (assumed to be a Map or similar) into an array of entries.
const fileEntries = computed<any[]>(() => {
    if (files.value && typeof files.value.entries === "function") {
        return Array.from(files.value.entries());
    }
    return [];
});

// Derived component id (remove "#" if present).
const componentId = computed(() => {
    return props.task.id ? props.task.id.replace("#", "") : "manager";
});

//
const tabs = importedTabs;
</script>

<template>
    <div data-chroma="0" data-highlight="0" data-alpha="0" data-scheme="solid" class="ui-content" :id="componentId"
        :data-tab="currentTab" ref="contentEl" v-bind="observe(['data-tab', currentTab])">
        <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar">
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-add" @click="handleAddClick">
                <ui-icon icon="file-up" />
            </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-get"
                @click="handleDownloadClick">
                <ui-icon icon="file-down" />
            </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-del"
                @click="handleDeleteClick">
                <ui-icon icon="file-x" />
            </button>
            <ui-longtext data-highlight="1" class="adl-space u2-input" data-name="directory">
                <input ref="inputEl" type="text" name="directory" v-model="directoryValue" placeholder="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" />
            </ui-longtext>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-dir-go" @click="goDirectory">
                <ui-icon icon="step-forward" />
            </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-use" @click="handlePlayClick">
                <ui-icon icon="image-play" />
            </button>
        </div>
        <div data-scheme="solid" data-alpha="0" class="adl-main">
            <ui-scrollbox data-scheme="solid" data-alpha="1" data-highlight="0.5" data-chroma="0.01"
                class="adl-tab-box">
                <div class="adl-tabs">
                    <ui-select-row v-for="tab in tabs" :key="tab.id" name="m-tab" :value="tab.id"
                        :checked="currentTab === tab.id" @change="(e) => handleTabChange(e, tab.id)">
                        <ui-icon :icon="tab.icon" inert style="padding: 0.5rem;" />
                        <span inert>{{ tab.content }}</span>
                    </ui-select-row>
                </div>
            </ui-scrollbox>
            <ui-scrollbox data-scheme="solid" data-alpha="1" class="adl-content-box" ref="contentBoxEl">
                <div class="adl-content" @drop="dropHandle" @dragover.prevent="dragOverHandle">
                    <ui-select-row v-for="[path, file] in fileEntries" :key="path" href="#" name="file" :value="path"
                        style="-webkit-user-drag: element; -moz-user-drag: element;" draggable="true"
                        @click="(ev) => navigateFile(ev, path)"
                        @dblclick="(ev) => navigateFile(ev, path)">
                        <ui-icon :icon="manager.byType(path)" inert />
                        <span inert>{{ getFilename(path) }}</span>
                        <span inert>
                            {{
                                file.lastModified
                                    ? new Date(file.lastModified).toLocaleString()
                                    : path.startsWith("..")
                                        ? ""
                                        : "N/A"
                            }}
                        </span>
                    </ui-select-row>
                </div>
            </ui-scrollbox>
        </div>
    </div>
</template>
