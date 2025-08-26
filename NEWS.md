Delicious Fruit [client, weeping] 1.0.0-preview.1 (2025-08-26)
==============================================================

### ➕ Added

- Forgot password page was implemented. (Starz0r)

### 🔄 Changed

- Upgrade Axios to 1.2.3
- Upgrade Next.js to 13.0.7
- Upgrade Node.js to 16.20.2
- Upgrade Tailwind CSS to 3.2.5
- Upgrade TypeScript to 5.1.6
- Upgrade jsonwebtoken to 8.3.0
- Individual game pages now display their screenshots. (Starz0r)
- Reviews, Home page, the Image Carousel, individual Game pages, and Tags look closer to their original counterpart. (TTBB)
- Search page is slightly more performant. (Starz0r, TTBB)


Delicious Fruit [client, weeping] 1.0.0-preview.0 (2025-08-22)
====================================

### ➕ Added

- Use server for infinite scrolling and sorting while searching. (TTBB)

### 🔧 Fixed

- Individual game pages no longer makes additional unnecessary API calls when it has already fetched all the details to populate the document. (Starz0r)
- Individual game pages no longer loop gets stuck in a loop making API calls. (Starz0r)
- Home page no longer makes additional unnecessary API calls when it has already fetched all the details to populate the document. (Starz0r)
- Individual game page navigation now works as intended. (Starz0r)
- Search page now allows you to navigate to game pages listed by the query. (Starz0r)
- Tags were being incorrectly mapped, causing the application to crash. (Starz0r)
- Individual game pages without a proper rating no longer cause the application to crash. (Starz0r)
- Tags on reviews were being incorrectly mapped, causing the application to crash. (Starz0r)
- Cache bug when sorting while searching. (TTBB)

### 🔄 Changed

- Upgrade Axios to 1.2.2 (Starz0r)
- Upgrade ESLint to 8.29.0 (Starz0r)
- Upgrade ESLint Config Next to 13.0.6 (Starz0r)
- Upgrade jsonwebtoken to 8.2.2 (Starz0r)
- Upgrade Next.js to 13.0.6 (Starz0r)
- Upgrade TypeScript to 5.1.3 (Starz0r)
- Upgrade Node.js to 16.20.1 (Starz0r)
- Reviews now more accurately displays information as it did originally. (TTBB)
