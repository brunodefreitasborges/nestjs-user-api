/*
  Warnings:

  - You are about to drop the `_UserToRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserToRoom";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_UserParticipantToRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserParticipantToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserParticipantToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserParticipantToRoom_AB_unique" ON "_UserParticipantToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_UserParticipantToRoom_B_index" ON "_UserParticipantToRoom"("B");
