declare module "*?raw"
{
    const content: string;
    export default content;
}

declare module '*.md' {
    const content: string;
    export default content;
}

declare module "*.html?raw"
{
    const content: string;
    export default content;
}

declare global {
    declare module "solid-js" {
        namespace JSX {
            export interface Directives {
                observe: [() => any, (v: any) => any]
            }

            export interface IntrinsicElements {
                'ui-select-row': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-calendar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-longtext': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-select-row': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-scrollbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-task': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-modal': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-number': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-slider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-frame': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-statusbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-navbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-taskbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-gridbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-block': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
                'ui-orientbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            }
        }
    }
}
