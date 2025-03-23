import { UIState } from "../../$core$/state/UIState.ts";

//
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";
import { E, H, M } from "/externals/lib/blue.js";

//
const fields = ["label", "icon", "href", "action", "id"];
const fieldTypes = new Map([
    ["text", (input: any) => H(`<ui-longtext data-scheme="solid" data-alpha="0" data-chroma="0.01" data-highlight="3" data-highlight-hover="1" class="u2-input" data-name=${input?.name}><input value="" placeholder=${input?.name} name=${input?.name} type="text" label="test" placeholder="test-longtext" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no"/></ui-longtext>`)],
    ["action-list", (input: any) => H(`<ui-button data-scheme="solid" data-alpha="0" data-chroma="0.01" data-highlight="3" data-highlight-hover="1" class="u2-input" data-name=${input?.name} style="block-size: 2rem;">
    <ui-button-row data-highlight-hover="2" data-alpha="0" data-value="open-link"> <ui-icon icon="external-link"></ui-icon> <span>Open Link</span> </ui-button-row>
    <ui-button-row data-highlight-hover="2" data-alpha="0" data-value="open-in-frame"> <ui-icon icon="app-window"></ui-icon> <span>Open in Frame</span> </ui-button-row>
    <ui-button-row data-highlight-hover="2" data-alpha="0" data-value="manager"> <ui-icon icon="folder"></ui-icon> <span>Explore</span> </ui-button-row>
    <ui-button-row data-highlight-hover="2" data-alpha="0" data-value="settings"> <ui-icon icon="settings"></ui-icon> <span>Settings</span> </ui-button-row>
    <ui-button-row data-highlight-hover="2" data-alpha="0" data-value="use-as-wallpaper"> <ui-icon icon="wallpaper"></ui-icon> <span>Use as Wallpaper</span> </ui-button-row>
    <ui-button-row data-highlight-hover="2" data-alpha="0" data-value="copy-link"> <ui-icon icon="copy-minus"></ui-icon> <span>Copy Link</span> </ui-button-row>
</ui-button>`)]
]);

//
export const stateOnEdit = makeObjectAssignable(makeReactive({
    id: "",
    label: "",
    icon: "",
    href: "",
    action: ""
}));

//
export const ItemEdit = (
    workspace,
    confirmState, // uploader to state manager (set by id)
    form // forms of editor
) => {
    //
    const bindContent = (topLevel) => {
        synchronizeInputs(stateOnEdit, ".u2-input", topLevel.element, subscribe);
        return topLevel;
    };

    //
    subscribe([UIState, "currentItem"], (state)=>{
        for (const k of fields) {
            if (stateOnEdit[k] != state?.[k]) { stateOnEdit[k] = state?.[k] || ""; };
        }
    });

    //
    const confirm = (ev) => {
        const modal = ev?.target?.closest?.(".adl-modal");
        if (modal) {
            confirmState(workspace, stateOnEdit);
            modal.dataset.hidden = "";
        };
    };

    //
    const deleteA = (ev) => {
        const modal = ev?.target?.closest?.(".adl-modal");
        if (modal) {
            workspace.removeItem(stateOnEdit?.id);
            modal.dataset.hidden = "";
        };
    };

    //
    const content = E("ui-modal.adl-modal", { dataset: { hidden: true, alpha: 1, scheme: "solid" }}, [
        bindContent(E("form.adl-item-edit", {dataset: {alpha: 0, highlight: 0, }, style: "background-color: transparent;"}, M(form, (input)=>{
            return E("label", {style: "background-color: transparent;"}, [
                E("div.adl-label", { style: "background-color: transparent;" }, [input?.label]),
                E("div.adl-input", { style: "background-color: transparent;", dataset: {scheme: "solid", alpha: 0, highlight: 2} }, [ fieldTypes?.get(input?.type)?.(input) ]),
            ])
        }))),
        E("div.adl-buttons", {dataset: {alpha: 0, highlight: 0}, style: "background-color: transparent;"}, [
            E("button.adl-delete" , {dataset: {scheme: "inverse", chroma: 0.05}, on: {click: new Set([deleteA])}}, ["Delete"]),
            E("button.adl-confirm", {dataset: {scheme: "inverse", chroma: 0.05}, on: {click: new Set([confirm])}}, ["Confirm"]),
        ]),
    ]);
    return content;
};

//
export default ItemEdit;
