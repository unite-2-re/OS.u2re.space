<template>
  <!-- Workspace Icons -->
  <Workspace :items="gridState.items" :lists="gridState.lists" />

  <!-- UI-Scaled Layer -->
  <ui-orientbox
    id="ui-layer"
    class="ui-layer"
    orient="0"
    style="background-color: transparent;"
  >
    <!-- Apps Part -->
    <template v-for="task in tasks" :key="task.id">
      <ui-frame
        :data-highlight="2"
        :data-chroma="0.1"
        data-scheme="solid"
        :id="task.id.replace('#', '')"
      >
        <!-- Используем слот для заголовка -->
        <div
          slot="ui-title-bar"
          style="justify-self: start; text-align: start; padding-inline: 1rem;"
        >
          {{ task.desc.label }}
        </div>

        <!-- Динамический рендер компонента: либо из components, либо дефолтный viewComponent -->
        <component
          :is="components.get(task.args?.type) || viewComponent"
          :id="task.id"
          :args="task.args"
        />
      </ui-frame>
    </template>

    <!-- ItemEdit -->
    <ItemEdit
      :loadState="() => targetItem"
      :confirmState="confirmEdit"
      :form="itemForm"
    />

    <!-- Taskbar -->
    <ui-taskbar :tasks="tasks">
      <template v-for="task in tasks" :key="task.id">
        <ui-task :taskId="task.id" :desc="task.desc">
          <ui-icon :icon="task.desc.icon" />
        </ui-task>
      </template>
    </ui-taskbar>

    <!-- Navbar (Mobile Only) -->
    <ui-navbar />

    <!-- Контекстное меню -->
    <ui-modal
      type="contextmenu"
      id="contextmenu"
      style="display: inline-grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"
    />

    <!-- Модальное окно для календаря -->
    <ui-modal type="popup" data-name="calendar">
      <ui-calendar />
    </ui-modal>
  </ui-orientbox>
</template>

<script>
import { ref, onBeforeUnmount, defineComponent } from "vue";

// Импортируем необходимые компоненты и состояния
import Workspace from "../workspace/Workspace.vue";
import ItemEdit, { targetItem } from "../workspace/ItemEdit.vue";
import components from "./Components";
import { confirmEdit, gridState, itemForm } from "../../$state$/GridState";

// Функция subscribe импортируется из внешней библиотеки
import { subscribe } from "/externals/lib/object.js";

// Дефолтный компонент для отображения iframe (Vue-версия makeView)
const viewComponent = defineComponent({
  name: "ViewComponent",
  props: {
    id: {
      type: String,
      required: true,
    },
    args: {
      type: Object,
      required: true,
    },
  },
  template: `
    <div :id="id.replace('#', '')" class="ui-content">
      <div class="adl-main">
        <div class="adl-content-box">
          <iframe 
            referrerpolicy="no-referrer" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;" 
            allowtransparency="true" 
            scrolling="auto"
            :src="args?.href"
            loading="eager" 
            seamless
            sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms" 
            allowfullscreen
            credentialless
            allow="*"
          ></iframe>
        </div>
      </div>
    </div>
  `,
});

export default defineComponent({
  name: "Shell",
  props: {
    // Передаётся tasksList, например, в виде Map или объекта, в зависимости от реализации
    tasksList: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // Инициализируем реактивное состояние tasks
    const tasks = ref(Array.from(props.tasksList.values()));

    // Подписываемся на обновления tasksList (функция subscribe должна вызывать колбэк при изменениях)
    // Если subscribe возвращает функцию отписки — вызываем её в onBeforeUnmount
    const unsubscribe = subscribe(props.tasksList, () => {
      tasks.value = Array.from(props.tasksList.values());
    });

    onBeforeUnmount(() => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });

    // Возвращаем все переменные для шаблона
    return {
      tasks,
      gridState,
      itemForm,
      confirmEdit,
      targetItem,
      components,
      viewComponent,
    };
  },
});
</script>

<style scoped>
/* Здесь можно добавить стили для компонента, если необходимо */
</style>
