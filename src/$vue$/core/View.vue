
<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  args: { href: string };
  id: string;
}

const props = defineProps<Props>();

const sanitizedId = computed(() => props.id?.replace("#", "") || "");

const iframeStyle = "border:none; inline-size:100%; block-size:100%; pointer-events:auto;";
</script>

<template>
  <div :id="sanitizedId" class="ui-content">
    <div class="adl-main">
      <div class="adl-content-box">
        <iframe
          referrerpolicy="no-referrer"
          width="100%"
          height="100%"
          frameBorder="0"
          :style="iframeStyle"
          allowtransparency="true"
          scrolling="auto"
          :src="args.href"
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
</template>
