'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowUp, Plus, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import artworkData from '../artworks.json';
import FloatingModels from './floating-models';

// 按展示顺序排列：[图片编号, 作品名称, 图片描述]；行末为作品序号。
const selections = [
 ['IMG_7440','Comfy Rosmontis ','阳光、微风与一个悠长的午后'], // 01
 ['bartender-lapuma',"Bartender La'puma",'酒吧中手持调酒壶的黑发少女'], // 02
 ['susie-the-barber','Susie the Barber','理发店里的少女与暖色灯光'], // 03
 ['IMG_6465','Myrtle','红发少女与暖色光影'], // 04
 ['IMG_2548','Rosmontis in Gown','云海中的银发少女'], // 05
 ['IMG_9984','Koishi','街角、黑猫与一束日光'], // 06
 ['IMG_0345','Cecilia','草地上的少女肖像'], // 07
 ['IMG_7079','Tsugu','黑色贝雷帽与柔和目光'], // 08
 ['IMG_8195','Weedy','圆月前的角色插画'], // 09
 ['IMG_7838','The Blue Devil','蓝白色角色习作'], // 10
 ['IMG_7670','Thumpy','抱着披萨的兔耳少女'], // 11
 ['IMG_3631','Miyu','树影中的蓝衣少女'], // 12
 ['IMG_5382','Huizhou Daybreak','暮色海岸与远方的云'], // 13
 ['IMG_2398','Tachibana Sherry','室内场景中的蓝发少女'], // 14
 ['IMG_4827','Hilda','柔光下的角色肖像'], // 15
 ['IMG_4315','La Pluma','清澈水面与夏日少女'], // 16
 ['IMG_5679','Lappland','银发角色服装习作'], // 17
 ['IMG_4153','Rosmontis','蓝色外套与白发少女'], // 18
 ['IMG_3574','Kei','粉色背景中的角色习作'], // 19
 ['IMG_9449','Not a Dog','粉发少女肖像'], // 20
 ['IMG_8209','Ryuuu','黑色尖帽与绿色眼睛'], // 21
 ['IMG_4889','Alice','青色背景中的角色肖像'], // 22
 ['IMG_2744','Cynisca','蓝白服饰角色插画'], // 23
 ['IMG_4210','Reisa','蓝紫色长发、水手服与星形光环的少女'], // 24
 ['IMG_6378','Kisaki','身穿深色旗袍的黑发少女'], // 25
 ['rosmontis-waking-3','Rosmontis Waking','白衬衫、银色猫耳与绿色眼睛的迷迭香'], // 26
 ['ibuki','Ibuki','草地与喷泉前的金发少女'], // 27
 ['maki','Maki','红发少女穿着休闲外套比出胜利手势'], // 28
 ['rosmontis-dreaming','Rosmontis Dreaming','趴在桌上睡着的银发猫耳少女'], // 29
];
const works=selections.map(([id,title,alt])=>({...artworkData.find(a=>a.id===id)!,title,alt}));
const isWide=(index:number)=>index===0 || index===2 || index===12;
function sources(work:typeof works[number]) {return [480,960,1600].map(size=>`/images/${work.id}-${size}.webp ${Math.round(work.width*Math.min(1,size/Math.max(work.width,work.height)))}w`).join(', ')}

