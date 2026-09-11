'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowUp, Plus, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import artworkData from '../artworks.json';

const selections = [
 ['IMG_7440','窗边的午后','阳光、微风与一个悠长的午后'],
 ['IMG_6465','烟火与祈愿','红发少女与暖色光影'],
 ['IMG_2548','云端来信','云海中的银发少女'],
 ['IMG_9984','光落下的地方','街角、黑猫与一束日光'],
 ['IMG_0345','风经过原野','草地上的少女肖像'],
 ['IMG_7079','温柔的侧写','黑色贝雷帽与柔和目光'],
 ['IMG_8195','月下','圆月前的角色插画'],
 ['IMG_7838','蓝色频率','蓝白色角色习作'],
 ['IMG_7670','小小心事','抱着披萨的兔耳少女'],
 ['IMG_3631','林间漫步','树影中的蓝衣少女'],
 ['IMG_5382','海的另一边','暮色海岸与远方的云'],
 ['IMG_2398','放学之后','室内场景中的蓝发少女'],
 ['IMG_4827','微光','柔光下的角色肖像'],
 ['IMG_4315','水色夏日','清澈水面与夏日少女'],
 ['IMG_5679','银色序曲','银发角色服装习作'],
 ['IMG_4153','青空','蓝色外套与白发少女'],
 ['IMG_3574','粉色信号','粉色背景中的角色习作'],
 ['IMG_9449','草莓日记','粉发少女肖像'],
 ['IMG_8209','黑猫来访','黑色尖帽与绿色眼睛'],
 ['IMG_4889','晴日','青色背景中的角色肖像'],
 ['IMG_2744','远行者','蓝白服饰角色插画'],
];
const works=selections.map(([id,title,alt])=>({...artworkData.find(a=>a.id===id)!,title,alt}));
function sources(work:typeof works[number]) {return [480,960,1600].map(size=>`/images/${work.id}-${size}.webp ${Math.round(work.width*Math.min(1,size/Math.max(work.width,work.height)))}w`).join(', ')}

export default function Home(){
 const [active,setActive]=useState(0);
 const selected=works[active];
 return <>
  <a className="skip" href="#works">跳到作品</a>
  <header className="header" id="top"><a className="brand" href="#top" aria-label="LITHOS 首页"><span className="brand-mark">L.</span>LITHOS<span className="brand-note">ILLUSTRATION</span></a><nav aria-label="主导航"><a className="nav-active" href="#works">作品 <span>21</span></a><a href="#about">关于</a><a className="nav-arrow" href="#works" aria-label="浏览作品"><ArrowUpRight size={20}/></a></nav></header>
  <main>
   <section className="intro" aria-labelledby="heading"><div className="intro-kicker"><span className="dot"/> PERSONAL ART ARCHIVE <span className="edition">VOL. 01 — 21 WORKS</span></div><div className="intro-main"><h1 id="heading">把想象，<br/><span className="second-line">留在<span className="outlined">画里</span><span className="cyan-period">。</span></span></h1><div className="intro-side"><div className="artist"><img src="/images/avatar-256.webp" width="48" height="48" alt="LITHOS 的插画头像"/><div><strong>Lithos</strong><span>插画 / 角色 / 日常灵感</span></div></div><p>关于喜欢的角色，<br/>也关于那些不想忘记的瞬间。</p><a href="#works" className="text-link">走进我的画集 <ArrowUpRight size={18}/></a></div></div><div className="intro-bottom"><span>SELECTED ILLUSTRATIONS</span><span>慢慢看，随意逛。 <span aria-hidden="true">↓</span></span></div></section>
   <section id="works" className="works" aria-label="插画作品"><div className="section-bar"><h2>作品集 <span> / SELECTED WORKS</span></h2><span className="count">001 — 021</span></div>
   <Dialog><div className="gallery">{works.map((work,index)=><article key={work.id} className={`artwork ${index===0 || index===10 ? 'wide':''}`}><DialogTrigger className="art-trigger" onClick={()=>setActive(index)} aria-label={`查看插画：${work.title}`}><div className="image-frame"><img src={`/images/${work.id}-960.webp`} srcSet={sources(work)} sizes={index===0||index===10?'(max-width: 600px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 64px), (max-width: 1500px) 62vw, 880px':'(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 44vw, (max-width: 1500px) 30vw, 430px'} width={work.width} height={work.height} alt={work.alt} loading={index<2?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} decoding="async"/><span className="expand"><Plus size={20}/></span>{index===0&&<span className="featured">FEATURED / 01</span>}</div><div className="caption"><span className="art-number">{String(index+1).padStart(2,'0')}</span><h3>{work.title}</h3><ArrowUpRight size={17}/></div></DialogTrigger></article>)}</div>
   <DialogContent className="viewer" showCloseButton={false} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();setActive((active+1)%works.length)}if(event.key==='ArrowLeft'){event.preventDefault();setActive((active-1+works.length)%works.length)}}}><div className="viewer-head"><div><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{String(active+1).padStart(2,'0')} / 21 · 插画作品</DialogDescription></div><DialogClose className="viewer-button" aria-label="关闭大图"><X/></DialogClose></div><img className="full-art" src={`/images/${selected.id}-1600.webp`} width={selected.width} height={selected.height} alt={selected.alt}/><div className="viewer-footer"><button className="viewer-button" onClick={()=>setActive((active-1+works.length)%works.length)} aria-label="上一幅"><ArrowLeft/></button><span>← → 切换作品 · Esc 关闭</span><button className="viewer-button" onClick={()=>setActive((active+1)%works.length)} aria-label="下一幅"><ArrowRight/></button></div></DialogContent></Dialog>
   </section>
   <section className="about" id="about"><span className="about-label">BEHIND THE CANVAS / 关于</span><div className="about-body"><img src="/images/avatar-256.webp" alt="画师头像" width="100" height="116" loading="lazy"/><div><h2>你好，我是 Lithos<span>。</span></h2><p>用画笔记录热爱，在颜色与线条之间，<br/>收藏一个个想象中的世界。</p></div><span className="about-signature" aria-hidden="true">Keep<br/>drawing ↗</span></div></section>
  </main><footer><a className="footer-logo" href="#top">LITHOS<span>© {new Date().getFullYear()}</span></a><span>THANK YOU FOR STOPPING BY.</span><a href="#top" className="back-top">回到顶部 <ArrowUp size={16}/></a></footer>
 </>
}
