Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.8 (2026-03-01)
====================================================================

### ➕ Added

- A game can now be randomly found and choosen. (Starz0r)
- Games can now have their owners changed, or their game removed entirely by admins. (Starz0r, TTBB)
- Messages from a thread can be replied to. (TTBB)
- More Report functionality. (TTBB)
- News entries can now be visited and read. (TTBB)
- News is now rendered, and displayed. (Starz0r, TTBB)
- Pages now display their current title in the web browser tab. (TTBB)
- Reviews can now be removed. (TTBB)
- Screenshots can be deleted. (Starz0r)
- Sortable columns on the user list. (TTBB)

### 🔧 Fixed

- Game and Review count on the Home page now accurately displays the correct value. (TTBB)
- Reviews now properly word wrap. (TTBB)

### 🗑 Removed

- Dropped deprecated links from the navigation bar. (Starz0r)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.6 (2025-09-09)
====================================================================

### ➕ Added

- Direct Messages can be Composed from the Inbox. (TTBB)
- Guidelines page listing all current rules. (TTBB)
- Inbox is now populated with your messages. (TTBB)
- Reviews can be liked and unliked. (TTBB)
- Some report functionality. (Starz0r)

### 🔧 Fixed

- Minor LCP issue regarding the Cherry in the site header.

### 🔄 Changed

- Certain pages are hidden to the user when not logged in. (TTBB)
- Reveal specific functionality on some pages when logged in. (TTBB)
- User page is now called the Profile page. (TTBB)
- You can now edit your Profile from the application (with the exception of Twitter links). (TTBB)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.5 (2025-09-05)
====================================================================

### ➕ Added

- Changelog is now embedded into the application. (Starz0r)
- Reviews can now be published or edited. (TTBB)
- Screenshot pages has been implemented, and the functionality has been added. (Starz0r)
- Uploading screenshot page has been implemented, and the functionality has been added. (TTBB)

### 🔄 Changed

- Clicking on Tags now brings you to a search query with them. (TTBB)
- Search page handling has been improved and multiple different ways. (TTBB)
- User Profiles now show some of the their details from the database. (TTBB)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.4 (2025-08-30)
====================================================================

### ➕ Added

- Compose message page has been reimplemented. (TTBB)
- Successfully logging in now redirects you back to the Home page, after some time has passed. (Starz0r)

### 🔄 Changed

- Session handling is slightly better. (Starz0r)
- Tag count is now correctly displayed along with Tags no longer repeating and being duplicated on individual Game pages. (Starz0r)
- Upgraded Axios to 1.2.6 (Starz0r)
- Upgraded Next.js to 13.1.2 (Starz0r)
- Upgraded Tailwind CSS to 3.3.0 (Starz0r)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.3 (2025-08-29)
==============================================================

### ➕ Added

- Reviews are now lazily loaded on individual game pages. (TTBB)

### 🔄 Changed

- Session handling is slightly better. (Starz0r)
- Upgrade Axios to 1.2.5 (Starz0r)
- Upgrade Next.js to 13.1.1 (Starz0r)
- Upgrade Tailwind CSS to 3.2.7 (Starz0r)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.2 (2025-08-28)
==============================================================

### ➕ Added

- Game pages now look closer to their original counterparts. (TTBB)
- User pages have been reimplemented. (TTBB)
- You can now look at all the reviews, starting from the latest. (Starz0r)

### 🔄 Changed

- Upgrade Axios to 1.2.4 (Starz0r)
- Upgrade Next.js to 13.1.0 (Starz0r)
- Upgrade Tailwind CSS to 3.2.6 (Starz0r)
- Upgrade jsonwebtoken to 8.4.0 (Starz0r)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.1 (2025-08-26)
==============================================================

### ➕ Added

- Forgot password page was implemented. (Starz0r)

### 🔄 Changed

- Upgrade Axios to 1.2.3 (Starz0r)
- Upgrade Next.js to 13.0.7 (Starz0r)
- Upgrade Node.js to 16.20.2 (Starz0r)
- Upgrade Tailwind CSS to 3.2.5 (Starz0r)
- Upgrade TypeScript to 5.1.6 (Starz0r)
- Upgrade jsonwebtoken to 8.3.0 (Starz0r)
- Individual game pages now display their screenshots. (Starz0r)
- Reviews, Home page, the Image Carousel, individual Game pages, and Tags look closer to their original counterpart. (TTBB)
- Search page is slightly more performant. (Starz0r, TTBB)


Delicious Fruit [Client, Weeping Higan] 1.0.0-preview.0 (2025-08-22)
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
