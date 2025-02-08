import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  forwardRef,
  Input,
  input,
  model,
  OnChanges,
  signal, SimpleChanges,
  TemplateRef, ViewChild
} from '@angular/core';
import {faChevronDown, faTriangleExclamation} from '@fortawesome/pro-regular-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators
} from '@angular/forms';
import {timer} from 'rxjs';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ]
})
export class InputComponent implements ControlValueAccessor, Validator, OnChanges, AfterViewInit{
  faFont = {
    faTriangleExclamation,
    faChevronDown,
  };

  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() icon?: IconProp;
  @Input() helpText?: TemplateRef<ElementRef>;
  @Input() checked: boolean = false;
  @Input() value?: string;
  @Input() errorMessage: string = '';

  @ViewChild('inputRef', { static: true })
  inputRef?: ElementRef;
  @ViewChild('textareaRef', { static: true })
  textareaRef?: ElementRef;

  id: string = 'mll-input-' + Math.random().toString(36).substr(2, 9);
  inputFocus = false;

  globalType?: 'text' | 'textarea' | 'select' | 'file' | 'checkbox' = 'text';
  typeMapping: any = {
    textarea: 'textarea',
    select: 'select',
    file: 'file',
    checkbox: 'checkbox',
  };

  private _control?: FormControl;
  get control(): FormControl | undefined {
    return this._control;
  }

  private _isRequired: boolean = false;
  get isRequired(): boolean {
    return this._isRequired;
  }

  fieldRequiredText: string = 'Field required';

  private onChange: (value: any) => void = () => {};
  public onTouched: () => void = () => {};

  constructor() {
    this.fieldRequiredText = "Champ obligatoire";
  }

  ngAfterViewInit(): void {
    timer(10).subscribe(() => {
      this.value = this.control?.value;
      if (this.value) {
        this.onInput(this.value);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']?.currentValue) {
      this.globalType = this.typeMapping[changes['type'].currentValue] || 'text';
      if (['radio', 'toggle'].includes(changes['type'].currentValue)) {
        this.globalType = 'checkbox';
      }
    }
  }

  writeValue(value: any): void {
    this.value = value; // Mise à jour de la propriété locale value
    if (this.inputRef && this.type !== 'textarea') {
      this.inputRef.nativeElement.value = value ?? ''; // Assure que la valeur n'est jamais null
    } else if (this.textareaRef && this.type === 'textarea') {
      this.textareaRef.nativeElement.value = value ?? ''; // Idem pour textarea
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.inputRef && this.type !== 'textarea') {
      this.inputRef.nativeElement.disabled = isDisabled;
    } else if (this.textareaRef && this.type === 'textarea') {
      this.textareaRef.nativeElement.disabled = isDisabled;
    }
  }

  validate(control: FormControl) {
    this._control = control;
    this._isRequired = this._control.hasValidator(Validators.required);
    return null;
  }

  onInput(value: any, active: boolean = true) {
    if (this.globalType === 'checkbox') {
      if (this.checkboxTypeSanityse() === 'checkbox') {
        let currentValues = this.control?.value || [];
        if (active) {
          // Ajoutez la valeur à l'array si elle n'est pas déjà présente
          if (currentValues.indexOf(value) === -1) {
            currentValues.push(value);
          }
        } else {
          // Retirez la valeur de l'array si elle est présente
          currentValues = currentValues.filter((val: any) => val !== value);
        }
        if (currentValues.length === 0) {
          currentValues = false;
        }

        this.onChange(currentValues);
      } else {
        this.onChange(active ? value : '');
      }
    } else {
      this.onChange(value);
    }

    // this.onTouched();
  }

  checkboxTypeSanityse() {
    if (this.type === 'toggle') {
      return 'checkbox';
    }
    return this.type;
  }

  displayError(): boolean {
    return <boolean>(
      this.control?.errors &&
      !this.control.pristine &&
      ((this.control?.dirty && this.control?.touched) || this.control?.errors['serverError'])
    );
  }
}
