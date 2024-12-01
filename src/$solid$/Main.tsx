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
const textField = ({input}: {input?: any})=> html`<ui-longtext class="u2-input" data-name=${()=>input?.name}><input value="" placeholder=${()=>input?.name} name=${()=>input?.name} type="text" label="test" placeholder="test-longtext" tabindex="0" draggable="false" autocomplete="off" class="u2-input" virtualkeyboardpolicy="manual" scroll="no"/></ui-longtext>`;
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

//
const fields = ["label", "icon", "href", "action"];

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
            confirmState=${(state, [_, k])=>{
                const item = getItem(state?.id)||{};
                if (state && item) {
                    //for (const k of fields) {
                        if (item[k] != state?.[k]) { item[k] = state?.[k] || ""; };
                    //}
                }
            }}
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
