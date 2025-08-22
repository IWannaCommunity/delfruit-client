weeping 1.0.0-preview.0 (2025-08-22)
====================================

### ➕ Added

- Use server for infinite scrolling and sorting while searching. (ttbb.0)

### 🔧 Fixed

- Individual game pages no longer makes additional unnecessary API calls when it has already fetched all the details to populate the document. (starz0r.0)
- Individual game pages no longer loop gets stuck in a loop making API calls. (starz0r.1)
- Home page no longer makes additional unnecesarry API calls when it has already fetched all the details to populate the document. (starz0r.2)
- Individual game page navigation now works as intended. (starz0r.3)
- Search page now allows you to navigate to game pages listed by the query. (starz0r.4)
- Tags were being incorrectly mapped, causing the application to crash. (starz0r.5)
- Individual game pages without a proper rating no longer cause the application to crash. (starz0r.6)
- Tags on reviews were being incorrectly mapped, causing the application to crash. (starz0r.7)
- Cache bug when sorting while searching. (ttbb.0)

### 🔄 Changed

- Upgrade Axios to 1.2.2 (starz0r.0)
- Upgrade ESLint to 8.29.0 (starz0r.1)
- Upgrade ESLint Config Next to 13.0.6 (starz0r.2)
- Upgrade jsonwebtoken to 8.2.2 (starz0r.3)
- Upgrade Next.js to 13.0.6 (starz0r.4)
- Upgrade TypeScript to 5.1.3 (starz0r.5)
- Upgrade Node.js to 16.20.1 (starz0r.6)
- Reviews now more accurately displays information as it did originally. (ttbb.0)
