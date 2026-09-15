ReseachSpace - Simple PHP + MySQL Backend

Files:
- db.php         -> connects PHP to MySQL
- register.php   -> creates account
- login.php      -> logs user in
- logout.php     -> logs user out
- upload.php     -> uploads PDF + saves paper details
- papers.php     -> lists/searches papers
- database.sql   -> creates the MySQL database and tables
- uploads/       -> stores uploaded PDFs

Local setup:
1. Install XAMPP.
2. Put ReseachSpace inside htdocs.
3. Start Apache and MySQL.
4. Open phpMyAdmin and import backend/database.sql.
5. Test: http://localhost/ReseachSpace/

The frontend design is unchanged. The next step is connecting its forms/buttons to these PHP files.


DELETE RESEARCH
- Only the logged-in author can delete their own paper from the profile page.
- The delete request checks the session user ID and paper author_id on the server.
- When deleted, the database row and stored PDF file are removed.
