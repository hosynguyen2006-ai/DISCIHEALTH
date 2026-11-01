const $=id=>document.getElementById(id),get=(k,d)=>JSON.parse(localStorage.getItem('disci_'+k)||JSON.stringify(d)),set=(k,v)=>localStorage.setItem('disci_'+k,JSON.stringify(v)),fmt=n=>new Intl.NumberFormat('vi-VN').format(n)+' ₫';

const exercises=[
['Squat','Chân · Mông','Cơ bản','Tăng sức mạnh cơ đùi, mông và thân dưới.',['Đứng hai chân rộng bằng vai, mũi chân hơi hướng ra ngoài.','Siết bụng, đẩy hông ra sau và hạ người như ngồi ghế.','Giữ gối cùng hướng mũi chân, lưng trung lập.','Đẩy sàn để đứng lên.'],'3 hiệp × 12 lần','Tránh gối đổ vào trong, gót chân nhấc khỏi sàn hoặc gù lưng.',false],
['Push-up','Ngực · Tay','Cơ bản','Rèn cơ ngực, vai, tay sau và cơ lõi.',['Đặt hai tay rộng hơn vai một chút.','Duỗi chân, siết bụng để thân người thẳng.','Hạ ngực có kiểm soát, khuỷu tay chếch 30–45 độ.','Đẩy sàn trở về vị trí ban đầu.'],'3 hiệp × 8–10 lần','Không võng lưng; có thể chống gối nếu chưa đủ sức.',false],
['Plank','Bụng · Core','Cơ bản','Cải thiện sức bền cơ bụng và ổn định thân người.',['Chống hai cẳng tay, khuỷu dưới vai.','Duỗi chân, siết bụng và cơ mông.','Giữ đầu, lưng và hông trên một đường thẳng.','Thở đều và kết thúc khi mất tư thế.'],'3 hiệp × 20–40 giây','Không nín thở hoặc để hông võng xuống.',true],
['Lunge','Chân · Mông','Trung bình','Tăng sức mạnh từng chân và khả năng thăng bằng.',['Đứng thẳng, bước một chân về trước.','Hạ hông đến khi hai gối gần góc 90 độ.','Giữ thân thẳng, gối trước theo hướng mũi chân.','Đẩy chân trước để trở về, đổi bên.'],'3 hiệp × 10 lần mỗi chân','Không bước quá hẹp hoặc để gối sụp vào trong.',true],
['Glute Bridge','Mông · Core','Cơ bản','Tập trung cơ mông và ổn định hông.',['Nằm ngửa, co gối, bàn chân trên sàn.','Siết cơ bụng và cơ mông.','Nâng hông đến khi vai–hông–gối gần thẳng hàng.','Hạ hông chậm và lặp lại.'],'3 hiệp × 12–15 lần','Không ưỡn lưng quá mức.',false],
['Jumping Jack','Cardio','Cơ bản','Khởi động toàn thân và tăng nhịp tim.',['Đứng thẳng, hai chân khép.','Bật tách chân, đưa tay qua đầu.','Bật khép chân và hạ tay.','Tiếp đất nhẹ nhàng.'],'3 hiệp × 30 giây','Nếu đau khớp, thay bật nhảy bằng bước sang ngang.',false],
['Dumbbell Row','Lưng · Tay','Trung bình','Tăng sức mạnh cơ lưng và tay trước.',['Một tay chống lên ghế, lưng trung lập.','Tay còn lại cầm tạ, kéo khuỷu về phía hông.','Siết cơ lưng ở vị trí trên cùng.','Hạ tạ chậm và đổi bên.'],'3 hiệp × 10 lần mỗi bên','Tránh xoay thân hoặc giật tạ.',true]
];

const products=[
{id:'band',name:'Dây kháng lực',cat:'Dụng cụ',price:120000},
{id:'mat',name:'Thảm tập',cat:'Dụng cụ',price:180000},
{id:'weights',name:'Tạ tay đôi',cat:'Dụng cụ',price:350000},
{id:'protein',name:'Bột protein',cat:'Dinh dưỡng',price:520000}
];

function isVip(){
 let v=get('vip',null);
 return !!(v&&v.active&&v.until>Date.now());
}

function renderVip(){
 let el=$('vipStatus');
 if(el)el.textContent=isVip()?'VIP đến '+new Date(get('vip',{}).until).toLocaleDateString('vi-VN'):'Chưa kích hoạt';
 let tag=$('discountTag');
 if(tag)tag.textContent=isVip()?'VIP · GIẢM 10%':'Giá thường';
}

function exerciseMeta(x){
 const name=x[0],target=x[1];
 let cat=/Cardio|Jump/i.test(name)?'Cardio & Đi bộ':/Plank|Bridge|Bird|Dead Bug|Stretch/i.test(name)?'Phục hồi & Cơ lõi':/Band|Resistance/i.test(name)?'Dây kháng lực':'Trọng lượng cơ thể';
 let quiet=!/Jumping Jack|Burpee|High Knees|Jump Squat/i.test(name);
 let joint=!/Jumping Jack|Burpee|Jump Squat|High Knees/i.test(name);
 let equipment=/Dumbbell|Tạ/i.test(name)?'Tạ':/Band/i.test(name)?'Dây kháng lực':/Push-up|Squat|Lunge/i.test(name)?'Không cần dụng cụ':'mat';
 return {cat,quiet,joint,equipment};
}

