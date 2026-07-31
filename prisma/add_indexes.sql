CREATE INDEX IF NOT EXISTS "Booking_userId_idx" ON "Booking"("userId");
CREATE INDEX IF NOT EXISTS "Booking_classId_idx" ON "Booking"("classId");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "FitnessClass_startTime_idx" ON "FitnessClass"("startTime");
CREATE INDEX IF NOT EXISTS "FitnessClass_location_idx" ON "FitnessClass"("location");
CREATE INDEX IF NOT EXISTS "FitnessClass_instructorId_idx" ON "FitnessClass"("instructorId");
