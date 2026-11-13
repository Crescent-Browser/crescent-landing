/* Local presentation interactions. No accounts, network sync, or storage. */
(() => {
  const input=document.querySelector('#feature-tab-search');
  const examples=[...document.querySelectorAll('[data-example-tab]')];
  input.addEventListener('input',()=>{
    const query=input.value.trim().toLowerCase();let visible=0;
    examples.forEach(button=>{button.hidden=!button.dataset.exampleTab.toLowerCase().includes(query);if(!button.hidden)visible++;});
    document.querySelector('.command-empty').hidden=visible>0;
  });
  examples.forEach(button=>button.addEventListener('click',()=>{document.querySelector('[data-command-feedback]').textContent='Selected: '+button.dataset.exampleTab;}));
  input.addEventListener('keydown',event=>{if(event.key==='Enter')examples.find(button=>!button.hidden)?.click();});
  document.querySelectorAll('[data-hub-mode]').forEach(button=>button.addEventListener('click',()=>{
    const personal=button.dataset.hubMode==='personal';
    document.querySelectorAll('[data-hub-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('[data-hub-description]').textContent=personal?'A private-network option for connecting your devices around your personal Crescent Hub.':'A paid managed option, without running your own server or VPN.';
    document.querySelector('[data-hub-name]').textContent=personal?'Tailscale':'Crescent Cloud';
    document.querySelector('[data-hub-location]').textContent=personal?'Your devices, connected':'Managed for you';
    document.querySelector('[data-tailscale-mark]').hidden=!personal;document.querySelector('[data-cloud-mark]').hidden=personal;
    document.querySelector('[data-network-caption]').textContent=personal?'Crescent Hub, on your devices':'Managed connection for your devices';
  }));
  const platforms={
    macos:{name:'macOS',title:'A little more space for your day.',description:'Side-by-side pages, separate Profiles, and your favorites close at hand.'},
    windows:{name:'Windows',title:'Find your flow. Keep your shortcuts.',description:'A familiar sidebar and room for every project on your desktop.'},
    linux:{name:'Linux',title:'Your workspace. Your way.',description:'Explore a browser shaped around your tabs, your tools, and your own rhythm.'},
    ios:{name:'iOS',title:'A good read. A place to keep it.',description:'Explore browsing, tab cards, and pinning a page to one of your Profiles.'},
    android:{name:'Android',title:'Your favorite internet, in your pocket.',description:'Explore mobile search, your Profiles, and a home for the tabs worth keeping.'}
  };
  const platformButtons=[...document.querySelectorAll('[data-platform]')];
  function selectPlatform(button){
    const key=button.dataset.platform, platform=platforms[key], mobile=key==='ios'||key==='android';
    platformButtons.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});
    const panel=document.querySelector('[data-platform-panel]');
    panel.setAttribute('aria-labelledby',button.id);panel.dataset.device=mobile?'mobile':'desktop';
    panel.querySelector('[data-platform-title]').textContent=platform.title;
    panel.querySelector('[data-platform-description]').textContent=platform.description;
    const link=panel.querySelector('[data-platform-link]');
    link.href=mobile?'#mobile-lab':'#try-themes';
    link.textContent='Explore the '+platform.name+' interface ↗';
    panel.querySelector('.platform-device').innerHTML=mobile?'<svg viewBox="0 0 32 44"><rect x="5" y="2" width="22" height="40" rx="5"/><path d="M12 7h8m-7 30h6"/></svg>':'<svg viewBox="0 0 48 40"><rect x="8" y="4" width="32" height="24" rx="3"/><path d="M3 32h42l-4 4H7Z"/></svg>';
  }
  platformButtons.forEach((button,index)=>{
    button.addEventListener('click',()=>selectPlatform(button));
    button.addEventListener('keydown',event=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?platformButtons.length-1:(index+(event.key==='ArrowRight'?1:-1)+platformButtons.length)%platformButtons.length;
      selectPlatform(platformButtons[next]);platformButtons[next].focus();
    });
  });
})();
