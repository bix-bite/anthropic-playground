# Creating a new angular component:

The following steps are for an example component:
* Name: ExampleComponent


```bash
ng g m example --routing=true 
ng g c example --skip-tests=true -m=example
```
this will create a directory src\app\example\

in example.module.ts:
* import SharedModule from '../shared/shared.module'
* import CommonModule from '@angular/common'
* declare ExampleComponent in declarations
* make sure ExampleRoutingModule is imported in imports array

```javascript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ExampleRoutingModule } from './example-routing.module';
import { ExampleComponent } from './example.component';


@NgModule({
  declarations: [ExampleComponent],
  imports: [
    CommonModule,
    SharedModule,
    ExampleRoutingModule
  ]
})
export class ExampleModule { }
```

in example-routing.module.ts, add a route:

```javascript
const routes: Routes = [{
  path: 'example',
  component: ExampleComponent
}];
```

add ExampleModule imported into AppModule.  You may need to remove the 'standalone=true' from ExampleComponent

in src\assets\i18n\en.json, add a title at PAGES.EXAMPLE.TITLE

```json
{
  "PAGES": {
      "EXAMPLE": {
          "TITLE": "Example Page"
      }, ...
  }
}
```

and optionally add any strings you will display to the user to LABELS.

Items added to src\assets\i18n\en.json can be displayed in your html template like this:

```html
  <h1 class="title">
    {{ 'PAGES.EXAMPLE.TITLE' | translate }}
  </h1>
```
This future-proofs your app to handle tranlations without rewriting everything since other 
i18n json files can be added for other languages.
