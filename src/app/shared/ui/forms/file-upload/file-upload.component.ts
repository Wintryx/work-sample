import {ChangeDetectionStrategy, Component, inject, input, signal} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClient, HttpEventType} from "@angular/common/http";
import {catchError, finalize, map, of} from "rxjs";
import {API_BASE_URL} from "@core/http/api.tokens";
import {CommonModule} from "@angular/common";
import {FieldValidatorConfig} from "@domains/forms";
import {FormFieldShellComponent} from "@shared/ui/forms/form-field-shell/form-field-shell.component";

let fileUploadId = 0;

/**
 * @description
 * A file upload component that uploads immediately upon selection.
 * Stores the returned File ID in the FormControl.
 */
@Component({
    selector: "app-file-upload",
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, ReactiveFormsModule, FormFieldShellComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./file-upload.component.html",
    styleUrl: "./file-upload.component.scss"
})
export class FileUploadComponent {
    readonly control = input.required<FormControl<string | null>>();
    readonly label = input("");
    readonly validators = input<FieldValidatorConfig[]>([]);

    protected readonly inputId = `file-upload-${++fileUploadId}`;

    protected readonly uploading = signal(false);
    protected readonly progress = signal(0);
    protected readonly fileName = signal<string | null>(null);
    protected readonly error = signal<string | null>(null);

    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        this.fileName.set(file.name);
        this.uploadFile(file);
    }

    private uploadFile(file: File): void {
        this.uploading.set(true);
        this.progress.set(0);
        this.error.set(null);

        const formData = new FormData();
        formData.append("file", file);

        this.http.post<{id: string}>(`${this.baseUrl}/upload`, formData, {
            reportProgress: true,
            observe: "events"
        }).pipe(
            map(event => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    this.progress.set(Math.round(100 * event.loaded / event.total));
                } else if (event.type === HttpEventType.Response) {
                    return event.body?.id;
                }
                return null;
            }),
            catchError(_ => { // Use underscore to indicate unused variable
                this.error.set("Upload failed. Please try again.");
                return of(null);
            }),
            finalize(() => this.uploading.set(false))
        ).subscribe(fileId => {
            if (fileId) {
                this.control().setValue(fileId);
                this.control().markAsDirty();
            }
        });
    }
}
