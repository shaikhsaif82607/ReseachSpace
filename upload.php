<?php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: login.html?next=upload.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Upload Research | ReseachSpace</title><link rel="stylesheet" href="styles.css"></head>
<body>
<header class="navbar">
  <a href="index.html" class="brand"><span class="brand-mark">R</span> ReseachSpace</a>
  <nav class="main-nav">
    <a href="index.html" data-page="index.html">Home</a>
    <a href="explore.html" data-page="explore.html">Explore</a>
    <a href="topics.html" data-page="topics.html">Topics</a>
    <a href="upload.php" data-page="upload.php">Upload</a>
    <a href="profile.html" data-page="profile.html">Profile</a>
  </nav>
  <div class="nav-actions" id="authNav"><a href="login.html" class="login">Log in</a></div>
</header>
<main>
<section class="page-hero center"><span class="eyebrow">SHARE YOUR RESEARCH</span><h1>Make your work<br><em>discoverable.</em></h1><p>Upload a research paper and help others find your ideas.</p></section>
<section class="upload-layout">
<form id="uploadForm" class="upload-form">
<div class="form-heading"><div><h2>Paper details</h2><p>Tell readers what your research is about.</p></div><b>01</b></div>
<label>Paper title<input name="title" required placeholder="Enter the full title"></label>
<div class="two-col"><label>Author<input id="currentAuthor" value="Loading..." readonly></label><label>Year<select name="year"><option>2026</option><option>2025</option><option>2024</option><option>2023</option></select></label></div>
<label>Research field<select name="topic"><option>Artificial Intelligence</option><option>Cloud Computing</option><option>Cybersecurity</option><option>IoT</option><option>Data Science</option><option>Healthcare</option><option>Computer Science</option><option>Physics</option></select></label>
<label>Abstract<textarea name="abstract" required rows="6" placeholder="Give readers a short overview of your research..."></textarea></label>
<div class="form-heading second"><div><h2>Research paper</h2><p>PDF format recommended.</p></div><b>02</b></div>
<label class="dropzone"><input id="pdfFile" name="paper" type="file" accept=".pdf" required><span>↑</span><strong id="fileName">Drop your PDF here or browse files</strong><small>Maximum 20 MB · PDF only</small></label>
<div class="submit-row"><small>🔒 You must be logged in to publish research</small><button class="btn" type="submit">Publish paper →</button></div>
</form>
<aside class="upload-side"><div class="dark-card"><span class="eyebrow">WHY UPLOAD?</span><h3>Your research can start the next discovery.</h3><div><b>12K+</b><small>papers in the library</small></div><div><b>42K+</b><small>downloads</small></div><div><b>18</b><small>research fields</small></div></div><div class="info-card"><b>☁ Cloud storage</b><p>Later, uploaded PDFs can be stored in Amazon S3 while paper information is stored in a database.</p></div></aside>
</section>
</main>
<footer class="compact-footer"><span>© 2026 ReseachSpace</span><span>Secure research sharing.</span></footer>
<script src="app.js?v=final"></script>
</body></html>