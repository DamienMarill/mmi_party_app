import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardStats} from '../../interfaces/card-stats';

@Component({
  selector: 'app-skill-allocation',
  standalone: false,

  templateUrl: './skill-allocation.component.html',
  styleUrl: './skill-allocation.component.scss'
})
export class SkillAllocationComponent implements OnInit {
  skillForm: FormGroup;
  totalPoints = 0;
  availablePoints = 0;
  readonly skillCategories = [
    { key: 'audiovisuel', label: 'Audiovisuel' },
    { key: 'communication', label: 'Communication' },
    { key: 'dev', label: 'Développement' },
    { key: 'graphisme', label: 'Graphisme' },
    { key: 'trois_d', label: '3D' },
    { key: 'ux_ui', label: 'UX/UI' }
  ];

  @Input()promo: string = 'MMI1';
  @Output()skillPoints: EventEmitter<CardStats>= new EventEmitter<CardStats>();

  constructor(private fb: FormBuilder) {
    const skillControls = this.skillCategories.reduce((acc, category) => ({
      ...acc,
      [category.key]: [0, [Validators.min(0), Validators.max(15)]]
    }), {});

    this.skillForm = this.fb.group(skillControls, {
      validators: [this.totalPointsValidator()]
    });
  }

  ngOnInit() {
    // Initialisation des points max
    this.setMaxPoints(this.promo);

    // Surveillance des changements du formulaire entier
    this.skillForm.valueChanges.subscribe(value => {
      this.calculateRemainingPoints();
      this.skillPoints.emit(value);
    });
  }

  public setMaxPoints(studentType: string) {
    switch(studentType) {
      case 'MMI1':
        this.totalPoints = 5;
        break;
      case 'MMI2':
        this.totalPoints = 10;
        break;
      case 'MMI3':
        this.totalPoints = 15;
        break;
      default:
        this.totalPoints = 0;
    }
    this.calculateRemainingPoints();
  }

  private calculateRemainingPoints() {
    const usedPoints = Object.values(this.skillForm.value as Record<keyof CardStats, number>)
      .reduce((sum, current) => sum + current, 0);
    this.availablePoints = this.totalPoints - usedPoints;

    this.skillForm.updateValueAndValidity();
  }

  private totalPointsValidator() {
    return (formGroup: FormGroup) => {
      const totalUsed = Object.values(formGroup.value as Record<keyof CardStats, number>)
        .reduce((sum, current) => sum + current, 0);

      return totalUsed <= this.totalPoints ? null : { exceededPoints: true };
    };
  }

  incrementSkill(skill: string) {
    if (this.availablePoints > 0) {
      const currentValue = this.skillForm.get(skill)?.value || 0;
      this.skillForm.patchValue({
        [skill]: currentValue + 1
      });
    }

    this.skillPoints.emit(this.skillForm.value);
  }

  decrementSkill(skill: string) {
    const currentValue = this.skillForm.get(skill)?.value || 0;
    if (currentValue > 0) {
      this.skillForm.patchValue({
        [skill]: currentValue - 1
      });
    }

    this.skillPoints.emit(this.skillForm.value);
  }
}
