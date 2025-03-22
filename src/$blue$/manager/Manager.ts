//
import { uploadFile, downloadFile, dropFile, removeFile } from "../../$core$/file/FileOps.ts";
import { FileManagment } from "../../$core$/file/FileManage.ts";
import type { Task } from "../../$core$/Types";

//
import { subscribe } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";
import {E, M, H, observableByMap} from "/externals/lib/blue.js"

//
export default (task: Task, )=>{
    const manager = new FileManagment(task.args);
    manager.navigate(task.args?.directory || "/user/images/");
    const current = manager.getCurrent();

    //
    const bindContent = (ct)=>{
        const content = ct.element;
        FileManagment.bindManager(content, manager);
        synchronizeInputs(task.args, ".u2-input", content, subscribe);
        return content;
    }

    //
    const bindInput = (input)=>{
        input.addEventListener("change", (ev)=>{ manager.navigate(ev.target.value || FileManagment.fileOf(content.value), ev)});
        return input;
    }

    //
    const handleAddClick = (_: Event) => { uploadFile(manager.currentDir(), current); };
    const handleDownloadClick = (_: Event) => { downloadFile(FileManagment.fileOf(content.value)); };
    const handleDeleteClick = (_: Event) => { removeFile(FileManagment.fileOf(content.value), current); };
    const goDirectory = (_: Event) => { manager.navigate(manager.currentDir()); };
    const handlePlayClick = (_: Event) => { manager.navigate(FileManagment.fileOf(content.value)); };
    //const handleTabChange = (ev: Event, _: string) => { currentTab.value = (ev.target as HTMLInputElement).value; };
    const dragOverHandle = (ev: DragEvent) => { ev.preventDefault(); };
    const navigateFile = (ev: Event, _: string) => { manager.navigate((ev?.target as any)?.value || FileManagment.fileOf(content.value), ev); };
    const getFilename = (path: string) => { const parts = path.split("/"); return parts.at(-1) || parts.at(-2) || path; };

    //
    const dropHandle = (ev: DragEvent) => {
        ev.preventDefault();
        const file = ev.dataTransfer?.files?.[0];
        if (file) {
            dropFile(file, manager.currentDir(), current);
        }
    };

    //
    let list: any;

    //
    const content = bindContent(E("div" + (task.taskId || "#manager") + ".ui-content", {
        dataset: {highlight: 0, alpha: 0, scheme: "solid"},
    }, [
        E("div.adl-toolbar", {dataset: {highlight: 0, chroma: 0}}, [
            E("button.adl-file-add", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleAddClick])}}, [H(`<ui-icon icon="file-up" />`)]),
            E("button.adl-file-get", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleDownloadClick])}}, [H(`<ui-icon icon="file-down" />`)]),
            E("button.adl-file-del", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleDeleteClick])}}, [H(`<ui-icon icon="file-x" />`)]),
            E("ui-longtext.adl-space.u2-input", {attributes: {tabindex: -1, type: "button"}, dataset: {highlight: 1, name: "directory"}}, [
                bindInput(H(`<input type="text" name="directory" placeholder="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" />`))
            ]),
            E("button.adl-dir-go" , {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([goDirectory])}}, [H(`<ui-icon icon="step-forward" />`)]),
            E("button.adl-dir-use", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handlePlayClick])}}, [H(`<ui-icon icon="image-play" />`)]),
        ]),
        E("div.adl-main", {dataset: {alpha: 0, chroma: 0, scheme: "solid"}}, [
            E("ui-scrollbox.adl-tab-box", {dataset: {scheme: "solid", alpha: 1, highlight: 0.5, chroma: 0.01}}),
            E("ui-scrollbox.adl-content-box", {dataset: {scheme: "solid", alpha: 1}}, [
                list = E("div.adl-content", {on: {drop: new Set([dropHandle]), dragover: new Set([dragOverHandle])}}, M(observableByMap(current), (entry)=>{
                    return E("ui-select-row", {
                        attributes: { href: "#", name: "file", draggable: true},
                        properties: { value: entry[0] },
                        style: "-webkit-user-drag: element; -moz-user-drag: element;",
                        on: {
                            click: new Set([(ev)=>navigateFile(ev, entry[0])]),
                            dblclick: new Set([(ev)=>navigateFile(ev, entry[0])])
                        }
                    }, [
                        E("ui-icon", {properties: {icon: manager.byType(entry[0]), inert: true}}),
                        E("span", {properties: {inert: true}}, [getFilename(entry[0]||"")]),
                        E("span", {properties: {inert: true}}, [entry[1]?.lastModified
                            ? new Date(entry[1]?.lastModified).toLocaleString()
                            : entry[0]?.startsWith("..") ? "" : "N/A"])
                    ])
                }))
            ]),
        ])
    ]));
    return content;
}
