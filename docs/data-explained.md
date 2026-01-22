## Summary
We have been given a breadth of wine data to inform the POC, I have gone into detail about the data we have access to in each data file, and what it means.

I have also started to list some of the data we don't yet have access to that could be useful going forward.

## Material Codes
Material codes are used across the data files to represent a single material record, they are heavily used across BBR's systems also since they represent the same.

2022-06-00750-00-1007039

| Vintage | 2022 |
| ---| --- |
| Case Size | 06 |
| Bottle Size | 750ml |
| Quality Code | 00 |
| BBR WIN | 1007039 |

1000-06-00750-G2-8308625

| Vintage | No vintage assigned |
| ---| --- |
| Case Size | 06 |
| Bottle Size | 750ml |
| Quality Code | G2 |
| BBR WIN | 8308625 |

Vintage code will either be the year the grapes used were harvested (correct me here?) or if no vintage is assigned, the vintage code will be 1000

Case size is the number of bottles in a case

Quality Code represents one of two things. 00 is normal expected quality, so encompasses most bottles. If the code is other than 00 then it represents that either the bottle or packaging is in a lesser than normal quality state. This could be damaged packaging, label, markings on the bottle etc. Quality codes are not comparable with each other, for example G2 does not compare with G2 on another wine, it is just a representation of lower quality in some way.

BBR WIN is the BBR Wine Identification Number (similar to LWIN) that represents that wine from a producer across vintages. These are BBR internal.

## Maturity model

BBR are moving towards a unified model, but there are still some older maturities that are across systems.

New Model - 4 terms:
*   Not Ready
*   Ready - youthful
*   Ready - Mature
*   Ready - at best

Other maturities we see:
*   Ready, but will improve (9 records)
*   Ready, but will keep (27 records)
*   Drink now (27 records)
*   For laying down (5 records)
*   NULL (8110 records)

New model descriptions as per BBR website:

> When is a wine ready to drink?  
>   
> The best time to drink a wine depends on your taste. We provide drinking windows for all our wines. Alongside the drinking windows there is a bottle icon and a maturity term. Read below to understand these terms.

> Not ready  
>   
> These wines are very young. Whilst they’re likely to have lots of intense flavours, their acidity or tannins may make them feel austere. Although it isn’t wrong to drink these wines now, you are likely to miss out on a lot of complexity by not waiting for the start of their drinking window.

> Ready - youthful  
>   
> These wines are entering their drinking window. They’re likely to have plenty of fruit flavours still and, for red wines, the tannins may well be quite noticeable. For those who prefer younger, fruitier wines, or if serving alongside a robust meal, these will be very enjoyable now. Alternatively, you can keep these wines in your cellar to develop further complexity.

> Ready - at best  
>   
> These wines are in their peak drinking window and are likely to have a beautiful balance of flavours. The structure will have softened somewhat, and the wines will show plenty of complexity. For many, this is seen as the ideal time to drink and enjoy them. If you choose to hold onto these wines, they will continue to evolve but not necessarily gain more complexity.

> Ready - mature  
>   
> These wines are fully mature and should be withdrawn to enjoy before the end of their drinking window. Whilst these bottles are likely to have plenty of complexity, the fruit flavours will have faded. These wines may have a beautiful texture at this stage of maturity.

## CPR Holdings Data

The data describes a structure related to CPR Holdings, which could stand for either "Customer Portfolio Record" or "Cellar Portfolio Record." Below is an explanation of each field:

1. **Region**: The geographical area associated with the material

`(Dimension - Material[Region])`

2. **Customer Number**: A unique identifier for the customer

`(Dimension - Customer[Customer Number])`

3. **Account Manager**: The employee responsible for the customer

`(Dimension - Customer[Employee Responsible])`

4. **Material Code**: A code representing the material in stock

`(Fact - CPR Stock and Value[Material Code])`

5. **Vineyard ID**: A unique identifier for the vineyard

`(Dimension - Property[Property Code])`

6. **Vineyard Name**: The name of the vineyard

`(Dimension - Property[Property Name])`

7. **Quantity**: The current quantity of the material in stock, measured in number of bottles

`(Measure - CPR_Current_Quantity__Units)`

8. **Wine Colour**: The colour of the wine, such as red, white, or rosé

`(Dimension - Material[Colour])`

## BBX Data
Each row represents the following fields:

