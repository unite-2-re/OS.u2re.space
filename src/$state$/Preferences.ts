// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable, safe } from "/externals/lib/object.js";
import {JSOX} from "jsox";

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
addEventListener("beforeunload", saveToStorage);
addEventListener("pagehide", saveToStorage);
addEventListener("storage", (ev)=>{
    if (ev.storageArea == localStorage) {
        if (ev.key == "@settings") { Object.assign(preferences, JSOX.parse(ev.newValue || "{}")); };
    }
});
