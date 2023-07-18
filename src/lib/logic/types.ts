export type User = {
  id: string;
  gradeMap: any;
  studyBlocks: StudyBlock[];
};

export type StudyBlock = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  subjects: Subject[];
};

export type Subject = {
  id: string;
  longName: string;
  courseCodeName: string;
  courseCodeNumber: string;
  color: string;
  studyBlockId: string;
  components: SubjectComponent[];
};

export type SubjectComponent = {
  id: string;
  name: string;
  nameOfSubcomponentSingular: string;
  subjectWeighting: string;
  numberOfSubComponentsToDrop_Lowest: number;
  subcomponents: SubjectSubcomponent[];
};

export type SubjectSubcomponent = {
  id: string;
  numberInSequence: number;
  overrideName?: string;
  isCompleted: boolean;
  gradeValuePercentage: string;
};
