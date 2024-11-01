
// EXTERNAL MODE!
/// <reference types="lit" />
// @ts-ignore
//import {LitElement, html, css} from '/externals/vendor/lit-core.min.js';

// internal package mode (will or chunk or built-in)
import {LitElement, html, css} from "lit";

// you won't able to exclude that
import {customElement, property} from 'lit/decorators.js';

// @ts-ignore
@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
    // Define scoped styles right with your component, in plain CSS
    static styles = css`
        :host {
        color: blue;
        }
    `;

    // Declare reactive properties
    @property() name?: string = 'World';

    // Render the UI as a function of component state
    render() {
        return html`<p>Hello, ${this.name}!</p>`;
    }
}
