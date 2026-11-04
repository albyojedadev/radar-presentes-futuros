/* Fixed editorial bands: geometry is not a measurement of political power. */
window.AtlasGraph = (() => {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kinds = {public:'Institución pública',private:'Empresa / organización',civic:'Sociedad civil',mechanism:'Mecanismo / proyecto'};
  const bands = ['CIUDADANÍA Y VÍAS DE PARTICIPACIÓN','REPRESENTACIÓN','GOBIERNO E INTERMEDIACIÓN','ÓRGANOS Y ORGANIZACIONES ESPECIALIZADAS','ÁMBITO TRANSNACIONAL'];
  function layout(nodes, availableWidth = 1000) {
    const width = Math.max(1000, availableWidth), positions = {}, rows = [];
    let top = 24;
    for (let level = 4; level >= 0; level--) {
      const group = nodes.filter(n => n.level === level);
      if (!group.length) continue;
      rows.push({label:bands[level],y:top});
      top += 25;
      for (let start = 0; start < group.length; start += 5) {
        const row = group.slice(start,start+5), step = Math.min(310,(width-190)/4);
        row.forEach((n,i) => positions[n.id] = {x:width/2+(i-(row.length-1)/2)*step,y:top,width:164,height:96});
        top += 100;
      }
      top += 6;
    }
    return {width,height:top+8,positions,rows};
  }
  function render(container, nodes, edges, selected) {
    const A = window.ATLAS;
    const viewport=container.closest('.map-viewport');
    const geometry = layout(nodes,viewport?.clientWidth || 1000), pos = geometry.positions;
    const related = new Set(edges.filter(e => e.from === selected || e.to === selected).flatMap(e => [e.from,e.to]));
    const definitions = Object.entries(A.types).map(([id,t]) => `<marker id="arrow-${id}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="${t.color}"/></marker>`).join('');
    // Reciprocal connections bend to opposite sides; text remains in the accessible details.
    const paths = edges.map(e => {
      const a=pos[e.from], b=pos[e.to];
      if (!a || !b) return '';
      const t=A.types[e.type], active=!selected || e.from===selected || e.to===selected;
      const dx=b.x-a.x, dy=b.y-a.y, length=Math.hypot(dx,dy)||1;
      const x1=a.x+dx/length*23, y1=a.y+18+dy/length*23;
      const x2=b.x-dx/length*24, y2=b.y+18-dy/length*24;
      const bend=Math.abs(dy)<30 ? 46 : 25;
      const cx=(x1+x2)/2-dy/length*bend, cy=(y1+y2)/2+dx/length*bend;
      return `<path class="connection" data-edge="${e.id}" d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" stroke="${t.color}" stroke-width="${t.width}" stroke-dasharray="${t.dash}" opacity="${active ? .8 : .08}" marker-end="url(#arrow-${e.type})"/>`;
    }).join('');
    container.style.width = `${geometry.width}px`;
    container.style.height = `${geometry.height}px`;
    container.innerHTML = `<svg class="connections" width="${geometry.width}" height="${geometry.height}" aria-hidden="true"><defs>${definitions}</defs>${paths}</svg>` + geometry.rows.map(r=>`<div class="band-line" style="top:${r.y+6}px"></div><span class="band-label" style="top:${r.y}px">${r.label}</span>`).join('') + nodes.map(n=>{
      const p=pos[n.id];
      const state=n.id===selected?'is-selected':selected?(related.has(n.id)?'related':'unrelated'):'';
      return `<button class="actor kind-${n.kind} ${state}" data-node="${n.id}" aria-pressed="${n.id===selected}" aria-label="${escape(n.label)} · ${kinds[n.kind]}" style="left:${p.x-82}px;top:${p.y}px"><span class="glyph" aria-hidden="true"></span><span class="actor-name">${escape(n.short)}</span><span class="actor-kind">${kinds[n.kind]}</span></button>`;
    }).join('');
    return geometry;
  }
  function renderList(container,nodes,selected) {
    container.innerHTML=nodes.slice().sort((a,b)=>a.level-b.level || a.label.localeCompare(b.label,'es')).map(n=>`<button class="list-actor" data-node="${n.id}" aria-pressed="${n.id===selected}"><span>${escape(n.label)}<small>${kinds[n.kind]}</small></span><span aria-hidden="true">↗</span></button>`).join('');
  }
  function renderBands(container,nodes,edges,selected,openBands,toggleBand) {
    const bandNames={0:'Ciudadanía y participación',1:'Representación',2:'Gobierno e intermediación',3:'Instituciones especializadas',4:'Ámbito transnacional'};
    const groups=[4,3,2,1,0].map(level=>({level,nodes:nodes.filter(n=>n.level===level)})).filter(g=>g.nodes.length);
    const levelOf=new Map(nodes.map(n=>[n.id,n.level]));
    container.innerHTML=groups.map(g=>{
      const external=edges.filter(e=>(levelOf.get(e.from)===g.level)!==(levelOf.get(e.to)===g.level));
      const open=openBands.has(g.level);
      const aggregate=external.length?`<p class="band-aggregate">${external.length} conexiones con otras franjas <span>${[...new Set(external.map(e=>levelOf.get(e.from)===g.level?levelOf.get(e.to):levelOf.get(e.from)))].map(level=>bandNames[level]).join(' · ')}</span></p>`:'<p class="band-aggregate">Sin conexiones externas registradas en esta vista.</p>';
      const actors=open?`<div class="band-actors">${g.nodes.map(n=>`<button class="band-actor kind-${n.kind}" data-node="${n.id}" aria-pressed="${selected===n.id}"><span>${escape(n.label)}</span><small>${kinds[n.kind]}</small></button>`).join('')}</div>`:'';
      return `<section class="band-section ${open?'is-open':''}"><button class="band-toggle" data-band="${g.level}" aria-expanded="${open}"><span class="band-index">0${5-g.level}</span><span class="band-heading">${bandNames[g.level]}<small>${g.nodes.length} nodos · posición orientativa, no escala de poder</small></span><span class="band-count">${open?'−':'+'}</span></button>${open?`<div class="band-content">${actors}${aggregate}</div>`:''}</section>`;
    }).join('');
  }
  return {layout,render,renderList,renderBands,escape,kinds};
})();
