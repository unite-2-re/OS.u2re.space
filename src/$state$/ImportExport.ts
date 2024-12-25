import { gridState } from "@/src/$state$/GridState.ts";

// @ts-ignore /* @vite-ignore */
import {subscribe, makeReactive, makeObjectAssignable, safe } from "/externals/lib/object.js";
import {JSOX} from "jsox";

// Function to download data to a file
export const saveBinaryToFS = async (data, filename = "settings") => {
    const file = new Blob([data], {type: "plain/text"});
    if ("msSaveOrOpenBlob" in self.navigator) {
        // IE10+
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(file, filename);
    }

    //
    // @ts-ignore
    const fx = await (self?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                // @ts-ignore
                showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
                // @ts-ignore
                showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window),
                // @ts-ignore
            })
        )
        // @ts-ignore
        : import(/* @vite-ignore */ "/externals/polyfill/showOpenFilePicker.mjs"));

    // @ts-ignore
    if (window?.showSaveFilePicker) {
        // @ts-ignore
        const fileHandle = await self?.showSaveFilePicker?.({
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
    // @ts-ignore
    const fpc = await (self?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                // @ts-ignore
                showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
                // @ts-ignore
                showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window),
                // @ts-ignore
            })
        )
        // @ts-ignore
        : import(/* @vite-ignore */ "/externals/polyfill/showOpenFilePicker.mjs"));

    //
    let fileBlob = null;
    try {
        // @ts-ignore
        fileBlob = fpc
            .then((fx: any) =>
                // @ts-ignore
                (fx?.showOpenFilePicker ?? self?.showOpenFilePicker)({
                    types: [
                        {
                            description: "JSOX Encoded",
                            accept: {"text/plain": [".jsox"]},
                        },
                    ],
                })
            )
            .then(([handle] = []) => handle?.getFile?.())
            .then((blob) => {
                return blob.text();
            })
            .catch(console.warn.bind(console));
    } catch (e) {
        console.warn(e);
    }

    //
    return fileBlob;
};

//
export const exportSettings = () => {
    return JSOX.stringify({
        items: JSOX.stringify(safe(Array.from(gridState.items?.values?.() || []))),
        lists: JSOX.stringify(safe(Array.from(gridState.lists?.values?.() || [])))
    });
};

//
export const importSettings = (data) => {
    if (!data) return;
    const obj = JSOX.parse(data);
    gridState.items = obj?.items;
    gridState.lists = obj?.lists;
    return obj;
};
