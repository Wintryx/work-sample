import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {environment} from "@env/environment";
import {NotificationsFacade} from "@domains/notifications/application/notifications.facade";

@Component({
    selector: "app-notifications-page",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
    ],
    templateUrl: "./notifications-page.component.html",
    styleUrl: "./notifications-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPageComponent {
    private readonly fb = inject(FormBuilder);
    protected readonly isDev = !environment.production;
    protected readonly notificationsFacade = inject(NotificationsFacade);
    protected readonly errorForm = this.fb.nonNullable.group({
        message: [{value: "", disabled: !this.isDev}],
    });

    /**
     * @description
     * Triggers a simulated error and optionally overrides the toast message.
     */
    protected onSimulateError(): void {
        if (!this.isDev) {
            return;
        }
        const message = this.errorForm.getRawValue().message;
        this.notificationsFacade.simulateError(message);
    }

    /**
     * @description
     * Triggers a simulated unauthorized response and validates the logout flow.
     */
    protected onSimulateUnauthorized(): void {
        if (!this.isDev) {
            return;
        }
        const message = this.errorForm.getRawValue().message;
        this.notificationsFacade.simulateUnauthorized(message);
    }
}
