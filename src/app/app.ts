import {ChangeDetectionStrategy, Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent} from "@core/layout/header/header.component";
import {FooterComponent} from "@core/layout/footer/footer.component";

/**
 * @description
 * Root Application Shell.
 * Provides the main layout structure and global navigation.
 */
@Component({
    selector: "app-root",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, MatButtonModule, HeaderComponent, FooterComponent],
    templateUrl: "./app.html",
    styleUrl: "./app.scss",
})
export class App {
}
