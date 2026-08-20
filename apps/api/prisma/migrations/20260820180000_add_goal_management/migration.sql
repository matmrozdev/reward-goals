-- CreateEnum
CREATE TYPE "GoalMeasurementType" AS ENUM ('COUNT');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "Goal" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(1000),
    "measurementType" "GoalMeasurementType" NOT NULL DEFAULT 'COUNT',
    "targetValue" INTEGER,
    "scheduleDays" "Weekday"[] NOT NULL DEFAULT ARRAY[]::"Weekday"[],
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Goal_targetValue_check" CHECK ("targetValue" IS NULL OR "targetValue" > 0)
);

-- CreateTable
CREATE TABLE "GoalProgressEntry" (
    "id" UUID NOT NULL,
    "goalId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "undoneAt" TIMESTAMP(3),

    CONSTRAINT "GoalProgressEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalReward" (
    "id" UUID NOT NULL,
    "goalId" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "requiredProgress" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalReward_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GoalReward_requiredProgress_check" CHECK ("requiredProgress" > 0)
);

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Goal_userId_archivedAt_idx" ON "Goal"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "Goal_userId_status_idx" ON "Goal"("userId", "status");

-- CreateIndex
CREATE INDEX "GoalProgressEntry_goalId_undoneAt_idx" ON "GoalProgressEntry"("goalId", "undoneAt");

-- CreateIndex
CREATE INDEX "GoalProgressEntry_goalId_createdAt_idx" ON "GoalProgressEntry"("goalId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoalReward_goalId_key" ON "GoalReward"("goalId");

-- CreateIndex
CREATE INDEX "GoalReward_goalId_unlockedAt_idx" ON "GoalReward"("goalId", "unlockedAt");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalProgressEntry" ADD CONSTRAINT "GoalProgressEntry_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalReward" ADD CONSTRAINT "GoalReward_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
