import {ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation} from "@angular/core";
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NotificationOptions, NotificationType} from "../notification.models";
import {NgClass} from "@angular/common";

@Component({
    selector: "app-notification-toast",
    standalone: true,
    imports: [MatIcon, MatIconButton, NgClass],
    templateUrl: "./toast.component.html",
    styleUrl: "./toast.component.scss",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
    readonly data = inject<NotificationOptions>(MAT_SNACK_BAR_DATA);
    private readonly snackBarRef = inject(MatSnackBarRef);

    readonly iconName = computed(() => {
        switch (this.data.type) {
            case NotificationType.Success:
                return "check_circle";
            case NotificationType.Error:
                return "error";
            case NotificationType.Warning:
                return "warning";
            case NotificationType.Info:
                return "info";
            default:
                return "info";
        }
    });

    /**
     * @description
     * Determines the icon and text color based on the background.
     * Since the background is set via Material overrides (global SCSS),
     * we just need to ensure contrast.
     */
    readonly contentClass = computed(() => {
        switch (this.data.type) {
            case NotificationType.Warning:
                return "text-slate-900"; // Dark text/icon on amber background
            default:
                return "text-white"; // White text/icon on dark/colored background
        }
    });

    dismiss(): void {
        this.snackBarRef.dismissWithAction();
    }
}
