export interface MmiiShape {
  bouche: BaseMMIIPart;
  cheveux?: ColoredMMIIPart;
  maquillage?: ColoredMMIIPart;
  nez: BaseMMIIPart;
  particularites?: BaseMMIIPart;
  pilosite?: ColoredMMIIPart;
  tete: ColoredMMIIPart;
  yeux: ColoredMMIIPart
}

export type BaseMMIIPart = {
  img: string;
}

export type ColoredMMIIPart = BaseMMIIPart & {
  color: string;
}
