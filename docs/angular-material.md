# Angular Material (lokale node_modules)

Version: 21.1.0
Paket: @angular/material
Peer-Abhaengigkeiten: @angular/cdk, @angular/core, @angular/common, @angular/forms, @angular/platform-browser, rxjs.

Prebuilt Themes (CSS): azure-blue.css, cyan-orange.css, deeppurple-amber.css, indigo-pink.css, magenta-violet.css, pink-bluegrey.css, purple-green.css, rose-red.css

Import-Schema (NgModule):
```ts
import { MatButtonModule } from '@angular/material/button';
@NgModule({ imports: [MatButtonModule] })
export class ExampleModule {}
```

Import-Schema (standalone):
```ts
import { MatButtonModule } from '@angular/material/button';
@Component({
  standalone: true,
  imports: [MatButtonModule],
})
export class ExampleComponent {}
```

## Komponenten und Direktiven (vollstaendige Liste aus lokalen Typings)

### autocomplete (@angular/material/autocomplete)
Modul: `MatAutocompleteModule`
Selektoren: `[matAutocompleteOrigin]`, `input[matAutocomplete], textarea[matAutocomplete]`, `mat-autocomplete`, `mat-optgroup`
Zweck: Autocomplete fuer Texteingaben (Vorschlagsliste an Inputs).
Nutzung: Importiere `MatAutocompleteModule` aus @angular/material/autocomplete (oder standalone in imports) und verwende einen der Selektoren im Template.

### badge (@angular/material/badge)
Modul: `MatBadgeModule`
Selektoren: `[matBadge]`
Zweck: Badge fuer Status/Anzahl auf Elementen.
Nutzung: Importiere `MatBadgeModule` aus @angular/material/badge (oder standalone in imports) und verwende einen der Selektoren im Template.

### bottom-sheet (@angular/material/bottom-sheet)
Modul: `MatBottomSheetModule`
Selektoren: `mat-bottom-sheet-container`
Zweck: Bottom Sheet als Overlay von unten (Aktionen/Kontext).
Nutzung: Importiere `MatBottomSheetModule` aus @angular/material/bottom-sheet (oder standalone in imports) und verwende einen der Selektoren im Template.

### button (@angular/material/button)
Modul: `MatButtonModule`
Selektoren: `button[matButton], a[matButton], button[mat-button], button[mat-raised-button], button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button], a[mat-flat-button], a[mat-stroked-button]`, `button[mat-fab], a[mat-fab], button[matFab], a[matFab]`, `button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]`, `button[mat-mini-fab], a[mat-mini-fab], button[matMiniFab], a[matMiniFab]`
Zweck: Buttons (Text, Filled, Raised, Outlined, FAB, Icon).
Nutzung: Importiere `MatButtonModule` aus @angular/material/button (oder standalone in imports) und verwende einen der Selektoren im Template.

### button-toggle (@angular/material/button-toggle)
Modul: `MatButtonToggleModule`
Selektoren: `mat-button-toggle`, `mat-button-toggle-group`
Zweck: Toggle Buttons und Toggle-Gruppen (Einzel/Mehrfachauswahl).
Nutzung: Importiere `MatButtonToggleModule` aus @angular/material/button-toggle (oder standalone in imports) und verwende einen der Selektoren im Template.

### card (@angular/material/card)
Modul: `MatCardModule`
Selektoren: `[mat-card-avatar], [matCardAvatar]`, `[mat-card-image], [matCardImage]`, `[mat-card-lg-image], [matCardImageLarge]`, `[mat-card-md-image], [matCardImageMedium]`, `[mat-card-sm-image], [matCardImageSmall]`, `[mat-card-xl-image], [matCardImageXLarge]`, `mat-card`, `mat-card-actions`, `mat-card-content`, `mat-card-footer`, `mat-card-header`, `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`, `mat-card-title, [mat-card-title], [matCardTitle]`, `mat-card-title-group`
Zweck: Card-Container fuer Inhalte und Sektionen.
Nutzung: Importiere `MatCardModule` aus @angular/material/card (oder standalone in imports) und verwende einen der Selektoren im Template.

