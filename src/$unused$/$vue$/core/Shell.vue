<script setup lang="ts">
import type { Task } from "../../$core$/Types";
import { confirmEdit, gridState, itemForm } from "../../$state$/GridState.ts";
import ItemEdit from "../workspace/ItemEdit.vue";
import Workspace from "../workspace/Workspace.vue";
import components from "./Components.ts";
import PageView from "./PageView.vue";

//
import { subscribe } from "/externals/lib/object.js";
import { ref, defineProps } from "vue";

//
const props = defineProps<{tasksList: any}>();
const tasks = ref<Task[]>([]);
if (props?.tasksList) {
    subscribe(props?.tasksList, () => { tasks.value = props?.tasksList; });
}
</script>

<template>
    <!-- Workspace Icons -->
    <Workspace
        v-bind:items="gridState.items"
        v-bind:shortcuts="gridState.shortcuts"
        v-bind:lists="gridState.lists"
    />

    <!-- UI-Scaled Layer -->
    <ui-orientbox id="ui-layer" class="ui-layer" orient="0" style="background-color: transparent;">
        <!-- Replace the empty v-for with an iteration over “tasks” -->
        <ui-frame v-for="task in tasks" :key="task.taskId" data-highlight="2" data-chroma="0.1" data-scheme="solid">
            <div style="justify-self: start; text-align: start; padding-inline: 1rem;" slot="ui-title-bar">
                {{ task.desc.label }}
            </div>
            <component :is="components?.get(task.args.type) || PageView"
                v-bind:desc="task.desc"
                v-bind:args="task.args"
                v-bind:taskId="task.taskId"
            ></component>
        </ui-frame>

        <!-- Item Edit -->
        <ItemEdit :confirmState="confirmEdit" v-bind:form="itemForm"></ItemEdit>

        <!-- Taskbar -->
        <ui-taskbar v-bind:tasks="props?.tasksList">
            <ui-task v-for="task in tasks" :key="task.taskId" v-bind:taskId="task.taskId" v-bind:desc="task.desc">
                <ui-icon :icon="task.desc.icon"></ui-icon>
            </ui-task>
        </ui-taskbar>

        <!-- Navbar (Mobile Only) -->
        <ui-navbar></ui-navbar>

        <!-- Contextmenu Modal -->
        <ui-modal type="contextmenu" id="contextmenu"
            style="display: inline-grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"></ui-modal>

        <!-- Calendar Popup Modal -->
        <ui-modal type="popup" data-name="calendar">
            <ui-calendar></ui-calendar>
        </ui-modal>
    </ui-orientbox>
</template>
