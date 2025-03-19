<script lang="ts" setup>
import { ref, onMounted, defineProps } from "vue";

//
import type { ItemsType } from "../../$core$/Types";
import { createLabel, createShaped } from "../../$core$/Items.ts";
import { dropFile } from "../../$core$/FileOps.ts";
import { fileActions } from "../../$core$/FileAction";

//
import { fixOrientToScreen } from "/externals/core/agate.js";
import { inflectInGrid } from "/externals/core/grid.js";

//
const props = defineProps<ItemsType>();
const topElement = ref<HTMLElement | null>(null);
const labelsRef = ref<HTMLElement | null>(null);
const shapesRef = ref<HTMLElement | null>(null);

//
const dragOverHandle = (ev: DragEvent) => {
    ev.preventDefault();
};

//
const dropHandle = (ev: DragEvent) => {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0];
    if (file) {
        dropFile(file, "/user/temp/")?.then((path: any) => {
            if (path) {
                fileActions?.(path);
            }
        });
    }
};

//
onMounted(() => {
    if (topElement.value) {
        fixOrientToScreen(topElement.value);
    }
    const listItems: unknown = props?.lists?.[0] || [];
    if (labelsRef.value) {
        inflectInGrid(labelsRef.value, props?.items, listItems as any[], createLabel);
    }
    if (shapesRef.value) {
        inflectInGrid(shapesRef.value, props?.items, listItems as any[], createShaped);
    }
});
</script>

<template>
    <ui-orientbox :orient="0" ref="topElement" data-alpha="0" data-chroma="0" data-scheme="base" class="u2-desktop-grid"
        style="background-color: transparent; inset: 0px; inset-block-end: auto; pointer-events: auto; contain: none; overflow: visible; container-type: normal; touch-action: none;"
        @dragover="dragOverHandle" @drop="dropHandle">
        <ui-gridbox class="u2-grid-page" style="background-color: transparent; inline-size: 100%; block-size: 100%;" ref="labelsRef"></ui-gridbox>
        <ui-gridbox class="u2-grid-page" style="background-color: transparent; inline-size: 100%; block-size: 100%;" ref="shapesRef"></ui-gridbox>
    </ui-orientbox>
</template>
