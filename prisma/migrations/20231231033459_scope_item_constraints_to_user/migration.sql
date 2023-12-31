/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order,userId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_name_key";

-- DropIndex
DROP INDEX "Item_order_key";

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_userId_key" ON "Item"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_order_userId_key" ON "Item"("order", "userId");
