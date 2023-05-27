import { Prisma } from "@prisma/client";

export type User = {
  id: String;
  gradeMap: any;
  studyBlocks: StudyBlock[];
};

export type StudyBlock = {
  id: String;
  name: String;
  startDate: Date;
  endDate: Date;
  subjects: Subject[];
};

export type Subject = {
  id: String;
  longName: String;
  courseCodeName: String;
  courseCodeNumber: String;
  color: String;
  components: SubjectComponent;
};

export type SubjectComponent = {
  id: String;
  name: String;
  nameOfSubcomponentSingular: String;
  subjectWeighting: number;
  numberOfSubComponentsToDrop_Lowest: number;
  subcomponents: SubjectSubcomponent[];
};

export type SubjectSubcomponent = {
  id: String;
  numberInSequence?: number;
  overrideName?: string;
  isCompleted: boolean;
  gradeValuePercentage: number;
};

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});
