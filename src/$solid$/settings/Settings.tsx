// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

//
import Content from "../core/TabContent.tsx";
import Form from "./Form.tsx";

//
import { $hideMenu } from "../../$ui$/Sidebar.ts";
import { observe } from "../core/Utils.tsx";
import { forms, tabs } from "./Fields.tsx";

// while: tab.component should be  ()=> html`...`
export const Settings = () => {
    const tabOf = (tabId) => tabs.find((t) => (t?.id == tabId));
    const [currentTab, setTab] = createSignal("display");
    const cTab = createMemo(() => tabOf(currentTab()));

    //
    let content: any = null;
    const $content = (topLevel) => { content = topLevel; };

    //
    return (<div
        data-alpha="0"
        data-scheme="solid"
        class="ui-content"
        id="settings"
        data-tab={currentTab()}
        ref={(el) => {
            $content(el);
            observe(["data-tab", setTab])(el);
        }}
    >
        {/* TODO: support titlebar-inline menu button support */}
        <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar" />
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
            <ui-scrollbox data-scheme="solid" data-alpha="1" class="adl-content-box">
                <Content tab={cTab()}>
                    <For each={forms}>
                        {(form) => (<Form form={form} tab={cTab()} />)}
                    </For>
                </Content>
            </ui-scrollbox>
        </div>
    </div>);
};

//
export default Settings;
