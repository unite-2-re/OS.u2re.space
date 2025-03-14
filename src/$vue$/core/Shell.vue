<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { AppsType } from '../../$core$/Types.ts';
import { confirmEdit, gridState, itemForm } from "../../$state$/GridState.ts";
import ItemEdit, {targetItem} from "../workspace/ItemEdit.vue";

//
import Workspace from '../workspace/Workspace.vue';
import components from './Components.ts';
import MakeView from './View.vue'

// @ts-ignore
import { subscribe } from '/externals/lib/object.js';

const props = defineProps<AppsType>();

// Initialize tasks ref from the tasksList (assuming tasksList is a Map or similar iterable)
const tasks = ref<any[]>(Array.from(props.tasksList.values()));

// Subscribe to changes
onMounted(() => {
    subscribe(props.tasksList, () => {
        tasks.value = Array.from(props.tasksList.values());
    });
});

function getComponent(task: any) {
    // If a matching component is registered, use it, otherwise fallback to MakeView.
    return components.get(task.args.type) || MakeView;
}

/*function handleOption(option) {
    console.log("Option clicked:", option);
}*/
</script>

<template>
    <!-- Workspace Icons -->
    <Workspace :items="gridState.items" :lists="gridState.lists" />

    <!-- UI-Scaled Layer -->
    <ui-orientbox id="ui-layer" class="ui-layer" orient="0" style="background-color: transparent;">
        <!-- Apps Part -->
        <template v-for="task in tasks" :key="task.id">
            <ui-frame :data-highlight="2" :data-chroma="0.1" data-scheme="solid" :id="task.id.replace('#', '')">
                <template #ui-title-bar>
                    <div style="justify-self: start; text-align: start; padding-inline: 1rem;">
                        {{ task.desc.label }}
                    </div>
                </template>
                <component :is="getComponent(task)" :id="task.id" :args="task.args" />
            </ui-frame>
        </template>

        <!-- Item Edit -->
        <ItemEdit :loadState="() => targetItem" :confirmState="confirmEdit" :form="() => itemForm" />

        <!-- Taskbar -->
        <ui-taskbar :tasks="tasks">
            <template v-for="task in tasks" :key="task.id">
                <ui-task :taskId="task.id" :desc="task.desc">
                    <ui-icon :icon="task.desc.icon" />
                </ui-task>
            </template>
        </ui-taskbar>

        <!-- Navbar (Mobile Only) -->
        <ui-navbar></ui-navbar>

        <!-- Context Menu Modal -->
        <ui-modal type="contextmenu" id="contextmenu"
            style="display: inline-grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);">
        </ui-modal>

        <ui-modal type="quick-settings">
            <!-- Верхний этаж: кнопки + переключатель -->
            <div class="settings-top">
                <ui-switch label="Theme" />
                <!--
                <button class="btn-option" @click="handleOption('option1')">Option 1</button>
                <button class="btn-option" @click="handleOption('option2')">Option 2</button>
                <button class="btn-option" @click="handleOption('option3')">Option 3</button>
                -->
            </div>

            <!-- Нижний этаж: ползунки -->
            <div class="settings-bottom">
                <!--<div class="slider-wrapper">
                    <label for="volume">Volume</label>
                    <input id="volume" type="range" min="0" max="100" v-model="volume" />
                </div>
                <div class="slider-wrapper">
                    <label for="brightness">Brightness</label>
                    <input id="brightness" type="range" min="0" max="100" v-model="brightness" />
                </div>-->
            </div>

            <!-- Дополнительный контент -->
            <div class="additional-content">
                <p>Additional settings or content...</p>
            </div>
        </ui-modal>

        <!-- Calendar Popup Modal -->
        <ui-modal type="popup" data-name="calendar">
            <ui-calendar></ui-calendar>
        </ui-modal>
    </ui-orientbox>


    <style scoped>
        /* Контейнер модального окна */
        ui-modal[type="quick-settings"] {
            /* базовые стили модального окна */
        }

        /* Верхний этаж: кнопки и переключатель в ряд */
        .settings-top {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            /* Добавьте свои layout стили и цвета */
        }

        /* Нижний этаж: ползунки в колонку */
        .settings-bottom {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin-top: 1rem;
            /* Добавьте свои layout стили и цвета */
        }

        .slider-wrapper {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
        }

        /* Дополнительный контент */
        .additional-content {
            margin-top: 1rem;
            text-align: center;
            /* Добавьте свои layout стили и цвета */
        }

        /* Стили для кнопок */
        .btn-option {
            padding: 0.5rem 1rem;
            border: none;
            cursor: pointer;
            /* Добавьте свои стили и цвета */
        }
    </style>

</template>
