import {
  INIT_PROJECT_ITEMS,
  INSURGENCE,
  REPURPOSE,
} from '@brysonandrew/copy/items';
import { TTitle } from '@brysonandrew/copy/types';
import { arrToRecord } from '@brysonandrew/utils-object/arrToRecord';
import { TInitItem } from '@brysonandrew/gallery';

export const PACKAGES = [
  'Standard',
  'Plus',
  'Select',
] as const;

export const CONTACT_PHONE = '516 407 953';
export const CONTACT_PHONE_WITH_NATIONAL_TRUNK = `+48${CONTACT_PHONE.replace(/\s/g, '')}`;
export const CONTACT_PHONE_WITH_NATIONAL_TRUNK_DISPLAY = `+48 ${CONTACT_PHONE}`;

export const CONTACT_EMAIL = 'andrew@brysona.dev'; // 'andrew@brysonwebdesign.co.nz';
export const CONTACT_URL = 'brysona.dev';

export const CONTACT_FORM_FOOTER = {
  email: CONTACT_EMAIL,
  // don't want people calling me
  // phone: {
  //   display: CONTACT_PHONE_WITH_NATIONAL_TRUNK_DISPLAY,
  //   withTrunk: CONTACT_PHONE_WITH_NATIONAL_TRUNK,
  // },
};

const RECORD = arrToRecord<TInitItem<TTitle>, 'title'>(
  INIT_PROJECT_ITEMS,
  'title',
);

export const CV_ITEMS = [
  INSURGENCE,
  REPURPOSE,
  RECORD['Insight Factory'],
];

export const CV_PRESETS_RECORD = {
  LATEST: CV_ITEMS,
  MEDIA: [
    RECORD['Insight Factory'],
    RECORD.Juke,
    RECORD.Buzzcast,
  ],
  CRYPTO: [RECORD.Juke, RECORD.Canvas, RECORD.Epirus],
} as const;

type TPresetRecord = typeof CV_PRESETS_RECORD;
export type TPresetName = keyof TPresetRecord;
export type TPresetValue = TPresetRecord[TPresetName];

type TPresetEntry = [TPresetName, TPresetValue];
export type TPresetEntries = TPresetEntry[];

export const CV_PRESETS = Object.entries(
  CV_PRESETS_RECORD,
) as TPresetEntries;

export const getYearsSince2016 = (): number => {
  const start = new Date(2016, 0, 1); // Jan 1, 2016
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();

  const hasHadAnniversary =
    now.getMonth() > start.getMonth() ||
    (now.getMonth() === start.getMonth() &&
      now.getDate() >= start.getDate());

  if (!hasHadAnniversary) years--;

  return years;
};

const years = getYearsSince2016();

export const DESCRIPTION_PARAGRAPHS = [
  `(Visit brysona.dev) ${years}+ years experience in front-end web technologies, specializing in React, Vue and Typescript and the frameworks Next.js and Nuxt.js.`,
];
