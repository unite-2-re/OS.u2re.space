import tasksList from '../$core$/Tasks.ts';
import Shell from './core/Shell.ts';
export const renderInPage = (root: HTMLElement): void => {
    root.append(Shell(tasksList)?.element);
};
