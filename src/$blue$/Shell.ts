// @ts-ignore
import {E, H, M } from "/externals/modules/blue.js"

//
import { confirmEdit, itemForm, workspace } from "../$core$/state/GridState.ts";

//
import Workspace from "./workspace/Workspace.ts";
import ItemEdit  from "./modals/ItemEdit.ts";

//
import Manager  from "./views/manager/Manager.ts";
import Settings from "./views/settings/Settings.ts";

//
import { QuickSettings } from "./modals/QuickSettings.ts";
import { AppMenu } from "./modals/AppMenu.ts";

//
export const viewable  = (task)=>{ return H(`<div id="${task?.taskId?.replace?.("#", "")}" class="ui-content"><div class="adl-main"><div class="adl-content-box"><iframe referrerpolicy="no-referrer" width="100%" height="100%" frameBorder="0" allowtransparency scrolling seamless credentialless style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;" src="${task?.args?.href}" loading="eager" allowfullscreen allow="*"></iframe></div></div></div>`); }
export const imageView = (task)=>{
    return H(`<div id="${task?.taskId?.replace?.("#", "")}" class="ui-content"><div class="adl-main"><div class="adl-content-box">
        <img src="${task?.args?.src || task?.args?.href || ""}" alt="Image View" style="inline-size: 100%; block-size: 100%; object-fit: cover; object-position: center; background-color: transparent; image-rendering: auto; image-rendering: smooth;"/>
    </div></div></div>`);
}

//
export const markdownView = (task)=>{
    const iframe = H(`<iframe referrerpolicy="no-referrer" width="100%" height="100%" frameBorder="0" allowtransparency scrolling seamless credentialless style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;" loading="eager" allowfullscreen allow="*" src="./apps/mdv/index.html"></iframe>`) as HTMLIFrameElement;
    if (iframe) { iframe.addEventListener("load", ()=>{
        iframe?.contentWindow?.postMessage({src: (URL.canParse(task?.args?.href||"") ? task?.args?.href : new URL(task?.args?.href||"", import.meta.url).href)||""}, "/", []);
    }); };
    return E("div.ui-content" + task?.taskId, {}, [ E("div.adl-main", {}, [ E("div.adl-content-box", {}, [ iframe ]) ]) ]);
}

//
export const components: Map<string, any> = new Map<string, any>([
    ["manager", Manager],
    ["settings", Settings],
    ["image", imageView],
    ["iframe", viewable],
    ["markdown", markdownView]
]);

//
export default (tasks: any)=>{
    return E(":fragment:", {}, [
        Workspace(workspace.gridState),
        E("ui-orientbox#ui-layer.ui-layer", {attribute: {orient: 0, }, style: {backgroundColor: "transparent"}}, [
            E("ui-taskbar", {properties: {tasks}}, M(tasks, (task)=>E("ui-task", {properties: task, dataset: {id: task?.taskId}}, [E("ui-icon", {attributes: task?.desc})]))),

            //! we can't reactive contents without container element
            E("div", {style: "display: contents !important; background-color: transparent !important;"}, M(tasks, (task: any)=>{
                return E("ui-frame", {dataset: {hidden: "", highlight: 2, chroma: 0.1, scheme: "solid", id: task?.taskId.replace("#", "") }}, [
                    E("div", {style: "justify-self: start; text-align: start; padding=inline: 1rem", slot: "ui-title-bar"}, [task?.desc?.label||""]),
                    (components.get(task?.args?.type) || viewable)?.(task),
                ])
            })),

            //
            E("ui-navbar", {}, []),
            E("ui-modal#contextmenu", {attributes: {type: "contextmenu"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, []),
            E("ui-modal", {attributes: {type: "popup"}, dataset: {name: "calendar"}}, [
                E("ui-calendar", {}, [])
            ]),

            //
            ItemEdit(workspace, confirmEdit, itemForm),
            QuickSettings(),
            AppMenu()
        ])
    ]);
}
