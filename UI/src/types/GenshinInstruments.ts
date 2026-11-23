export enum GenshinInstruments {
  WindsongLyre = 'WindsongLyre',             // 1.4 - Лира ветров
  FloralZither = 'FloralZither',             // 2.2 - Цветочная цитра
  AratakiDrum = 'AratakiDrum',               // 2.7 - Грандиозный барабан Аратаки    | Красный Барабан Итто
  VintageLyre = 'VintageLyre',               // 3.0 - Старинная лира                 | Аранары (сюжетная)
  NightwindHorn = 'NightwindHorn',           // 4.6 - Горн ночного ветра             | Труба
  DjemDjemDrum = 'DjemDjemDrum',             // 5.3 - Барабан джем-джем              | Барабан Натлана
  Ukulele = 'Ukulele',                       // 5.3 - Укулеле
  LingeringEuphonia = 'LingeringEuphonia',   // 5.7 - «Благозвучие струн»            | Гитара Скирк (сюжетная)
  LeapingSpiritPiano = 'LeapingSpiritPiano', // 5.8 - Клавиши стремительного ритма   | Пианино Натлана
  HarmonicKeys = 'HarmonicKeys',             // 6.4 (Luna V) - Клавиши гармонии      | Пианино Фонтейна
  Vodyanitsa = 'Vodyanitsa',               // 7.1 - Водяница
}

export const GENSHIN_INSTRUMENT_LABELS_RU: Record<GenshinInstruments, string> = {
  [GenshinInstruments.WindsongLyre]: 'Лира ветров',
  [GenshinInstruments.FloralZither]: 'Цветочная цитра',
  [GenshinInstruments.AratakiDrum]: 'Грандиозный барабан Аратаки',
  [GenshinInstruments.VintageLyre]: 'Старинная лира',
  [GenshinInstruments.NightwindHorn]: 'Горн ночного ветра',
  [GenshinInstruments.DjemDjemDrum]: 'Барабан джем-джем',
  [GenshinInstruments.Ukulele]: 'Укулеле',
  [GenshinInstruments.LingeringEuphonia]: '«Благозвучие струн»',
  [GenshinInstruments.LeapingSpiritPiano]: 'Клавиши стремительного ритма',
  [GenshinInstruments.HarmonicKeys]: 'Клавиши гармонии',
  [GenshinInstruments.Vodyanitsa]: 'Водяница',
};

export const GENSHIN_INSTRUMENT_FILE_NAMES: Record<GenshinInstruments, string> = {
  [GenshinInstruments.WindsongLyre]: 'Item_Windsong_Lyre.webp',
  [GenshinInstruments.FloralZither]: 'Item_Floral_Zither.webp',
  [GenshinInstruments.AratakiDrum]: 'Item_Arataki_Drum.webp',
  [GenshinInstruments.VintageLyre]: 'Item_Vintage_Lyre.webp',
  [GenshinInstruments.NightwindHorn]: 'Item_Nightwind_Horn.webp',
  [GenshinInstruments.DjemDjemDrum]: 'Item_Djem_Djem_Drum.webp',
  [GenshinInstruments.Ukulele]: 'Item_Ukulele.webp',
  [GenshinInstruments.LingeringEuphonia]: 'Item_Lingering_Euphonia.webp',
  [GenshinInstruments.LeapingSpiritPiano]: 'Item_Leaping_Spirit_Piano.webp',
  [GenshinInstruments.HarmonicKeys]: 'Item_Harmonic_Keys.webp',
  [GenshinInstruments.Vodyanitsa]: 'Vodyanitsa_Icon.webp',
};