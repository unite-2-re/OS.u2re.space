<script setup lang="ts">
import { computed } from 'vue';

// Определите тип TabType в зависимости от структуры данных
interface TabType {
  id: string;
  // другие поля по необходимости
}

// Принимаем пропс tab, который является функцией, возвращающей значение типа TabType
const props = defineProps<{
  tab: () => TabType | null
}>();

// Вычисляем id вкладки, учитывая, что tab может вернуть null
const tabId = computed(() => props.tab()?.id);
</script>

<template>
  <div class="adl-content" :data-tab="tabId">
    <slot />
  </div>
</template>
