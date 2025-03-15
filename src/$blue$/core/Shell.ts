export default (tasks: any[])=>{
    return E(":fragment:", {}, [
        Workspace,
        E("ui-orientbox#ui-layer.ui-layer", {attribute: {orient: 0, }, style: {backgroundColor: "transparent"}}, [
            // TODO: reactive arrays
            M(tasks, (task: any)=>E("ui-frame", {dataset: {highlight: 2, chroma: 0.1, scheme: "solid", id: task?.id.replace("#", "") }}, [
                E("div", {style: "justify-self: start; text-align: start; padding=inline: 1rem", slot: "ui-title-bar"}),
                task?.desc?.label,
                // !dependent by task?.args?.type
            ])),
            E("ui-taskbar", {properties: tasks}, M(tasks, (task)=>E("ui-task", {properties: task}, [E("ui-icon", {attributes: task.desc})]))),
            E("ui-navbar", {}, []),
            E("ui-modal#contextmenu", {attributes: {type: "contextmenu"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, []),
            E("ui-modal", {attributes: {type: "modal"}, dataset: {name: "calendar"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, [
                E("ui-calendar", {}, [])
            ])
        ])
    ]);
}
