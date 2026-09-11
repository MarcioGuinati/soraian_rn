-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "photo" TEXT,
    "birth_weight" DOUBLE PRECISION,
    "birth_height" DOUBLE PRECISION,
    "blood_type" TEXT,
    "parent_names" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeding_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount_ml" DOUBLE PRECISION,
    "breast_side" TEXT,
    "duration_minutes" INTEGER,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feeding_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "meal_type" TEXT NOT NULL,
    "food" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "unit" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diaper_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "consistency" TEXT,
    "color" TEXT,
    "amount" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diaper_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sleep_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "location" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sleep_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bath_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER,
    "water_temperature" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bath_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temperature_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "measurement_method" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temperature_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION,
    "head_circumference" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_records" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "unit" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medication_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "professional" TEXT NOT NULL,
    "specialty" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccines" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "batch" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vaccines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date_time" TIMESTAMP(3) NOT NULL,
    "recurrence" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "category" TEXT,
    "content" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "children_user_id_idx" ON "children"("user_id");

-- CreateIndex
CREATE INDEX "feeding_records_child_id_idx" ON "feeding_records"("child_id");

-- CreateIndex
CREATE INDEX "feeding_records_recorded_at_idx" ON "feeding_records"("recorded_at");

-- CreateIndex
CREATE INDEX "feeding_records_child_id_recorded_at_idx" ON "feeding_records"("child_id", "recorded_at");

-- CreateIndex
CREATE INDEX "food_records_child_id_idx" ON "food_records"("child_id");

-- CreateIndex
CREATE INDEX "food_records_recorded_at_idx" ON "food_records"("recorded_at");

-- CreateIndex
CREATE INDEX "diaper_records_child_id_idx" ON "diaper_records"("child_id");

-- CreateIndex
CREATE INDEX "diaper_records_recorded_at_idx" ON "diaper_records"("recorded_at");

-- CreateIndex
CREATE INDEX "diaper_records_child_id_recorded_at_idx" ON "diaper_records"("child_id", "recorded_at");

-- CreateIndex
CREATE INDEX "sleep_records_child_id_idx" ON "sleep_records"("child_id");

-- CreateIndex
CREATE INDEX "sleep_records_started_at_idx" ON "sleep_records"("started_at");

-- CreateIndex
CREATE INDEX "sleep_records_child_id_started_at_idx" ON "sleep_records"("child_id", "started_at");

-- CreateIndex
CREATE INDEX "bath_records_child_id_idx" ON "bath_records"("child_id");

-- CreateIndex
CREATE INDEX "bath_records_started_at_idx" ON "bath_records"("started_at");

-- CreateIndex
CREATE INDEX "temperature_records_child_id_idx" ON "temperature_records"("child_id");

-- CreateIndex
CREATE INDEX "temperature_records_recorded_at_idx" ON "temperature_records"("recorded_at");

-- CreateIndex
CREATE INDEX "weight_records_child_id_idx" ON "weight_records"("child_id");

-- CreateIndex
CREATE INDEX "weight_records_recorded_at_idx" ON "weight_records"("recorded_at");

-- CreateIndex
CREATE INDEX "medication_records_child_id_idx" ON "medication_records"("child_id");

-- CreateIndex
CREATE INDEX "medication_records_recorded_at_idx" ON "medication_records"("recorded_at");

-- CreateIndex
CREATE INDEX "appointments_child_id_idx" ON "appointments"("child_id");

-- CreateIndex
CREATE INDEX "appointments_date_idx" ON "appointments"("date");

-- CreateIndex
CREATE INDEX "vaccines_child_id_idx" ON "vaccines"("child_id");

-- CreateIndex
CREATE INDEX "vaccines_date_idx" ON "vaccines"("date");

-- CreateIndex
CREATE INDEX "reminders_child_id_idx" ON "reminders"("child_id");

-- CreateIndex
CREATE INDEX "reminders_date_time_idx" ON "reminders"("date_time");

-- CreateIndex
CREATE INDEX "notes_child_id_idx" ON "notes"("child_id");

-- CreateIndex
CREATE INDEX "notes_recorded_at_idx" ON "notes"("recorded_at");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeding_records" ADD CONSTRAINT "feeding_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_records" ADD CONSTRAINT "food_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaper_records" ADD CONSTRAINT "diaper_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep_records" ADD CONSTRAINT "sleep_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bath_records" ADD CONSTRAINT "bath_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temperature_records" ADD CONSTRAINT "temperature_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weight_records" ADD CONSTRAINT "weight_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_records" ADD CONSTRAINT "medication_records_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;
