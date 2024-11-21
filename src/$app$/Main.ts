// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";
import { lazy } from "solid-js";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";
import Icons from "./Icons.ts";

// @ts-ignore
import {makeSelection} from /* @vite-ignore */ "/externals/lib/interact.js";


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
        makeSelection(topLevel, "ui-shaped");
    });

    //
    return html`<div id="application" ref=${$element} style="inline-size: 100%; block-size: 100%; position: fixed; inset: 0px; place-self: center; display: flex; pointer-events: auto; background: transparent; overflow: hidden;">
        <!-- Workspace Icons -->
        <${Icons}><//>

        <!-- Apps Part -->
        <${For} each=${() => apps}>${(app) => {
            return html`<ui-frame id=${app?.id.replace("#","")}> <div slot="ui-title-bar">${app?.title}</div>  <${lazy(app?.component)}><//>  </ui-frame>`;
        }}<//>

        <!-- Taskbar -->
        <ui-taskbar prop:tasks=${apps}>

            <${For} each=${() => apps}>${(app) => {
                return html`<ui-task prop:taskId=${app?.id} icon=${app?.icon}> <ui-icon icon=${app?.icon}></ui-icon> </ui-task>`;
            }}<//>

        </ui-taskbar>

        <!-- Navbar (Mobile Only) -->
        <ui-navbar></ui-navbar>

    </div>`;
};

//
export default Apps;
