// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

//
export interface TabType {
    component?: ()=>any;
    content: string;
    id: string;
};

//
export interface TabProps {
    tabs: TabType[];
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
export const Tabbed = ({tabs}: TabProps) => {
    const [currentTab, setTab] = createSignal("main");
    const $element = refAndMount((topLevel)=> {
        console.log(topLevel.querySelector("input"));
    });

    //
    return html`<div ref=${$element} data-tab=${currentTab} ref=${observe(["data-tab", logged(setTab)])}>
        <div>
            <${For} each=${() => tabs}>${(tab) => {
                return html`<label>
                    <span>${tab.content as string}</span>
                    <input type="radio" checked=${currentTab == tab.id} onChange=${(e)=>setTab(e.target.value)}></input>
                </label>`
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
