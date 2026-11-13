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
  let source='Arc';
  const sourceItems={Arc:['Profiles & Spaces','Pinned tabs & Favorites','Folders & split layouts'],Chrome:['Profiles & bookmarks','Open tabs & history','Extension migration review'],Zen:['Profiles & Workspaces','Pinned tabs & folders','Split-layout mapping review'],Dia:['Profiles & bookmarks','Pinned organization','Source coverage review'],Firefox:['Profiles & bookmarks','Open tabs & history','Organization mapping review']};
  document.querySelectorAll('[data-import-source]').forEach(button=>button.addEventListener('click',()=>{
    source=button.dataset.importSource;
    document.querySelectorAll('[data-import-source]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('[data-import-name]').textContent=source;
    const items=document.querySelector('[data-import-items]');items.replaceChildren(...sourceItems[source].map(text=>{const span=document.createElement('span');span.textContent='◌ '+text;return span;}));
    document.querySelector('[data-import-feedback]').textContent='Sample Profiles · illustrative data only';
  }));
  document.querySelector('[data-preview-import]').addEventListener('click',()=>{
    document.querySelector('[data-import-feedback]').textContent=`${source} → Crescent · review 2 sample Profiles. No browser data was read or changed.`;
  });
})();
