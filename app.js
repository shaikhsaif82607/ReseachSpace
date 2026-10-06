const topics = [
  ["Artificial Intelligence","AI","Machine learning, intelligent systems and emerging AI research."],
  ["Cloud Computing","☁","Cloud architecture, distributed systems and scalable applications."],
  ["Cybersecurity","◈","Security, privacy, threats, defenses and secure software."],
  ["Internet of Things","⌁","Connected devices, sensors, edge computing and smart systems."],
  ["Data Science","⌬","Analytics, data mining, visualization and predictive research."],
  ["Healthcare","＋","Technology, digital health, medical systems and innovation."],
  ["Computer Science","⌘","Algorithms, software engineering, databases and computing theory."],
  ["Physics","◌","Classical, quantum and applied physics research."],
  ["Environmental Science","♧","Climate, sustainability, agriculture and environmental research."]
];

function toast(message){
  const e=document.getElementById('toast');
  if(!e)return;
  e.textContent=message;
  e.classList.add('show');
  setTimeout(()=>e.classList.remove('show'),2500);
}

function toggleMenu(){
  document.querySelector('.navbar')?.classList.toggle('open');
}

function searchHome(){
  const q=document.getElementById('homeSearch').value.trim();
  location.href='explore.html'+(q?'?q='+encodeURIComponent(q):'');
}

function saveLoggedUser(user){
  if(user) localStorage.setItem('reseachspace_user',JSON.stringify(user));
}

function getSavedUser(){
  try{
    return JSON.parse(localStorage.getItem('reseachspace_user')||'null');
  }catch(e){
    return null;
  }
}

function clearLoggedUser(){
  localStorage.removeItem('reseachspace_user');
}

async function getMe(){
  try{
    const r=await fetch('/backend/me.php?_='+Date.now(),{
      method:'GET',
      credentials:'include',
      cache:'no-store',
      headers:{'Accept':'application/json'}
    });

    const text=await r.text();

    if(!r.ok)return null;

    const d=JSON.parse(text);
    return d.user||null;
  }catch(e){
    console.error('Session check failed:',e);
    return null;
  }
}

async function setupNavigation(){
  const nav=document.getElementById('authNav');
  const links=document.querySelectorAll('.main-nav a[data-page]');
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  links.forEach(link=>{
    link.classList.toggle(
      'active',
      link.dataset.page.toLowerCase()===page
    );
  });

  if(!nav)return;

  const isProfile=page==='profile.html';
  const saved=getSavedUser();

  if(isProfile&&saved){
    nav.innerHTML='<button type="button" class="btn small nav-logout" id="logoutBtn">Log out</button>';
    document.getElementById('logoutBtn').onclick=logoutUser;
  }else if(saved){
    nav.innerHTML='<a class="nav-user" href="profile.html">'+escapeHtml(saved.name)+'</a>';
  }else{
    nav.innerHTML='<a href="login.html" class="login">Log in</a>';
  }

  const user=await getMe();

  if(user){
    saveLoggedUser(user);

    if(isProfile){
      nav.innerHTML='<button type="button" class="btn small nav-logout" id="logoutBtn">Log out</button>';
      document.getElementById('logoutBtn').onclick=logoutUser;
    }else{
      nav.innerHTML='<a class="nav-user" href="profile.html">'+escapeHtml(user.name)+'</a>';
    }
  }else{
    clearLoggedUser();
    nav.innerHTML='<a href="login.html'+(isProfile?'?next=profile.html':'')+'" class="login">Log in</a>';
  }
}

