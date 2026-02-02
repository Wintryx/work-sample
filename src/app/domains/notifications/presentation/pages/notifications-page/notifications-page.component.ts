import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {NotificationsFacade} from "@domains/notifications/application/notifications.facade";
import {NotificationType} from "@core/notifications/notification.models";

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
        MatSelectModule,
    ],
    templateUrl: "./notifications-page.component.html",
    styleUrl: "./notifications-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPageComponent {
    private readonly fb = inject(FormBuilder);
    protected readonly notificationsFacade = inject(NotificationsFacade);
    protected readonly notificationTypes = [
        {label: "Success", value: NotificationType.Success},
        {label: "Info", value: NotificationType.Info},
        {label: "Warn", value: NotificationType.Warning},
    ];
    protected readonly errorForm = this.fb.nonNullable.group({
        message: [""],
    });
    protected readonly notificationForm = this.fb.nonNullable.group({
        message: [""],
        type: [NotificationType.Success],
    });

    /**
     * @description
     * Triggers a simulated error and optionally overrides the toast message.
     */
    protected onSimulateError(): void {
        const message = this.errorForm.getRawValue().message;
        this.notificationsFacade.simulateError(message);
    }

    /**
     * @description
     * Triggers a simulated unauthorized response and validates the logout flow.
     */
    protected onSimulateUnauthorized(): void {
        const message = this.errorForm.getRawValue().message;
        this.notificationsFacade.simulateUnauthorized(message);
    }

    /**
     * @description
     * Triggers a simulated success/info/warning toast using the notification interceptor.
     */
    protected onSimulateNotification(): void {
        const {message, type} = this.notificationForm.getRawValue();
        this.notificationsFacade.simulateNotification(message, type);
    }
}
