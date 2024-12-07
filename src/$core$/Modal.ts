export const initializeModal = ()=>{
    //
    const hideModal = (ev)=>{
        const element = ev?.target as HTMLElement;
        const selector = ".adl-modal, .u2-input, input, ui-contextmenu, button, ui-focustext";
        const modals = document.querySelectorAll(".adl-modal:not([data-hidden])");
        if (!(element.matches(selector) || element.closest(selector))) {
            modals.forEach((m)=>m?.setAttribute?.("data-hidden", ""));
        }
    }

    //
    document.documentElement.addEventListener("contextmenu", hideModal);
    document.documentElement.addEventListener("click", hideModal);
}

//
export default initializeModal;
