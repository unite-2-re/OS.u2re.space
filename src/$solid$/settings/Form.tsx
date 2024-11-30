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
export const Form = ({form}: {form: ()=>any}) => {
    const $content = refAndMount((topLevel)=> {
        synchronizeInputs(state, ".u2-input", topLevel, subscribe);
    });

    //
    return html`<form ref=${$content}>
        <${For} each=${() => form().inputs}>${(input) => {
            return html`<${input?.component} input=${input}><//>`;
        }}<//>
    </form>`;
};

//
export default Form;
