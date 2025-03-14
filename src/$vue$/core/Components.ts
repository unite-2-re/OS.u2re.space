// components.ts
import { DefineComponent } from "vue";
import Manager from "../manager/Manager.vue";
import Settings from "../settings/Settings.vue";

export const components: Map<string, DefineComponent> = new Map([
  ["manager", Manager],
  ["settings", Settings]
]);

export default components;
