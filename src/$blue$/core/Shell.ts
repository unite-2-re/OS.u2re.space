import { gridState } from "../../$state$/GridState";
import Workspace from "../workspace/Workspace";
import {E, M, computed, remap} from "/externals/lib/blue.js"

//
import Manager from "../manager/Manager.ts";
import Settings from "../settings/Settings.ts";

//
export const components: Map<string, any> = new Map<string, any>([
    ["manager", Manager],
    ["settings", Settings]
]);

//
export default (tasks: any)=>{
    let taskproc: any;
    let taskbar: any;

    // TODO! Aggregate Set into observable arrays
    const taskList = remap(tasks, ()=>{
        const tp = {"tasks": Array.from(tasks.values())};
        requestAnimationFrame(()=>{ taskbar.reform(); taskproc.reform(); }); return tp;
    });

    console.log(taskList.tasks);

    //
    return E(":fragment:", {}, [
        Workspace(gridState),
        E("ui-orientbox#ui-layer.ui-layer", {attribute: {orient: 0, }, style: {backgroundColor: "transparent"}}, [
            //! we can't reactive contents without container element
            taskproc = E("div", {style: "display: contents !important; background-color: transparent !important;"}, [()=>M(taskList.tasks, (task: any)=>E("ui-frame", {dataset: {highlight: 2, chroma: 0.1, scheme: "solid", id: task?.taskId.replace("#", "") }}, [
                E("div", {style: "justify-self: start; text-align: start; padding=inline: 1rem", slot: "ui-title-bar"}, [task?.desc?.label]),
                components.get(task?.args?.type)?.(task),
            ]))]),
            taskbar = E("ui-taskbar", {properties: tasks}, [()=>M(taskList.tasks, (task)=>E("ui-task", {properties: task, dataset: {id: task.taskId}}, [E("ui-icon", {attributes: task.desc})]))]),
            E("ui-navbar", {}, []),
            E("ui-modal#contextmenu", {attributes: {type: "contextmenu"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, []),
            E("ui-modal", {attributes: {type: "modal"}, dataset: {name: "calendar"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, [
                E("ui-calendar", {}, [])
            ])
        ])
    ]);
}
