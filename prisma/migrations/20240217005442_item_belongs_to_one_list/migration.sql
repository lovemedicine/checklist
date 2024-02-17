/*
  Warnings:

  - You are about to drop the column `userId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `ListItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order,listId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_userId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_listId_fkey";

-- DropIndex
DROP INDEX "Item_name_userId_key";

-- DropIndex
DROP INDEX "Item_order_userId_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "userId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ListItem";

-- CreateIndex
CREATE UNIQUE INDEX "Item_order_listId_key" ON "Item"("order", "listId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
