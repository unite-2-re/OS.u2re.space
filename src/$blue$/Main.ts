import Shell from './core/Shell.ts';
export const renderInPage = (root: HTMLElement, tasks: any[]): void => {
    root.append(Shell(tasks)?.element);
};