### checkbox (@angular/material/checkbox)
Modul: `MatCheckboxModule`
Selektoren: `mat-checkbox`
Zweck: Checkbox-Eingaben.
Nutzung: Importiere `MatCheckboxModule` aus @angular/material/checkbox (oder standalone in imports) und verwende einen der Selektoren im Template.

### chips (@angular/material/chips)
Modul: `MatChipsModule`
Selektoren: `[matChipEdit]`, `[matChipRemove]`, `input[matChipInputFor]`, `mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]`, `mat-basic-chip-option, [mat-basic-chip-option], mat-chip-option, [mat-chip-option]`, `mat-chip-avatar, [matChipAvatar]`, `mat-chip-grid`, `mat-chip-listbox`, `mat-chip-row, [mat-chip-row], mat-basic-chip-row, [mat-basic-chip-row]`, `mat-chip-set`, `mat-chip-trailing-icon, [matChipTrailingIcon]`, `span[matChipEditInput]`
Zweck: Chips fuer Tags, Auswahl und Eingabe.
Nutzung: Importiere `MatChipsModule` aus @angular/material/chips (oder standalone in imports) und verwende einen der Selektoren im Template.

### core (@angular/material/core)
Modul: `MatLineModule`, `MatNativeDateModule`, `MatOptionModule`, `MatPseudoCheckboxModule`, `MatRippleModule`, `NativeDateModule`
Selektoren: `[mat-line], [matLine]`, `[mat-ripple], [matRipple]`, `div[mat-internal-form-field]`, `mat-optgroup`, `mat-pseudo-checkbox`, `structural-styles`
Zweck: Basis-Utilities (z.B. Ripple, Options/Optgroup, Line, Pseudo-Checkbox, Native Date Adapter).
Nutzung: Importiere `MatLineModule`, `MatNativeDateModule`, `MatOptionModule`, `MatPseudoCheckboxModule`, `MatRippleModule`, `NativeDateModule` aus @angular/material/core (oder standalone in imports) und verwende einen der Selektoren im Template.

### datepicker (@angular/material/datepicker)
Modul: `MatDatepickerModule`
Selektoren: `[matDatepickerApply], [matDateRangePickerApply]`, `[matDatepickerCancel], [matDateRangePickerCancel]`, `[matDatepickerToggleIcon]`, `mat-datepicker-actions, mat-date-range-picker-actions`
Zweck: Datumsauswahl inkl. Actions/Range-Buttons.
Nutzung: Importiere `MatDatepickerModule` aus @angular/material/datepicker (oder standalone in imports) und verwende einen der Selektoren im Template.

