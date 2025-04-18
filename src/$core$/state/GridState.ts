// @ts-ignore /* @vite-ignore */
import type { ItemsType, ItemType, ShortcutType } from "../Types";
import { safe, makeReactive, makeObjectAssignable, objectAssign, UUIDv4 } from "/externals/lib/object.js";
import { JSOX } from "jsox";

//
import { cvt_cs_to_os, getBoundingOrientRect } from "/externals/core/agate.js";
import { convertOrientPxToCX, redirectCell } from "/externals/core/grid.js";
import { README_NAME } from "../file/FileAction";

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
export const defaultShortcuts = [
    {id: "manager", href: "#manager", action: "manager", icon: "folder", label: "File Manager"},
    {id: "icons", href: "https://lucide.dev/icons/", action: "open-in-frame", icon: "book-type", label: "Icons"},
    {id: "readme", href: README_NAME, action: "open-in-frame", icon: "notebook-text", label: "About"}
];

//
export const defaultItems = [
    {id: "readme"},
    {id: "manager"},
    {id: "icons"},
];

//
export class GridState {
    #gridState: ItemsType;
    #name: string = "workspace";

    //
    constructor(name?: string, shortcuts?: any) {
        const raw = JSOX.parse(localStorage.getItem(this.#name = name || "workspace") || "{items: [], shortcuts: []}");
        this.#gridState = makeObjectAssignable(makeReactive({
            layout: makeReactive(raw.layout || { columns: 4, rows: 8 }),
            shortcuts: shortcuts || makeObjectAssignable(makeReactive(new Set(mergeByKey([ ...defaultShortcuts, ...Array.from(raw.shortcuts)?.values?.() || []])?.map((I)=>wrapItemToReactive(I))))),
            items: makeObjectAssignable(makeReactive( new Set(mergeByKey([ ...defaultItems, ...Array.from(raw.items)?.values?.() ])?.map?.((I)=>wrapItemToReactive(I))))),
        }));

        //
        document.addEventListener("visibilitychange", (ev)=>{
            if (document.visibilityState === "hidden") {
                this.saveInStorage(ev);
            }
        });

        //
        addEventListener("beforeunload", (ev)=>this.saveInStorage(ev));
        addEventListener("pagehide", (ev)=>this.saveInStorage(ev));
        setIdleInterval(()=>this.saveInStorage(), 6000);

