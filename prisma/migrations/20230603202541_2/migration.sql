/*
  Warnings:

  - Made the column `confirmationToken` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passwordResetToken` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmationToken" TEXT NOT NULL,
    "passwordResetToken" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dx3a'
);
INSERT INTO "new_User" ("confirmationToken", "createdAt", "email", "emailConfirmed", "id", "name", "password", "passwordResetToken", "profilePicture", "role") SELECT "confirmationToken", "createdAt", "email", "emailConfirmed", "id", "name", "password", "passwordResetToken", "profilePicture", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
