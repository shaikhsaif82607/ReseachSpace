RESEACHSPACE - UPDATED PROJECT

1. Copy the ReseachSpace folder to:
   C:\xampp\htdocs\ReseachSpace

2. Start Apache and MySQL in XAMPP.

3. Open phpMyAdmin and make sure the database is named:
   reseachspace

4. If this is a new database, import backend/database.sql.
   Do NOT drop your existing database if you already have users/papers.

5. Open the project through Apache, NOT by opening HTML files directly:
   http://localhost/ReseachSpace/

IMPORTANT AUTH FLOW
- login.html = login only
- signup.html = registration only
- Login creates a PHP session.
- Home/Explore/Topics show the logged-in user's name on the right.
- When logged out, those pages show Log in.
- Profile shows Log out.
- Upload is protected by PHP and requires login.
- The upload Author field is filled from the logged-in PHP session.
- upload.php saves the paper using the logged-in user's ID, so the browser cannot choose another author.

IMPORTANT
The project uses PHP. Do not run it with VS Code Live Server (127.0.0.1:5500).
Use http://localhost/ReseachSpace/ so PHP sessions and backend endpoints work correctly.

VIEW / DOWNLOAD FIX
- View paper opens the actual PDF in the browser.
- Download PDF downloads the actual PDF.
- The backend checks both backend/uploads and the project's root uploads folder so older uploaded papers continue to work.


NEW: DELETE RESEARCH
On the profile page, each of the logged-in user's own papers has a Delete research button. The server verifies the logged-in user is the paper author before deleting the database record and PDF.


PDF FIX: View opens view.html and loads PDF as a data URL. Download uses a data URL. This avoids IDM intercepting the PDF request and prevents 0-byte downloads.
  
ReseachSpace - Online Research Platform