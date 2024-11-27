// @ts-ignore
import { For, createSignal, onMount, lazy } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

//
export const Form = ({form}: {form: ()=>any}) => {
    return html`<form>
        <${For} each=${() => form().inputs}>${(input) => {
            return html`<${input?.component} input=${input}><//>`;
        }}<//>
    </form>`;
};

//
export default Form;
