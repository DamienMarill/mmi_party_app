export interface MmiiShape {
  bouche: ColoredMMIIPart;
  cheveux: ColoredMMIIPart;
  maquillage: BaseMMIIPart;
  nez: BaseMMIIPart;
  particularites: BaseMMIIPart;
  pilosite: ColoredMMIIPart;
  tete: ColoredMMIIPart;
  yeux: ColoredMMIIPart
}

export type BaseMMIIPart = {
  img: string;
}

export type ColoredMMIIPart = BaseMMIIPart & {
  color: string;
}
