# Backup and restore

### Backing up the database
Log into your PostgreSQL instance and run the following commands:
```sql
\copy gk_user to 'gk_user.csv' delimiter ',' csv header;
\copy study_block to 'study_block.csv' delimiter ',' csv header;
\copy course to 'course.csv' delimiter ',' csv header;
\copy course_component to 'course_component.csv' delimiter ',' csv header;
\copy course_subcomponent to 'course_subcomponent.csv' delimiter ',' csv header;
```
Then copy all the produced CSV files (from whatever folder you ran `psql`) to a safe location. These files represent all of the data required to run a Gradekeeper instance.

For example, if you're copying off a Kubernetes cluster, you might want to run something like this:
```
kubectl cp your-gradekeeper-pod-65b77fdff4-9nsn2:/csv_output/ ~/Desktop/my_backup
```

### Restoring
Firstly, you'll need to run the Gradekeeper server once to ensure that all migrations have been performed and the database schema is up to date.  
  
Then, log into your PostgreSQL instance and run the following commands:
```sql
\copy gk_user from 'gk_user.csv' csv header;
\copy study_block from 'study_block.csv' csv header;
\copy course from 'course.csv' csv header;
\copy course_component from 'course_component.csv' csv header;
\copy course_subcomponent from 'course_subcomponent.csv' csv header;
```
You'll want to run those in the order specified, because of the foreign key relations between descendant tables.