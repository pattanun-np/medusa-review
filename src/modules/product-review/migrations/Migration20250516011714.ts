import { Migration } from '@mikro-orm/migrations';

export class Migration20250516011714 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "review" add column if not exists "parent_id" text null;`);
    this.addSql(`alter table if exists "review" add constraint "review_parent_id_foreign" foreign key ("parent_id") references "review" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_parent_id" ON "review" (parent_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "review" drop constraint if exists "review_parent_id_foreign";`);

    this.addSql(`drop index if exists "IDX_review_parent_id";`);
    this.addSql(`alter table if exists "review" drop column if exists "parent_id";`);
  }

}
