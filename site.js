/* SITE.JS - runs on every page: theme button, accounts, navbar state */
(function(){
 const $=id=>document.getElementById(id);

 /* ---- THEME (light / dark, remembered) ---- */
 const THEME_KEY="fyp-theme";
 function applyTheme(t){
  document.documentElement.setAttribute("data-theme",t);
  $("themeIcon").innerHTML=t==="dark"?"&#9788;":"&#9790;";
  $("themeText").textContent=t==="dark"?"Light":"Dark";
 }
 let theme=null;
 try{theme=localStorage.getItem(THEME_KEY)}catch(e){}
 if(!theme)theme=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";
 applyTheme(theme);
 $("themeBtn").addEventListener("click",()=>{
  const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
  applyTheme(t);
  try{localStorage.setItem(THEME_KEY,t)}catch(e){}
 });

 /* ---- ACCOUNTS (demo only: saved in this browser, not on a server) ---- */
 const USERS_KEY="fyp-users",SESSION_KEY="fyp-session";
 function getUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY))||[]}catch(e){return []}}
 function saveUsers(u){try{localStorage.setItem(USERS_KEY,JSON.stringify(u))}catch(e){}}
 function currentUser(){try{const em=localStorage.getItem(SESSION_KEY);return getUsers().find(u=>u.email===em)||null}catch(e){return null}}
 function updateAuthUI(){
  const u=currentUser();
  document.body.classList.toggle("logged-in",!!u);
  $("hello").textContent=u?"Hi, "+u.name.split(" ")[0]:"";
  document.querySelectorAll(".logo").forEach(a=>a.setAttribute("href",u?"home.html":"index.html"));
 }
 function say(id,text){$(id).textContent=text}
 function startSession(email){try{localStorage.setItem(SESSION_KEY,email)}catch(e){}}

 const signup=$("signupForm");
 if(signup)signup.addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("su-name").value.trim(),email=$("su-email").value.trim().toLowerCase(),p1=$("su-pass").value,p2=$("su-pass2").value;
  if(!name||!email)return say("signupMsg","Please fill in your name and email.");
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return say("signupMsg","That email doesn't look right.");
  if(p1.length<6)return say("signupMsg","Password must be at least 6 characters.");
  if(p1!==p2)return say("signupMsg","The two passwords don't match.");
  const users=getUsers();
  if(users.some(u=>u.email===email))return say("signupMsg","An account with that email already exists. Try logging in.");
  users.push({name,email,password:p1});saveUsers(users);
  startSession(email);
  location.href="home.html";
 });

 const login=$("loginForm");
 if(login)login.addEventListener("submit",e=>{
  e.preventDefault();
  const email=$("li-email").value.trim().toLowerCase(),pass=$("li-pass").value;
  const u=getUsers().find(x=>x.email===email&&x.password===pass);
  if(!u)return say("loginMsg","Wrong email or password.");
  startSession(email);
  location.href="home.html";
 });

 $("logout").addEventListener("click",()=>{
  try{localStorage.removeItem(SESSION_KEY)}catch(e){}
  location.href="index.html";
 });

 updateAuthUI();
})();
