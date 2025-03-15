<script setup lang="ts">
    const props = defineProps<{
        input: any
    }>();
</script>
<template>
    <ui-number>
        <span slot="icon" class="ui-indicator"></span>
        <input type="number" inputmode="numeric" pattern="[0-9]*" size="5" label=" " placeholder="Columns" name="columns" value="4" min="4" max="6" step="1"/>
    </ui-number>
</template>