let exerciseCategory='',quietOnly=false,jointOnly=false;

function renderExercises(){
 let grid=$('exerciseGrid');
 if(!grid)return;

 let q=($('exerciseSearch')?.value||'').toLowerCase();
 let level=$('level')?.value||'';
 let equipment=$('equipmentFilter')?.value||'';

 let list=exercises.filter(x=>{
  let m=exerciseMeta(x);
  return (x[0]+' '+x[1]+' '+x[3]).toLowerCase().includes(q)
   &&(!level||x[2]===level)
   &&(!exerciseCategory||m.cat===exerciseCategory)
   &&(!quietOnly||m.quiet)
   &&(!jointOnly||m.joint)
   &&(!equipment||m.equipment===equipment);
 });

 grid.innerHTML=list.map(x=>{
  let m=exerciseMeta(x);
  return `<article class="card exercise-card">
   <div class="row">
    <span class="exercise-category">${m.cat}</span>
    <span class="muted">${x[2]}</span>
   </div>
   <h3>${x[0]}</h3>
   <p class="exercise-en">${x[0]==='Push-up'?'Push-ups':x[0]}</p>
   <p><span class="muted">Cơ tác động:</span> ${x[1]}</p>
   <p><span class="muted">Dụng cụ:</span> ${m.equipment}</p>
   <div class="exercise-tags">
    <span>Êm phòng trọ</span>
    ${m.joint?'<span>Bảo vệ khớp</span>':''}
   </div>
   <div class="row">
    <small class="muted">${x[5]}</small>
    <a href="exercise-detail.html?name=${encodeURIComponent(x[0])}">Chi tiết ›</a>
   </div>
  </article>`;
 }).join('')||'<article class="card">Không tìm thấy bài tập phù hợp. Hãy thay đổi bộ lọc.</article>';

 if($('exerciseCount'))$('exerciseCount').textContent=`Hiển thị ${list.length}/${exercises.length} bài tập`;
}

let cameraStream=null,detector=null,poseLoop=null;

async function startCamera(){
 if(!isVip()){
  $('poseStatus').textContent='Bạn cần mở khóa VIP để sử dụng công cụ điều chỉnh tư thế.';
  return;
 }

 try{
  cameraStream=await navigator.mediaDevices.getUserMedia({
   video:{facingMode:'user'},
   audio:false
  });

  $('poseVideo').srcObject=cameraStream;
  $('poseStatus').textContent='Đang tải mô hình nhận diện…';

  await tf.setBackend('webgl');
  await tf.ready();

  detector=await poseDetection.createDetector(
   poseDetection.SupportedModels.MoveNet,
   {modelType:poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING}
  );

  $('poseStatus').textContent='Đã nhận diện. Hãy thực hiện động tác trong khung hình.';

  poseLoop=setInterval(async()=>{
   if(!detector||$('poseVideo').readyState<2)return;

   let ps=await detector.estimatePoses($('poseVideo'));
   if(!ps.length)return;

   let k=ps[0].keypoints;
   let pt=n=>k.find(x=>x.name===n);
   let hip=pt('left_hip'),knee=pt('left_knee'),ankle=pt('left_ankle');

   if(hip?.score>.25&&knee?.score>.25&&ankle?.score>.25){
    let a=Math.abs(
     Math.atan2(ankle.y-knee.y,ankle.x-knee.x)
     -Math.atan2(hip.y-knee.y,hip.x-knee.x)
    )*180/Math.PI;

    a=a>180?360-a:a;

    $('poseStatus').textContent=
     a<105
      ?'Gập gối sâu: kiểm soát thăng bằng và hướng gối theo mũi chân.'
      :a<145
       ?'Đang hạ người: siết bụng, giữ lưng trung lập.'
       :'Tư thế đứng/chuẩn bị: giữ chân vững và lưng trung lập.';
   }else{
    $('poseStatus').textContent='Chưa thấy rõ các khớp. Hãy điều chỉnh góc máy và ánh sáng.';
   }
  },800);

 }catch(e){
  $('poseStatus').textContent='Không thể khởi động camera hoặc AI: '+e.message;
  stopCamera();
 }
}

function stopCamera(){
 if(poseLoop)clearInterval(poseLoop);
 poseLoop=null;

 if(cameraStream)cameraStream.getTracks().forEach(t=>t.stop());
 cameraStream=null;

 if($('poseVideo'))$('poseVideo').srcObject=null;

 if(detector){
  detector.dispose();
  detector=null;
 }
}

