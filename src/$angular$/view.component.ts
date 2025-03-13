import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-angular-view',
  template: `
    <div [id]="formatId(id)" class="ui-content">
      <div class="adl-main">
        <div class="adl-content-box">
          <iframe 
            referrerpolicy="no-referrer" 
            width="100%" height="100%" 
            frameBorder="0" 
            style="border:none; inline-size:100%; block-size:100%; pointer-events:auto;"
            allowtransparency="true" 
            scrolling="auto"
            [src]="args?.href"
            loading="eager"
            seamless
            sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms"
            allowfullscreen
            credentialless
            allow="*">
          </iframe>
        </div>
      </div>
    </div>
  `
})
export class AngularViewComponent {
  // Значения будут получены через DI
  constructor(
    @Inject('id') public id: string,
    @Inject('args') public args: any
  ) {}

  formatId(id: string): string {
    return id && typeof id.replace === 'function' ? id.replace('#', '') : id;
  }
}
