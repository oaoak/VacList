/*
  Warnings:

  - A unique constraint covering the columns `[spot_id,user_id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Review_spot_id_user_id_key` ON `Review`(`spot_id`, `user_id`);
