import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {HeaderComponent} from '@core/layout/header/header-component';

/**
 * @description
 * Root Application Shell.
 * Provides the main layout structure and global navigation.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    HeaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Title signal for the header or document title
  protected readonly title = signal('EPM Progress Maker');
}