        //
        addEventListener("storage", (ev)=>{
            if (ev.storageArea == localStorage && ev.key == this.#name) {
                this.importState(JSOX.parse(ev?.newValue || "{items: [], shortcuts: []}"));
            }
        });
    }

    //
    importState(raw) {
        this.#gridState.layout    = makeReactive(raw.layout || { columns: 4, rows: 8 });
        this.#gridState.items     = mergeByKey([...defaultItems, ...Array.from(raw?.items?.values?.() || [])]).map((I) => wrapItemToReactive(I)) as unknown as Set<ItemType>;
        this.#gridState.shortcuts = mergeByKey([...defaultShortcuts, ...Array.from(raw?.shortcuts)?.values?.() || []]).map((I) => wrapItemToReactive(I)) as unknown as Set<ShortcutType>;
    }

    //
    get gridState(): ItemsType { return this.#gridState; };
    get layout() { return this.#gridState.layout; };

    //
    getItemRepresentation(id: any) {
        const item = unwrap(typeof id == "string" ? this.getItem(id) : id);
        const clon = {...item}; clon.id = UUIDv4();
        return JSOX.stringify(clon);
    }

    //
    importItem(jsox: any, event?) {
        const obj = typeof jsox == "string" ? JSOX.parse(jsox) : jsox;
        return this.addItem(obj.id, event, obj);
    }

    //
    getRawObject() {
        return {
            layout: safe(this.#gridState.layout),
            items: [...unwrap(this.#gridState.items || [])],
            shortcuts: [...unwrap(this.#gridState.shortcuts || [])],
        };
    }

    //
    getJSOX() {
        return JSOX.stringify(this.getRawObject());
    }

    //
    saveInStorage(ev?: any) {
        localStorage.setItem(this.#name, this.getJSOX());
        //localStorage.setItem("grids@lists", JSOX.stringify([...unwrap(gridState.lists || [])]));
    }

    //
    getItem(id: any) {
        return Array.from(this.#gridState.shortcuts.values()).find((item: any)=>(item?.id || item) == (id?.id || id));
    }

    //
    getCellByCoordinate(item: any, event?: any) {
        const screen = [event?.clientX || mouseCoord?.[0] || 0, event?.clientY || mouseCoord?.[1] || 0];
        const box  = document.querySelector(".u2-desktop-grid") as any;
        const grid = box?.querySelector?.("ui-gridbox");
        const size = [
            (box?.clientWidth  || innerWidth  || 0),
            (box?.clientHeight || innerHeight || 0)
        ];

        //
        const obs = getBoundingOrientRect(grid, box?.orient || 0);
        const oriented = cvt_cs_to_os(screen, size, box?.orient || 0);

        //
        const args = {
            size: [obs?.width || 0, obs?.height || 0],
            layout: [this.gridState.layout.columns || 4, this.#gridState.layout.rows || 8],
            items: this.#gridState.items,
            item
        };

        //
        const fl = convertOrientPxToCX([oriented[0] - obs.left, oriented[1] - obs.top], args);
        return redirectCell([Math.floor(fl[0]), Math.floor(fl[1])], args as any);
    }

    addItem(id, event?, structure: any = {}) {
        const exists = Array.from(this.#gridState.shortcuts.values()).find((t)=>(t?.id == id));
        if (exists) {
            objectAssign(exists, structure);
        } else {
            const shortcut = wrapItemToReactive({ ...structure, id: (id||structure?.id) });
            const item = wrapItemToReactive({ id: (id||structure?.id) });
            item.cell  = this.getCellByCoordinate(item, event);

            //
            this.#gridState.shortcuts.add(shortcut);
            this.#gridState.items.add(item);
            return shortcut;
        }
        return exists;
    }

    removeItem(id) {
        const item = Array.from(this.#gridState.items.values()).find((item: any)=>(item?.id || item) == (id?.id || id));
        const shortcut = Array.from(this.#gridState.shortcuts.values()).find((item: any)=>(item?.id || item) == (id?.id || id));

        //
        if (item && this.#gridState.items?.has?.(item)) { this.#gridState.items?.delete?.(item); };
        if (shortcut && this.#gridState.shortcuts?.has?.(shortcut)) { this.#gridState.shortcuts?.delete?.(shortcut); };

        //
        return shortcut;
    }
}

//
const mouseCoord = [0, 0];

//
document.addEventListener("mousemove", (ev)=>{
    mouseCoord[0] = ev?.clientX || 0;
    mouseCoord[1] = ev?.clientY || 0;
});

//
export const itemForm  = [
    {
        name: "label",
        label: "Label",
        type: "text"
    },
    {
        name: "icon",
        label: "IconID",
        type: "text"
    },
    {
        name: "action",
        label: "Action",
        //type: "text"
        type: "action-list"
    },
    {
        name: "href",
        label: "HREF",
        type: "text"
    },
];

//
export const confirmEdit = (grid, state, /*[_, k]*/p?: [any?, any?])=>{
    const item = grid?.getItem?.(state?.id)||{};
    if (state && item) {
        if (!p) {
            for (const F of itemForm) {
                const k = F.name;
                if (item[k] != state?.[k]) { item[k] = state?.[k] ?? item[k]; };
            }
        } else {
            const k = p?.[1]; if (item[k] != state?.[k]) { item[k] = state?.[k] ?? item[k]; };
        }
    }
};

//
export const workspace = new GridState("workspace");