document.addEventListener('DOMContentLoaded',()=>{

 if($('menuBtn')){
  $('menuBtn').onclick=()=>$('nav').classList.toggle('open');
 }

 const currentPage=(location.pathname.split('/').pop()||'index.html').toLowerCase();

 document.querySelectorAll('#nav a').forEach(a=>{
  if((a.getAttribute('href')||'').toLowerCase()===currentPage){
   a.classList.add('active');
   a.setAttribute('aria-current','page');
  }
 });

 const signedUser=get('user',null);

 if($('authArea')&&signedUser){
  $('authArea').innerHTML='<a class="btn soft" href="account.html">Xin chào, '+String(signedUser.name||'bạn').replace(/[<>"']/g,'')+'</a>';
 }

 if($('healthForm')){
  $('healthForm').onsubmit=e=>{
   e.preventDefault();

   let w=+$('weight').value;
   let h=+$('height').value/100;
   let a=+$('age').value;
   let b=w/(h*h);

   let bmr=$('gender').value==='male'
    ?10*w+6.25*h*100-5*a+5
    :10*w+6.25*h*100-5*a-161;

   let t=bmr*+$('activity').value;

   $('bmi').textContent=b.toFixed(1);
   $('tdee').textContent=Math.round(t).toLocaleString('vi-VN');

   $('bmiText').textContent=
    b<18.5?'Thấp hơn khoảng tham khảo':
    b<25?'Trong khoảng tham khảo':
    b<30?'Cao hơn khoảng tham khảo':
    'Rất cao';

   $('healthAlert').textContent=
    b<18.5?'Mức 1: chú ý dinh dưỡng và theo dõi thể trạng.':
    b<25?'Mức 1: BMI trong khoảng tham khảo.':
    b<30?'Mức 2: cân nhắc điều chỉnh vận động và dinh dưỡng.':
    'Mức 3: nên trao đổi với chuyên gia y tế.';

   set('health',{bmi:b.toFixed(1),tdee:Math.round(t)});
  };
 }

 if($('medicalForm')){
  $('examDate').value=new Date().toISOString().slice(0,10);

  $('medicalForm').onsubmit=e=>{
   e.preventDefault();

   let a=get('medical',[]);

   a.push({
    date:$('examDate').value,
    clinic:$('clinic').value,
    note:$('examNote').value
   });

   set('medical',a);

   $('medicalList').innerHTML=a.map(x=>
    `<p>${x.date} · ${x.clinic}: ${x.note}</p>`
   ).join('');

   e.target.reset();
  };

  let a=get('medical',[]);

  $('medicalList').innerHTML=a.map(x=>
   `<p>${x.date} · ${x.clinic}: ${x.note}</p>`
  ).join('');
 }

 if($('planForm')){
  $('planForm').onsubmit=e=>{
   e.preventDefault();

   let days=[
    'Thứ 2 – Toàn thân',
    'Thứ 3 – Phục hồi',
    'Thứ 4 – Thân dưới',
    'Thứ 5 – Nghỉ/giãn cơ',
    'Thứ 6 – Thân trên',
    'Thứ 7 – Cardio',
    'Chủ nhật – Phục hồi'
   ];

   $('planResult').innerHTML=
    '<b>'+ $('planGoal').value+'</b><ol>'+
    days.filter((x,i)=>i%2===0).slice(0,+$('planDays').value)
     .map(x=>'<li>'+x+'</li>').join('')+
    '</ol>Dụng cụ: '+($('equipment').value||'Tay không');
  };
 }

 // Ghi nhận buổi tập
 if($('logForm')){
  $('logDate').value=new Date().toISOString().slice(0,10);

  $('logForm').onsubmit=e=>{
   e.preventDefault();

   let a=get('logs',[]);

   a.push({
    name:$('logName').value,
    mins:+$('logMinutes').value,
    kcal:+$('logCalories').value,
    date:$('logDate').value
   });

   set('logs',a);
   alert('Đã lưu kết quả buổi tập.');
   renderProgress();
  };
 }

 // Chi tiết bài tập và video hướng dẫn
 if($('detailName')){
  let name=new URLSearchParams(location.search).get('name')||'Squat';
  let x=exercises.find(item=>item[0]===name)||exercises[0];

  $('detailName').textContent=x[0];
  $('detailTarget').textContent=x[3]+' · '+x[1];
  $('detailSteps').innerHTML=x[4].map(step=>'<li>'+step+'</li>').join('');
  $('detailMistakes').textContent=x[6];
  $('detailDose').textContent='Khối lượng gợi ý: '+x[5];

  // Tạo liên kết video YouTube theo tên bài tập
  const videoQuery=encodeURIComponent(x[0]+' exercise tutorial proper form');
  const videoUrl='https://www.youtube.com/results?search_query='+videoQuery;

  if($('videoLock')){
   $('videoLock').hidden=true;
  }

  if($('videoFrame')){
   $('videoFrame').innerHTML=`
    <div class="exercise-video-panel"
         style="margin-top:18px;padding:20px;background:#fff;border:1px solid #e5eee8;border-radius:16px">

     <h3 style="margin:0 0 10px;color:#173d30">
      🎬 Video hướng dẫn ${x[0]}
     </h3>

     <p style="margin:0 0 14px;color:#66766d;line-height:1.6">
      Video hướng dẫn kỹ thuật thực hiện động tác ${x[0]}.
     </p>

     <a class="btn primary"
        href="${videoUrl}"
        target="_blank"
        rel="noopener noreferrer">
      ▶ Xem video hướng dẫn trên YouTube
     </a>
    </div>
   `;
  }

  if($('startCamera')){
   $('startCamera').onclick=startCamera;
  }

  if($('stopCamera')){
   $('stopCamera').onclick=stopCamera;
  }
 }

 if($('makeFromTools')){
  $('makeFromTools').onclick=()=>
   $('toolSuggestions').textContent=
    'Với '+($('toolInput').value||'tay không')+
    ' và nhóm cơ '+$('muscle').value+
    ': Squat, Push-up, Plank, Glute Bridge. Chọn mức độ phù hợp.';
 }

 if($('exerciseGrid')){
  renderExercises();

  $('exerciseSearch').oninput=renderExercises;
  $('level').onchange=renderExercises;

  if($('equipmentFilter')){
   $('equipmentFilter').onchange=renderExercises;
  }

  document.querySelectorAll('[data-category]').forEach(b=>{
   b.onclick=()=>{
    exerciseCategory=b.dataset.category;

    document.querySelectorAll('[data-category]').forEach(x=>
     x.classList.toggle('active',x===b)
    );

    renderExercises();
   };
  });

  if($('quietToggle')){
   $('quietToggle').onclick=()=>{
    quietOnly=!quietOnly;
    $('quietToggle').classList.toggle('active',quietOnly);
    renderExercises();
   };
  }

  if($('jointToggle')){
   $('jointToggle').onclick=()=>{
    jointOnly=!jointOnly;
    $('jointToggle').classList.toggle('active',jointOnly);
    renderExercises();
   };
  }
 }

 // Thống kê tiến độ
 function renderProgress(){
  let a=get('logs',[]);
  let n=a.length;

  if($('totalSessions'))$('totalSessions').textContent=n;

  if($('totalMinutes')){
   $('totalMinutes').textContent=a.reduce((s,x)=>s+x.mins,0)+' phút';
  }

  if($('totalCalories')){
   $('totalCalories').textContent=a.reduce((s,x)=>s+x.kcal,0)+' kcal';
  }

  if($('streak')){
   $('streak').textContent=new Set(a.map(x=>x.date)).size+' ngày';
  }

  if($('history')){
   $('history').innerHTML=a.map(x=>
    `<p>${x.date} · ${x.name} · ${x.mins} phút</p>`
   ).join('')||'Chưa có buổi tập.';
  }

  if($('badges')){
   $('badges').innerHTML=(
    n>=10?['🏅 Người bền bỉ','🔥 10 buổi tập']:
    n>=5?['🏅 Khởi đầu tốt']:
    n?['🌱 Bắt đầu hành trình']:
    ['Huy hiệu sẽ mở khi ghi nhận buổi tập']
   ).map(x=>'<span class="badge">'+x+'</span>').join('');
  }

  if($('progressChart')){
   let c=$('progressChart');
   let ctx=c.getContext('2d');
   let w=c.clientWidth;

   c.width=w*devicePixelRatio;
   c.height=150*devicePixelRatio;

   ctx.scale(devicePixelRatio,devicePixelRatio);

   let days=$('period').value==='month'?30:7;
   let vals=Array(days).fill(0);
   let now=new Date();

   a.forEach(x=>{
    let d=Math.floor(
     (new Date(now.toDateString())-new Date(x.date+'T00:00:00'))/86400000
    );

    if(d>=0&&d<days)vals[days-1-d]+=x.mins;
   });

   let max=Math.max(30,...vals);
   let gap=w/days;

   ctx.fillStyle='#2864d7';

   vals.forEach((v,i)=>{
    ctx.fillRect(
     i*gap+gap*.2,
     130-v/max*105,
     gap*.6,
     v/max*105
    );
   });
  }
 }

 renderProgress();

 if($('period')){
  $('period').onchange=renderProgress;
 }

 // Theo dõi dinh dưỡng
 if($('foodForm')){
  $('foodForm').onsubmit=e=>{
   e.preventDefault();

   let a=get('food',[]);

   a.push({
    name:$('foodName').value,
    kcal:+$('foodKcal').value,
    date:new Date().toISOString().slice(0,10)
   });

   set('food',a);
   renderFood();
   e.target.reset();
  };

  function renderFood(){
   let a=get('food',[]).filter(x=>
    x.date===new Date().toISOString().slice(0,10)
   );

   $('dailyCalories').textContent=
    a.reduce((s,x)=>s+x.kcal,0)+' kcal';

   $('foodList').innerHTML=a.map(x=>
    `<p>${x.name}: ${x.kcal} kcal</p>`
   ).join('');
  }

  renderFood();
 }

 // Cửa hàng
 function renderShop(){
  let q=$('productSearch').value.toLowerCase();
  let cat=$('productCategory').value;

  $('productGrid').innerHTML=products
   .filter(p=>
    (p.name+' '+p.cat).toLowerCase().includes(q)&&
    (!cat||p.cat===cat)
   )
   .map(p=>`
    <article class="card">
     <span class="pill">${p.cat}</span>
     <h2>${p.name}</h2>
     ${isVip()
      ?`<p class="muted"><s>${fmt(p.price)}</s></p>
        <strong class="vip-price">${fmt(Math.round(p.price*.9))}</strong>
        <p class="vipTag">VIP giảm 10% · Tiết kiệm ${fmt(Math.round(p.price*.1))}</p>`
      :`<strong>${fmt(p.price)}</strong>
        <p class="muted">Đăng ký VIP để giảm 10%</p>`
     }
     <button class="btn primary" onclick="addCart('${p.id}')">
      Thêm vào giỏ
     </button>
    </article>
   `).join('');

  $('discountTag').textContent=isVip()?'VIP · GIẢM 10%':'Giá thường';
 }

 if($('productGrid')){
  renderShop();
  $('productSearch').oninput=renderShop;
  $('productCategory').onchange=renderShop;
 }

 if($('cartItems'))renderCart();

 if($('activateVip')){
  $('activateVip').onclick=()=>{
   set('vip',{active:true,until:Date.now()+30*86400000});
   renderVip();
   renderShop();
   renderCart();
  };
 }

 if($('deactivateVip')){
  $('deactivateVip').onclick=()=>{
   set('vip',{active:false,until:0});
   renderVip();
   renderShop();
   renderCart();
  };
 }

 renderVip();

 if($('checkout')){
  $('checkout').onclick=()=>{
   let a=get('cart',[]);

   if(!a.length){
    return $('orderMessage').textContent='Giỏ hàng đang trống.';
   }

   let orders=get('orders',[]);
   orders.push({items:a,date:new Date().toISOString()});

   set('orders',orders);
   set('cart',[]);
   renderCart();

   $('orderMessage').textContent='Đã ghi nhận đơn hàng.';
  };
 }

 // Cộng đồng
 if($('postForm')){
  let feedMode='all';

  function esc(v){
   return String(v??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
   }[c]));
  }

  function renderFeed(){
   let posts=get('communityPosts',[]);

   if(feedMode==='friends'){
    posts=posts.filter(x=>x.privacy==='friends'||x.author);
   }

   if(feedMode==='groups'){
    posts=posts.filter(x=>x.privacy==='group');
   }

   $('communityFeed').innerHTML=posts.map((x,i)=>`
    <article class="card community-post">
     <div class="row">
      <div>
       <b>${esc(x.author||'Thành viên DISCI')}</b>
       <div class="tiny">
        ${new Date(x.date).toLocaleString('vi-VN')} ·
        ${x.privacy==='public'?'Công khai':x.privacy==='friends'?'Bạn bè':'Nhóm của tôi'}
       </div>
      </div>
      <span class="pill">DISCI</span>
     </div>

     <p>${esc(x.content)}</p>

     <div class="row post-actions">
      <button class="btn soft" onclick="likeCommunityPost(${i})">
       ♥ ${x.likes||0} Thích
      </button>

      <button class="btn line" onclick="commentCommunityPost(${i})">
       ▢ Bình luận (${(x.comments||[]).length})
      </button>

      <button class="btn line" onclick="shareCommunityPost(${i})">
       ↗ Chia sẻ
      </button>

      <button class="btn line" onclick="reportCommunityPost(${i})">
       ⚑ Báo cáo
      </button>
     </div>

     ${(x.comments||[]).map(c=>`<p class="comment">${esc(c)}</p>`).join('')}
    </article>
   `).join('')||`
    <article class="card mt">
     <p class="muted">Chưa có bài viết trong mục này. Hãy chia sẻ hoạt động đầu tiên!</p>
    </article>
   `;
  }

  $('postForm').onsubmit=e=>{
   e.preventDefault();

   let posts=get('communityPosts',[]);
   let u=get('user',null);
   let profile=get('communityProfile',{});

   posts.unshift({
    content:$('postContent').value.trim(),
    date:new Date().toISOString(),
    likes:0,
    comments:[],
    privacy:$('postPrivacy').value,
    author:profile.name||u?.name||'Thành viên DISCI'
   });

   set('communityPosts',posts);
   $('postContent').value='';
   renderFeed();
  };

  document.querySelectorAll('[data-feed]').forEach(b=>{
   b.onclick=()=>{
    feedMode=b.dataset.feed;

    document.querySelectorAll('[data-feed]').forEach(x=>
     x.classList.toggle('primary',x===b)
    );

    renderFeed();
   };
  });

  document.querySelectorAll('[data-tab]').forEach(b=>
   b.onclick=()=>showCommunityTab(b.dataset.tab)
  );

  document.querySelectorAll('[data-goto]').forEach(b=>
   b.onclick=()=>showCommunityTab(b.dataset.goto)
  );

  if($('newPostJump')){
   $('newPostJump').onclick=()=>{
    $('postComposer').scrollIntoView({behavior:'smooth'});
    $('postContent').focus();
   };
  }

  function showCommunityTab(tab){
   document.querySelectorAll('[data-tab]').forEach(b=>
    b.classList.toggle('active',b.dataset.tab===tab)
   );

   document.querySelectorAll('.community-panel').forEach(x=>
    x.classList.toggle('active',x.id==='panel-'+tab)
   );

   if(tab==='rank')renderLeaderboard();
   if(tab==='friends')renderFriends();
   if(tab==='profile')renderCommunityProfile();
  }

  function renderFriends(){
   let names=['Minh Anh','Hoàng Nam','Mai Phương','Quốc Bảo','Thu Hà','Gia Huy'];
   let q=($('friendSearch')?.value||'').toLowerCase();
   let friends=get('friends',[]);

   $('friendList').innerHTML=names
    .filter(n=>n.toLowerCase().includes(q))
    .map((n,i)=>`
     <article class="card">
      <div class="friend-avatar">${n[0]}</div>
      <h3>${n}</h3>
      <p class="muted">Thành viên DISCI · ${i%2?'Tăng sức bền':'Tập luyện tại nhà'}</p>
      <button class="btn ${friends.includes(n)?'line':'soft'}"
              onclick="toggleFriend('${n}')">
       ${friends.includes(n)?'Đã kết nối':'＋ Kết bạn'}
      </button>
     </article>
    `).join('');

   $('friendSuggestions').innerHTML=names.slice(0,3).map(n=>
    `<p>♧ ${n}</p>`
   ).join('');
  }

  if($('friendSearch')){
   $('friendSearch').oninput=renderFriends;
  }

  function renderLeaderboard(){
   let logs=get('logs',[]);
   let metric=$('rankMetric')?.value||'sessions';
   let mine=metric==='sessions'?logs.length:logs.reduce((s,x)=>s+x.mins,0);
   let unit=metric==='sessions'?'buổi tập':'phút';

   let demo=[
    ['Trần Minh Tuấn',17],
    ['Lê Thị Mai Phương',11],
    ['Hoàng Nam',8],
    ['Bạn',mine]
   ].sort((a,b)=>b[1]-a[1]);

   $('leaderboard').innerHTML=demo.map((x,i)=>`
    <div class="leader-row">
     <span class="leader-no">#${i+1}</span>
     <b>${x[0]}</b>
     <strong>${x[1]} <small>${unit}</small></strong>
    </div>
   `).join('');
  }

  if($('rankMetric')){
   $('rankMetric').onchange=renderLeaderboard;
  }

  if($('rankWeek')){
   $('rankWeek').onclick=()=>renderLeaderboard();
  }

  if($('rankMonth')){
   $('rankMonth').onclick=()=>renderLeaderboard();
  }

  if($('communityProfile')){
   $('communityProfile').onsubmit=e=>{
    e.preventDefault();

    set('communityProfile',{
     name:$('communityName').value,
     bio:$('communityBio').value,
     goal:$('communityGoal').value
    });

    $('profileMessage').textContent='Đã lưu hồ sơ cộng đồng.';
   };
  }

  function renderCommunityProfile(){
   let p=get('communityProfile',{});
   let logs=get('logs',[]);

   if($('communityName')){
    $('communityName').value=p.name||get('user',{})?.name||'';
   }

   if($('communityBio'))$('communityBio').value=p.bio||'';
   if($('communityGoal'))$('communityGoal').value=p.goal||'Khỏe mạnh';
   if($('profileSessions'))$('profileSessions').textContent=logs.length;

   if($('profileMinutes')){
    $('profileMinutes').textContent=logs.reduce((s,x)=>s+x.mins,0);
   }

   if($('profileBadges')){
    $('profileBadges').innerHTML=(
     logs.length>=10
      ?['🏅 Chiến binh 10 buổi','🔥 Kiên trì']
      :logs.length>=3
       ?['🌱 Khởi đầu tốt']
       :['Hãy ghi nhận buổi tập để nhận huy hiệu']
    ).map(x=>`<span class="badge">${x}</span>`).join('');
   }
  }

  let logs=get('logs',[]);

  if($('communityStreak')){
   $('communityStreak').textContent=new Set(logs.map(x=>x.date)).size;
  }

  if($('communityBadges')){
   $('communityBadges').textContent=(logs.length>=10?4:logs.length>=3?2:0)+' / 6';
  }

  renderFeed();
  renderFriends();
  renderCommunityProfile();
  renderLeaderboard();
 }

 // Nhóm tập luyện
 if($('groupForm')){
  const seed=[
   {name:'DISCI – Người mới bắt đầu',desc:'Cùng nhau xây dựng thói quen vận động.',members:128},
   {name:'Tăng cơ khoa học',desc:'Chia sẻ kinh nghiệm tập kháng lực.',members:86},
   {name:'Chạy bộ & Cardio',desc:'Duy trì sức bền mỗi ngày.',members:94},
   {name:'Giảm mỡ lành mạnh',desc:'Tập luyện và dinh dưỡng cân bằng.',members:112}
  ];

  function renderGroups(){
   let mine=get('groups',[]);
   let joined=get('joinedGroups',[]);

   $('groupList').innerHTML=mine.map((x,i)=>`
    <div class="group-row">
     <b>${x.name}</b>
     <p>${x.desc}</p>
     <button class="btn line" onclick="deleteGroup(${i})">Xóa nhóm</button>
    </div>
   `).join('')||'<p class="muted">Bạn chưa tạo nhóm nào.</p>';

   $('publicGroups').innerHTML=seed.map((x,i)=>`
    <article class="card">
     <span class="pill">${x.members} thành viên</span>
     <h3>${x.name}</h3>
     <p>${x.desc}</p>
     <button class="btn ${joined.includes(i)?'line':'soft'}"
             onclick="toggleJoinGroup(${i})">
      ${joined.includes(i)?'Đã tham gia · Rời nhóm':'＋ Tham gia nhóm'}
     </button>
    </article>
   `).join('');
  }

  $('groupForm').onsubmit=e=>{
   e.preventDefault();

   let a=get('groups',[]);

   a.push({
    name:$('groupName').value.trim(),
    desc:$('groupDesc').value.trim()
   });

   set('groups',a);
   renderGroups();
   e.target.reset();
  };

  renderGroups();
 }

 // Trợ lý AI ngoại tuyến
 if($('aiForm')){
  const knowledge=[
   {
    keys:['squat','ngồi xổm'],
    answer:'Squat: đứng rộng bằng vai, đẩy hông ra sau, gập gối theo hướng mũi chân, giữ lưng trung lập rồi đẩy sàn đứng lên. Bắt đầu 2–3 hiệp × 8–12 lần.'
   },
   {
    keys:['người mới','mới bắt đầu','lịch tập'],
    answer:'Gợi ý lịch cho người mới: 3 buổi/tuần, xen kẽ ngày nghỉ. Mỗi buổi gồm 5–8 phút khởi động, 3–4 bài toàn thân (Squat, Wall/Incline Push-up, Glute Bridge, Bird-Dog), sau đó thả lỏng. Bắt đầu nhẹ và tăng dần.'
   },
   {
    keys:['phòng trọ','êm','ồn','nhảy'],
    answer:'Bài ít tiếng ồn: Squat chậm, Wall Push-up, Glute Bridge, Bird-Dog, Dead Bug và Plank. Tránh động tác bật nhảy; dùng thảm để giảm tiếng va chạm.'
   },
   {
    keys:['sau khi tập','ăn gì','dinh dưỡng','protein'],
    answer:'Sau tập, bạn có thể ăn bữa cân bằng gồm nguồn protein (trứng, cá, thịt nạc, đậu phụ), tinh bột (cơm, khoai, yến mạch), rau và nước. Lượng ăn tùy nhu cầu năng lượng và tình trạng sức khỏe.'
   },
   {
    keys:['giảm mỡ','giảm cân'],
    answer:'Ưu tiên thói quen bền vững: vận động đều, tập sức mạnh 2–3 buổi/tuần, đi bộ/cardio phù hợp, ăn đủ chất và ngủ đủ. Không nên nhịn ăn cực đoan hoặc ép cân nhanh.'
   },
   {
    keys:['tăng cơ','cơ bắp'],
    answer:'Tập kháng lực có tăng tiến, đảm bảo kỹ thuật, nghỉ phục hồi và ăn đủ năng lượng/protein. Có thể bắt đầu 2–3 buổi toàn thân mỗi tuần.'
   },
   {
    keys:['đau','chấn thương','chóng mặt'],
    answer:'Hãy dừng bài tập nếu đau bất thường, chóng mặt hoặc khó thở. Không cố tập xuyên đau; nếu triệu chứng nặng, kéo dài hoặc bạn có bệnh nền, hãy hỏi chuyên gia y tế.'
   }
  ];

  function answerAI(q){
   let t=q.toLowerCase();
   let hit=knowledge.find(k=>k.keys.some(w=>t.includes(w)));

   return hit
    ?hit.answer
    :'Tôi chưa có câu trả lời chuyên biệt cho câu hỏi này trong kho kiến thức ngoại tuyến. Bạn có thể hỏi về lịch tập người mới, bài tập êm phòng trọ, squat, dinh dưỡng sau tập, tăng cơ hoặc giảm mỡ. Đây là trợ lý quy tắc chạy trên trình duyệt, chưa kết nối mô hình AI trực tuyến.';
  }

  function sendAI(q){
   if(!q.trim())return;

   let box=$('aiConversation');

   box.innerHTML+=`
    <div class="ai-message user">
     ${q.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
    </div>
    <div class="ai-message bot">
     ${answerAI(q)}
    </div>
   `;

   $('aiQuestion').value='';
   box.scrollTop=box.scrollHeight;
  }

  $('aiForm').onsubmit=e=>{
   e.preventDefault();
   sendAI($('aiQuestion').value);
  };

  document.querySelectorAll('.quick-questions button').forEach(b=>
   b.onclick=()=>sendAI(b.textContent)
  );
 }

 if($('askAssistant')){
  $('askAssistant').onclick=()=>
   $('assistantAnswer').textContent=
    $('assistantQuestion').value.trim()
     ?'Gợi ý: khởi động kỹ, chọn cường độ phù hợp, tăng tải từ từ và nghỉ ngơi đầy đủ. Nếu có bệnh lý hoặc đau bất thường, hãy hỏi chuyên gia.'
     :'Hãy nhập câu hỏi.';
 }

 // Nhắc lịch tập
 if($('enableReminder')){
  $('enableReminder').onclick=async()=>{
   if(!('Notification'in window)){
    return $('reminderStatus').textContent='Trình duyệt không hỗ trợ thông báo.';
   }

   let p=await Notification.requestPermission();

   $('reminderStatus').textContent=
    p==='granted'
     ?'Đã cấp quyền thông báo. Giờ nhắc: '+$('reminderTime').value
     :'Bạn chưa cấp quyền.';
  };
 }

 if($('testReminder')){
  $('testReminder').onclick=()=>{
   if('Notification'in window&&Notification.permission==='granted'){
    new Notification('DISCI',{body:'Đừng quên lịch luyện tập hôm nay!'});
   }else{
    $('reminderStatus').textContent='Hãy cấp quyền thông báo trước.';
   }
  };
 }

 // Đăng nhập và đăng ký
 if($('closeAuth')){
  $('closeAuth').onclick=()=>$('authModal').hidden=true;
 }

 if(document.querySelectorAll('[data-auth]').length){
  document.querySelectorAll('[data-auth]').forEach(b=>
   b.onclick=()=>showAuth(b.dataset.auth)
  );
 }

 if($('authForm')){
  $('authForm').onsubmit=e=>{
   e.preventDefault();

   let users=get('users',[]);
   let email=$('authEmail').value;
   let pw=$('authPassword').value;

   if(authMode==='register'){
    if(users.some(x=>x.email===email)){
     return $('authMessage').textContent='Email đã tồn tại.';
    }

    users.push({
     email,
     pw,
     name:$('authName').value
    });

    set('users',users);
    set('user',{email,name:$('authName').value});

   }else{
    let u=users.find(x=>x.email===email&&x.pw===pw);

    if(!u){
     return $('authMessage').textContent='Thông tin đăng nhập không chính xác.';
    }

    set('user',{email,name:u.name});
   }

   $('authMessage').textContent='Thao tác tài khoản thành công.';
   renderAccount();
  };
 }

 function renderAccount(){
  let u=get('user',null);
  let p=get('profile',{});

  if($('accountStatus')){
   $('accountStatus').textContent=u
    ?'Đang đăng nhập: '+u.email
    :'Bạn chưa đăng nhập.';
  }

  if($('profileName'))$('profileName').value=p.name||u?.name||'';
  if($('profileEmail'))$('profileEmail').value=p.email||u?.email||'';
  if($('profileDob'))$('profileDob').value=p.dob||'';
  if($('profileGoal'))$('profileGoal').value=p.goal||'Khỏe mạnh';
 }

 renderAccount();

 if($('profileForm')){
  $('profileForm').onsubmit=e=>{
   e.preventDefault();

   set('profile',{
    name:$('profileName').value,
    email:$('profileEmail').value,
    dob:$('profileDob').value,
    goal:$('profileGoal').value
   });

   $('profileMessage').textContent='Đã lưu hồ sơ.';
  };
 }

 if($('logout')){
  $('logout').onclick=()=>{
   set('user',null);
   renderAccount();
  };
 }

});

