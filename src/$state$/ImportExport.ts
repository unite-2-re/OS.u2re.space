import { gridState, mergeByKey, wrapItemToReactive } from "./GridState.ts";

// @ts-ignore /* @vite-ignore */
import { safe } from "/externals/lib/object.js";
import { JSOX } from "jsox";

// Function to download data to a file
export const saveBinaryToFS = async (data, filename = "settings") => {
    const ctx = window ?? self;
    const file = new Blob([data], {type: "plain/text"});
    if ("msSaveOrOpenBlob" in ctx.navigator) {
        // IE10+
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(file, filename);
    }

    // @ts-ignore
    if (ctx?.showSaveFilePicker) {
        // @ts-ignore
        const fileHandle = await ctx?.showSaveFilePicker?.({
                suggestedName: filename,
                types: [
                    {
                        description: "JSOX Encoded",
                        accept: {"text/plain": [".jsox"]},
                    },
                ],
            })
            ?.catch?.(console.warn.bind(console));
        const writableFileStream = await fileHandle
            ?.createWritable?.({ keepExistingData: true })
            ?.catch?.(console.warn.bind(console));
        await writableFileStream
            ?.write?.(file)
            ?.catch?.(console.warn.bind(console));
        await writableFileStream?.close()?.catch?.(console.warn.bind(console));
    } else {
        // Others
        let url = "";
        const a = document.createElement("a");
        a.href = url = URL.createObjectURL(file);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};

//
export const pickBinaryFromFS = async () => {
    const ctx = window ?? self;
    // @ts-ignore
    const fpc = await (ctx?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                // @ts-ignore
                showOpenFilePicker: ctx?.showOpenFilePicker?.bind?.(ctx),
                // @ts-ignore
                showSaveFilePicker: ctx?.showSaveFilePicker?.bind?.(ctx),
                // @ts-ignore
            })
        )
        // @ts-ignore
        : import(/* @vite-ignore */ "/externals/polyfill/showOpenFilePicker.mjs"));

    //
    const fx = await fpc; let fileBlob = null;
    try {
        // @ts-ignore
        fileBlob = (ctx?.showOpenFilePicker ?? fx?.showOpenFilePicker)?.({
            types: [{
                description: "JSOX Encoded",
                accept: {"text/plain": [".jsox"]},
            }],
        })?.then?.(([handle] = []) => handle?.getFile?.())?.then?.((blob) => blob?.text?.())?.catch?.(console.warn.bind(console));
    } catch (e) { console.warn(e); }

    //
    return fileBlob;
};

//
export const exportSettings = () => {
    return JSOX.stringify({
        shortcuts: [...safe(gridState.shortcuts || [])],
        items: [...safe(gridState.items || [])],
        lists: [...safe(gridState.lists || [])]
    });
};

//
export const importSettings = (data) => {
    if (!data) return;
    const obj = JSOX.parse(data);
    gridState.shortcuts = mergeByKey([...(obj.shortcuts || [])]).map((I)=>wrapItemToReactive(I));

    // TODO: deprecate items, lists, and use items-groups
    gridState.items = mergeByKey([...(obj.items || [])]).map((I)=>wrapItemToReactive(I));
    gridState.lists = [...(obj.lists || [])];
    return obj;
};
