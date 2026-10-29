-- Rename district column to province on Customer table
ALTER TABLE "Customer" RENAME COLUMN "district" TO "province";

-- Rename district column to province on Order table
ALTER TABLE "Order" RENAME COLUMN "district" TO "province";