let authMode='login';

function showAuth(mode){
 authMode=mode;

 let modal=document.getElementById('authModal');

 if(modal){
  modal.hidden=false;
  document.getElementById('authTitle').textContent=
   mode==='login'?'Đăng nhập':'Đăng ký';

  document.getElementById('authName').hidden=mode==='login';
 }
}

// Giỏ hàng
function addCart(id){
 let a=get('cart',[]);
 let x=a.find(x=>x.id===id);

 if(x)x.qty++;
 else a.push({id,qty:1});

 set('cart',a);
 renderCart();
}

function renderCart(){
 let el=document.getElementById('cartItems');
 if(!el)return;

 let a=get('cart',[]);
 let total=0;

 el.innerHTML=a.map(x=>{
  let p=products.find(p=>p.id===x.id);
  let price=isVip()?Math.round(p.price*.9):p.price;

  total+=price*x.qty;

  return `
   <div class="cartItem">
    <span>${p.name} × ${x.qty} · ${fmt(price)}</span>
    <span>
     <button class="btn soft" onclick="changeQty('${x.id}',-1)">−</button>
     <button class="btn soft" onclick="changeQty('${x.id}',1)">+</button>
     <button class="btn line" onclick="removeCart('${x.id}')">Xóa</button>
    </span>
   </div>
  `;
 }).join('')||'Giỏ hàng đang trống.';

 if(document.getElementById('cartTotal')){
  document.getElementById('cartTotal').textContent=fmt(total);
 }
}

