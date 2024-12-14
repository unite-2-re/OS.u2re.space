

//
export const initializeSidebar = ()=>{
    //
    document.documentElement.addEventListener("ag-click", (evc)=>{
        const ev = evc?.detail || evc;
        const target = ev?.target as HTMLElement;
        if (!(target?.matches?.(".adl-tab-box, .adl-menu") || target?.closest?.(".adl-tab-box, .adl-menu"))) {
            //const sidebar = target?.matches?.(".adl-tab-box") ? target : target?.closest?.(".adl-tab-box");
            document.documentElement.querySelectorAll(".adl-tab-box").forEach((sidebar)=>{
                sidebar?.classList?.remove?.("adl-open");
            });
        }
    });
}

//
export const $openMenu = (content)=>{
    const sidebar = content?.querySelector?.(".adl-tab-box");
    if (!sidebar?.classList?.contains?.("adl-open")) {
        sidebar?.classList?.add("adl-open");
    } else {
        sidebar?.classList?.remove("adl-open");
    }
}

//
export const $hideMenu = (content)=>{
    const sidebar = content?.querySelector?.(".adl-tab-box");
    sidebar?.classList?.remove("adl-open");
}

//
export default initializeSidebar;
