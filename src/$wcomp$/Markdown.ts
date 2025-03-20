// @ts-ignore
import styles from "./Markdown.scss?inline&compress";
import { provide } from "../$core$/file/FileOps.ts";
import { E } from "/externals/lib/blue.js";
import { marked } from "marked";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
export class MarkdownView extends HTMLElement {
    static observedAttributes = ["src"];

    //
    constructor() { super(); this.createShadowRoot(); }

    //
    #view: any;
    #themeStyle: any;

    //
    async setHTML(doc: string|Promise<string> = "") {
        let once = false;
        const view = this.#view?.element;
        if ( view) view.innerHTML = (await doc) || view.innerHTML;
        if (!once) document.dispatchEvent(new CustomEvent("ext-ready", {}));
        once = true;
    }

    //
    renderMarkdown(file: string|File|Blob|Response) {
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
            this.renderMarkdown(file as any);
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

        // @ts-ignore
        const THEME_URL = "/externals/core/theme.js";
        import(/* @vite-ignore */ "" + `${THEME_URL}`).then((module)=>{
            // @ts-ignore
            this.#themeStyle = module?.default?.(shadowRoot);
            if (this.#themeStyle) { shadowRoot?.appendChild?.(this.#themeStyle); }
        }).catch(console.warn.bind(console));

        //
        const style = document.createElement("style");
        style.innerHTML = `@import url("${preInit}");`;
        shadowRoot.appendChild(style);

        //
        requestAnimationFrame(()=>{
            provide(this.getAttribute("src") || "")?.then?.((file)=>this.renderMarkdown(file as any));
        });
    }
}

//
export default ()=>{
    customElements.define("adl-markdown-view", MarkdownView);
}
