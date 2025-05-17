import { Migration } from '@mikro-orm/migrations';

export class Migration20250516022918 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "review" add column if not exists "is_admin" boolean null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "review" drop column if exists "is_admin";`);
  }

}
