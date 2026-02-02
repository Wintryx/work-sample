import {ChangeDetectionStrategy, Component, inject, input, signal} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClient, HttpEventType, HttpResponse} from "@angular/common/http";
import {catchError, concatMap, filter, finalize, from, map, of, tap, toArray} from "rxjs";
import {API_BASE_URL} from "@core/http/api.tokens";
import {CommonModule} from "@angular/common";
import {FieldValidatorConfig} from "@domains/forms";
import {FormFieldShellComponent} from "@shared/ui/forms/form-field-shell/form-field-shell.component";

let fileUploadId = 0;

type UploadStatus = "pending" | "uploading" | "done" | "error";

interface UploadItem {
    name: string;
    status: UploadStatus;
    id?: string;
    error?: string;
}

/**
 * @description
 * A file upload component that uploads immediately upon selection.
 * Stores the returned File IDs in the FormControl for multi-file uploads.
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
    readonly control = input.required<FormControl<string[] | null>>();
    readonly label = input("");
    readonly accept = input("image/*");
    readonly multiple = input(true);
    readonly validators = input<FieldValidatorConfig[]>([]);

    protected readonly inputId = `file-upload-${++fileUploadId}`;

    protected readonly uploading = signal(false);
    protected readonly progress = signal(0);
    protected readonly uploads = signal<UploadItem[]>([]);
    protected readonly currentIndex = signal<number | null>(null);
    protected readonly error = signal<string | null>(null);

    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const files = Array.from(input.files);
        const shouldFilterImages = this.accept().includes("image/");
        const imageFiles = shouldFilterImages
            ? files.filter(file => file.type.startsWith("image/") || !file.type)
            : files;

        if (!imageFiles.length) {
            this.error.set(shouldFilterImages ? "Only image files are allowed." : "No files selected.");
            return;
        }

        if (shouldFilterImages && imageFiles.length !== files.length) {
            this.error.set("Some files were skipped because they are not images.");
        } else {
            this.error.set(null);
        }

        this.uploads.set(imageFiles.map(file => ({name: file.name, status: "pending"})));
        this.uploadFiles(imageFiles);
        input.value = "";
    }

    private uploadFiles(files: File[]): void {
        this.uploading.set(true);
        this.progress.set(0);

        from(files).pipe(
            concatMap((file, index) => this.uploadFile(file, index)),
            toArray(),
            finalize(() => {
                this.uploading.set(false);
                this.currentIndex.set(null);
            })
        ).subscribe(fileIds => {
            const successful = fileIds.filter((id): id is string => Boolean(id));
            this.control().setValue(successful.length ? successful : null);
            this.control().markAsDirty();
        });
    }

    private uploadFile(file: File, index: number) {
        this.currentIndex.set(index);
        this.updateUpload(index, {status: "uploading"});
        this.progress.set(0);

        const formData = new FormData();
        formData.append("file", file);

        return this.http.post<{id: string}>(`${this.baseUrl}/upload`, formData, {
            reportProgress: true,
            observe: "events"
        }).pipe(
            tap(event => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    this.progress.set(Math.round(100 * event.loaded / event.total));
                }
            }),
            filter((event): event is HttpResponse<{id: string}> => event.type === HttpEventType.Response),
            map(event => event.body?.id ?? null),
            tap(fileId => {
                if (fileId) {
                    this.updateUpload(index, {status: "done", id: fileId});
                } else {
                    this.updateUpload(index, {status: "error", error: "Upload failed."});
                }
            }),
            catchError(_ => {
                this.updateUpload(index, {status: "error", error: "Upload failed."});
                return of(null);
            }),
        );
    }

    protected currentFileName(): string | null {
        const index = this.currentIndex();
        if (index === null) return null;
        return this.uploads()[index]?.name ?? null;
    }

    protected uploadedCount(): number {
        const value = this.control().value;
        return Array.isArray(value) ? value.length : 0;
    }

    private updateUpload(index: number, patch: Partial<UploadItem>): void {
        this.uploads.update(items => {
            const next = items.slice();
            const target = next[index];
            if (!target) return items;
            next[index] = {...target, ...patch};
            return next;
        });
    }
}
