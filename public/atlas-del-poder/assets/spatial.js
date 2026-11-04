/* Editorial categories expand in place. Geometry has no evidentiary meaning. */
window.AtlasSpace = (() => {
  const scene = document.getElementById('space-scene');
  const lines = document.getElementById('space-lines');
  const points = document.getElementById('space-points');
  const {escape, kinds} = window.AtlasGraph;
  const categories = [
    ['Ciudadanía y participación', -.68, .57, .12, '#236747'],
    ['Representación', -.73, -.37, -.13, '#87651d'],
    ['Gobierno e intermediación', .10, .10, .28, '#924451'],
    ['Instituciones especializadas', .66, -.58, .08, '#66635c'],
    ['Ámbito transnacional', .72, .58, -.24, '#a34f30']
  ];
  const expanded = new Set();
  const placements = new Map();
  let nodes = [], edges = [], selected = null;
  let yaw = 0, pitch = 0, zoom = 1, panX = 0, panY = 0, drag;
  let suppressClick = false;

  function separatePoints(visible, width, height) {
    const occupied = [];
    const ordered = [...visible.entries()].sort(([a,first],[b,second]) =>
      Number(placements.has(b))-Number(placements.has(a)) || Number(Boolean(first.node))-Number(Boolean(second.node)));
    for (const [id,item] of ordered) {
      const manual = placements.get(id);
      const [x,y] = manual || item.position;
      const halfWidth = item.node ? 15 : 18;
      const below = item.node ? 15 : 18;
      const fits = (cx,cy) => occupied.every(([l,t,r,b]) =>
        cx+halfWidth+3 <= l || cx-halfWidth-3 >= r || cy+below+3 <= t || cy-17 >= b);
      let best = manual;
      for (let step = 0; !best && step < 220; step++) {
        const angle = step * 2.399963, radius = Math.sqrt(step)*15;
        const cx = x+Math.cos(angle)*radius, cy = y+Math.sin(angle)*radius;
        if (zoom <= 1 && (cx<halfWidth || cx>width-halfWidth || cy<18 || cy+below>height)) continue;
        if (fits(cx,cy)) { best = [cx,cy]; break; }
      }
      const [cx,cy] = best || [x,y];
      occupied.push([cx-halfWidth,cy-16,cx+halfWidth,cy+below]);
      item.position = [cx+panX,cy+panY];
    }
  }

  function draw() {
    if (!scene.clientWidth) return;
    const width = scene.clientWidth, height = scene.clientHeight;
    const scaleX = width * .39 * zoom, scaleY = height * .43 * zoom;
    const visible = new Map(), endpoints = new Map();
    const project = ([x,y,z]) => {
      const horizontal = x * Math.cos(yaw) + z * Math.sin(yaw);
      const depth = z * Math.cos(yaw) - x * Math.sin(yaw);
      const vertical = y * Math.cos(pitch) - depth * Math.sin(pitch);
      const perspective = 1 / (1 - (depth * Math.cos(pitch) + y * Math.sin(pitch)) * .22);
      return [width/2 + horizontal * scaleX * perspective, height/2 + vertical * scaleY * perspective];
    };
    categories.forEach(([label,x,y,z,tint], level) => {
      const members = nodes.filter(node => node.level === level);
      if (!members.length) return;
      const id = 'group-' + level, open = expanded.has(level);
      const internal = edges.filter(edge => members.some(n => n.id === edge.from) && members.some(n => n.id === edge.to)).length;
      visible.set(id, {label, level, tint, open, total:members.length, internal, position:project([x,y,z])});
      members.forEach((node,index) => {
        endpoints.set(node.id, open ? node.id : id);
        if (!open) return;
        const angle = index * 2.399963;
        const radius = .13 + .055 * Math.sqrt(index + 1);
        const position=project([x+Math.cos(angle)*radius,y+Math.sin(angle)*radius,z+Math.sin(angle*2)*.20]);
        const anchor=visible.get(id).position;
        const moved=placements.get(id);
        if(moved) {
          position[0]+=moved[0]-anchor[0];
          position[1]+=moved[1]-anchor[1];
        }
        visible.set(node.id, {node,tint,position});
      });
    });
    separatePoints(visible,width,height);

    const bundles = new Map();
    const neighbors = new Set([selected]);
    const levels = new Map(nodes.map(node => [node.id,node.level]));
    for (const edge of edges) {
      let from = endpoints.get(edge.from), to = endpoints.get(edge.to);
      const active = edge.from === selected || edge.to === selected;
      if (active) { neighbors.add(from); neighbors.add(to); }
      const aggregate = !expanded.has(levels.get(edge.from)) || !expanded.has(levels.get(edge.to));
      if (aggregate) [from,to] = ['group-'+levels.get(edge.from),'group-'+levels.get(edge.to)].sort();
      if (!from || !to || from === to) continue;
      const key = [from,to,aggregate ? 'group' : edge.type].join('/');
      if (!bundles.has(key)) bundles.set(key,{from,to,type:edge.type,aggregate,active:false});
      const bundle = bundles.get(key);
      bundle.active ||= active;
    }

    const types = window.ATLAS.types;
    const markers = Object.entries(types).map(([key,type]) =>
      `<marker id="space-arrow-${key}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${type.color}"/></marker>`).join('');
    const lanes = new Map();
    const paths = [...bundles.values()].map(bundle => {
      const [ax,ay] = visible.get(bundle.from).position;
      const [bx,by] = visible.get(bundle.to).position;
      const dx = bx-ax, dy = by-ay, length = Math.hypot(dx,dy) || 1;
      const pair = [bundle.from,bundle.to].sort().join('/');
      const lane = lanes.get(pair) || 0;
      lanes.set(pair,lane+1);
      const bend = (lane % 2 ? -1 : 1) * (12 + Math.floor(lane/2)*17) * (bundle.from < bundle.to ? 1 : -1);
      const mx = (ax+bx)/2-dy/length*bend, my = (ay+by)/2+dx/length*bend;
      const start = visible.get(bundle.from).node ? 8 : 18;
      const end = visible.get(bundle.to).node ? 10 : 20;
      const path = `M${ax+dx/length*start} ${ay+dy/length*start} Q${mx} ${my} ${bx-dx/length*end} ${by-dy/length*end}`;
      if (bundle.aggregate) return `<path class="space-aggregate" d="${path}" opacity="${selected && !bundle.active ? .24 : .75}"/>`;
      const type = types[bundle.type];
      return `<path d="${path}" fill="none" stroke="${type.color}" stroke-width="${type.width}" stroke-dasharray="${type.dash}" opacity="${selected ? (bundle.active ? .95 : .10) : .48}" marker-end="url(#space-arrow-${bundle.type})"/>`;
    }).join('');
    const groupBounds = [...visible.values()].filter(item => !item.node).map(group => {
      const [cx,cy] = group.position;
      const stars = [...visible.values()].filter(item => item.node?.level === group.level);
      const rx = Math.max(42, ...stars.map(({position:[x]}) => Math.abs(x-cx)+22));
      const ry = Math.max(34, ...stars.map(({position:[,y]}) => Math.abs(y-cy)+18));
      return {group,cx,cy,rx,ry};
    });
    const galaxies = groupBounds.map(({group,cx,cy,rx,ry}) => {
      return `<g class="space-galaxy" style="color:${group.tint}">
        <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="currentColor" fill-opacity=".055" stroke="currentColor" stroke-opacity=".22"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${rx*.79}" ry="${ry*.69}" fill="none" stroke="currentColor" stroke-opacity=".26" stroke-dasharray="2 5"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${rx*.48}" ry="${ry*.42}" fill="currentColor" fill-opacity=".045"/>
      </g>`;
    }).join('');
    lines.innerHTML = `<defs>${markers}</defs>${galaxies}${paths}`;

    const labelBoxes = [];
    const groupLabels = new Map();
    const overlaps = ([l,t,r,b],[left,top,right,bottom]) => l<right&&r>left&&t<bottom&&b>top;
    for (const {group,cx,cy,rx,ry} of groupBounds) {
      const labelX=Math.max(66,Math.min(width-66,cx));
      const options=[
        [labelX-64,cy+ry+10],
        [labelX-64,cy-ry-70],
        [cx+rx+10,cy-28],
        [cx-rx-138,cy-28]
      ].map(([l,t])=>[l,t,l+128,t+60]);
      const otherGalaxies=groupBounds.filter(g=>g.group!==group).map(g=>[g.cx-g.rx,g.cy-g.ry,g.cx+g.rx,g.cy+g.ry]);
      const score=box=>Number(box[0]<0||box[1]<0||box[2]>width||box[3]>height)*10+
        [...labelBoxes,...otherGalaxies].filter(other=>overlaps(box,other)).length;
      const best=options.reduce((a,b)=>score(b)<score(a)?b:a);
      labelBoxes.push(best);
      groupLabels.set(group.level,[best[0]+64-cx,best[1]-cy]);
    }
    const markersOnScreen = [...visible.values()].map(({position:[x,y]}) => [x-10,y-10,x+10,y+10]);
    const focused = document.activeElement?.dataset?.spaceKey;
    points.innerHTML = [...visible.entries()].map(([id,item]) => {
      const [x,y] = item.position;
      const position = `left:${x}px;top:${y}px;--constellation:${item.tint}`;
      if (item.node) {
        const node = item.node;
        const halfLabel = Math.min(65, node.short.length * 3 + 5);
        const box = [x-halfLabel,y+13,x+halfLabel,y+44];
        const readable = box[0] >= 0 && box[2] <= width && box[3] <= height &&
          ![...labelBoxes,...markersOnScreen].some(([l,t,r,b]) => box[0]<r && box[2]>l && box[1]<b && box[3]>t);
        if (readable) labelBoxes.push(box);
        return `<button type="button" data-space-key="${id}" data-node="${id}" data-focus-detail class="space-point space-actor kind-${node.kind}" style="${position}" aria-label="${escape(node.label)} · ${kinds[node.kind]}" aria-pressed="${id===selected}" ${readable?'data-label':''} ${selected&&!neighbors.has(id)?'data-muted':''}><i aria-hidden="true"></i><span>${escape(node.short)}</span></button>`;
      }
      const count = item.internal ? ` · ${item.internal} vínculos internos` : '';
      const [labelX,labelY]=groupLabels.get(item.level);
      return `<button type="button" data-space-key="${id}" data-space-group="${item.level}" class="space-point space-hub" style="${position};--label-x:${labelX}px;--label-y:${labelY}px" aria-expanded="${item.open}"><i aria-hidden="true">${item.open?'−':'+'}</i><span><b>${escape(item.label)}</b><small>${item.total} actores${count}</small></span></button>`;
    }).join('');
    if (focused) [...points.querySelectorAll('button')].find(button => button.dataset.spaceKey === focused)?.focus({preventScroll:true});
  }

  function setData(nextNodes,nextEdges,actor) {
    nodes = nextNodes; edges = nextEdges; selected = actor;
    const match = nodes.find(node => node.id === actor);
    if (match) expanded.add(match.level);
    draw();
  }
  points.addEventListener('click', event => {
    const button = event.target.closest('[data-space-group]');
    if (!button) return;
    const level = Number(button.dataset.spaceGroup);
    if (expanded.has(level)) {
      expanded.delete(level);
      if (nodes.some(node => node.id === selected && node.level === level)) {
        document.querySelector('#detail [data-clear]')?.click();
      }
    } else expanded.add(level);
    draw();
    points.querySelector(`[data-space-group="${level}"]`)?.focus({preventScroll:true});
  });
  scene.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag) return;
    suppressClick=false;
    const button=event.target.closest('[data-space-key]');
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch,panX,panY,pan:event.shiftKey,key:button?.dataset.spaceKey};
    if(button) {
      drag.start=[parseFloat(button.style.left)-panX,parseFloat(button.style.top)-panY];
      drag.children=button.dataset.spaceGroup===undefined?[]:nodes
        .filter(node=>node.level===Number(button.dataset.spaceGroup)&&placements.has(node.id))
        .map(node=>[node.id,placements.get(node.id)]);
    } else event.preventDefault();
  });
  scene.addEventListener('pointermove', event => {
    if (!drag || drag.id!==event.pointerId) return;
    const dx = event.clientX-drag.x, dy = event.clientY-drag.y;
    if (!drag.moved) {
      if(Math.hypot(dx,dy)<5)return;
      drag.moved=true;
      suppressClick=true;
      scene.setPointerCapture(event.pointerId);
      scene.classList.add('is-dragging');
    }
    if(drag.key) {
      placements.set(drag.key,[drag.start[0]+dx,drag.start[1]+dy]);
      for(const [id,[x,y]] of drag.children)placements.set(id,[x+dx,y+dy]);
    }
    else if (drag.pan) {panX=drag.panX+dx;panY=drag.panY+dy;}
    else {yaw=drag.yaw+dx*.005;pitch=Math.max(-1,Math.min(1,drag.pitch+dy*.005));}
    draw();
  });
  function endDrag(event) {
    if(drag?.id!==event.pointerId)return;
    drag=null;
    scene.classList.remove('is-dragging');
  }
  window.addEventListener('pointerup',endDrag);
  window.addEventListener('pointercancel',endDrag);
  scene.addEventListener('lostpointercapture',endDrag);
  scene.addEventListener('click',event=>{
    if(!suppressClick||event.detail===0)return;
    suppressClick=false;
    event.preventDefault();
    event.stopPropagation();
  },true);
  document.querySelector('.space-controls').addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.camera;
    if (!action) return;
    if (action === 'reset') { yaw=0; pitch=0; zoom=1; panX=0; panY=0; placements.clear(); }
    if (action === 'in') zoom = Math.min(2,zoom*1.2);
    if (action === 'out') zoom = Math.max(.5,zoom/1.2);
    draw();
  });
  new ResizeObserver(draw).observe(scene);
  return {setData};
})();
