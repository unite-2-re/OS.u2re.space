export const initializeModal = ()=>{
    //
    /*const hideModal = (evc)=>{
        const ev       = evc?.detail || evc;
        const element  = ((ev?.target || evc?.target) || document.querySelector(":hover, :active") || document.activeElement) as HTMLElement;
        const selector = ".adl-modal, .u2-input, input, ui-contextmenu, button, ui-focustext, ui-modal, ui-longtext, ui-taskbar, ui-navbar, ui-statusbar";

        // un-conditional forbid to hiding
        if (element?.matches?.("input") && (ev?.type == "adl-click" || ev?.type == "click")) return;

        //
        requestAnimationFrame(()=>{
            const modals = document.querySelectorAll(".adl-modal:not([data-hidden])");
            if (!(element.matches(selector) || element.closest(selector))) {
                if (document.activeElement?.matches?.("input")) {
                    (document.activeElement as any)?.blur?.();
                } else {
                    modals.forEach((m)=>{
                        if (!ev || (element?.matches?.(".adl--modal") ? element : element?.closest?.(".adl-modal")) != m) { m?.setAttribute?.("data-hidden", ""); };
                    });
                }
            }
        });
    }

    //
    //document.documentElement.addEventListener("contextmenu", hideModal);
    document.documentElement.addEventListener("click", hideModal);*/
};

//
export default initializeModal;
