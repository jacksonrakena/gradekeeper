import { Subject, SubjectComponent, SubjectSubcomponent } from "./types";

export type FullSubject = Subject & { components: FullSubjectComponent[] };
export type FullSubjectComponent = SubjectComponent & { subcomponents: SubjectSubcomponent[] };
