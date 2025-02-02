// @ts-ignore /* @vite-ignore */
import { safe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";
import { JSOX } from "jsox";

//
export const defaultLists = [[/*"settings", "import", "export"*/]];
export const defaultItems = [
    /*{
        id: "github",
        icon: "github",
        label: "GitHub",
        //cell: [0, 0],
        href: "https://github.com/orgs/unite-2-re/repositories" // TODO: add github source code link
    },
    {
        id: "youtube",
        icon: "youtube",
        label: "(Unreleased)",
        //cell: [1, 0],
        href: "https://www.youtube.com/@MobileCenter-s5v"
    },*/
    /*{
        id: "settings",
        icon: "settings",
        label: "Settings",
        //cell: [2, 0],
        href: "#settings"
    },
    {
        id: "manager",
        icon: "folder-code",
        label: "Manager",
        //cell: [3, 0],
        href: "#manager"
    },
    {
        id: "import",
        icon: "upload",
        label: "Import Settings",
        //cell: [0, 1],
        href: "#import",
        action: "import-settings"
    },
    {
        id: "export",
        icon: "download",
        label: "Export Settings",
        //cell: [1, 1],
        href: "#export",
        action: "export-settings"
    }*/
]; // also, we thinking about "action:<id>" href type instead of "action" field, and "params" instead of "action"
// "open-link" works as "_blank" if external domain, and "_self" if internal domain or same origin

//
export const wrapItemToReactive = (item: any)=>{
    return makeObjectAssignable(makeReactive({
        ...item,
        cell: makeReactive(item?.cell || [0, 0])
    }));
}

//
export const unwrap = (items: any[]|Set<any>)=>{
    return safe(items);
}



//
export const mergeByKey = (items: any[]|Set<any>, key = "id")=>{
    const entries = Array.from(items?.values?.()).map((I)=>[I?.[key],I]);
    const map = new Map(entries as any);
    return Array.from(map?.values?.() || []);
}

//
export const gridState = makeObjectAssignable(makeReactive({
    items: makeObjectAssignable(makeReactive(new Set(mergeByKey([...defaultItems, ...Array.from(JSOX.parse(localStorage.getItem("grids@items") || "[]")?.values?.() || [])]).map((I)=>wrapItemToReactive(I))))),
    lists: makeObjectAssignable(makeReactive(new Set([...Array.from(JSOX.parse(localStorage.getItem("grids@lists") || JSOX.stringify(defaultLists))?.values?.() || defaultLists)])))
}));

//
export const saveToStorage = (ev?: any)=>{
    localStorage.setItem("grids@items", JSOX.stringify([...unwrap(gridState.items || [])]));
    localStorage.setItem("grids@lists", JSOX.stringify([...unwrap(gridState.lists || [])]));
}

//
const setIdleInterval = (cb, timeout, ...args)=>{
    requestIdleCallback(async ()=>{
        if (!cb || typeof cb != "function") return;
        while (true) {
            await Promise.try(cb, ...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r));
        }
    }, {timeout: 1000});
}

//
setIdleInterval(saveToStorage, 6000);

//
export const getItem = (id)=>{
    return Array.from(gridState.items.values()).find((item: any)=>(item?.id || item) == (id?.id || id));
}

//
export const addItem = (id, structure)=>{
    const item = wrapItemToReactive({
        ...structure, id: (id||structure?.id)
    });
    gridState.items.add(item);
    return item;
}

//
export const removeItem = (id)=>{
    const item = getItem(id);
    if (gridState.items?.has?.(item)) { gridState.items?.delete?.(item); };
    return item;
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
        if (ev.key == "grids@items") { gridState.items = mergeByKey([...defaultItems, ...Array.from(JSOX.parse(ev.newValue || "[]")?.values?.() || [])]).map((I)=>wrapItemToReactive(I)); };
        if (ev.key == "grids@lists") { gridState.lists = [...Array.from(JSOX.parse(ev.newValue || JSOX.stringify(defaultLists))?.values?.() || defaultLists)]; };
    }
});

//
defaultItems.forEach((item)=>{
    const exists = getItem(item?.id);
    if (exists) { Object.assign(exists, item); };
});
