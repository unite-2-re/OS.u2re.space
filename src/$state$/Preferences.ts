// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable, safe } from "/externals/lib/object.js";
import {JSOX} from "jsox";

// @ts-ignore
import { observeBySelector } from "/externals/lib/dom.js";

//
export const preferences = makeObjectAssignable(makeReactive({
    scaling: 1,
    columns: 4,
    rows: 8,
    theme: "default"
}));

//
Object.assign(preferences, JSOX.parse(localStorage.getItem("@settings") || "{}"));

//
export const saveToStorage = (ev?: any)=>{
    localStorage.setItem("@settings", JSOX.stringify(safe(preferences)));
}

//
document.addEventListener("visibilitychange", (ev)=>{
    if (document.visibilityState === "hidden") {
        saveToStorage(ev);
    }
});

//
const setIdleInterval = (cb, timeout = 1000, ...args)=>{
    requestIdleCallback(async ()=>{
        if (!cb || (typeof cb != "function")) return;
        while (true) {
            await Promise.try(cb, ...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r, {timeout: 100}));
            await new Promise((r)=>requestAnimationFrame(r));
        }
    }, {timeout: 1000});
}

//
setIdleInterval(saveToStorage, 6000);

//
addEventListener("beforeunload", saveToStorage);
addEventListener("pagehide", saveToStorage);
addEventListener("storage", (ev)=>{
    if (ev.storageArea == localStorage) {
        if (ev.key == "@settings") { Object.assign(preferences, JSOX.parse(ev.newValue || "{}")); };
    }
});

//
subscribe(preferences, (value, prop)=>{
    const grids = document.querySelectorAll(".u2-desktop-grid .u2-grid-page") as unknown as HTMLElement[];
    if (prop == "columns") { grids.forEach((target: HTMLElement)=>target.style.setProperty("--layout-c", "" + (value||4))); };
    if (prop == "rows") { grids.forEach((target: HTMLElement)=>target.style.setProperty("--layout-r", "" + (value||8))); };
    if (prop == "theme") { document.documentElement.dispatchEvent(new CustomEvent("u2-theme-change", { bubbles: true, detail: {} })); document.documentElement.setAttribute("data-theme", "" + (value||"default")); };
});

//
observeBySelector(document.documentElement, ".u2-desktop-grid .u2-grid-page", (mutations)=>{
    mutations.addedNodes.forEach((target)=>{
        target.style.setProperty("--layout-c", "" + (preferences.columns||4));
        target.style.setProperty("--layout-r", "" + (preferences.rows||8));
    });
});