*   **ListingId**: Unique identifier for the listing.
*   **ParentCode**: Code linking to a parent record.
*   **MaterialCode**: Code representing the specific wine material.
*   **MaterialDescriptionLong**: Detailed description of the wine.
*   **LWIN**: Identifier similar to BBR WIN, used across vintages. Refers to [https://www.liv-ex.com/wwd/lwin/lwin-get-started/](https://www.liv-ex.com/wwd/lwin/lwin-get-started/)
*   **Country**: Country of origin.
*   **Region**: Wine's geographical region.
*   **Vintage**: Year the wine was produced or harvested.
*   **Property**: Name of the vineyard or property.
*   **UnitSize**: Size of each bottle in words (e.g. Magnum, bottle, Six-bottle Assortment Case)
*   **CaseSize**: Number of bottles in a case.
*   **ListedQuantity**: Total number of bottles listed.
*   **ListedValue**: Total value of the listing.
*   **ListedCaseCount**: Number of cases listed.
*   **Wine Scores**: Includes scores from Wine Advocate, Robert Parker, Galloni, Jancis, and Burghound.
*   **BBXHighestBid**: Highest bid on the listing.
*   **BBXHighestBidderReference**: Reference for the highest bidder (customer number).
*   **BBXLowestBid**: Lowest bid on the listing.
*   **Livex Prices**: Includes adjusted Livex price, market price, and percentage difference.
*   **WineSearcher Prices**: Includes adjusted lower list value and percentage difference.
*   **CustomerNumber**: Identifier for the customer listing the wine.
*   **OriginalPurchasePrice**: Price originally paid for the wine.
*   **Staff**: Staff member managing the listing.
*   **ListingDatetime**: Date and time the listing was created.
*   **ListingStatus**: Current status of the listing (e.g., active, sold).
*   **LastChangeDatetime**: Last time the listing was updated.
*   **BatchNumbers**: Batch details for the wine.
*   **Location**: Storage location of the wine.
*   **Bins**: Specific bin location.
*   **Conditions**: Includes bottle, wine, and packaging conditions.
*   **OwnGoods**: Indicates if the wine is owned by the customer.
*   **WebsiteUrl**: URL for the listing on the website.
*   **BestBBX**: Best BBX offer or deal.
*   **Broking Prices**: Includes last transaction price and best list price.
*   **Colour**: Wine color (e.g., red, white, rosé).
*   **Maturity**: Maturity level of the wine. (Not ready, Ready - youthful, Ready - Mature, Ready - at best)

## Product File Data
Each row represents the following fields:

1. **MaterialCode**: A unique code identifying the product.
2. **MaterialDescription**: A detailed description of the product, including its name.
3. **BBRWIN**: The internal BBR Wine Identification Number, similar to LWIN, used to identify the wine across vintages.
4. **Country**: The country where the product originates.
5. **Region**: The specific geographical region of the product.
6. **Producer**: The name of the producer or brand.
7. **Colour**: The colour of the wine, such as red, white, or rosé.
8. **Sweetness**: Indicates the sweetness level of the wine.
9. **Volume**: The volume of the product in litres.
10. **HierarchyLevel2**: A broad category for the product, such as wine, spirits, or non-drink items.
11. **HierarchyLevel3**: A more specific subcategory, like still wine, sparkling wine, or Scotch whisky.
12. **UnitSize**: The size description of the product, e.g., Bottle, Magnum, Jeroboam.
13. **UnitVolume**: A text representation of the product's volume, e.g., 150CL, 37.5CL.
14. **AlcoholPercentage**: The alcohol content of the product, expressed as a percentage.
15. **DrinkingFromDate**: The earliest year the product is recommended for drinking.
16. **DrinkingToDate**: The latest year the product is recommended for drinking.
17. **Maturity**: The current maturity level of the wine, such as "Not ready" or "Ready - at best."

## Stock File Data
Each row represents the following fields:

1. **MaterialCode**: A unique identifier for the product, often representing a specific wine or item.
2. **CaseSize**: The number of bottles included in a single case.
3. **IBPricePU**: The price per unit (bottle) when sold "In Bond," meaning without duty or VAT applied.
4. **IBPricePerCase**: The total price for a full case when sold "In Bond."
5. **DPPricePU**: The price per unit (bottle) when sold "Duty Paid," meaning all taxes and duties have been applied.
6. **DPPricePerCase**: The total price for a full case when sold "Duty Paid."
7. **CasesAvailableToPurchase**: The number of cases currently available for purchase. This may not always be a whole number.
8. **BottlesAvailableToPurchase**: The total number of individual bottles available for purchase.
9. **AvailableSales**: The total value of the available stock, calculated as the "In Bond" price per bottle multiplied by the number of bottles available.

## Other data we don't currently have that could be useful:
*   Customer purchase history + Spending habits

This would help us to identify patterns in customer purchases, and look to pre-empt opportunities to sell to them, also knowing how much they tend to spend each time they purchase (would help to constrain those upsells opportunities to their price range)

*   Wines bought direct but not in cellar

Right now, we can only see what is in their cellar, in order to make any observations about their preferences etc. Not being able to see wines that were bought direct for delivery means we are missing potentially useful insights about the customer and their tastes/preferences.

*   Grape information and other PIM descriptors of wines (searchable keywords)

More searchable information that would enable us to filter for certain wines or better describe the wines and compare with other wines

*   Tasting notes/reviews

These would be perfect for inclusion into emails where recommendations are made for wines - so as to sell the reason why it's a good match/to better describe the wine

*   Wine descriptions (copy) available through website, only product name descriptor (includes region etc)

As above, potentially useful for describing wines to customers, even in summary form.

*   Customer information - demographic info/account value etc

Knowing "who" the customer is might enable the LLM to better suggest the types of wines/products they might like. Age/nationality/race etc, but also budgetary guidelines for constraining options etc.

*   Historical wine values/prices over time

Value is an ongoing discussion with Will and Ellie, the LLM can't currently accurately talk about value of wines in the cellars as increasing or decreasing value as we only have a single data point with the price. But also, knowing that a wine is discounted etc could be useful for upselling opportunities.

*   Deals of the day (upsell opportunities)

Will has mentioned previously that each day the account managers are given a list of wines to try and upsell each day. This is currently sent out as an email, but isn't available to the LLM to make use of.

*   Logistical information (transport capabilities/costs, wine storage locations etc)

Currently the LLM has no knowledge of transport possibilites - can the wine be delivered by X date to Y location. This seems to be in a number of the scenarios that were sent over, so might be a useful addition to have. Also knowing where in the world the bottles are would be critical to know if it can be delivered somewhere.