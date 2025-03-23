// @ts-ignore
//import styles from "./Markdown.scss?inline&compress";
import { E } from "/externals/lib/blue.js";
import { marked } from "marked";

//
let currentFS = null;
export const useFS = ()=>{ return (currentFS ??= $useFS$()); };
export const provide = async (req = "", rw = false) => {
    const url = (req)?.url ?? req;
    const path = getDir(url?.replace?.(location.origin, "")?.trim?.());
    const fn   = url?.split("/")?.at?.(-1);

    //
    if (!URL.canParse(url) && path?.trim()?.startsWith?.("/user")) {
        const fs = await useFS();
        const $path = path?.replace?.("/user/", "")?.trim?.();
        const clean = (($path?.split?.("/") || [$path])?.filter?.((p)=>!!p?.trim?.()) || [""])?.join?.("/") || "";
        const npt = ((clean && clean != "/") ? "/" + clean + "/" : clean) || "/";

        //
        if (npt && npt != "/") { await fs?.mkdir?.(npt); };
        if (rw) {
            return {
                write(data) {
                    return fs?.writeFile?.(npt + fn, data);
                }
            }
        }

        //
        const handle = await fs?.readFile?.(npt + fn, {encoding: "blob"});

        //
        let file = null;
        try { file = handle?.unwrap?.() ?? handle; } catch(e) {};
        return file;
    } else {
        return fetch(req).then(async (r) => {
            const blob = await r.blob();
            const lastModified = Date.parse(r.headers.get("Last-Modified") || "") || 0;
            return new File([blob], url.substring(url.lastIndexOf('/') + 1), {
                type: blob.type,
                lastModified
            });
        });
    }
    return null;
};

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
export class MarkdownView extends HTMLElement {
    static observedAttributes = ["src"];

    //
    constructor() { super(); this.createShadowRoot(); }

    //
    #view;
    #themeStyle;

    //
    async setHTML(doc = "") {
        let once = false;
        const view = this.#view?.element;
        if ( view) view.innerHTML = (await doc) || view.innerHTML;
        if (!once) document.dispatchEvent(new CustomEvent("ext-ready", {}));
        once = true;
    }

    //
    renderMarkdown(file) {
        if (typeof file == "string") {
            this.setHTML(marked(file));
        } else
        if (file instanceof File || file instanceof Blob || file instanceof Response) {
            file?.text()?.then?.((doc)=>this.setHTML(marked(doc)));
        }
    }

    //
    attributeChangedCallback(name) {
        if (name == "src") provide(this.getAttribute("src") || "")?.then?.((file)=>{
            this.renderMarkdown(file);
        });
    }

    //
    createShadowRoot() {
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(E("div.viewbox", { dataset: {scheme: "solid", alpha: 1} }, [
            E("nav", {}, [
                E("div.row", {}, [  ]),
                E("div.row", {}, [  ])
            ]),
            E("main.view", {}, [
                this.#view = E("div.md-content", {})
            ])
        ])?.element);

        //
        const style = document.createElement("style");
        style.innerHTML = `@import url("./css/github-markdown.css");`;
        shadowRoot.appendChild(style);

        //
        requestAnimationFrame(()=>{
            provide(this.getAttribute("src") || "")?.then?.((file)=>this.renderMarkdown(file));
        });
    }
}

//
export default ()=>{
    customElements.define("adl-markdown-view", MarkdownView);
}
