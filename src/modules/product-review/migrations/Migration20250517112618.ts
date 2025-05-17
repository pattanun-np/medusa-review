import { Migration } from '@mikro-orm/migrations';

export class Migration20250517112618 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "review_media" add column if not exists "fileUrl" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "review_media" drop column if exists "fileUrl";`);
  }

}
