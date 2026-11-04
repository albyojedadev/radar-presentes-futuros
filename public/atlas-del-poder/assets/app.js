(() => {
  'use strict';
  const A=window.ATLAS, G=window.AtlasGraph, esc=G.escape, $=id=>document.getElementById(id);
  const byId = new Map(A.nodes.map(n=>[n.id,n]));
  const state={topic:'all',selected:null,route:null,type:'all',view:'map',zoom:1,openBands:new Set()};
  const topics={
    vote:['01 / REPRESENTACIÓN','Del voto a las decisiones','La ciudadanía está en la base. Sigue sus conexiones hacia la representación y los órganos de decisión.'],
    checks:['02 / CONTRAPESOS','Quién controla a quién','Los controles tienen funciones y límites distintos. La independencia de un órgano no significa ausencia de rendición de cuentas.'],
    money:['03 / DINERO','Quién financia a quién','Aquí aparecen todos los actores del Atlas. Las flechas muestran los vínculos económicos registrados. Un actor sin flecha puede tener relaciones económicas que aún no están recogidas.'],
    global:['04 / CONEXIONES GLOBALES','Más allá de las fronteras','Organismos, foros y participaciones empresariales. Las fechas y los mecanismos importan más que la proximidad en el dibujo.'],
    all:['ATLAS / CONJUNTO','Todas las conexiones registradas','Una vista de consulta amplia. Selecciona un actor o utiliza las vistas temáticas para seguir un recorrido concreto.']
  };
  let geometry;
  const sourceLinks=ids=>`<ul class="source-links">${[...new Set(ids)].map(id=>{const s=A.sources[id];return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.locator)} Consulta: ${s.checked}.</small></li>`;}).join('')}</ul>`;
  const routeButtons=(cls,routes)=>routes.map((r,i)=>`<button class="${cls}" data-route="${r.id}">${esc(r.title)} <span aria-hidden="true">${String(i+1).padStart(2,'0')} ↗</span></button>`).join('');
  function eligibleEdges() {
    const seeds=new Set(A.nodes.filter(n=>n.topics.includes(state.topic)).map(n=>n.id));
    const civicControls=new Set(['defensor','courts','transparency','ctbg','admin']);
    return A.edges.filter(e=>{
      if(e.status==='pending')return false;
      if(state.route || state.topic==='all')return true;
      const both=seeds.has(e.from)&&seeds.has(e.to);
      if(state.topic==='money')return e.type==='capital';
      if(state.topic==='vote')return both&&['vote','appointment'].includes(e.type);
      if(state.topic==='checks')return (['oversight','appointment'].includes(e.type)&&(seeds.has(e.from)||seeds.has(e.to))) ||
        (e.type==='vote'&&civicControls.has(e.to));
      return both;
    });
  }
  function currentNodes() {
    const route=A.routes.find(r=>r.id===state.route);
    if(route)return A.nodes.filter(n=>route.nodes.includes(n.id)||route.context?.includes(n.id));
    if(state.topic==='all'||state.topic==='money')return A.nodes;
    const endpoints=new Set(eligibleEdges().filter(e=>state.type==='all'||e.type===state.type).flatMap(e=>[e.from,e.to]));
    return A.nodes.filter(n=>endpoints.has(n.id));
  }
  function currentEdges(nodes) {
    const ids=new Set(nodes.map(n=>n.id));
    return eligibleEdges().filter(e=>ids.has(e.from)&&ids.has(e.to)&&(state.type==='all'||e.type===state.type));
  }
  function resize() {
    if (!geometry || state.view!=='map' || $('explorar').hidden) return;
    const scale=Math.max(.78,Math.min(1.2,($('map-viewport').clientWidth-10)/geometry.width))*state.zoom;
    $('map-inner').style.transform=`scale(${scale})`;
    $('map-stage').style.width=`${geometry.width*scale}px`;
    $('map-stage').style.height=`${geometry.height*scale}px`;
    $('zoom-out').disabled=state.zoom<=.75;
    $('zoom-in').disabled=state.zoom>=2;
  }
  function detail() {
    const n=byId.get(state.selected);
    if (!n) {
      $('detail').hidden=true;
      return;
    }
    $('detail').hidden=false;
    const links=A.edges.filter(e=>e.status!=='pending'&&(e.from===n.id||e.to===n.id)&&(state.type==='all'||e.type===state.type));
    $('detail').innerHTML=`<button class="detail-close" data-clear>← CERRAR FICHA</button><p class="eyebrow" style="margin-top:24px">SIGUE UNA CONEXIÓN · ${esc(G.kinds[n.kind])}</p><h2>${esc(n.label)}</h2><p>${esc(n.summary)}</p><div class="detail-access"><h3>Tu vía de intervención</h3><p>${esc(n.access)}</p></div><h3>Hasta dónde llega</h3><p class="limit">${esc(n.limit)}</p><h3>${links.length} relaciones ${state.type==='all'?'registradas':'del tipo elegido'}</h3><p class="relation-help">Abre una relación para leer su mecanismo y su fuente.</p>${links.length?links.map(e=>{
      const other=byId.get(e.from===n.id?e.to:e.from), t=A.types[e.type];
      const phase=e.phase || (e.status==='documented'?'Vínculo documentado':'Marco o competencia');
      return `<details class="relation"><summary><span>${esc(byId.get(e.from).short)} → ${esc(byId.get(e.to).short)}<small class="relation-type" style="color:${t.color}">${esc(t.label)} · ${esc(phase)}</small></span></summary><p><strong>${esc(e.label)}.</strong> ${esc(e.detail)}</p><span class="badge">${esc(e.date)}</span>${sourceLinks(e.sources)}<button data-node="${other.id}" data-focus-detail>Ver ${esc(other.short)} ↗</button></details>`;
    }).join(''):'<p>No hay conexiones registradas con este filtro. Esto no significa ausencia de relaciones o controles.</p>'}<h3>Fuentes de esta ficha</h3>${sourceLinks(n.sources)}`;
  }
  function render() {
    const nodes=currentNodes(), edges=currentEdges(nodes), meta=topics[state.topic], route=A.routes.find(r=>r.id===state.route);
    $('map-kicker').textContent=route?'RECORRIDO CIUDADANO':meta[0];
    $('map-title').textContent=route?route.title:meta[1];
    $('map-description').textContent=meta[2];
    $('route-banner').hidden=!route;
    $('route-banner').innerHTML=route?`<strong>${route.nodes.map(id=>esc(byId.get(id).short)).join(' → ')}</strong><p>${esc(route.text)}</p>${route.sources?sourceLinks(route.sources):''}`:'';
    const moneyRoutes=state.topic==='money'||route?.topic==='money'||route?.id==='taxes';
    $('routes-title').textContent=moneyRoutes?'Recorridos de Dinero':'Caminos para entrar.';
    $('route-links').innerHTML=routeButtons('route-link',moneyRoutes?A.routes.filter(r=>r.id==='taxes'||r.topic==='money'):A.routes);
    document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===state.topic&&!route)));
    $('type-filter').value=state.type;
    const availableTypes=new Set(eligibleEdges().filter(e=>!route||nodes.some(n=>n.id===e.from)&&nodes.some(n=>n.id===e.to)).map(e=>e.type));
    for(const option of $('type-filter').options)option.disabled=option.value!=='all'&&!availableTypes.has(option.value);
    $('view-map').setAttribute('aria-pressed',String(state.view==='map'));
    $('view-space').setAttribute('aria-pressed',String(state.view==='space'));
    $('view-bands').setAttribute('aria-pressed',String(state.view==='bands'));
    $('view-list').setAttribute('aria-pressed',String(state.view==='list'));
    $('map-viewport').hidden=state.view!=='map';
    $('space-view').hidden=state.view!=='space';
    $('actor-list').hidden=state.view!=='list';
    $('bands-view').hidden=state.view!=='bands';
    document.querySelector('.zoom-controls').hidden=state.view!=='map';
    geometry=state.view==='map'?G.render($('map-inner'),nodes,edges,state.selected):null;
    if(state.view==='space') AtlasSpace.setData(nodes,edges,state.selected);
    if(state.view==='list') G.renderList($('actor-list'),nodes,state.selected);
    if(state.view==='bands') G.renderBands($('bands-view'),nodes,edges,state.selected,state.openBands,level=>{state.openBands.has(level)?state.openBands.delete(level):state.openBands.add(level);render();});
    const active=state.selected?edges.filter(e=>e.from===state.selected||e.to===state.selected).length:edges.length;
    $('map-status').textContent=`${nodes.length} actores · ${edges.length} conexiones en esta vista${state.selected?` · ${active} de la selección`:''}`;
    detail();resize();
  }
  function clearSearch() { $('search').value='';$('search-results').hidden=true; }
  function selectNode(id,focusDetail=false) {
    if (!byId.has(id)) return;
    if (!currentNodes().some(n=>n.id===id)) {state.route=null;state.topic='all';state.type='all';}
    state.selected=id;clearSearch();render();
    $('detail').scrollTop=0;
    if(focusDetail || state.view==='list' || matchMedia('(max-width:800px)').matches) { $('detail').focus();$('detail').scrollIntoView({block:'start'}); }
    else {
      const actor=$('map-inner').querySelector(`[data-node="${id}"]`);
      actor?.focus({preventScroll:true});actor?.scrollIntoView({block:'nearest',inline:'nearest'});
    }
  }
  function reset() {
    state.selected=null;state.route=null;state.type='all';state.zoom=1;clearSearch();render();
    $('map-viewport').scrollTo(0,0);
  }
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  $('search').addEventListener('input',()=>{
    const query=normalize($('search').value.trim());
    $('search-results').hidden=!query;
    if(!query)return;
    const found=A.nodes.filter(n=>normalize(`${n.label} ${n.short} ${n.summary}`).includes(query));
    $('search-results').innerHTML=found.length?`<p role="status">${found.length} resultado${found.length===1?'':'s'} en todo el atlas</p>${found.map(n=>`<button data-node="${n.id}" data-focus-detail>${esc(n.label)}<small>${esc(G.kinds[n.kind])}</small></button>`).join('')}`:'<p role="status">No hay resultados. Prueba con una institución, una empresa o «información».</p>';
  });
  $('search').addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();$('search-results').querySelector('button')?.focus();}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){
    if(!$('search-results').hidden){clearSearch();$('search').focus();}
    else if(!$('explorar').hidden){reset();$('reset').focus();}
  }});
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');
    if(!event.target.closest('.search-wrap'))$('search-results').hidden=true;
    if(!b)return;
    if(b.dataset.node)selectNode(b.dataset.node,b.hasAttribute('data-focus-detail'));
    else if(b.dataset.topic){state.topic=b.dataset.topic;state.selected=null;state.route=null;state.zoom=1;state.type='all';clearSearch();render();$('map-viewport').scrollTo(0,0);}
    else if(b.dataset.route){state.route=b.dataset.route;state.type='all';state.selected=null;state.zoom=1;clearSearch();render();$('map-title').scrollIntoView({block:'start'});}
    else if(b.hasAttribute('data-clear')||b.id==='reset'){reset();$('reset').focus();}
    else if(b.dataset.band!==undefined){const level=Number(b.dataset.band);state.openBands.has(level)?state.openBands.delete(level):state.openBands.add(level);render();}
    else if(b.id==='view-map'||b.id==='view-list'||b.id==='view-bands'||b.id==='view-space'){state.view=b.id==='view-map'?'map':b.id==='view-list'?'list':b.id==='view-bands'?'bands':'space';render();}
    else if(b.id==='zoom-in'){state.zoom=Math.min(2,state.zoom+.25);resize();}
    else if(b.id==='zoom-out'){state.zoom=Math.max(.75,state.zoom-.25);resize();}
    else if(b.id==='fit'){state.zoom=1;resize();$('map-viewport').scrollTo(0,0);}
  });
  $('type-filter').addEventListener('change',event=>{state.type=event.target.value;render();});
  window.addEventListener('resize',()=>{
    if(state.view==='map'&&geometry&&geometry.width!==Math.max(1000,$('map-viewport').clientWidth))render();
    else resize();
  });
  // Drag only the canvas background; node buttons and native scrolling remain available.
  let drag=null;
  $('map-viewport').addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('button'))return;
    drag={x:event.clientX,y:event.clientY,left:$('map-viewport').scrollLeft,top:$('map-viewport').scrollTop};
    $('map-viewport').setPointerCapture(event.pointerId);$('map-viewport').classList.add('dragging');
  });
  $('map-viewport').addEventListener('pointermove',event=>{if(drag)$('map-viewport').scrollTo(drag.left-event.clientX+drag.x,drag.top-event.clientY+drag.y);});
  const stopDrag=()=>{drag=null;$('map-viewport').classList.remove('dragging');};
  $('map-viewport').addEventListener('pointerup',stopDrag);
  $('map-viewport').addEventListener('pointercancel',stopDrag);
  $('edge-legend').innerHTML=Object.values(A.types).map(t=>`<span><svg aria-hidden="true" viewBox="0 0 28 10"><path d="M0 5H23" stroke="${t.color}" stroke-width="${t.width}" stroke-dasharray="${t.dash}"/><path d="M22 2L27 5L22 8" fill="none" stroke="${t.color}"/></svg>${esc(t.label)}</span>`).join('');
  Object.entries(A.types).forEach(([id,t])=>{const opt=document.createElement('option');opt.value=id;opt.textContent=t.label;$('type-filter').append(opt);});
  render();
})();
