// @ts-ignore
import { For, createSignal, onMount, lazy } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

// @ts-ignore
import {makeSelection} from "/externals/lib/interact.js";

//
import type { AppsType } from "@src/$core$/Types";
import Items from "./workspace/Items";
import { getItem, gridState, targetItem } from "../$state$/GridState";
import { refAndMount } from "@src/$core$/Utils";
import ItemEdit from "./workspace/ItemEdit.tsx";

// while: tab.component should be  ()=> html`...`
export const Workspace = ({tasks}: AppsType) => {
    const $element = refAndMount((topLevel)=> {
        //makeSelection(topLevel, "ui-shaped");
    });

    //
    return html`<div id="root" ref=${$element} style="inline-size: 100%; block-size: 100%; position: fixed; inset: 0px; place-self: center; display: flex; pointer-events: auto; background: transparent; overflow: hidden;">
        <!-- Workspace Icons -->
        <${Items} items=${()=>gridState.items} lists=${()=>gridState.lists}><//>

        <!-- Apps Part -->
        <${For} each=${() => tasks}>${(task) => {
            return html`<ui-frame data-scheme="solid" id=${task?.id.replace("#","")}> <div slot="ui-title-bar">${task?.title}</div>  <${lazy(task?.component)}><//>  </ui-frame>`;
        }}<//>

        <!-- -->
        <${ItemEdit}
            loadState=${()=>(targetItem)}
            confirmState=${(state)=>Object.assign(getItem(state?.id)||{}, state)}
        ><//>

        <!-- Taskbar -->
        <ui-taskbar prop:tasks=${tasks}>

            <${For} each=${() => tasks}>${(task) => {
                return html`<ui-task prop:taskId=${task?.id} icon=${task?.icon}> <ui-icon icon=${task?.icon}></ui-icon> </ui-task>`;
            }}<//>

        </ui-taskbar>

        <!-- Navbar (Mobile Only) -->
        <ui-navbar></ui-navbar>

    </div>`;
};

//
export default Workspace;
