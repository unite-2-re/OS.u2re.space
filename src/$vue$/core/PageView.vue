<script lang="ts" setup>
import { computed, defineProps } from "vue";

const props = defineProps<{
    args: any,
    id: string
}>();

const cleanedId = computed(()=>{
    return props.id.replace("#", "");
});
</script>

<style scoped></style>

<template>
    <div :id="cleanedId" class="ui-content">
        <div class="adl-main">
            <div class="adl-content-box">
                <iframe referrerpolicy="no-referrer" width="100%" height="100%" frameborder="0"
                    style="border:none; inline-size:100%; block-size:100%; pointer-events:auto;"
                    allowtransparency="true" scrolling="auto" :src="args?.href" loading="eager" seamless
                    sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms"
                    allowfullscreen credentialless allow="*"></iframe>
            </div>
        </div>
    </div>
</template>
