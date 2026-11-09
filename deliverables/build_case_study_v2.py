"""Decision-led 10-slide Groww SIP case study. All examples remain source-bounded."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
R=Path(__file__).resolve().parents[1]; OUT=R/'output/pdf/Groww_SIP_Graduation_Case_Study.pdf'; OUT.parent.mkdir(parents=True,exist_ok=True)
W,H=960,540
C={k:HexColor(v) for k,v in dict(ink='#16383A',dark='#0D655D',green='#11887B',mint='#EAF6F2',paper='#F7FAF8',line='#CADFD8',gray='#526A6B',orange='#B36431',warm='#FFF1E8',white='#FFFFFF').items()}
pdfmetrics.registerFont(TTFont('A',str(Path('C:/Windows/Fonts/arial.ttf'))));pdfmetrics.registerFont(TTFont('AB',str(Path('C:/Windows/Fonts/arialbd.ttf'))))
c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1);c.setTitle('Groww SIP | evidence-led product case study')
def p(t,x,top,w,size=13,color='ink',bold=False,leading=None):
 st=ParagraphStyle('x',fontName='AB' if bold else 'A',fontSize=size,leading=leading or size*1.33,textColor=C[color]);a=Paragraph(t,st);_,h=a.wrap(w,500);a.drawOn(c,x,top-h);return top-h
def box(x,y,w,h,fill='paper',stroke='line',radius=9):
 c.setFillColor(C[fill]);c.setStrokeColor(C[stroke]);c.roundRect(x,y,w,h,radius,fill=1,stroke=1)
def rule(x,y,w,color='line'):
 c.setStrokeColor(C[color]);c.setLineWidth(1);c.line(x,y,x+w,y)
def header(n,kicker,title,source):
 c.setFillColor(C['white']);c.rect(0,0,W,H,fill=1,stroke=0);c.setFillColor(C['green']);c.rect(0,H-8,W,8,fill=1,stroke=0)
 p(kicker.upper(),42,506,780,10,'green',True);p(title,42,481,870,25,'ink',True,29);rule(42,416,876)
 p(source,42,34,820,9,'gray');p(f'{n:02d} / 10',870,34,58,9,'green',True)
def label(t,x,y,w,body,fill='mint',h=95):
 box(x,y,w,h,fill);p(t,x+13,y+h-13,w-26,13,'dark',True);p(body,x+13,y+h-39,w-26,11.5,'ink')
def pill(t,x,y,w,fill='mint'):
 box(x,y,w,31,fill,fill,16);p(t,x+10,y+23,w-20,10.5,'dark',True)
def link(t,url,x,y,w=500):
 p(t,x,y,w,11,'green',True);c.linkURL(url,(x,y-22,x+w,y+2),relative=0)
# 1 - one-sentence decision and brief boundary
header(1,'Decision in one view','Protect wanted SIP continuity without pushing an unwanted payment','Brief; public account and capability sources in AI Evidence Log, 9 Nov 2026.')
box(42,286,876,116,'mint');p('Increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.',58,380,839,21,'ink',True,27)
p('The investor-good outcome is an informed, affordable choice. A deliberate pause may be right even when the metric falls.',58,320,830,13,'gray')
label('Research bet',42,105,274,'A previously working AutoPay can become repeated manual repair for someone who still wants to contribute. The writer may consider moving platforms.','paper',157)
label('Product bet',343,105,274,'Help the person distinguish a bank debit, the Groww order, a manual workaround, and the following scheduled SIP.','paper',157)
label('Evidence boundary',644,105,274,'The next-cycle outcome and month-12 effect are not established. This is a testable hypothesis.','warm',157)
c.showPage()
# 2 - full metric tree
header(2,'Part 2 · metric system','One investor, many SIPs: the metric is an OR across plans','Brief NSM definition; PART2_4_CURRENT_DECISION_2026-11-09.md. All Groww cohort values unknown.')
box(42,307,876,96,'mint');p('N = A + I + U',59,386,280,24,'green',True);p('Eligible first-SIP starters at their month-12 checkpoint',360,380,530,13,'ink',True)
p('A: ≥1 successful SIP in prior 30 days  |  I: none confirmed  |  U: unresolved',360,351,530,11,'gray')
for x,head,body in [(42,'1 · Chosen plan','Amount/date and mandate fit the person’s intent.'),(265,'2 · Due and attempt','A wanted instalment reaches a valid payment attempt.'),(488,'3 · Final order','SIP-linked success is confirmed; debit alone is insufficient.'),(711,'4 · Continuity','Recovery or informed change; any plan can qualify at month 12.')]:label(head,x,170,207,body,'paper',115)
p('Possible lift = 100 × (net eligible people whose month-12 status changes) / N percentage points. Both the numerator and N need Groww data.',45,143,865,12,'ink',True)
p('Guardrail: an informed pause is not a failure to “fix”; another successful SIP can make a single-plan repair valuable to the user but neutral to the NSM.',45,95,865,11.5,'gray')
c.showPage()
# 3 - current alternatives/competitor
header(3,'Current product and competitor check','A new pause button is not the uncovered need','Groww skip, AutoPay and order help; Zerodha Coin modify/pause/delete help (official pages, checked 9 Nov).')
label('Groww already offers controls',42,246,274,'Skip an upcoming instalment, edit a SIP, and check order and AutoPay help. The skip rule depends on timing.','mint',148)
c.linkURL('https://groww.in/help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79',(42,246,316,394),relative=0)
label('Coin also offers controls',343,246,274,'Official Coin help documents modify, pause and delete. Feature parity alone is not a reason to build.','paper',148)
c.linkURL('https://support.zerodha.com/category/mutual-funds/features-on-coin/systematic-investment-plan/articles/modify-cancel-sip-coin-app',(343,246,617,394),relative=0)
label('Observed user work',644,246,274,'A Groww writer reports manual investing, contacting both bank and Groww, and trying a new mandate after repeat failures.','warm',148)
box(42,120,876,105,'paper');p('PM inference',58,205,150,12,'green',True);p('The gap worth testing is not “can I pause?” It is whether a person can tell what happened this cycle, what remains unresolved, and what to expect at the next due date.',58,180,830,13,'ink')
p('Rivals: bank/rail execution may be the only problem; existing Groww help may already answer the question. We have not observed the live in-app flow for this cohort.',58,143,830,11,'gray')
c.showPage()
# 4 - engine and findings
header(4,'Part 1 · discovery engine','The engine turns public accounts into questions, not population rates','SIP Lens snapshot and AI Evidence Log, 9 Nov 2026. Different counts have different units.')
for x,num,txt in [(42,'932','app review IDs retrieved'),(265,'100','public voice rows saved'),(488,'9/9','source-linked readings'),(711,'4','unscored problem leads')]:
 box(x,313,207,82,'mint');p(num,x+14,381,175,24,'green',True);p(txt,x+14,345,180,11,'gray')
p('Collection → SIP relevance and duplicate screen → event/action/outcome proposal → source check → answer with rival + unknown.',45,290,870,14,'ink',True)
for x,head,body in [(42,'Starts and expectations','People describe different goals; a later reassessment does not prove a bad start.'),(343,'Changes and interruptions','Skip, reduction, manual catch-up and continued payment are different outcomes.'),(644,'What remains weak','Checking frequency, quiet drop-offs, segment rates and month-12 success are not visible publicly.')]:label(head,x,139,274,body,'paper',113)
p('No denominator connects retrieved reviews to first-time Groww investors. The answers guide research; they do not measure churn or choose a solution.',45,108,860,11.5,'gray')
link('Open the nine-question engine','https://sip-research-viewer.soumyasantra431.workers.dev/',45,79)
c.showPage()
# 5 - episode contrasts
header(5,'Behavioral evidence','The same “missed SIP” signal can mean three different things','Public account links and paraphrases in the AI Evidence Log; first-ever-MF and month-12 outcomes unverified.')
for x,head,body,tail in [(42,'Unwanted repair','AutoPay worked for months, then repeatedly failed. The writer invested manually, contacted the bank and Groww, and tried another mandate.','Next scheduled success unknown.'),(343,'Same-cycle recovery','One of several SIPs debited. The writer manually paid the others, so a single failed plan cannot be equated with a stopped investor.','Manual catch-up ≠ future AutoPay.'),(644,'Informed adjustment','A writer skipped a month, paid the next and considered reducing the amount. The desired plan changed without all investing ending.','A skip ≠ lost intent.')]:
 box(x,179,274,218,'paper');p(head,x+16,374,240,15,'dark',True);p(body,x+16,341,240,12,'ink');rule(x+16,230,242);p(tail,x+16,217,242,11,'orange',True)
p('Contrast rule: capture intent → triggering event → action → this-cycle order → following scheduled order → other SIPs. Keep reported reason separate from our driver hypothesis.',45,151,865,12.5,'ink',True)
p('These selected posts show possible mechanisms and counterexamples. They are not representative, verified transaction records or a count of first-year drop-offs.',45,105,865,11,'gray')
c.showPage()
# 6 - segment matrix
header(6,'Parts 3–4 · opportunity choice','Five behavioral situations; choose a testable burden, not the loudest complaint','PARTS2_TO5_RESEARCH_CONCLUSION_2026-11-09.md; source-linked cases in Evidence Log.')
heads=[('Situation',42,250),('Observed signal',300,240),('What could change',556,220),('Strong rival',782,136)]
for t,x,w in heads:p(t,x,395,w,10,'green',True)
rows=[('Automation-reliant restorer','Repeats manual repair','Clarify next payment','Bank/rail fault'),('Budget recalibrator','Skip → pay → reduce','Fit new amount','Correct pause'),('Schedule interpreter','Asks effect of edit','Understand next due','Help suffices'),('Early-return reassessor','Concern; continues','Interpret horizon','No payment gap'),('Externally guided starter','Friend shaped start','Own decision logic','Circumstance changed')]
for i,row in enumerate(rows):
 y=342-i*42;box(42,y,876,36,'mint' if i==0 else 'paper');
 for txt,(_,x,w) in zip(row,heads):p(txt,x+8,y+27,w-13,11.2,'ink',i==0)
box(42,95,876,66,'warm');p('Decision: test the repeated-repair task. The reported burden is concrete and Groww can influence the information hand-off. Reach, severity across the cohort and month-12 lift are unknown; the choice reverses if current help already resolves it.',57,145,845,12.5,'ink',True)
c.showPage()
# 7 - research methodology and honest result
header(7,'Part 3 · primary research','Written survey narrowed the claim; it did not validate the chosen mechanism','PART3_PRIMARY_USER_RESEARCH_AND_PROBLEM_GATE_2026-11-08.md; private answers excluded from public engine.')
for x,num,cap in [(42,'9','submitted'),(265,'5/8','of 8 participation-eligible tried SIP'),(488,'1','broad cohort screen fit'),(711,'0/5–6','incident interviews')]:
 box(x,314,207,80,'mint');p(num,x+14,381,178,23,'green',True);p(cap,x+14,344,180,10.5,'gray')
label('Why this method?',42,142,274,'A past, specific due-date incident can separate intention, action and result. A general opinion about SIPs cannot.','paper',150)
label('Same neutral prompts',343,142,274,'Ask what they expected, what changed, what Groww and bank showed, what they did outside the app, and what happened next.','paper',150)
label('What we learned',644,142,274,'One broad-fit answer mixed a long-term goal and early-profit expectation. It challenges a payment-only story, but gives no next-payment episode.','warm',150)
p('Eight survey-eligible = 4 completed SIP + 1 setup-only attempt + 3 never attempted. Among five attempters: 1 no prior MF, 3 prior MF, 1 unsure.',45,305,860,10.7,'gray')
p('Required contrast still absent: a strict-cohort unwanted interruption beside a comparable continuer or informed pause. Mock interviews would not close that gap.',45,115,860,11,'gray')
c.showPage()
# 8 - problem/causal map
header(8,'Part 4 · problem definition','The burden is observed; the cause and retention impact remain hypotheses','Groww/Reddit sources in Evidence Log; FINAL_PROBLEM_BOUNDARY_2026-11-09.md.')
box(42,307,876,89,'mint');p('When a previously working SIP fails, a person who still wants to contribute may repair this month manually yet remain unsure whether the next scheduled debit will work.',58,378,842,17,'ink',True)
label('User job',42,166,274,'Know which payment fact is confirmed, avoid a duplicate action, and carry a precise question to official support.','paper',119)
label('Product outcome',343,166,274,'Correctly distinguish bank debit, completed SIP order, this-cycle workaround and following due status.','paper',119)
label('Business path',644,166,274,'If a wanted next SIP succeeds for a person otherwise inactive at month 12, the NSM may move. Net reach and lift are unknown.','paper',119)
p('Causal fork to test: unclear cross-actor status adds repair work  |  bank/rail still fails despite perfect explanation  |  current help already suffices  |  another SIP keeps the person active.',45,133,865,12,'ink',True)
p('The product cannot create money, repair a bank, certify a payment or turn an informed pause into a failure.',45,89,865,11.5,'orange')
c.showPage()
# 9 - solution comparison and MVP
header(9,'Part 5 · solution choice and prototype','A two-cycle check earns AI only if it beats a fixed guide','MVP contract and live prototype. Concept comparison is designed, not user-tested.')
for x,name,body in [(42,'A · Existing help','Accurate official rules; investor must find the relevant page amid mixed bank and order states.'),(343,'B · Fixed SIP Check','Six simple choices; code separates this payment, next due and another SIP without AI.'),(644,'C · AI-assisted Check','Model proposes six facts from the person’s wording; code rejects conflicts and the person can correct it.')]:label(name,x,225,274,body,'paper' if x!=343 else 'mint',155)
box(42,113,876,91,'warm');p('What the customer sees',57,186,203,12,'orange',True);p('“Bank debited; Groww processing” becomes: this order is not yet confirmed; check its expected completion date. The following scheduled SIP stays unknown. No duplicate payment is suggested.',260,187,630,12,'ink')
p('B is live. C is coded but held after failed extraction diagnostics. Same-task test: correct facts and official check, unsafe directions, effort and corrections. If B works as well, prefer B.',45,101,860,11,'gray')
link('Try the customer-facing SIP Check','https://sip-research-viewer.soumyasantra431.workers.dev/sip-map',45,68)
c.showPage()
# 10 - experiment, metrics, risks
header(10,'Parts 6–8 · learning and success','Do not call a prototype task a 12-month retention result','Brief; CONTINUITY_MAP_EVAL.md; AI Evidence Log. User task tests and human golden-set scoring outstanding.')
label('Task comparison',42,273,274,'Give the same real payment-understanding task to current help, fixed check and gated AI. Record unassisted result and corrections.','paper',122)
label('Leading indicators',343,273,274,'Correct status understanding / completed tasks; correct official route / tasks; wanted next-SIP success / intended dues.','paper',122)
label('Guardrails',644,273,274,'Unexpected debit, false completion, duplicate-pay direction, advice, affordability strain and wrongly discouraged pauses.','warm',122)
box(42,115,876,136,'mint');p('Future investor-level experiment',57,231,830,14,'dark',True);p('Randomize eligible investors, not SIPs. Compare next scheduled success and intent match before the mature cohort reaches month 12. Report A/N and unresolved U/N; preserve one-versus-many SIP status.',57,201,838,12.5,'ink')
p('RICE = reach × impact × confidence / effort. It is not numerically rankable: reach, incremental impact and confidence are unmeasured. The decisive next work is 5–6 target interviews, ~20 independent AI labels and 3 real user tasks; current counts are zero.',57,155,838,11.5,'ink')
link('Read sources, arithmetic and AI corrections in the Evidence Log','https://github.com/soumyasantra431-dot/Groww_MF_SIP-Project/blob/main/deliverables/AI_EVIDENCE_LOG_SUBMISSION.md',45,83,800)
c.showPage();c.save();print(OUT)
