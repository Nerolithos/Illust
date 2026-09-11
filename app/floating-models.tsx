'use client';

import { useEffect, useRef, useState } from 'react';

export default function FloatingModels() {
 const host = useRef<HTMLDivElement>(null);
 const rotate = useRef<(delta:number)=>void>(()=>{});
 const [status,setStatus]=useState('正在加载小物件…');
 useEffect(()=>{
  const element=host.current!;
  let disposed=false, cleanup=()=>{};
  async function init(){
   const [T,{GLTFLoader},{MeshoptDecoder},{RoomEnvironment}]=await Promise.all([
    import('three'),import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/libs/meshopt_decoder.module.js'),import('three/examples/jsm/environments/RoomEnvironment.js')
   ]);
   if(disposed)return;
   const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
   renderer.setClearColor(0x000000,0);
   renderer.outputColorSpace=T.SRGBColorSpace;
   renderer.toneMapping=T.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.05;
   element.appendChild(renderer.domElement);
   const scene=new T.Scene();
   const camera=new T.PerspectiveCamera(34,1,0.1,30);
   camera.position.set(0,0.08,5.2);camera.lookAt(0,0,0);
   const pmrem=new T.PMREMGenerator(renderer), room=new RoomEnvironment();
   const environment=pmrem.fromScene(room,0.04);
   scene.environment=environment.texture;scene.environmentIntensity=0.65;
   room.dispose();pmrem.dispose();
   scene.add(new T.HemisphereLight(0xe6faff,0x787269,2));
   const key=new T.DirectionalLight(0xfff2df,3.2);key.position.set(-3,4,5);scene.add(key);
   const rim=new T.DirectionalLight(0xafefff,2);rim.position.set(3,2,-2);scene.add(rim);
   const figureGroup=new T.Group(),toolsGroup=new T.Group();scene.add(figureGroup,toolsGroup);
   figureGroup.position.set(-0.67,0.05,0);toolsGroup.position.set(0.64,-0.08,0.15);
   const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
   const release=(object:import('three').Object3D)=>object.traverse(node=>{
    if(node instanceof T.Mesh){node.geometry.dispose();for(const m of Array.isArray(node.material)?node.material:[node.material]){
     for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();
    }}
   });
   async function model(name:string,height:number){
    const gltf=await loader.loadAsync(`/models/${name}.glb`);
    if(disposed){release(gltf.scene);return null;}
    const object=gltf.scene;const bounds=new T.Box3().setFromObject(object);
    const size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
    const scale=height/size.y;object.scale.multiplyScalar(scale);object.position.copy(center.multiplyScalar(-scale));
    object.traverse(node=>{if(node instanceof T.Mesh){for(const m of Array.isArray(node.material)?node.material:[node.material]){
     if(m instanceof T.MeshStandardMaterial){m.envMapIntensity=0.6;m.roughness=Math.max(m.roughness,0.45);}
     if(m instanceof T.MeshPhysicalMaterial)m.specularIntensity=0.7;
    }}});
    const pivot=new T.Group();pivot.add(object);return pivot;
   }
   let running=false,frame=0,visible=true,last=0,phase=0;
   let pointer:number|null=null,previousX=0;
   // 弧度/秒：画笔与调色盘约 52 秒一圈，人物约 33 秒一圈。
   const toolsSpinSpeed=0.12,figureSpinSpeed=0.19;
   const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
   const render=()=>renderer.render(scene,camera);
   function tick(now:number){
    if(!running)return;
    frame=requestAnimationFrame(tick);
    if(now-last<1000/30)return;
    const delta=Math.min((now-last)/1000,0.05);phase+=delta;last=now;
    figureGroup.position.y=0.05+(reduce.matches?0:Math.sin(phase*1.2)*0.075);
    toolsGroup.position.y=-0.08+(reduce.matches?0:Math.sin(phase*1.2+1.8)*0.07);
    if(pointer===null&&!reduce.matches){
     figureGroup.rotation.y+=figureSpinSpeed*delta;
     toolsGroup.rotation.y+=toolsSpinSpeed*delta;
    }
    render();
   }
   function update(){const next=visible&&!document.hidden&&!reduce.matches;if(next&&!running){running=true;last=performance.now();frame=requestAnimationFrame(tick)}else if(!next){running=false;cancelAnimationFrame(frame);render()}}
   rotate.current=(delta)=>{figureGroup.rotation.y+=delta;toolsGroup.rotation.y+=delta;render()};
   const down=(e:PointerEvent)=>{if(pointer!==null||!e.isPrimary||e.button!==0)return;pointer=e.pointerId;previousX=e.clientX;element.setPointerCapture(pointer);element.classList.add('dragging')};
   const move=(e:PointerEvent)=>{if(e.pointerId===pointer){rotate.current((e.clientX-previousX)*0.012);previousX=e.clientX}};
   const up=()=>{pointer=null;element.classList.remove('dragging')};
   element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('lostpointercapture',up);
   const resize=new ResizeObserver(()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();render()});resize.observe(element);
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()});observer.observe(element);
   document.addEventListener('visibilitychange',update);reduce.addEventListener('change',update);
   cleanup=()=>{running=false;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',update);reduce.removeEventListener('change',update);element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('lostpointercapture',up);release(scene);environment.dispose();renderer.dispose();renderer.domElement.remove();rotate.current=()=>{}};
   const results=await Promise.allSettled([model('figure',1.85),model('palette',0.95),model('brush',1.25)]);
   if(disposed)return;
   const [figure,palette,brush]=results.map(r=>r.status==='fulfilled'?r.value:null);
   if(figure){figure.rotation.y=-0.2;figureGroup.add(figure)}
   if(palette){palette.position.set(-0.06,-0.26,0);palette.rotation.set(0.15,-0.15,-0.3);toolsGroup.add(palette)}
   if(brush){brush.position.set(0.29,0.28,0.16);brush.rotation.z=-0.4;toolsGroup.add(brush)}
   setStatus(results.every(r=>r.status==='fulfilled')?'':'部分模型暂时无法加载');render();update();
  }
  init().catch(()=>{if(!disposed){cleanup();setStatus('3D 预览暂不可用')}});
  return()=>{disposed=true;cleanup()};
 },[]);
 return <div className="model-stage"><div ref={host} className="model-canvas" tabIndex={0} role="group" aria-label="浮动的角色、调色盘与画笔。水平拖动或按左右方向键旋转。" onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotate.current(e.key==='ArrowLeft'?-0.15:0.15)}}}/>{status&&<span className="model-status" role="status">{status}</span>}<span className="model-hint">↔ 拖动转一转</span></div>
}
