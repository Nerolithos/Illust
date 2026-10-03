import json,re,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Preformatted,PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
pdfmetrics.registerFont(TTFont('Arial','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Mono','/System/Library/Fonts/Supplemental/Courier New.ttf'))
base=ParagraphStyle('body',fontName='Arial',fontSize=10,leading=14,spaceAfter=7)
label=ParagraphStyle('label',parent=base,fontSize=11,textColor=colors.HexColor('#235777'),spaceBefore=12,spaceAfter=5,keepWithNext=True)
mono=ParagraphStyle('mono',fontName='Mono',fontSize=9,leading=11,spaceAfter=9)
title=ParagraphStyle('title',parent=base,fontSize=20,leading=25,spaceAfter=15)
rows=[]
p='/Users/Lithos/.codex/sessions/2026/09/27/rollout-2026-09-27T14-30-14-01a0e18e-9b78-7e32-a6e7-11ce08aeb778.jsonl'
for line in open(p):
 d=json.loads(line)
 if d['type']!='response_item':continue
 q=d['payload']
 if q.get('type')!='message' or q.get('role') not in ('user','assistant'):continue
 t='\n'.join(c.get('text','') for c in q.get('content',[]) if c.get('type') in ('input_text','output_text')).strip()
 if t.startswith('Please output all the chatlog above'):break
 if t.startswith('<recommended_plugins>'):continue
 if t.startswith('# Files pasted by the user:'):
  t='[Initial pasted instructions]\n\n'+open('/Users/Lithos/.codex/attachments/b88911b3-ec4b-4372-8b38-91785a239bc1/pasted-text.txt').read().strip()
 if t:rows.append(('Student' if q['role']=='user' else 'AI',t))
story=[Paragraph('CSC4120 Learning Session',title),Paragraph('Complete dialogue transcript • AVL trees and interval trees',base)]
def addtext(t):
 for i,part in enumerate(re.split(r'```[^\n]*\n(.*?)```',t,flags=re.S)):
  if i%2:
   story.append(Preformatted(part.rstrip('\n'),mono));continue
  for para in re.split(r'\n\s*\n',part.strip()):
   if not para:continue
   para=html.escape(para)
   para=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',para)
   para=re.sub(r'`([^`]+)`',r'\1',para)
   para=para.replace('\n','<br/>') if all(x.startswith('- ') for x in para.splitlines()) else para.replace('\n',' ')
   story.append(Paragraph(para,base))
for idx,(role,t) in enumerate(rows):
 if idx==1:story.append(PageBreak())
 story.append(Paragraph(role+':',label));addtext(t)
def footer(c,d):
 c.setFont('Arial',8);c.setFillColor(colors.HexColor('#667788'));c.drawString(45,28,'CSC4120 | Dialogue transcript');c.drawRightString(550,28,str(d.page))
out='output/pdf/csc4120-dialogue-transcript.pdf'
SimpleDocTemplate(out,pagesize=(595.28,841.89),rightMargin=45,leftMargin=45,topMargin=40,bottomMargin=45,title='CSC4120 Complete Dialogue Transcript',author='Student and AI').build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(out)
print('Turns:',len(rows),'Pages:',len(r.pages))
print('Final text:',r.pages[-1].extract_text()[-500:])
