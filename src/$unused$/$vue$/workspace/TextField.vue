<script lang="ts" setup>
interface Input {name?: string}
const props = defineProps<{input?: Input}>();
</script>

<template>
<ui-longtext class="u2-input" :data-name="props?.input?.name">
    <input
        value=""
        :placeholder="props?.input?.name"
        :name="props?.input?.name"
        type="text"
        label="test"
        tabindex="0"
        draggable="false"
        autocomplete="off"
        class="u2-input"
        scroll="no"
    ></input>
</ui-longtext>
</template>
