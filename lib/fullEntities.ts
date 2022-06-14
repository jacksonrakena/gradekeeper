import { Subject, SubjectComponent, SubjectSubcomponent } from "@prisma/client";

export type FullSubject = Subject & { components: FullSubjectComponent[] };
export type FullSubjectComponent = SubjectComponent & { subcomponents: SubjectSubcomponent[] };
