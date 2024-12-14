export const initializeModal = ()=>{
    //
    const hideModal = (evc)=>{
        const ev = evc?.detail || evc;
        const element = ev?.target as HTMLElement;
        const selector = ".adl-modal, .u2-input, input, ui-contextmenu, button, ui-focustext";
        const modals = document.querySelectorAll(".adl-modal:not([data-hidden])");
        if (!(element.matches(selector) || element.closest(selector))) {
            modals.forEach((m)=>m?.setAttribute?.("data-hidden", ""));
        }
    }

    //
    document.documentElement.addEventListener("ag-contextmenu", hideModal);
    document.documentElement.addEventListener("ag-click", hideModal);
}

//
export default initializeModal;
