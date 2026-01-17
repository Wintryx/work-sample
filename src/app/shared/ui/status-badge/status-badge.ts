import { CommonModule } from "@angular/common";
import { ItemStatus } from "@domains/dashboard/dashboard.models";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * @description
 * Reusable presentational component for displaying item statuses.
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
      {{ status() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  // Using the new Signal-based inputs
  readonly status = input.required<ItemStatus>();

  protected badgeClasses() {
    const s = this.status();
    return {
      "bg-green-100 text-green-700 border-green-200": s === ItemStatus.Done,
      "bg-blue-100 text-blue-700 border-blue-200": s === ItemStatus.InProgress,
      "bg-slate-100 text-slate-600 border-slate-200": s === ItemStatus.Todo,
    };
  }
}
