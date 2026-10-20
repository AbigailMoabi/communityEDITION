const INTERESTS=["Coding","Music","Football","Hiking","Photography","Debate","Gaming","Art","Entrepreneurship","Volunteering","Film","Dance","Reading","Chess","Cooking","Fitness"];
const PEOPLE=[
 {id:"p1",name:"Thandi M.",sub:"Year 1, Computer Science",bio:"New here and looking for a study group and someone to play chess with.",tags:["Coding","Chess","Reading"]},
 {id:"p2",name:"Kabo S.",sub:"Year 2, Business",bio:"Run a small thrift side hustle. Always up for a hike on Saturdays.",tags:["Entrepreneurship","Hiking","Fitness"]},
 {id:"p3",name:"Neo T.",sub:"Year 1, Engineering",bio:"Guitar in the dorm, football on weekends.",tags:["Music","Football","Gaming"]},
 {id:"p4",name:"Lesedi R.",sub:"Year 3, Media Studies",bio:"Making a short film this term and need people to help.",tags:["Film","Photography","Art"]},
 {id:"p5",name:"Amara O.",sub:"Year 1, Law",bio:"Debate nerd who also loves to cook for friends.",tags:["Debate","Cooking","Volunteering"]},
 {id:"p6",name:"Tumelo B.",sub:"Year 2, Design",bio:"Dance crew member. Come learn something new with us.",tags:["Dance","Music","Art"]},
 {id:"p7",name:"Mpho K.",sub:"Year 2, Information Systems",bio:"Hackathon fan, part-time gamer, full-time coffee drinker.",tags:["Coding","Gaming","Entrepreneurship"]},
 {id:"p8",name:"Ora L.",sub:"Year 1, Education",bio:"Weekend volunteer and bookworm looking for a book club.",tags:["Volunteering","Reading","Fitness"]}];
const CLUBS=[
 {id:"c1",name:"Code & Coffee",sub:"Meets Wednesdays, 5pm, Library Room 2",bio:"Build small projects together. Beginners very welcome.",tags:["Coding","Entrepreneurship"]},
 {id:"c2",name:"Trailblazers Hiking Club",sub:"Meets Saturdays, 7am, Main Gate",bio:"Day hikes and campus clean-ups for all fitness levels.",tags:["Hiking","Fitness","Volunteering"]},
 {id:"c3",name:"Open Mic Society",sub:"Meets Fridays, 6pm, Student Centre",bio:"Music, poetry and comedy. Perform or just cheer.",tags:["Music","Dance","Art"]},
 {id:"c4",name:"Debate Union",sub:"Meets Tuesdays, 4pm, Hall B",bio:"Weekly practice rounds and inter-campus tournaments.",tags:["Debate","Reading"]},
 {id:"c5",name:"Lens & Frames",sub:"Meets Thursdays, 3pm, Media Lab",bio:"Photo walks and film nights. Borrow a camera.",tags:["Photography","Film","Art"]},
 {id:"c6",name:"Campus FC",sub:"Trains Mon and Thu, 5pm, Main Field",bio:"Social football, mixed levels, no trials.",tags:["Football","Fitness"]},
 {id:"c7",name:"Game Night Guild",sub:"Meets Fridays, 7pm, Common Room",bio:"Board games, chess and video games with snacks.",tags:["Gaming","Chess"]},
 {id:"c8",name:"Community Kitchen",sub:"Meets Sundays, 11am, Residence Hall",bio:"Cook meals for local shelters and make friends.",tags:["Cooking","Volunteering"]}];
const MENTORS=[
 {id:"m1",name:"Dr. Keabetswe P.",sub:"Lecturer, Computer Science",bio:"Happy to talk about first-year courses, internships and imposter syndrome.",tags:["Coding","Chess","Entrepreneurship"]},
 {id:"m2",name:"Boitumelo N.",sub:"Final year, Business (peer mentor)",bio:"Can share how I found my feet in my first semester.",tags:["Entrepreneurship","Volunteering","Fitness"]},
 {id:"m3",name:"Prof. Kgosi A.",sub:"Media Studies",bio:"Helps students turn creative hobbies into portfolios.",tags:["Film","Photography","Art","Music"]},
 {id:"m4",name:"Naledi D.",sub:"Alumna, Law (now at a firm)",bio:"Advice on debate, moots and choosing electives.",tags:["Debate","Reading","Volunteering"]},
 {id:"m5",name:"Tebogo W.",sub:"Student Affairs",bio:"Knows every club, grant and support service on campus.",tags:["Hiking","Cooking","Dance","Football"]}];
const ACTIONS={people:["Say hi","Hi sent"],clubs:["Join club","Joined"],mentors:["Request intro","Requested"]};
const KEY="fyp-v1";
let state={interests:[],joined:[]},tab="people";
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.interests&&s.joined)state=s}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function renderChips(){
 $("interests").innerHTML=INTERESTS.map(i=>`<button class="chip" aria-pressed="${state.interests.includes(i)}" data-i="${esc(i)}">${esc(i)}</button>`).join("");
}
function renderResults(){
 const data={people:PEOPLE,clubs:CLUBS,mentors:MENTORS}[tab];
 const [off,on]=ACTIONS[tab];
 const rows=data.map(d=>({...d,n:d.tags.filter(t=>state.interests.includes(t)).length}))
  .sort((a,b)=>b.n-a.n);
 const picked=state.interests.length>0;
 $("results").innerHTML=rows.map(d=>{
  const done=state.joined.includes(d.id);
  const label=!picked?"Pick interests to see matches":d.n?`${d.n} shared interest${d.n>1?"s":""}`:"No overlap yet";
  return `<article class="card"><h3>${esc(d.name)}</h3><p class="meta">${esc(d.sub)}</p>
  <p class="bio">${esc(d.bio)}</p>
  <div class="tags">${d.tags.map(t=>`<span class="tag${state.interests.includes(t)?" match":""}">${esc(t)}</span>`).join("")}</div>
  <span class="score${d.n?"":" zero"}">${label}</span>
  <button class="act" aria-pressed="${done}" data-id="${d.id}">${done?on:off}</button></article>`;
 }).join("");
}
function renderCircle(){
 const all=[...PEOPLE,...CLUBS,...MENTORS];
 const items=state.joined.map(id=>all.find(x=>x.id===id)).filter(Boolean);
 $("circle").innerHTML=items.length?items.map(x=>`<li>${esc(x.name)}</li>`).join(""):`<li>Nobody yet. Say hi to someone or join a club.</li>`;
}
function renderAll(){renderChips();renderResults();renderCircle()}

$("interests").addEventListener("click",e=>{
 const b=e.target.closest("[data-i]");if(!b)return;
 const i=b.dataset.i,k=state.interests.indexOf(i);
 k<0?state.interests.push(i):state.interests.splice(k,1);
 save();renderChips();renderResults();
 $("interests").querySelector(`[data-i="${CSS.escape(i)}"]`).focus();
});
$("results").addEventListener("click",e=>{
 const b=e.target.closest("[data-id]");if(!b)return;
 const id=b.dataset.id,k=state.joined.indexOf(id);
 k<0?state.joined.push(id):state.joined.splice(k,1);
 save();renderResults();renderCircle();
 $("results").querySelector(`[data-id="${id}"]`).focus();
});
document.querySelector(".tabs").addEventListener("click",e=>{
 const b=e.target.closest("[data-tab]");if(!b)return;
 tab=b.dataset.tab;
 document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-selected",t===b));
 renderResults();
});
$("reset").addEventListener("click",()=>{state={interests:[],joined:[]};save();renderAll()});
renderAll();
