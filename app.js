const $ = id => document.getElementById(id);
const STORAGE_KEY = "myBookshelfBooksV1";
const GOAL_KEY = "myBookshelfGoal";
const state = { books: [], goal: 24, editingId: null };
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
function showError(error){ alert(`処理に失敗しました: ${error.message || error}`); }
function dateLabel(s){ if(!s)return ""; const d=new Date(s+"T00:00:00"); return Number.isNaN(d.getTime())?"":d.toLocaleDateString("ja-JP",{year:"numeric",month:"short",day:"numeric"}); }
function saveBooks(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.books)); }
function load(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    state.books = Array.isArray(saved) ? saved : [];
    state.goal = Math.max(1, Math.min(999, Number(localStorage.getItem(GOAL_KEY)) || 24));
    document.querySelector(".head-note").textContent = "YOUR PERSONAL LIBRARY · THIS BROWSER";
    render();
  } catch(e) { showError(e); }
}
function render(){
 const q=$("search").value.trim().toLocaleLowerCase("ja"),filter=$("filter").value,sort=$("sort").value;
 let list=state.books.filter(b=>[b.title,b.author,b.category,b.memo,b.quote].join(" ").toLocaleLowerCase("ja").includes(q)&&(filter==="all"||(filter==="favorite"?b.favorite:b.status===filter)));
 if(sort==="title")list.sort((a,b)=>a.title.localeCompare(b.title,"ja"));
 if(sort==="rating")list.sort((a,b)=>(b.rating||0)-(a.rating||0));
 if(sort==="date")list.sort((a,b)=>(b.readDate||"").localeCompare(a.readDate||""));
 if(sort==="new")list.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));
 $("total").textContent=state.books.length;
 $("read").textContent=state.books.filter(b=>b.status==="read").length;
 $("unread").textContent=state.books.filter(b=>b.status==="unread").length;
 $("favorite").textContent=state.books.filter(b=>b.favorite).length;
 const y=String(new Date().getFullYear()),read=state.books.filter(b=>b.status==="read"&&b.readDate?.startsWith(y)).length,pct=Math.min(100,Math.round(read/Math.max(1,state.goal)*100));
 $("goalRead").textContent=read;$("goalTarget").textContent=state.goal;$("goalPct").textContent=pct+"%";$("goalBar").style.width=pct+"%";$("goalMessage").textContent=pct>=100?"目標達成！読書の積み重ね、すばらしい！":`今年の目標まであと${Math.max(0,state.goal-read)}冊。自分のペースでいこう。`;
 const genres={};state.books.forEach(b=>genres[b.category||"その他"]=(genres[b.category||"その他"]||0)+1);const ge=Object.entries(genres).sort((a,b)=>b[1]-a[1]).slice(0,5),max=Math.max(1,...ge.map(x=>x[1]));
 $("genres").innerHTML=ge.length?ge.map(([n,c])=>`<div class="genre-row"><span>${esc(n)}</span><div class="genre-track"><span style="width:${c/max*100}%"></span></div><b>${c}</b></div>`).join(""):'<p class="muted">本を登録すると表示されます。</p>';
 $("count").textContent=`${list.length}冊`;
 $("books").innerHTML=list.length?list.map(b=>{const cover=b.coverUrl?`background-image:url('${esc(b.coverUrl).replace(/'/g,"%27")}')`:`background:${esc(b.color||"#52796f")}`;return `<article class="book"><div class="cover" style="${cover}">${b.coverUrl?"":esc(b.title)}</div><div class="book-body"><div class="tags"><span class="tag">${esc(b.category||"その他")}</span><span class="tag ${b.status==="unread"?"unread":""}">${b.status==="read"?"読了":"これから読む"}</span>${b.favorite?'<span class="tag">♥ お気に入り</span>':""}</div><h3>${esc(b.title)}</h3><div class="author">${esc(b.author||"著者未登録")}</div><div class="stars">${b.rating?"★".repeat(b.rating)+"☆".repeat(5-b.rating):"未評価"}</div>${b.readDate||b.purchaseDate?`<p class="dates">${b.readDate?`読了 ${esc(dateLabel(b.readDate))}`:""}${b.purchaseDate?` · 購入 ${esc(dateLabel(b.purchaseDate))}`:""}</p>`:""}${b.memo?`<p class="memo">${esc(b.memo)}</p>`:""}${b.quote?`<p class="quote">“${esc(b.quote)}”</p>`:""}<div class="book-actions"><button class="small" data-edit="${esc(b.id)}">編集</button><button class="small" data-toggle="${esc(b.id)}">${b.status==="read"?"未読にする":"読了にする"}</button></div></div></article>`}).join(""):'<div class="empty">📚<br>該当する本がありません。<br>検索条件を変えるか、本を追加してみましょう。</div>';
}
function openBook(b=null){
 state.editingId=b?.id||null;$("bookForm").reset();$("id").value=b?.id||"";$("dialogTitle").textContent=b?"本の情報を編集":"本を追加する";$("delete").hidden=!b;
 if(b){$("title").value=b.title||"";$("author").value=b.author||"";$("category").value=b.category||"その他";$("status").value=b.status||"unread";$("rating").value=b.rating||0;$("readDate").value=b.readDate||"";$("purchaseDate").value=b.purchaseDate||"";$("color").value=b.color||"#52796f";$("favoriteInput").value=b.favorite?"1":"0";$("coverUrl").value=b.coverUrl||"";$("memo").value=b.memo||"";$("quote").value=b.quote||"";}
 $("bookDialog").showModal();
}
$("add").addEventListener("click",()=>openBook());
$("goalEdit").addEventListener("click",()=>{$("goalInput").value=state.goal;$("goalDialog").showModal()});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
$("search").addEventListener("input",render);$("filter").addEventListener("change",render);$("sort").addEventListener("change",render);
$("books").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]"),toggle=e.target.closest("[data-toggle]");
 if(edit){openBook(state.books.find(b=>b.id===edit.dataset.edit));return;}
 if(toggle){const b=state.books.find(x=>x.id===toggle.dataset.toggle);if(!b)return;b.status=b.status==="read"?"unread":"read";if(b.status==="read"&&!b.readDate)b.readDate=today();saveBooks();render();}
});
$("bookForm").addEventListener("submit",e=>{
 e.preventDefault();
 const b={title:$("title").value.trim(),author:$("author").value.trim(),category:$("category").value,status:$("status").value,rating:Number($("rating").value),readDate:$("status").value==="read"?$("readDate").value:"",purchaseDate:$("purchaseDate").value,color:$("color").value,favorite:$("favoriteInput").value==="1",coverUrl:$("coverUrl").value.trim(),memo:$("memo").value.trim(),quote:$("quote").value.trim()};
 if(!b.title){alert("タイトルを入力してください。");return;}
 if(state.editingId){const i=state.books.findIndex(x=>x.id===state.editingId);if(i>=0)state.books[i]={...state.books[i],...b,updatedAt:new Date().toISOString()};}
 else state.books.push({...b,id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),createdAt:new Date().toISOString()});
 saveBooks();$("bookDialog").close();render();
});
$("delete").addEventListener("click",()=>{if(!state.editingId)return;const b=state.books.find(x=>x.id===state.editingId);if(!confirm(`「${b?.title}」を削除しますか？`))return;state.books=state.books.filter(x=>x.id!==state.editingId);saveBooks();$("bookDialog").close();render();});
$("goalForm").addEventListener("submit",e=>{e.preventDefault();state.goal=Math.max(1,Math.min(999,Number($("goalInput").value)||24));localStorage.setItem(GOAL_KEY,String(state.goal));$("goalDialog").close();render();});
load();