### dialog (@angular/material/dialog)
Modul: `MatDialogModule`
Selektoren: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`, `[mat-dialog-close], [matDialogClose]`, `[mat-dialog-content], mat-dialog-content, [matDialogContent]`, `[mat-dialog-title], [matDialogTitle]`, `mat-dialog-container`
Zweck: Modale Dialoge.
Nutzung: Importiere `MatDialogModule` aus @angular/material/dialog (oder standalone in imports) und verwende einen der Selektoren im Template.

### divider (@angular/material/divider)
Modul: `MatDividerModule`
Selektoren: `mat-divider`
Zweck: Trennlinien (h/v Divider).
Nutzung: Importiere `MatDividerModule` aus @angular/material/divider (oder standalone in imports) und verwende einen der Selektoren im Template.

### expansion (@angular/material/expansion)
Modul: `MatExpansionModule`
Selektoren: `mat-accordion`, `mat-action-row`, `mat-expansion-panel`, `mat-expansion-panel-header`, `mat-panel-description`, `mat-panel-title`, `ng-template[matExpansionPanelContent]`
Zweck: Expansion Panels und Accordion.
Nutzung: Importiere `MatExpansionModule` aus @angular/material/expansion (oder standalone in imports) und verwende einen der Selektoren im Template.

### form-field (@angular/material/form-field)
Modul: `MatFormFieldModule`
Selektoren: `[matPrefix], [matIconPrefix], [matTextPrefix]`, `[matSuffix], [matIconSuffix], [matTextSuffix]`, `mat-error, [matError]`, `mat-form-field`, `mat-hint`, `mat-label`
Zweck: Form-Field-Container mit Label, Hint, Error, Prefix/Suffix.
Nutzung: Importiere `MatFormFieldModule` aus @angular/material/form-field (oder standalone in imports) und verwende einen der Selektoren im Template.

### grid-list (@angular/material/grid-list)
Modul: `MatGridListModule`
Selektoren: `[mat-grid-avatar], [matGridAvatar]`, `[mat-line], [matLine]`, `mat-grid-list`, `mat-grid-tile`, `mat-grid-tile-footer`, `mat-grid-tile-header`, `mat-grid-tile-header, mat-grid-tile-footer`
Zweck: Grid-List fuer kachelbasierte Layouts.
Nutzung: Importiere `MatGridListModule` aus @angular/material/grid-list (oder standalone in imports) und verwende einen der Selektoren im Template.

### icon (@angular/material/icon)
Modul: `MatIconModule`
Selektoren: `mat-icon`
Zweck: Icons und Icon-Registry.
Nutzung: Importiere `MatIconModule` aus @angular/material/icon (oder standalone in imports) und verwende einen der Selektoren im Template.

### input (@angular/material/input)
Modul: `MatInputModule`
Selektoren: `[matPrefix], [matIconPrefix], [matTextPrefix]`, `[matSuffix], [matIconSuffix], [matTextSuffix]`, `input[matInput], textarea[matInput], select[matNativeControl], input[matNativeControl], textarea[matNativeControl]`, `mat-error, [matError]`, `mat-form-field`, `mat-hint`, `mat-label`
Zweck: Material-Styles fuer native Input/Textarea/Select.
Nutzung: Importiere `MatInputModule` aus @angular/material/input (oder standalone in imports) und verwende einen der Selektoren im Template.

### list (@angular/material/list)
Modul: `MatListModule`
Selektoren: `[matListItemAvatar]`, `[matListItemIcon]`, `[matListItemLine]`, `[matListItemMeta]`, `[matListItemTitle]`, `[mat-subheader], [matSubheader]`, `mat-action-list`, `mat-divider`, `mat-list`, `mat-list-item, a[mat-list-item], button[mat-list-item]`, `mat-list-option`, `mat-nav-list`, `mat-selection-list`
Zweck: Listen (Action, Nav, Selection) und List Items.
Nutzung: Importiere `MatListModule` aus @angular/material/list (oder standalone in imports) und verwende einen der Selektoren im Template.

### menu (@angular/material/menu)
Modul: `MatMenuModule`
Selektoren: `[matContextMenuTriggerFor]`, `[mat-menu-item]`, `[mat-menu-trigger-for], [matMenuTriggerFor]`, `mat-menu`, `ng-template[matMenuContent]`
Zweck: Menues und Kontextmenues.
Nutzung: Importiere `MatMenuModule` aus @angular/material/menu (oder standalone in imports) und verwende einen der Selektoren im Template.

### paginator (@angular/material/paginator)
Modul: `MatPaginatorModule`
Selektoren: `mat-paginator`
Zweck: Pagination fuer Listen/Tabellen.
Nutzung: Importiere `MatPaginatorModule` aus @angular/material/paginator (oder standalone in imports) und verwende einen der Selektoren im Template.

### progress-bar (@angular/material/progress-bar)
Modul: `MatProgressBarModule`
Selektoren: `mat-progress-bar`
Zweck: Linearer Fortschrittsbalken.
Nutzung: Importiere `MatProgressBarModule` aus @angular/material/progress-bar (oder standalone in imports) und verwende einen der Selektoren im Template.

### progress-spinner (@angular/material/progress-spinner)
Modul: `MatProgressSpinnerModule`
Selektoren: `mat-progress-spinner, mat-spinner`
Zweck: Kreis-Spinner / Progress-Spinner.
Nutzung: Importiere `MatProgressSpinnerModule` aus @angular/material/progress-spinner (oder standalone in imports) und verwende einen der Selektoren im Template.

### radio (@angular/material/radio)
Modul: `MatRadioModule`
Selektoren: `mat-radio-button`, `mat-radio-group`
Zweck: Radio-Buttons und Gruppen.
Nutzung: Importiere `MatRadioModule` aus @angular/material/radio (oder standalone in imports) und verwende einen der Selektoren im Template.

### select (@angular/material/select)
Modul: `MatSelectModule`
Selektoren: `[matPrefix], [matIconPrefix], [matTextPrefix]`, `[matSuffix], [matIconSuffix], [matTextSuffix]`, `mat-error, [matError]`, `mat-form-field`, `mat-hint`, `mat-label`, `mat-optgroup`, `mat-select`, `mat-select-trigger`
Zweck: Select/Dropdown-Komponente.
Nutzung: Importiere `MatSelectModule` aus @angular/material/select (oder standalone in imports) und verwende einen der Selektoren im Template.

### sidenav (@angular/material/sidenav)
Modul: `MatSidenavModule`
Selektoren: `mat-drawer`, `mat-drawer-container`, `mat-drawer-content`, `mat-sidenav`, `mat-sidenav-container`, `mat-sidenav-content`
Zweck: Sidenav/Drawer-Layout.
Nutzung: Importiere `MatSidenavModule` aus @angular/material/sidenav (oder standalone in imports) und verwende einen der Selektoren im Template.

### slider (@angular/material/slider)
Modul: `MatSliderModule`
Selektoren: `input[matSliderStartThumb], input[matSliderEndThumb]`, `input[matSliderThumb]`, `mat-slider`, `mat-slider-visual-thumb`
Zweck: Slider fuer numerische Werte/Ranges.
Nutzung: Importiere `MatSliderModule` aus @angular/material/slider (oder standalone in imports) und verwende einen der Selektoren im Template.

### slide-toggle (@angular/material/slide-toggle)
Modul: `MatSlideToggleModule`
Selektoren: `mat-slide-toggle`
Zweck: Schalter (On/Off Toggle).
Nutzung: Importiere `MatSlideToggleModule` aus @angular/material/slide-toggle (oder standalone in imports) und verwende einen der Selektoren im Template.

### snack-bar (@angular/material/snack-bar)
Modul: `MatSnackBarModule`
Selektoren: `[matSnackBarAction]`, `[matSnackBarActions]`, `[matSnackBarLabel]`, `mat-snack-bar-container`, `simple-snack-bar`
Zweck: Kurzlebige Benachrichtigungen.
Nutzung: Importiere `MatSnackBarModule` aus @angular/material/snack-bar (oder standalone in imports) und verwende einen der Selektoren im Template.

### sort (@angular/material/sort)
Modul: `MatSortModule`
Selektoren: `[matSort]`, `[mat-sort-header]`
Zweck: Sortier-Header fuer Tabellen.
Nutzung: Importiere `MatSortModule` aus @angular/material/sort (oder standalone in imports) und verwende einen der Selektoren im Template.

### stepper (@angular/material/stepper)
Modul: `MatStepperModule`
Selektoren: `[matStepLabel]`, `button[matStepperNext]`, `button[matStepperPrevious]`, `mat-step`, `mat-step-header`, `mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]`, `ng-template[matStepperIcon]`
Zweck: Schrittweiser Wizard/Stepper.
Nutzung: Importiere `MatStepperModule` aus @angular/material/stepper (oder standalone in imports) und verwende einen der Selektoren im Template.

### table (@angular/material/table)
Modul: `MatTableModule`
Selektoren: `[matCellDef]`, `[matColumnDef]`, `[matFooterCellDef]`, `[matFooterRowDef]`, `[matHeaderCellDef]`, `[matHeaderRowDef]`, `mat-cell, td[mat-cell]`, `mat-footer-cell, td[mat-footer-cell]`, `mat-footer-row, tr[mat-footer-row]`, `mat-header-cell, th[mat-header-cell]`, `mat-header-row, tr[mat-header-row]`, `mat-row, tr[mat-row]`, `mat-table[recycleRows], table[mat-table][recycleRows]`, `ng-template[matNoDataRow]`
Zweck: Daten-Tabelle (Rows/Cells/Defs).
Nutzung: Importiere `MatTableModule` aus @angular/material/table (oder standalone in imports) und verwende einen der Selektoren im Template.

### tabs (@angular/material/tabs)
Modul: `MatTabsModule`
Selektoren: `[matTabBodyHost]`, `[matTabContent]`, `[mat-tab-label], [matTabLabel]`, `[matTabLabelWrapper]`, `[mat-tab-link], [matTabLink]`, `[mat-tab-nav-bar]`, `mat-tab`, `mat-tab-body`, `mat-tab-group`, `mat-tab-header`, `mat-tab-nav-panel`
Zweck: Tabs und Tab-Navigation.
Nutzung: Importiere `MatTabsModule` aus @angular/material/tabs (oder standalone in imports) und verwende einen der Selektoren im Template.

### timepicker (@angular/material/timepicker)
Modul: `MatTimepickerModule`
Selektoren: keine Selektoren in Typings gefunden
Zweck: Zeit-Auswahl.
Nutzung: Importiere `MatTimepickerModule` aus @angular/material/timepicker (oder standalone in imports) und verwende einen der Selektoren im Template.

### toolbar (@angular/material/toolbar)
Modul: `MatToolbarModule`
Selektoren: `mat-toolbar`, `mat-toolbar-row`
Zweck: Toolbar/App-Bar.
Nutzung: Importiere `MatToolbarModule` aus @angular/material/toolbar (oder standalone in imports) und verwende einen der Selektoren im Template.

### tooltip (@angular/material/tooltip)
Modul: `MatTooltipModule`
Selektoren: `[matTooltip]`, `mat-tooltip-component`
Zweck: Tooltips.
Nutzung: Importiere `MatTooltipModule` aus @angular/material/tooltip (oder standalone in imports) und verwende einen der Selektoren im Template.

### tree (@angular/material/tree)
Modul: `MatTreeModule`
Selektoren: `[matTreeNodeOutlet]`
Zweck: Tree-View (Baum-Strukturen).
Nutzung: Importiere `MatTreeModule` aus @angular/material/tree (oder standalone in imports) und verwende einen der Selektoren im Template.

## Theming (Sass)
Globale Mixins (core/theming/_all-theme.scss): all-component-themes, all-component-bases, all-component-colors, angular-material-theme.
Globale Typography/Density Mixins (core/typography/_all-typography.scss, core/density/private/_all-density.scss): all-component-typographies, angular-material-typography, all-component-densities, angular-material-density.
Jede Komponente besitzt ein eigenes _<komponente>-theme.scss mit Mixins base(), color(), typography(), density(), overrides(), theme() (teilweise mit color-variant).
Basis-Styles: core/_core.scss mit core(), app-background(), elevation-classes().

## Hinweise
Form-Field-Selektoren (mat-form-field, mat-label, mat-hint, mat-error, matPrefix/matSuffix) erscheinen in mehreren Entry-Points, gehoeren konzeptionell zu MatFormFieldModule.
Einige Selektoren (z.B. mat-option/optgroup) werden aus Core/Option-Teilen exportiert und tauchen in Autocomplete/Select mit auf.
