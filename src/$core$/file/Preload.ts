import { observeBySelector } from "/externals/lib/dom.js";

//
import { useAsWallpaper } from "./FileAction.ts";

//
export const loadFromStorage = async ()=>{
    const item = localStorage.getItem("@wallpaper");
    if (item) { useAsWallpaper(item); }
}

//
export const preload = ()=>{
    addEventListener("storage", (ev)=>{
        if (ev?.key == "@wallpaper") {
            if (ev?.newValue) { useAsWallpaper(ev?.newValue || ""); }
        }
    });

    //
    requestIdleCallback(()=>{
        loadFromStorage();
    });

    //
    observeBySelector(document.documentElement, "canvas[is=\"ui-canvas\"]", (mut)=>{
        loadFromStorage();
    });

}

//
export default preload;
