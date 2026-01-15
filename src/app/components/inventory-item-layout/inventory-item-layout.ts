import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inventory-item-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="module-container" style="padding: 20px;">
      <router-outlet></router-outlet>
    </div>
  `
})
export class InventoryItemLayout {}
