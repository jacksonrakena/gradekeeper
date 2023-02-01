
/**
  This script deletes 'dangling' entities in the database.
  Theoretically, there should never be any dangling entities,
  because Prisma is configured to cascade-delete when deleting.
  But sometimes a bug in a developer environment can fuck everything up,
  so this script will delete all entities where the parent entity ID column
  does not have a valid row in the parent table.
 */

/*
  Delete subjects that have a null study block
*/
delete from Subject where Subject.id in
                          (select * from (select Subject.id from Subject
                              LEFT JOIN StudyBlock
                                  on StudyBlock.id = Subject.studyBlockId
                                             WHERE StudyBlock.id IS NULL)temp_table);

/*
  Delete subject components that have a null subject
*/
delete from SubjectComponent where SubjectComponent.id in (select * from (select SubjectComponent.id from SubjectComponent LEFT JOIN Subject on Subject.id = SubjectComponent.subjectId WHERE Subject.id IS NULL)temp_table);

/*
  Delete subject subcomponents that have a null subject component
*/
delete from SubjectSubcomponent where SubjectSubcomponent.id in (select * from (select SubjectSubcomponent.id from SubjectSubcomponent LEFT JOIN SubjectComponent on SubjectComponent.id = SubjectSubcomponent.componentId WHERE SubjectComponent.id IS NULL) as SSSCi);