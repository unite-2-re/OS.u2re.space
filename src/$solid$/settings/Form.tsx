// @ts-ignore
import { For, createSignal, onMount, lazy } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// @ts-ignore
import { observeAttribute, synchronizeInputs } from "/externals/lib/dom.js";
import { refAndMount } from "@src/$core$/Utils.ts";

//
export const state = makeObjectAssignable(makeReactive({}));
export const Form = ({form, tab}: {form: ()=>any, tab: ()=>any}) => {
    const $content = refAndMount((topLevel)=> {
        synchronizeInputs(state, ".u2-input", topLevel, subscribe);
    });

    // TODO: available by tab (' data-hidden="..." ')
    return html`<form ref=${$content}><${For} each=${() => form?.()?.inputs}>${(input) => {
        return html`<ui-block>
            <ui-icon icon=${()=>input?.icon} slot="icon"></ui-icon>
            <span>${()=>input?.label}</span>
            <${input?.component} input=${()=>input} slot="element"><//>
        </ui-block>`;
    }}<//></form>`;
};

//
export default Form;
