// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";
import Icons from "./Icons.ts";

//
export interface AppType {
    component?: ()=>any;
    title: string;
    icon: string;
    id: string;
};

//
export interface AppsType {
    apps: AppType[];
}

//
const refAndMount = (cb)=>{
    return (element)=>{
        onMount(()=>cb(element));
    }
}

//
const observe = (val) => {
    return (el)=> {
        const [attr, setter] = val;
        observeAttribute(el, attr, (obs)=>setter(el.getAttribute(attr)));
    }
}

//
const logged = (fx)=>{
    return (...args)=>{
        console.log(...args);
        return fx(...args);
    }
}

// while: tab.component should be  ()=> html`...`
export const Apps = ({apps}: AppsType) => {
    const $element = refAndMount((topLevel)=> {

    });

    //
    return html`<div ref=${$element}>
        <${Icons}><//>

        <!-- Apps Part -->
        <${For} each=${() => apps}>${(app) => {
            return html`<ui-frame data-hidden id=${app?.id}> <div slot="ui-title-bar">${app?.title}</div>  ${app?.component}</ui-frame>`;
        }}<//>

        <!-- Taskbar -->
        <ui-taskbar>

            <${For} each=${() => apps}>${(app) => {
                return html`<ui-task data-id=${app?.id}> <ui-icon icon=${app?.icon}></ui-icon> </ui-task>`;
            }}<//>

        </ui-taskbar>

        <!-- Navbar (Mobile Only) -->
        <ui-navbar></ui-navbar>

    </div>`;
};

//
export default Apps;
