-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "presence" BOOLEAN NOT NULL,
    "spf" TEXT,
    "dkim" TEXT,
    "dmarc" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);
