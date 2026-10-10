import { PRIMARY_SUBJECTS } from "./primary";
import { JSS_SUBJECTS } from "./jss";
import { SSS_SCIENCE_SUBJECTS } from "./sss-sci";
import { SSS_ARTS_SUBJECTS } from "./sss-arts";
import { SSS_BIZ_SUBJECTS } from "./sss-biz";
import type { SubjectDef } from "./types";

export const ALL_SUBJECTS: SubjectDef[] = [
  ...PRIMARY_SUBJECTS,
  ...JSS_SUBJECTS,
  ...SSS_SCIENCE_SUBJECTS,
  ...SSS_ARTS_SUBJECTS,
  ...SSS_BIZ_SUBJECTS,
];
