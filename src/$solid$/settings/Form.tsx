// @ts-ignore
import { For, createSignal, onMount, lazy } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// @ts-ignore
import { observeAttribute, synchronizeInputs } from "/externals/lib/dom.js";
import { refAndMount } from "@src/$core$/Utils.ts";
import { preferences } from "@src/$state$/Preferences.ts";

//
export const Form = ({form, tab}: {form: any, tab: ()=>any}) => {
    const $content = refAndMount((topLevel)=> {
        synchronizeInputs(preferences, ".u2-input", topLevel, subscribe);
    });

    // TODO: available by tab (' data-hidden="..." ')
    return html`<form data-alpha="1" data-scheme="solid" data-chroma="0.05" data-highlight="2" ref=${$content}>
    <span class="adl-form-label">${form?.label}</span>
    <${For} each=${() => form?.inputs}>${(input) => {
        return html`<ui-block>
            <ui-icon slot="icon" icon=${()=>input?.icon}></ui-icon>
            <span slot="label">${()=>input?.label}</span>
            <${input?.component} input=${()=>input} slot="element"><//>
        </ui-block>`;
    }}<//></form>`;
};

//
export default Form;
