//
import { For, createSignal } from "solid-js";

//
import { subscribe } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";

//
import { hooked, observe, refAndMount } from "../core/Utils.tsx";
import { uploadFile, downloadFile, dropFile, removeFile } from "../../$core$/FileOps.ts";
import { FileManagment } from "../../$core$/FileManage.ts";
import { tabs } from "../settings/Fields.tsx";
import { $hideMenu } from "../../$ui$/Sidebar.ts";

// while: tab.component should be  ()=> html`...`
export const Manager = (task: { args: any, taskId: string }) => {
    //const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");

    //
    const manager = new FileManagment(task?.args);
    const current: any = manager.getCurrent();
    manager.navigate(task?.args?.directory || "/user/images/");

    //
    const [files, setFiles] = createSignal(current, { equals: false });
    subscribe(current, () => setFiles(current));

    // subscribe by args payload (if prop is directory, change it)
    subscribe(task?.args, (value, prop) => { if (prop == "directory") manager.navigate(value); });

    //
    let input = hooked();
    let content = hooked(null, (topLevel) => {
        FileManagment.bindManager(topLevel, manager);

        // when input changes opinion of directory, reflect it
        synchronizeInputs(task?.args, ".u2-input", topLevel, subscribe);
    });

    //
    //const cTab = createMemo(()=>tabOf(currentTab()));
    const $content = refAndMount((_) => {
        manager.navigate(manager.currentDir());
    });

    //
    const dragOverHandle = (ev) => {
        ev?.preventDefault?.();
    }

    //
    const dropHandle = (ev) => {
        ev?.preventDefault?.();
        const file = ev?.dataTransfer?.files?.[0];
        if (file) { dropFile(file, manager.currentDir(), current); };
    }

    //
    return (
        <div
            data-chroma="0"
            data-highlight="0"
            data-alpha="0"
            data-scheme="solid"
            class="ui-content"
            id={task?.taskId?.replace("#", "") || "manager"}
            data-tab={currentTab}
            ref={(el) => {
                content?.(el);
                observe?.(["data-tab", setTab])(el);
            }}
        >
            <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar">
                <button
                    data-highlight-hover="2"
                    type="button"
                    tabIndex={-1}
                    class="adl-file-add"
                    onClick={(ev) => uploadFile(manager.currentDir(), current)}
                >
                    <ui-icon icon="file-up" />
                </button>
                <button
                    data-highlight-hover="2"
                    type="button"
                    tabIndex={-1}
                    class="adl-file-get"
                    onClick={(ev) => downloadFile(FileManagment.fileOf(content))}
                >
                    <ui-icon icon="file-down" />
                </button>
                <button
                    data-highlight-hover="2"
                    type="button"
                    tabIndex={-1}
                    class="adl-file-del"
                    onClick={(ev) => removeFile(FileManagment.fileOf(content), current)}
                >
                    <ui-icon icon="file-x" />
                </button>
                <ui-longtext
                    data-highlight="1"
                    class="adl-space u2-input"
                    data-name="directory"
                >
                    <input
                        ref={input}
                        placeholder=""
                        name="directory"
                        type="text"
                        tabIndex={0}
                        draggable="false"
                        class="u2-input"
                        value="/user/images/"
                    />
                </ui-longtext>
                <button
                    data-highlight-hover="2"
                    type="button"
                    tabIndex={-1}
                    class="adl-dir-go"
                    onClick={(ev) => manager.navigate(manager.currentDir())}
                >
                    <ui-icon icon="step-forward" />
                </button>
                <button
                    data-highlight-hover="2"
                    type="button"
                    tabIndex={-1}
                    class="adl-file-use"
                    onClick={(ev) => manager.navigate(FileManagment.fileOf(content))}
                >
                    <ui-icon icon="image-play" />
                </button>
            </div>
            <div data-scheme="solid" data-alpha="0" class="adl-main">
                <ui-scrollbox
                    data-scheme="solid"
                    data-alpha="1"
                    data-highlight="0.5"
                    data-chroma="0.01"
                    class="adl-tab-box"
                >
                    <div class="adl-tabs" data-alpha="0">
                        <For each={tabs}>
                            {(tab) => (
                                <ui-select-row
                                    data-alpha="0"
                                    name="s-tab"
                                    onClick={() => $hideMenu(content)}
                                    onChange={(e) => setTab(e.target.value)}
                                    value={tab.id}
                                    checked={currentTab() === tab.id}
                                >
                                    <ui-icon icon={tab.icon} style="padding: 0.5rem;" />
                                    <span>{tab.content as string}</span>
                                </ui-select-row>
                            )}
                        </For>
                    </div>
                </ui-scrollbox>
                <ui-scrollbox
                    data-scheme="solid"
                    data-alpha="1"
                    class="adl-content-box"
                    ref={$content}
                >
                    <div
                        onDrop={dropHandle}
                        onDragOver={dragOverHandle}
                        class="adl-content"
                    >   {/* [path, file] */}
                        <For each={Array.from(files().entries() || [])}>{(E) => (
                            <ui-select-row
                                key={E?.[0]}
                                href="#"
                                onClick={(ev) =>
                                    manager.navigate(FileManagment.fileOf(content), ev)
                                }
                                onDblClick={(ev) =>
                                    manager.navigate(FileManagment.fileOf(content), ev)
                                }
                                name="file"
                                value={E?.[0]}
                                style="-webkit-user-drag: element; -moz-user-drag: element;"
                                draggable
                                prop:draggable={true}
                            >
                                <ui-icon inert icon={manager.byType(E?.[0])} />
                                <span inert>
                                    {E?.[0].split("/")?.at(-1) ||
                                        E?.[0].split("/")?.at(-2) ||
                                        E?.[0]}
                                </span>
                                <span inert>
                                    {E?.[1].lastModified
                                        ? new Date(E?.[1].lastModified).toLocaleString()
                                        : E?.[0].startsWith("..")
                                            ? ""
                                            : "N/A"}
                                </span>
                            </ui-select-row>
                        )}</For>
                    </div>
                </ui-scrollbox>
            </div>
        </div>
    );
};

//
export default Manager;
