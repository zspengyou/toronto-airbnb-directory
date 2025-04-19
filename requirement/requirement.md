

## Project overview
webpage to search airbnb based on csv file, show the search result to the user. 

## Feature requirements
I have a csv file with following properties: 
* _id: Unique row identifier for Open Data database
* operator_registration_number: Short-term rental operator registration number issued by the City of Toronto
* address: Short-term rental property street name and number provided by the operator at registration
* unit: Short-term rental property unit number provided by the operator at registration
* postal_code: First 3 characters of the postal code associated with address of a short-term rental property
* property_type: Short-term rental property description based on physical and legal characteristics. For example: Apartment, Condominium, Single Family Detached etc.
* ward_number: Ward number of the address listed as a short-term rental property
* ward_name: Ward name of the address listed as a short-term rental property

here are some data

| _id      | operator_registration_number | address          | unit | postal_code | property_type               | ward_number  | ward_name           |
|----------|------------------------------|------------------|------|--------------|----------------------------|--------------|---------------------|
| 4387432  | STR-2301-HBQHHW              | 137 Danforth Ave | 1    | M4K          | Apartment                  | 14           | Toronto-Danforth    |
| 4387433  | STR-2301-HHRRVW              | 631 Queens St W  | 2    | M5V          | Apartment                  | 10           | Spadina-Fort York   |
| 4387434  | STR-2209-JCLRVM              | 91 Hove St       |      | M3H          | Single/Semi-detached House | 6            | York Centre         |


create a website with a search bar that user can input 1. unit 2. address (street number and street name). 
search based on data under /data/short-term-rental-registrations-data.csv
search result will be shown in a table with 4 column: operator_registration_number,  address, unit, property_type
show totoal number of units matched 


## project file structure
├── README.md
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── input.tsx
│       └── table.tsx
├── components.json
├── data
│   └── short-term-rental-registrations-data.csv
├── eslint.config.mjs
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── requirement
│   ├── airbnb search mockup.png
│   └── requirement.md
└── tsconfig.json


## Rules
Alll new components should be /components and be named like example-component.tsx
All new pages go in /app/ and be named like example-page.tsx
Alll new lib files go in /lib and be named like example-lib.ts
Alll new utils go in /lib/utils and be named like example-utils.ts
Alll new api routes go in /src/app/api and be named like example-api.ts
Alll new styles go in /src/app/globals.css
Alll new fonts go in /src/app/fonts and be named like example-font.tsx
Alll new images go in /public/images and be named like example-image.png
Alll new icons go in /src/app/icons and be named like example-icon.tsx
Alll new icons go in /src/app/icons and be named like example-icon.tsx