import { E } from "/externals/lib/blue.js"

//
export const AppMenu = () => {
    const onAction = (root)=>{
        root?.element?.addEventListener?.("click", (ev)=>{
            if (ev?.target?.closest?.(".ui-list-item") || ev?.target?.matches?.(".ui-list-item")) {
                const modal = ev?.target?.closest?.("ui-modal");
                if (modal) modal.dataset.hidden = "";
            }
        });
        return root;
    }

    return onAction(E("ui-modal.ui-modal", {
        attributes: { type: "popup" },
        dataset: {
            scheme: "solid", name: "app-menu", hidden: ""
        }
    }, [
        E("div.menu-container", { dataset: { scheme: "solid", alpha: 1, chroma: 0.2, highlight: 1 }, }, [

            E("div.menu-grid", { dataset: { scheme: "solid", alpha: 1, chroma: 0, highlight: 0 } }, [
                E("div.ui-list-item", { dataset: {scheme: "solid", alpha: 0, highlightHover: 2, action: "manager"}, attributes: {} }, [
                    E("ui-shaped", { dataset: {scheme: "inverse"}, attributes: {icon: "folder"} }, [E("div.u2-item-design", {dataset: {shape: "square", scheme: "inverse", alpha: 1}})]),
                    E("span", {}, ["File Manager"])
                ]),

                E("div.ui-list-item", { dataset: {scheme: "solid", alpha: 0, highlightHover: 2, action: "settings"}, attributes: {} }, [
                    E("ui-shaped", { dataset: {scheme: "inverse"}, attributes: {icon: "settings"} }, [E("div.u2-item-design", {dataset: {shape: "square", scheme: "inverse", alpha: 1}})]),
                    E("span", {}, ["Settings"])
                ])
            ])

        ])
    ]));
}
