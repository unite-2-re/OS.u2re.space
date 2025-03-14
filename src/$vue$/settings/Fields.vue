<script lang="ts" setup>
import { defineComponent, h } from "vue";

interface FormInput {
    icon: string;
    label: string;
    render: any;
}

interface FormSection {
    label: string;
    inputs: FormInput[];
}

// Appearance input component
const AppearanceComponent = defineComponent({
    name: "AppearanceComponent",
    setup() {
        return () =>
            h(
                "ui-switch",
                {
                    "data-name": "theme",
                    style: { "--max-value": "2" },
                },
                {
                    icon: () => h("ui-icon", { icon: "sun-moon" }),
                    default: () => [
                        h("input", {
                            type: "radio",
                            label: " ",
                            placeholder: "Dark",
                            name: "theme",
                            value: "dark",
                        }),
                        h("input", {
                            type: "radio",
                            label: " ",
                            placeholder: "Default",
                            name: "theme",
                            value: "default",
                        }),
                        h("input", {
                            type: "radio",
                            label: " ",
                            placeholder: "Light",
                            name: "theme",
                            value: "light",
                        }),
                    ],
                }
            );
    },
});

// Columns input component under Workspace
const WorkspaceColumnsComponent = defineComponent({
    name: "WorkspaceColumnsComponent",
    setup() {
        return () =>
            h(
                "ui-number",
                {},
                {
                    default: () => [
                        h("span", { slot: "icon", class: "ui-indicator" }),
                        h("input", {
                            type: "number",
                            inputmode: "numeric",
                            pattern: "[0-9]*",
                            size: "5",
                            label: " ",
                            placeholder: "Columns",
                            name: "columns",
                            value: 4,
                            min: 4,
                            max: 6,
                            step: 1,
                        }),
                    ],
                }
            );
    },
});

// Rows input component under Workspace
const WorkspaceRowsComponent = defineComponent({
    name: "WorkspaceRowsComponent",
    setup() {
        return () =>
            h(
                "ui-number",
                {},
                {
                    default: () => [
                        h("span", { slot: "icon", class: "ui-indicator" }),
                        h("input", {
                            type: "number",
                            inputmode: "numeric",
                            pattern: "[0-9]*",
                            size: "5",
                            label: " ",
                            placeholder: "Rows",
                            name: "rows",
                            value: 8,
                            min: 8,
                            max: 12,
                            step: 1,
                        }),
                    ],
                }
            );
    },
});

// Forms data
const forms: FormSection[] = [
    {
        label: "Appearance",
        inputs: [
            {
                icon: "sun-moon",
                label: "Theme:",
                render: AppearanceComponent,
            },
        ],
    },
    {
        label: "Workspace",
        inputs: [
            {
                icon: "columns-3",
                label: "Columns:",
                render: WorkspaceColumnsComponent,
            },
            {
                icon: "rows-3",
                label: "Rows:",
                render: WorkspaceRowsComponent,
            },
        ],
    },
];
</script>

<style scoped>
.settings-form {
    padding: 1rem;
    font-family: sans-serif;
}

.settings-section {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #ccc;
    padding-bottom: 1rem;
}

.settings-input {
    margin: 0.5rem 0;
}
</style>


<!-- SettingsForm.vue -->
<template>
    <div class="settings-form">
        <section v-for="section in forms" :key="section.label" class="settings-section">
            <h2>{{ section.label }}</h2>
            <div v-for="input in section.inputs" :key="input.label" class="settings-input">
                <!-- Render the input component -->
                <component :is="input.render" />
            </div>
        </section>
    </div>
</template>

<!-- Дополнительно можно раскинуть следующие фрагменты в отдельные файлы Vue:
  • AppearanceComponent.vue
  • WorkspaceColumnsComponent.vue
  • WorkspaceRowsComponent.vue
и импортировать их в SettingsForm.vue -->
