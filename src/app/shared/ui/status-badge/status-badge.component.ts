import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { StatusBadgeVariant } from "./status-badge.models";

/**
 * @description
 * Reusable presentational component for displaying status badges.
 * Demonstrates high reusability and clean Tailwind integration.
 */
@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [ngClass]="badgeClasses()"
      class="px-2.5 py-1 rounded-full text-xs font-bold border uppercase"
    >
      {{ label() ?? variant() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  // Using the new Signal-based inputs
  readonly variant = input.required<StatusBadgeVariant>();
  readonly label = input<string | null>(null);

  protected badgeClasses() {
    const variant = this.variant();
    return {
      "bg-green-100 text-green-700 border-green-200": variant === StatusBadgeVariant.Success,
      "bg-blue-100 text-blue-700 border-blue-200": variant === StatusBadgeVariant.Info,
      "bg-amber-100 text-amber-700 border-amber-200": variant === StatusBadgeVariant.Warning,
      "bg-slate-100 text-slate-600 border-slate-200": variant === StatusBadgeVariant.Neutral,
    };
  }
}