export default function Home(){
 const [active,setActive]=useState(0);
 const selected=works[active];
 return <>
  <a className="skip" href="#works">跳到作品</a>
  <header className="header" id="top"><a className="brand" href="#top" aria-label="LITHOS 首页"><img className="brand-mark" src="/images/favicon-256.webp" width="36" height="36" alt=""/>LITHOS<span className="brand-note">ILLUSTRATION</span></a><nav aria-label="主导航"><a className="nav-active" href="#works">作品 <span>{works.length}</span></a><a href="#about">关于</a><a className="nav-arrow" href="#works" aria-label="浏览作品"><ArrowUpRight size={20}/></a></nav></header>
  <main>
   <section className="intro" aria-labelledby="heading"><div className="intro-kicker"><span className="dot"/> PERSONAL ART ARCHIVE <span className="edition">VOL. 01 — {works.length} WORKS</span></div><div className="intro-main"><h1 id="heading">孩子不懂，<br/><span className="second-line">画着<span className="outlined">玩的</span><span className="cyan-period">。</span></span></h1><FloatingModels/><div className="intro-side"><div className="artist"><img src="/images/avatar-256.webp" width="48" height="48" alt="LITHOS 的插画头像"/><div><strong>Lithos</strong><span>插画 / 二创 / 日常灵感</span></div></div><p>就不告诉你我的 P 站号。</p><a href="#works" className="text-link">走进我的画集 <ArrowUpRight size={18}/></a></div></div><div className="intro-bottom"><span>SELECTED ILLUSTRATIONS</span><span>慢慢看，随意逛。 <span aria-hidden="true">↓</span></span></div></section>
   <section id="works" className="works" aria-label="插画作品"><div className="section-bar"><h2>作品集 <span> / SELECTED WORKS</span></h2><span className="count">001 — {String(works.length).padStart(3,'0')}</span></div>
   <Dialog><div className="gallery">{works.map((work,index)=><article key={work.id} className={`artwork ${isWide(index)?'wide':''}`}><DialogTrigger className="art-trigger" onClick={()=>setActive(index)} aria-label={`查看插画：${work.title}`}><div className="image-frame"><img src={`/images/${work.id}-960.webp`} srcSet={sources(work)} sizes={isWide(index)?'(max-width: 600px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 64px), (max-width: 1500px) 62vw, 880px':'(max-width: 600px) calc(100vw - 40px), (max-width: 900px) 44vw, (max-width: 1500px) 30vw, 430px'} width={work.width} height={work.height} alt={work.alt} loading={index<3?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} decoding="async"/><span className="expand"><Plus size={20}/></span>{index===0&&<span className="featured">FEATURED / 01</span>}</div><div className="caption"><span className="art-number">{String(index+1).padStart(2,'0')}</span><h3>{work.title}</h3><ArrowUpRight size={17}/></div></DialogTrigger></article>)}</div>
   <DialogContent className="viewer" showCloseButton={false} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();setActive((active+1)%works.length)}if(event.key==='ArrowLeft'){event.preventDefault();setActive((active-1+works.length)%works.length)}}}><div className="viewer-head"><div><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{String(active+1).padStart(2,'0')} / {works.length} · 插画作品</DialogDescription></div><DialogClose className="viewer-button" aria-label="关闭大图"><X/></DialogClose></div><img className="full-art" src={`/images/${selected.id}-1600.webp`} width={selected.width} height={selected.height} alt={selected.alt}/><div className="viewer-footer"><button className="viewer-button" onClick={()=>setActive((active-1+works.length)%works.length)} aria-label="上一幅"><ArrowLeft/></button><span>← → 切换作品 · Esc 关闭</span><button className="viewer-button" onClick={()=>setActive((active+1)%works.length)} aria-label="下一幅"><ArrowRight/></button></div></DialogContent></Dialog>
   </section>
   <section className="about" id="about"><span className="about-label">BEHIND THE CANVAS / 关于</span><div className="about-body"><img src="/images/avatar-256.webp" alt="画师头像" width="100" height="116" loading="lazy"/><div><h2>你好 Bro，我是 Lithos<span>。</span></h2><p>我是迷迭香领域画师，<br/>快来 Pixiv 给我点灵感吧求求了</p></div><span className="about-signature" aria-hidden="true">Created with<br/>Procreate</span></div></section>
  </main><footer><a className="footer-logo" href="#top">LITHOS<span>© {new Date().getFullYear()}</span></a><span>THANK YOU FOR STOPPING BY.</span><a href="#top" className="back-top">回到顶部 <ArrowUp size={16}/></a></footer>
 </>
}
