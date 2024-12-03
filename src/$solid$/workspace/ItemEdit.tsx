// @ts-ignore
import { For, createSignal, createComputed, onMount, lazy } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// @ts-ignore
import { observeAttribute, synchronizeInputs } from "/externals/lib/dom.js";
import { refAndMount } from "@src/$core$/Utils.ts";

//
const fields = ["label", "icon", "href", "action", "id"];
export const stateOnEdit = makeObjectAssignable(makeReactive({
    id: "",
    label: "",
    icon: "",
    href: "",
    action: ""
}));

//
document.documentElement.addEventListener("click", (ev)=>{
    const element = ev?.target as HTMLElement;
    const selector = ".adl-modal, .u2-input, input, ui-contextmenu";
    const modals = document.querySelectorAll(".adl-modal:not([data-hidden])");
    if (!(element.matches(selector) || element.closest(selector))) {
        modals.forEach((m)=>m?.setAttribute?.("data-hidden", ""));
    }
});

//
export const ItemEdit = ({
    loadState, // loader from state manager (load for id)
    confirmState, // uploader to state manager (set by id)
    form // forms of editor
}: {
    loadState: ()=>any,
    confirmState: (S: any, KV?: [any, any])=>any,
    form: any
}) => {
    //
    const $content = refAndMount((topLevel)=> {
        synchronizeInputs(stateOnEdit, ".u2-input", topLevel, subscribe);
        subscribe(stateOnEdit, (value, prop)=>confirmState(stateOnEdit, [value, prop]));
    });

    // when changing target, set another field values
    createComputed(()=>{
        const state = loadState?.();
        if (state) {
            for (const k of fields) {
                if (stateOnEdit[k] != state?.[k]) { stateOnEdit[k] = state?.[k] || ""; };
            }
        }
    });

    //
    const $modal = refAndMount((topLevel)=> {
    });

    //data-hidden
    return html`<div ref=${$modal} data-hidden class="adl-modal" data-scheme="solid" data-highlight="8">
        <form class="adl-item-edit" ref=${$content}>
            <${For} each=${() => form}>${(input) => { return html`<label>
                <div class="adl-label">${input?.label}</div>
                <div class="adl-input" data-scheme="solid" data-alpha="0" data-highlight="2"><${input?.component} input=${()=>input}><//></div>
            </label>`;}}<//>
        </form>
        <div class="adl-buttons">
            <!-- TODO! support for l18n -->
            <button class="adl-delete" data-scheme="inverse" data-chroma="0.05"> Delete </button>
            <button class="adl-confirm" data-scheme="inverse" data-chroma="0.05"> Confirm </button>
        </div>
    </div>`;
};

//
export default ItemEdit;
