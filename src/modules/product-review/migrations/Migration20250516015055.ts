import { Migration } from '@mikro-orm/migrations';

export class Migration20250516015055 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "review" alter column "rating" type real using ("rating"::real);`);
    this.addSql(`alter table if exists "review" alter column "rating" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "review" alter column "rating" type real using ("rating"::real);`);
    this.addSql(`alter table if exists "review" alter column "rating" set not null;`);
  }

}
