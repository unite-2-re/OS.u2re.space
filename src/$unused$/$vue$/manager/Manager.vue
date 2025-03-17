<script setup lang="ts">
import { ref, computed, onMounted, watch  } from "vue";

//
import { tabs } from "../settings/Fields.ts"

//
import { addItemEv, downloadItemEv, dropItemEv, removeItemEv } from "../../$core$/FileOps.ts";
import { FileManagment } from "../../$core$/FileManage.ts";
import type { Task } from "../../$core$/Types";

//
import { subscribe } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";

//
const props = defineProps < Task > ();
const currentTab = ref("display");

//
const manager = new FileManagment(props.args);
const directory = ref(props.args?.directory || "/user/images/");
manager.navigate(directory.value);
const current = manager.getCurrent();

//
const files = ref<[string, File|Blob|any][]>(Array.from(current?.entries?.() || []));

//
watch(directory, (nv)=>{
    if (props.args?.directory != nv) {
        props.args.directory = nv;
        manager.navigate(nv);
    }
});

//
subscribe(props.args, (value: any, prop: string) => {
    if (prop === "directory" && props.args?.directory != directory.value) {
        manager.navigate(directory.value = value);
    }
});
subscribe(current, (_value: any, _prop: string) => {
    files.value = Array.from(current?.entries?.() || [])
});

// Refs for some DOM elements.
const contentEl = ref < HTMLElement | null > (null);
const inputEl = ref < HTMLInputElement | null > (null);
const contentBoxEl = ref < HTMLElement | null > (null);

//
onMounted(() => {
    if (contentEl.value) {
        FileManagment.bindManager(contentEl.value, manager);
        synchronizeInputs(props.args, ".u2-input", contentEl.value, subscribe);
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

// Derived component id (remove "#" if present).
const componentId = computed(() => {
    return props.taskId ? props.taskId.replace("#", "") : "manager";
});
</script>

<template>
    <div data-chroma="0" data-highlight="0" data-alpha="0" data-scheme="solid" class="ui-content" :id="componentId" :data-tab="currentTab" ref="contentEl">
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
                <input ref="inputEl" type="text" name="directory" v-model="directory" placeholder="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" />
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
                    <ui-select-row v-for="F in files" :key="F[0]" href="#" name="file" :value="F[0]"
                        style="-webkit-user-drag: element; -moz-user-drag: element;" draggable="true"
                        @click="(ev) => navigateFile(ev, F[0])"
                        @dblclick="(ev) => navigateFile(ev, F[0])">
                        <ui-icon :icon="manager.byType(F[0])" inert />
                        <span inert>{{ getFilename(F[0]) }}</span>
                        <span inert>
                            {{
                                F[1].lastModified
                                    ? new Date(F[1].lastModified).toLocaleString()
                                    : F[0].startsWith("..")
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
