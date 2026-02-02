import {ChangeDetectionStrategy, Component, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {environment} from "@env/environment";

@Component({
    selector: "app-footer-component",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./footer.component.html",
    styleUrl: "./footer.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    protected readonly currentYear = new Date().getFullYear();
    protected readonly isDev = signal(!environment.production);
}
