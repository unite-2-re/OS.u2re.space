import { For, createSignal  } from "solid-js";
import html from "solid-js/html";

//
export interface TabType {
    component?: ()=>any;
    content: string;
    id: string;
};

// while: tab.component should be  ()=> html`...`
export const Tabbed = (tabs: TabType[]) => {
    const [currentTab, setTab] = createSignal("main");

    //
    return html`<div>
        <div>
            <${For} each=${() => tabs}>${(tab) => {
                return html`<div>
                    <span>${tab.content as string}</span>
                    <input checked=${currentTab == tab.id} onChange=${(e)=>setTab(e.target.value)}></input>
                </div>`
            }}<//>
        </div>
        <div>
            <${For} each=${() => tabs}>${(tab) => {
                // too deceptive :/
                return currentTab == tab.id ? tab?.component?.() : null;
            }}<//>
        </div>
    </div>`;
};

//
export default Tabbed;
