To use Alembic for database migrations, you first need to initialize Alembic in your project directory. You can do this with the following command:

alembic init alembic

This will create a new directory named alembic in your project directory, and it will create a alembic.ini file.

Next, you need to configure Alembic to use the same database as your application. You can do this by editing the sqlalchemy.url setting in the alembic.ini file.

After you've initialized Alembic and configured it to use your database, you can use the following commands to create and apply migrations:

1. To generate a new migration script:

alembic revision -m "description of your migration"

This will create a new migration script in the alembic/versions directory. You can edit this script to define your migration.

2. To apply all pending migrations:

alembic upgrade head

This will apply all migrations that haven't been applied yet.

3. To undo the last migration:

alembic downgrade -1

This will undo the last applied migration.

4. To show the current revision:

alembic current

This will print the revision number of the last applied migration.

Remember to import your models in the env.py file in the alembic directory so Alembic can detect changes in your models and generate migration scripts accordingly.
