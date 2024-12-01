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

//
const textField = (inp)=> html`<ui-longtext class="u2-input" name=${()=>inp?.name}><input value="" placeholder=${()=>inp?.name} name=${()=>inp?.name} type="text"/></ui-longtext>`;
const itemForm  = [
    {
        name: "label",
        label: "Label",
        component: textField
    },
    {
        name: "icon",
        label: "IconID",
        component: textField
    },
    {
        name: "action",
        label: "Action",
        component: textField
    },
    {
        name: "href",
        label: "HREF",
        component: textField
    },
];

// while: tab.component should be  ()=> html`...`
export const Workspace = ({tasks}: AppsType) => {
    const $element = refAndMount((topLevel)=> {
        //makeSelection(topLevel, "ui-shaped");
    });

    //
    return html`<div id="root" ref=${$element}>
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
            form=${()=>itemForm}
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
