import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { formatDate } from "@angular/common";

/**
 * @description
 * Custom pipe for standardized date and time formatting across the application.
 * Demonstrates the use of LOCALE_ID for internationalization support.
 *
 * Usage: {{ value | dateFormat }} or {{ value | dateFormat:'short' }}
 */
@Pipe({
  name: "dateFormat",
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(value: Date | string | number | null | undefined, format = "medium"): string {
    if (!value) return "";

    // Standardize to a professional format if none is provided
    const pattern = format === "medium" ? "EEE, dd.MM.yyyy - HH:mm" : format;

    return formatDate(value, pattern, this.locale);
  }
}