function escapeHtml(value){
  return String(value).replace(
    /[&<>"']/g,
    c=>({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[c])
  );
}

async function logoutUser(){
  clearLoggedUser();

  try{
    await fetch('/backend/logout.php',{
      method:'POST',
      credentials:'same-origin',
      cache:'no-store'
    });
  }catch(e){
    console.error('Logout failed:',e);
  }

  window.location.href='index.html';
}

async function protectUploadPage(){
  if(!document.getElementById('uploadForm'))return;

  const user=await getMe();

  if(!user){
    location.href='login.html?next=upload.php';
    return false;
  }

  const name=document.getElementById('currentAuthor');

  if(name){
    name.value=user.name;
  }

  return true;
}

async function protectProfilePage(){
  if(!document.getElementById('profilePapers'))return;

  const user=await getMe();

  if(!user){
    location.href='login.html?next=profile.html';
    return false;
  }

  return true;
}

function card(p){
  return `<article class="paper-card">
    <span class="paper-topic">${p.topic.toUpperCase()}</span>
    <h3>${p.title}</h3>
    <p>${p.abstract}</p>
    <div class="paper-meta">
      <span>${p.author} · ${p.year}</span>
      <span>↓ ${p.downloads}</span>
    </div>
  </article>`;
}

async function getPapers(){
  try{
    const r=await fetch('/backend/papers.php',{
      cache:'no-store'
    });

    if(!r.ok){
      throw new Error('Paper request failed');
    }

    const d=await r.json();

    return d.papers||[];
  }catch(e){
    console.error('Could not load papers:',e);
    return [];
  }
}

async function getPdfData(id,mode){
  const r=await fetch(
    '/backend/paper_file.php?id='+
    encodeURIComponent(id)+
    '&mode='+
    encodeURIComponent(mode)+
    '&_='+
    Date.now(),
    {
      credentials:'include',
      cache:'no-store',
      headers:{'Accept':'application/json'}
    }
  );

  const text=await r.text();

  let d;

  try{
    d=JSON.parse(text);
  }catch(e){
    throw new Error(
      text.slice(0,200)||'Invalid server response'
    );
  }

  if(!r.ok||!d.ok){
    throw new Error(d.error||'PDF could not be loaded');
  }

  return d;
}

async function viewPaper(id){
  const tab=window.open(
    'view.html?id='+encodeURIComponent(id),
    '_blank'
  );

  if(!tab){
    toast('Allow pop-ups to view the PDF');
  }
}

async function downloadPaper(id){
  try{
    const d=await getPdfData(id,'download');

    const a=document.createElement('a');

    a.href='data:application/pdf;base64,'+d.data;
    a.download=d.name||'research-paper.pdf';

    document.body.appendChild(a);
    a.click();
    a.remove();

    toast('PDF download started');
  }catch(e){
    toast(e.message||'Could not download PDF');
    console.error(e);
  }
}

async function renderFeatured(){
  const e=document.getElementById('featured');

  if(e){
    const p=await getPapers();
    e.innerHTML=p.slice(0,3).map(card).join('');
  }
}

async function renderLibrary(){
  const list=document.getElementById('paperList');

  if(!list)return;

  const params=new URLSearchParams(location.search);

  const search=(
    document.getElementById('librarySearch').value||
    params.get('q')||
    ''
  ).toLowerCase();

  const topic=
    document.getElementById('topicFilter').value||
    params.get('topic')||
    '';

  const year=document.getElementById('yearFilter').value;

  let arr=await getPapers();

  arr=arr.filter(p=>
    (
      !search||
      `${p.title} ${p.author} ${p.topic} ${p.abstract}`
        .toLowerCase()
        .includes(search)
    )&&
    (!topic||p.topic===topic)&&
    (!year||String(p.year)===year)
  );

  const sort=document.getElementById('sortFilter').value;

  arr.sort((a,b)=>
    sort==='views'
      ?b.views-a.views
      :sort==='downloads'
        ?b.downloads-a.downloads
        :b.year-a.year
  );

  document.getElementById('count').textContent=
    `${arr.length} paper${arr.length===1?'':'s'}`;

  list.innerHTML=arr.length
    ?arr.map(p=>`
      <article class="library-paper">
        <span class="paper-topic">
          ${p.topic.toUpperCase()} · ${p.year}
        </span>
        <h2>${p.title}</h2>
        <p>${p.abstract}</p>

        <div class="paper-meta">
          <span>${p.author}</span>
          <span>
            👁 ${p.views} views · ↓ ${p.downloads} downloads
          </span>
        </div>

        <div class="paper-actions">
          <button
            type="button"
            class="mini primary"
            onclick="viewPaper(${p.id})"
          >
            View paper
          </button>

          <button
            type="button"
            class="mini"
            onclick="downloadPaper(${p.id})"
          >
            Download PDF
          </button>
        </div>
      </article>
    `).join('')
    :`
      <div class="empty">
        <h3>No papers found</h3>
        <p>Try a different search or clear the filters.</p>
      </div>
    `;
}

function clearFilters(){
  document.getElementById('librarySearch').value='';
  document.getElementById('topicFilter').value='';
  document.getElementById('yearFilter').value='';
  renderLibrary();
}

function renderTopics(){
  const e=document.getElementById('topicGrid');

  if(e){
    e.innerHTML=topics.map(t=>`
      <article class="topic-card">
        <div class="topic-icon">${t[1]}</div>
        <h3>${t[0]}</h3>
        <p>${t[2]}</p>
        <a href="explore.html?topic=${encodeURIComponent(t[0])}">
          Explore ${t[0]} →
        </a>
      </article>
    `).join('');
  }
}

async function setupUpload(){
  const form=document.getElementById('uploadForm');

  if(!form)return;

  const allowed=await protectUploadPage();

  if(!allowed)return;

  const input=document.getElementById('pdfFile');

  if(input){
    input.onchange=()=>{
      document.getElementById('fileName').textContent=
        input.files[0]?.name||
        'Drop your PDF here or browse files';
    };
  }

  form.onsubmit=async e=>{
    e.preventDefault();

    try{
      const user=await getMe();

      if(!user){
        toast('Please log in before uploading');
        return setTimeout(
          ()=>location.href='login.html?next=upload.php',
          700
        );
      }

      const file=input.files[0];

      if(
        !file||
        file.type!=='application/pdf'||
        file.size>20*1024*1024
      ){
        return toast('Choose a PDF under 20 MB');
      }

      const r=await fetch('/backend/upload.php',{
        method:'POST',
        credentials:'include',
        body:new FormData(form)
      });

      const d=await r.json();

      toast(d.error||d.message||'Upload failed');

      if(!d.error){
        setTimeout(
          ()=>location.href='profile.html',
          700
        );
      }
    }catch(e){
      toast('Cannot connect to PHP backend');
      console.error(e);
    }
  };
}

function demoLogin(){
  toast('Google login is not connected yet. Use email and password.');
}

function setupAuth(){
  const form=document.getElementById('authForm');

  if(!form)return;

  const mode=document.body.dataset.auth;

  const url=
    mode==='signup'
      ?'/backend/register.php'
      :'/backend/login.php';

  form.onsubmit=async e=>{
    e.preventDefault();

    const data=Object.fromEntries(
      new FormData(form)
    );

    try{
      const r=await fetch(url,{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      });

      const text=await r.text();

      let d;

      try{
        d=JSON.parse(text);
      }catch(error){
        throw new Error(
          'Server returned invalid response: '+
          text.slice(0,120)
        );
      }

      toast(
        d.error||
        d.message||
        'Something went wrong'
      );

      if(!d.error){
        if(d.user){
          saveLoggedUser(d.user);
        }

        const next=
          new URLSearchParams(location.search).get('next');

        setTimeout(
          ()=>location.href=
            mode==='signup'
              ?'login.html'
              :(next||'profile.html'),
          700
        );
      }
    }catch(error){
      toast('Cannot connect to PHP backend');
      console.error(error);
    }
  };
}

function openEdit(p){
  document.getElementById('editId').value=p.id;
  document.getElementById('editTitle').value=p.title;
  document.getElementById('editTopic').value=p.topic;
  document.getElementById('editYear').value=p.year;
  document.getElementById('editAbstract').value=p.abstract;
  document.getElementById('editModal').classList.remove('hidden');
}

function closeEdit(){
  document.getElementById('editModal')?.classList.add('hidden');
}

async function editPaper(e){
  e.preventDefault();

  try{
    const r=await fetch('/backend/edit.php',{
      method:'POST',
      credentials:'include',
      body:new FormData(e.target)
    });

    const d=await r.json();

    toast(d.error||d.message||'Update failed');

    if(!d.error){
      closeEdit();
      setTimeout(()=>loadProfile(),400);
    }
  }catch(error){
    toast('Cannot connect to PHP backend');
    console.error(error);
  }
}

async function deletePaper(id){
  if(!confirm('Delete this research paper? This cannot be undone.')){
    return;
  }

  try{
    const data=new URLSearchParams();
    data.set('id',id);

    const r=await fetch('/backend/delete.php',{
      method:'POST',
      credentials:'include',
      body:data
    });

    const d=await r.json();

    toast(d.error||d.message||'Delete failed');

    if(!d.error){
      setTimeout(()=>loadProfile(),500);
    }
  }catch(e){
    toast('Cannot connect to PHP backend');
    console.error(e);
  }
}

async function loadProfile(){
  const e=document.getElementById('profilePapers');

  if(!e)return;

  const allowed=await protectProfilePage();

  if(!allowed)return;

  try{
    const me=await getMe();

    const r=await fetch(
      '/backend/profile.php?id='+me.id,
      {
        cache:'no-store',
        credentials:'include'
      }
    );

    const d=await r.json();

    if(d.error){
      throw new Error(d.error);
    }

    document.getElementById('profileName').textContent=d.user.name;
    document.getElementById('profileEmail').textContent=d.user.email;

    document.getElementById('profileAvatar').textContent=
      d.user.name
        .split(' ')
        .map(x=>x[0])
        .join('')
        .slice(0,2)
        .toUpperCase();

    document.getElementById('profileViews').textContent=
      Number(d.stats.views).toLocaleString();

    document.getElementById('profileDownloads').textContent=
      Number(d.stats.downloads).toLocaleString();

    document.getElementById('profileCitations').textContent=
      d.stats.citations;

    document.getElementById('profilePaperCount').textContent=
      d.stats.papers;

    document.getElementById('myPaperCount').textContent=
      `${d.stats.papers} paper${d.stats.papers===1?'':'s'}`;

    e.innerHTML=d.papers.length
      ?d.papers.map(p=>`
        <article class="profile-paper">
          <span class="paper-topic">
            ${p.topic.toUpperCase()} · ${p.year}
          </span>

          <h3>${escapeHtml(p.title)}</h3>

          <p>${escapeHtml(p.abstract)}</p>

          <p>
            ${p.views} views · ${p.downloads} downloads
          </p>

          <div class="paper-actions">

            <button
              type="button"
              class="mini primary"
              onclick="viewPaper(${p.id})"
            >
              View paper
            </button>

            <button
              type="button"
              class="mini"
              onclick="downloadPaper(${p.id})"
            >
              Download PDF
            </button>

            <button
              type="button"
              class="mini edit-paper"
              onclick='openEdit(${JSON.stringify(p).replace(/'/g,"&#39;")})'
            >
              Edit research
            </button>

            <button
              type="button"
              class="mini delete-paper"
              onclick="deletePaper(${p.id})"
            >
              Delete research
            </button>

          </div>
        </article>
      `).join('')
      :`
        <div class="empty">
          <h3>No papers yet</h3>
          <p>Upload your first research paper.</p>
          <a class="btn" href="upload.php">
            Upload paper
          </a>
        </div>
      `;

    const score=d.stats.score;

    document.getElementById('impactScore').innerHTML=
      `${score}<small>/100</small>`;

    document.getElementById('impactBar').style.width=
      score+'%';

    document.getElementById('impactText').textContent=
      d.stats.papers
        ?'Activity based on your papers, views and downloads.'
        :'Upload papers and share your research to build activity.';

    const featured=document.getElementById('profileFeatured');

    if(featured){
      const all=await getPapers();

      featured.innerHTML=
        all
          .filter(p=>!d.papers.some(
            x=>String(x.id)===String(p.id)
          ))
          .slice(0,3)
          .map(card)
          .join('')||
        '<div class="empty"><p>No other research available yet.</p></div>';
    }

  }catch(error){
    toast('Cannot load profile');
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded',async()=>{
  setupNavigation();
  renderFeatured();
  renderLibrary();
  renderTopics();
  setupUpload();
  setupAuth();
  loadProfile();

  const editForm=document.getElementById('editForm');

  if(editForm){
    editForm.onsubmit=e=>editPaper(e);
  }

  const editModal=document.getElementById('editModal');

  if(editModal){
    editModal.addEventListener(
      'click',
      e=>{
        if(e.target===editModal){
          closeEdit();
        }
      }
    );
  }

  const t=new URLSearchParams(location.search).get('topic');

  if(t&&document.getElementById('topicFilter')){
    document.getElementById('topicFilter').value=t;
    renderLibrary();
  }
});