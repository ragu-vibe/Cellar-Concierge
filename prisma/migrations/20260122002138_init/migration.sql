-- CreateTable
CREATE TABLE "Wine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bbrWin" TEXT,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "producer" TEXT,
    "colour" TEXT,
    "sweetness" TEXT,
    "volume" REAL,
    "hierarchyLevel2" TEXT,
    "hierarchyLevel3" TEXT,
    "unitSize" TEXT,
    "unitVolume" TEXT,
    "alcoholPercentage" REAL,
    "drinkingFromDate" INTEGER,
    "drinkingToDate" INTEGER,
    "maturity" TEXT,
    "grapeVariety1" TEXT,
    "grapePercentage1" REAL,
    "grapeVariety2" TEXT,
    "grapePercentage2" REAL,
    "grapeVariety3" TEXT,
    "grapePercentage3" REAL,
    "grapeVariety4" TEXT,
    "grapePercentage4" REAL,
    "grapeVariety5" TEXT,
    "grapePercentage5" REAL,
    "caseSize" INTEGER,
    "ibPricePerUnit" REAL,
    "ibPricePerCase" REAL,
    "dpPricePerUnit" REAL,
    "dpPricePerCase" REAL,
    "casesAvailable" REAL,
    "bottlesAvailable" INTEGER,
    "availableSales" REAL,
    "vintage" INTEGER,
    "qualityCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "accountManagerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Customer_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "AccountManager" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccountManager" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "wineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchasePrice" REAL,
    "currentMarketValue" REAL,
    "storedStatus" TEXT,
    "dutyStatus" TEXT,
    "region" TEXT,
    "propertyCode" TEXT,
    "propertyName" TEXT,
    "colour" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioHolding_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioHolding_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "accountManagerId" TEXT,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "budget" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    "approvedAt" DATETIME,
    "orderedAt" DATETIME,
    "amNote" TEXT,
    CONSTRAINT "Plan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plan_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "AccountManager" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "wineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerUnit" REAL,
    "priceType" TEXT,
    "reason" TEXT,
    "addedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlanItem_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanEdit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "wineId" TEXT,
    "newWineId" TEXT,
    "reason" TEXT,
    "editedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlanEdit_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "wineId" TEXT NOT NULL,
    "campaign" TEXT,
    "quantity" INTEGER NOT NULL,
    "pricePerUnit" REAL,
    "priceType" TEXT,
    "expiresAt" DATETIME,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'offered',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Allocation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Allocation_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SellIntent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "wineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "timeframe" TEXT,
    "targetPrice" REAL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "bbxListingId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SellIntent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SellIntent_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "originalSource" TEXT,
    "responseCreatedDate" DATETIME,
    "responseLastModifiedDate" DATETIME,
    "responseType" TEXT,
    "initialStatement" TEXT,
    "primaryMotivation" TEXT,
    "whichInterests" TEXT,
    "styleInterestAnswered" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestAll" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestRed" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestWhite" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestRose" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestSweet" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestSherryMadeira" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestPort" BOOLEAN NOT NULL DEFAULT false,
    "styleInterestSake" BOOLEAN NOT NULL DEFAULT false,
    "frenchWineAnswered" BOOLEAN NOT NULL DEFAULT false,
    "frenchWineAll" BOOLEAN NOT NULL DEFAULT false,
    "frenchRedBordeaux" BOOLEAN NOT NULL DEFAULT false,
    "frenchWhiteBordeaux" BOOLEAN NOT NULL DEFAULT false,
    "frenchRedBurgundy" BOOLEAN NOT NULL DEFAULT false,
    "frenchWhiteBurgundyChablis" BOOLEAN NOT NULL DEFAULT false,
    "frenchChampagne" BOOLEAN NOT NULL DEFAULT false,
    "frenchRhoneValley" BOOLEAN NOT NULL DEFAULT false,
    "frenchLoireValley" BOOLEAN NOT NULL DEFAULT false,
    "frenchBeaujolais" BOOLEAN NOT NULL DEFAULT false,
    "frenchAlsace" BOOLEAN NOT NULL DEFAULT false,
    "frenchSweetWines" BOOLEAN NOT NULL DEFAULT false,
    "frenchSouthernFrance" BOOLEAN NOT NULL DEFAULT false,
    "frenchNone" BOOLEAN NOT NULL DEFAULT false,
    "italianWineAnswered" BOOLEAN NOT NULL DEFAULT false,
    "italianWineAll" BOOLEAN NOT NULL DEFAULT false,
    "italianPiedmont" BOOLEAN NOT NULL DEFAULT false,
    "italianBrunelloMontalcino" BOOLEAN NOT NULL DEFAULT false,
    "italianTuscany" BOOLEAN NOT NULL DEFAULT false,
    "italianOther" BOOLEAN NOT NULL DEFAULT false,
    "italianNone" BOOLEAN NOT NULL DEFAULT false,
    "europeanWineAnswered" BOOLEAN NOT NULL DEFAULT false,
    "europeanWineAll" BOOLEAN NOT NULL DEFAULT false,
    "europeanSpain" BOOLEAN NOT NULL DEFAULT false,
    "europeanPortugal" BOOLEAN NOT NULL DEFAULT false,
    "europeanGermanyAustria" BOOLEAN NOT NULL DEFAULT false,
    "europeanEngland" BOOLEAN NOT NULL DEFAULT false,
    "europeanOther" BOOLEAN NOT NULL DEFAULT false,
    "europeanNone" BOOLEAN NOT NULL DEFAULT false,
    "rowWineAnswered" BOOLEAN NOT NULL DEFAULT false,
    "rowWineAll" BOOLEAN NOT NULL DEFAULT false,
    "rowSouthAmerica" BOOLEAN NOT NULL DEFAULT false,
    "rowNorthAmerica" BOOLEAN NOT NULL DEFAULT false,
    "rowAustralia" BOOLEAN NOT NULL DEFAULT false,
    "rowNewZealand" BOOLEAN NOT NULL DEFAULT false,
    "rowSouthAfrica" BOOLEAN NOT NULL DEFAULT false,
    "rowNone" BOOLEAN NOT NULL DEFAULT false,
    "collectorSpendAnswered" BOOLEAN NOT NULL DEFAULT false,
    "collectorSpendAllRanges" BOOLEAN NOT NULL DEFAULT false,
    "collectorSpend20to50" BOOLEAN NOT NULL DEFAULT false,
    "collectorSpend50to100" BOOLEAN NOT NULL DEFAULT false,
    "collectorSpend100to250" BOOLEAN NOT NULL DEFAULT false,
    "collectorSpend250plus" BOOLEAN NOT NULL DEFAULT false,
    "drinkNowSpendAnswered" BOOLEAN NOT NULL DEFAULT false,
    "drinkNowSpendAllRanges" BOOLEAN NOT NULL DEFAULT false,
    "drinkNowSpendUpTo20" BOOLEAN NOT NULL DEFAULT false,
    "drinkNowSpend20to50" BOOLEAN NOT NULL DEFAULT false,
    "drinkNowSpend50to100" BOOLEAN NOT NULL DEFAULT false,
    "drinkNowSpend100plus" BOOLEAN NOT NULL DEFAULT false,
    "spiritsInterestAnswered" BOOLEAN NOT NULL DEFAULT false,
    "spiritsInterestAll" BOOLEAN NOT NULL DEFAULT false,
    "spiritsScotchWhiskies" BOOLEAN NOT NULL DEFAULT false,
    "spiritsOtherWhiskies" BOOLEAN NOT NULL DEFAULT false,
    "spiritsGin" BOOLEAN NOT NULL DEFAULT false,
    "spiritsRum" BOOLEAN NOT NULL DEFAULT false,
    "spiritsTequilaMezcal" BOOLEAN NOT NULL DEFAULT false,
    "spiritsCognacArmagnac" BOOLEAN NOT NULL DEFAULT false,
    "spiritsVodka" BOOLEAN NOT NULL DEFAULT false,
    "whiskyRegionAnswered" BOOLEAN NOT NULL DEFAULT false,
    "whiskyRegionAll" BOOLEAN NOT NULL DEFAULT false,
    "whiskySpeyside" BOOLEAN NOT NULL DEFAULT false,
    "whiskyHighland" BOOLEAN NOT NULL DEFAULT false,
    "whiskyLowland" BOOLEAN NOT NULL DEFAULT false,
    "whiskyIslayIslands" BOOLEAN NOT NULL DEFAULT false,
    "whiskyCampbeltown" BOOLEAN NOT NULL DEFAULT false,
    "whiskyEngland" BOOLEAN NOT NULL DEFAULT false,
    "whiskyIreland" BOOLEAN NOT NULL DEFAULT false,
    "whiskyScandinavia" BOOLEAN NOT NULL DEFAULT false,
    "whiskyRestOfEurope" BOOLEAN NOT NULL DEFAULT false,
    "whiskyBourbonUSA" BOOLEAN NOT NULL DEFAULT false,
    "whiskyRyeUSA" BOOLEAN NOT NULL DEFAULT false,
    "whiskyTaiwanIndia" BOOLEAN NOT NULL DEFAULT false,
    "whiskyJapan" BOOLEAN NOT NULL DEFAULT false,
    "whiskyAustraliaNewZealand" BOOLEAN NOT NULL DEFAULT false,
    "spiritsSpendAnswered" BOOLEAN NOT NULL DEFAULT false,
    "spiritsSpendAllRanges" BOOLEAN NOT NULL DEFAULT false,
    "spiritsSpendUpTo100" BOOLEAN NOT NULL DEFAULT false,
    "spiritsSpend100to200" BOOLEAN NOT NULL DEFAULT false,
    "spiritsSpend200to1000" BOOLEAN NOT NULL DEFAULT false,
    "spiritsSpend1000plus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomerPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VintageRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "region" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rating" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioHolding_customerId_wineId_key" ON "PortfolioHolding"("customerId", "wineId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPreference_customerId_key" ON "CustomerPreference"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "VintageRating_region_year_key" ON "VintageRating"("region", "year");
