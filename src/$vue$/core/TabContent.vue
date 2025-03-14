<script setup lang="ts">
import { computed, defineProps } from 'vue';
interface TabType { id: string; }
const props = defineProps<{tab: TabType | null}>();
const tabId = computed(() => props.tab?.id);
</script>

<template><div class="adl-content" :data-tab="tabId"><slot /></div></template>
