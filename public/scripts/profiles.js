/* Three independent, illustrative Profiles. Nothing is persisted or synced. */
(() => {
  const scene=document.querySelector('.spaces-showcase');
  const browser=scene.querySelector('.browser');
  const assets=window.CrescentBrandAssets;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const scrollHost=document.querySelector('[data-preview-scroll]');
  const profiles={
    work:{name:'Work',space:'Studio',theme:'prism',preset:'spectrum',scheme:'dark',url:'github.com',favorites:['github','linear','slack','notion'],pins:[['github','Pull requests'],['linear','Roadmap'],['slack','Team updates'],['notion','Sprint notes'],['google-calendar','Today’s calendar']],page:'code'},
    personal:{name:'Personal',space:'Everyday',theme:'afterglow',preset:'dusk',scheme:'light',url:'medium.com',favorites:['medium','spotify','youtube','google-maps'],pins:[['medium','Weekend reading'],['spotify','Daily Mix'],['youtube','Watch later'],['google-maps','Places to explore'],['airbnb','The next little escape']],page:'reading'},
    creative:{name:'Creative',space:'Design',theme:'meridian',preset:'plum',scheme:'dark',url:'figma.com',favorites:['figma','dribbble','pinterest','canva'],pins:[['figma','Brand explorations'],['dribbble','Visual inspiration'],['pinterest','Moodboard'],['canva','Quick sketches'],['behance','Portfolio ideas']],page:'design'}
  };
  const order=Object.keys(profiles), dwell=5500;
  let selected='work', wanted=!reduce.matches, visible=false, hovered=false, timer=null;
  const logo=(service)=>'<img class="favorite-logo" src="'+assets[service]+'" alt="'+(window.CrescentBrandNames[service]||service)+'">';
  const pages={
    code:'<div class="profile-page profile-page-code"><header><span class="code-site-brand">'+logo('github')+' GitHub</span><span>Dashboard &nbsp; / &nbsp; Projects</span><i>+</i></header><div class="code-repo"><small>STUDIO / LAUNCH-NOTES</small><h4>Make something<br>worth shipping.</h4><div class="code-repo-tabs"><b>Code</b><span>Issues <i>3</i></span><span>Pull requests <i>2</i></span></div><div class="code-file"><div><span>◉</span> A little progress, every day.<em>main ↓</em></div><p><i>01</i><span class="code-purple">const</span> nextIdea = {</p><p><i>02</i>&nbsp; name: <span class="code-peach">"Something good"</span>,</p><p><i>03</i>&nbsp; status: <span class="code-peach">"In the making"</span>,</p><p><i>04</i>&nbsp; readyFor: [<span class="code-peach">"one more thought"</span>]</p><p><i>05</i>};</p></div><div class="code-readme"><span>README.md</span><strong>One idea. A little room to build.</strong></div></div></div>',
    reading:'<div class="profile-page profile-page-reading"><header><strong>Medium</strong><span>Write &nbsp; ⌕</span></header><div class="reading-content"><small>THE WEEKEND EDIT</small><h4>The art of<br>paying attention.</h4><p>Sometimes the best thing to find<br>is a little space to think.</p><div class="reading-author"><i>C</i><span>Curiosity Journal <small>4 min read · Original sample</small></span></div><div class="reading-art"><div></div><i></i><b></b></div><p class="reading-body">A quiet morning. A good read. An idea worth keeping for another day.</p></div></div>',
    design:'<div class="profile-page profile-page-design"><header><span>'+logo('figma')+' Studio / Brand explorations</span><span>Share ↗</span></header><div class="design-canvas"><span class="design-canvas-label">A LITTLE MORE POSSIBILITY</span><div class="design-board board-type"><small>TYPE / 01</small><strong>Play<br>with<br>possibility.</strong><span>Outfit · A little character.</span></div><div class="design-board board-shapes"><span class="design-sun"></span><span class="design-arc"></span><small>GOOD IDEAS TAKE SHAPE.</small></div><div class="design-board board-palette"><i></i><i></i><i></i><i></i></div><span class="design-cursor">↖ &nbsp; You, exploring</span></div></div>'
  };
  function render(animate=false){
    const p=profiles[selected];const row=window.CrescentNativeThemes.find(r=>r.theme===p.theme&&r.preset===p.preset&&r.scheme===p.scheme),t=row.tokens;
    const values={'--sidebar':t.sidebar_top,'--sidebar-bottom':t.sidebar_bottom,'--chrome':t.frame,'--ui-ink':t.text,'--ui-pale':t.omnibox,'--ui-active':t.tab_selected,'--mock-accent':t.accent,'--frame':t.separator,'--native-toolbar':t.toolbar,'--native-toolbar-ink':t.text,'--native-omnibox':t.omnibox,'--native-line':t.separator,'--native-grain':String(t.grainAlpha/255),'--native-selected-ink':t.tab_selected_text,'--native-inset':t.contentInset/6+'cqw','--native-radius':t.contentRadius/8+'cqw'};
    Object.entries(values).forEach(([key,value])=>scene.style.setProperty(key,value));
    scene.dataset.profile=selected;browser.dataset.nativeTheme=p.theme;browser.dataset.nativeMode=p.preset;browser.dataset.nativeToolbar=['standard','title','hidden'][t.toolbarStyle];
    browser.querySelector('.mock-url').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>'+p.url;
    browser.querySelector('.favorites').innerHTML=p.favorites.map(service=>'<span data-service="'+service+'">'+logo(service)+'</span>').join('');
    browser.querySelector('.space-title').innerHTML='<i></i>'+p.space;
    let rows=browser.querySelector('.profile-pinned-tabs');
    if(!rows){rows=document.createElement('div');rows.className='profile-pinned-tabs';browser.querySelector('.tab-row').before(rows);browser.querySelectorAll('.tab-row').forEach(row=>row.remove());}
    rows.innerHTML=p.pins.map((pin,index)=>'<div class="tab-row'+(index===0?' active':'')+'" data-app="'+window.CrescentBrandNames[pin[0]]+'" title="'+window.CrescentBrandNames[pin[0]]+' · '+pin[1]+'"><img class="tab-brand" data-brand="'+pin[0]+'" src="'+assets[pin[0]]+'" alt=""><span>'+pin[1]+'</span></div>').join('');
    const page=browser.querySelector('.mock-main > div:last-child');page.className='profile-page-mount';page.innerHTML=pages[p.page];
    scene.querySelectorAll('[data-showcase-profile]').forEach(button=>{const on=button.dataset.showcaseProfile===selected;button.setAttribute('aria-pressed',String(on));button.tabIndex=on?0:-1;});
    scene.querySelector('[data-example-profile]').textContent=p.name;scene.querySelector('[data-example-space]').textContent=p.space;scene.querySelector('[data-profile-theme]').textContent=row.name+' · '+row.presetName;
    window.CrescentPaintPrism?.();
    if(animate&&!reduce.matches)page.animate([{opacity:.2,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:430,easing:'ease-out'});
  }
  function sync(){
    const focus=document.activeElement;const focusWithin=scene.contains(focus)&&!focus.closest('[data-profile-play]');
    const running=wanted&&!reduce.matches&&visible&&!hovered&&!focusWithin&&!document.hidden&&!document.querySelector('#mobile-dialog').open;
    scene.dataset.carouselRunning=String(running);scene.dataset.carouselWanted=String(wanted);
    const button=scene.querySelector('[data-profile-play]');button.disabled=reduce.matches;button.setAttribute('aria-label',reduce.matches?'Automatic Profile rotation disabled by reduced motion':wanted?'Pause Profile rotation':'Play Profile rotation');button.title=button.getAttribute('aria-label');button.innerHTML=wanted?'<span aria-hidden="true">Ⅱ</span>':'<span aria-hidden="true">▶</span>';
    if(timer!==null&&!running){clearTimeout(timer);timer=null;}
    if(running&&timer===null)timer=setTimeout(()=>{timer=null;selected=order[(order.indexOf(selected)+1)%order.length];render(true);sync();},dwell);
  }
  scene.querySelectorAll('[data-showcase-profile]').forEach((button,index,list)=>{
    button.addEventListener('click',()=>{selected=button.dataset.showcaseProfile;wanted=false;render(true);sync();});
    button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?list.length-1:(index+(event.key==='ArrowRight'?1:-1)+list.length)%list.length;list[next].click();list[next].focus();});
  });
  scene.querySelector('[data-profile-play]').addEventListener('click',()=>{wanted=!wanted;sync();});
  scene.addEventListener('pointerenter',()=>{hovered=true;sync();});scene.addEventListener('pointerleave',()=>{hovered=false;sync();});
  scene.addEventListener('focusin',sync);scene.addEventListener('focusout',()=>queueMicrotask(sync));document.addEventListener('visibilitychange',sync);
  new MutationObserver(sync).observe(document.querySelector('#mobile-dialog'),{attributes:true,attributeFilter:['open']});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{root:scrollHost,threshold:.2}).observe(scene);
  reduce.addEventListener('change',()=>{if(reduce.matches)wanted=false;sync();});
  render();sync();
})();
