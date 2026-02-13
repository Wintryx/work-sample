import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsFacade } from "../../../application/forms.facade";
import { FormValueMap } from "@domains/forms";
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

/**
 * @description
 * Smart page component for displaying and managing dynamic forms.
 * It uses tabs to switch between different form configurations.
 */
@Component({
  selector: "app-forms-page",
  standalone: true,
  imports: [CommonModule, MatTabsModule, DynamicFormComponent, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./forms-page.component.html",
  styleUrl: "./forms-page.component.scss",
})
export class FormsPageComponent implements OnInit {
  protected readonly formsFacade = inject(FormsFacade);

  /**
   * @description
   * Loads the initial form configuration when the component is initialized.
   */
  ngOnInit(): void {
    this.loadFormForTab(0);
  }

  /**
   * @description
   * Handles tab changes to load the corresponding form configuration.
   * @param index The index of the selected tab.
   */
  protected onTabChange(index: number): void {
    this.loadFormForTab(index);
  }

  /**
   * @description
   * Dispatches a form submission action to the facade.
   * @param formId The ID of the submitted form.
   * @param formData The raw data from the submitted form.
   */
  protected onFormSubmit(formId: string, formData: FormValueMap): void {
    this.formsFacade.submitForm(formId, formData);
  }

  /**
   * @description
   * A simple mapping from tab index to form ID.
   * @param index The tab index.
   */
  private loadFormForTab(index: number): void {
    const formId = this.getFormIdForIndex(index);
    if (formId) {
      this.formsFacade.loadFormConfig(formId);
    }
  }

  private getFormIdForIndex(index: number): string | null {
    switch (index) {
      case 0:
        return "user-profile";
      // Future forms would be added here
      // case 1: return "company-settings";
      // case 2: return "address-form";
      default:
        return null;
    }
  }
}
