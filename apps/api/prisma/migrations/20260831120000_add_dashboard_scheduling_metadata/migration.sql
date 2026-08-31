-- AlterTable
ALTER TABLE "Goal" ADD COLUMN "scheduledTimeMinutes" INTEGER;

-- AddConstraint
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_scheduledTimeMinutes_check"
CHECK (
    "scheduledTimeMinutes" IS NULL
    OR (
        "scheduledTimeMinutes" >= 0
        AND "scheduledTimeMinutes" <= 1439
    )
);
