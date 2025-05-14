import { Migration } from '@mikro-orm/migrations';

export class Migration20250514010337 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "review_media" ("id" text not null, "fileId" text not null, "mimeType" text not null, "review_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_media_review_id" ON "review_media" (review_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_media_deleted_at" ON "review_media" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "review_media" add constraint "review_media_review_id_foreign" foreign key ("review_id") references "review" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "review_media" cascade;`);
  }

}
