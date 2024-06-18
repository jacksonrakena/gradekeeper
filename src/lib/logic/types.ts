export type User = {
  id: string;
  gradeMap: any;
  studyBlocks: StudyBlock[];
  meta: {
    version: string;
    name: string;
    commitAuthorName: string;
    commitBranch: string;
    commitHash: string;
    commitMessage: string;
    compiledAt: string;
  };
};

export type StudyBlock = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  courses: Course[];
};

export type Course = {
  id: string;
  longName: string;
  courseCodeName: string;
  courseCodeNumber: string;
  color: string;
  studyBlockId: string;
  components: CourseComponent[];
};

export type CourseComponent = {
  id: string;
  name: string;
  courseId: string;
  nameOfSubcomponentSingular: string;
  subjectWeighting: string;
  numberOfSubComponentsToDrop_Lowest: number;
  subcomponents: CourseSubcomponent[];
  sequenceNumber?: number;
};

export type CourseSubcomponent = {
  id: string;
  numberInSequence: number;
  overrideName?: string;
  isCompleted: boolean;
  gradeValuePercentage: string;
};
