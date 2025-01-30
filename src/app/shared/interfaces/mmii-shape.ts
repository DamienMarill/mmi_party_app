export interface MmiiShape {
  bouche: ColoredMMIIPart; //
  cheveux: ColoredMMIIPart; //
  maquillage: BaseMMIIPart; //
  nez: BaseMMIIPart; //
  particularites: ColoredMMIIPart;
  pilosite: ColoredMMIIPart;
  tete: ColoredMMIIPart; //
  yeux: ColoredMMIIPart //
  sourcils: ColoredMMIIPart;
  pull: ColoredMMIIPart;
}

export type BaseMMIIPart = {
  img: string;
}

export type ColoredMMIIPart = BaseMMIIPart & {
  color: string;
}