function changeQty(id,n){
 let a=get('cart',[]);
 let x=a.find(x=>x.id===id);

 if(x)x.qty+=n;

 set('cart',a.filter(x=>x.qty>0));
 renderCart();
}

function removeCart(id){
 set('cart',get('cart',[]).filter(x=>x.id!==id));
 renderCart();
}

// Thử thách
function joinChallenge(i){
 let a=get('joined',[]);

 if(!a.includes(i))a.push(i);

 set('joined',a);

 document.getElementById('challengeStatus').textContent=
  'Đã tham gia thử thách '+[7,14,30][i]+' ngày.';
}

// Tương tác cộng đồng
function likeCommunityPost(i){
 let a=get('communityPosts',[]);

 if(a[i]){
  a[i].likes=(a[i].likes||0)+1;
  set('communityPosts',a);
  location.reload();
 }
}

function commentCommunityPost(i){
 let v=prompt('Nhập bình luận:');

 if(v&&v.trim()){
  let a=get('communityPosts',[]);
  a[i].comments=a[i].comments||[];
  a[i].comments.push(v.trim());

  set('communityPosts',a);
  location.reload();
 }
}

function toggleFriend(name){
 let a=get('friends',[]);

 set(
  'friends',
  a.includes(name)?a.filter(x=>x!==name):[...a,name]
 );

 location.reload();
}

function toggleJoinGroup(i){
 let a=get('joinedGroups',[]);

 set(
  'joinedGroups',
  a.includes(i)?a.filter(x=>x!==i):[...a,i]
 );

 location.reload();
}

function deleteGroup(i){
 let a=get('groups',[]);

 a.splice(i,1);
 set('groups',a);
 location.reload();
}

function shareCommunityPost(i){
 let p=get('communityPosts',[])[i];

 if(p&&navigator.clipboard){
  navigator.clipboard.writeText(p.content)
   .then(()=>alert('Đã sao chép nội dung bài viết.'))
   .catch(()=>alert(p.content));
 }else if(p){
  prompt('Sao chép nội dung bài viết:',p.content);
 }
}

function reportCommunityPost(i){
 let reports=get('communityReports',[]);

 reports.push({
  index:i,
  date:new Date().toISOString()
 });

 set('communityReports',reports);
 alert('Đã ghi nhận báo cáo trên thiết bị này.');
}