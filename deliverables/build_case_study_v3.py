"""Ten-slide research case study; source-bounded and readable at presentation size."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/Groww_SIP_Graduation_Case_Study.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
W,H=960,540
COL={k:HexColor(v) for k,v in dict(ink='#153638',teal='#08796D',dark='#075C55',pale='#E9F5F1',paper='#F6FAF8',line='#BED9D1',muted='#496366',orange='#A8582D',warm='#FFF0E7',white='#FFFFFF').items()}
pdfmetrics.registerFont(TTFont('A','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('B','C:/Windows/Fonts/arialbd.ttf'))
c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
c.setTitle('Groww SIP | research and product decision case study')

def text(t,x,top,w,size=11.5,bold=False,color='ink',limit=None):
    for s in ([size,size-.5,size-1,size-1.5] if limit else [size]):
        st=ParagraphStyle('p',fontName='B' if bold else 'A',fontSize=s,leading=s*1.32,textColor=COL[color])
        p=Paragraph(t,st);_,h=p.wrap(w,700)
        if limit is None or h<=limit:break
    p.drawOn(c,x,top-h)
    return h
def box(x,y,w,h,fill='paper',border='line'):
    c.setFillColor(COL[fill]);c.setStrokeColor(COL[border]);c.roundRect(x,y,w,h,9,fill=1,stroke=1)
def card(x,y,w,h,title,body,fill='paper',size=11.5):
    box(x,y,w,h,fill);text(title,x+13,y+h-14,w-26,12.3,True,'dark')
    text(body,x+13,y+h-42,w-26,size,False,'ink',h-53)
def base(n,kicker,title,source):
    c.setFillColor(COL['white']);c.rect(0,0,W,H,stroke=0,fill=1)
    c.setFillColor(COL['teal']);c.rect(0,532,W,8,stroke=0,fill=1)
    text(kicker.upper(),40,514,850,10,True,'teal')
    text(title,40,486,880,23,True,'ink',60)
    c.setStrokeColor(COL['line']);c.line(40,411,920,411)
    text(source,40,32,815,8.8,False,'muted',25)
    text(f'{n:02d} / 10',865,32,55,9,True,'teal')
def bar(t,x,y,w,fill='pale',size=11.5):
    box(x,y,w,48,fill);text(t,x+13,y+37,w-26,size,True,'ink',38)
def line(t,x,y,w,size=11.5,color='ink',bold=False):text(t,x,y,w,size,bold,color)
def link(url,x,y,w,h):c.linkURL(url,(x,y,x+w,y+h),relative=0)

# 1: research contract and full decision trajectory
base(1,'The assignment and decision','What would make a first SIP still active at month 12?','Brief, 30 Oct 2026; Parts 2–4 current decision; AI Evidence Log.')
box(40,296,880,104,'pale');text('North Star: increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.',57,383,845,18,True,'ink',67)
line('“Active” = at least one successful SIP instalment in the preceding 30 days. One investor counts once.',57,328,835,12,'muted')
for i,(head,body) in enumerate([('1 · Define','People, not plans'),('2 · Observe','Intent, event, outcome'),('3 · Contrast','Repair, pause, continue'),('4 · Decide','Reversible problem bet'),('5 · Test','Task, harm, next due')]):
    x=40+i*178;card(x,171,168,102,head,body,'paper',10.5)
bar('Product principle: a wanted, affordable contribution should work; an informed pause is also a valid investor outcome.',40,96,880,'warm',12)
line('Decision today: study unwanted repair after a routine breaks. Reach, root cause and month-12 lift are still unmeasured.',45,78,870,11,'muted')
c.showPage()

# 2: metric decomposition
base(2,'Part 2 · metric tree','The unit is a person; payment events are diagnostic','Brief definition; PART2_4_CURRENT_DECISION_2026-11-09.md. All Groww cohort quantities unknown.')
card(40,292,275,106,'Cohort and numerator','N = eligible first-ever-MF investors whose first Groww SIP reached month 12. A = people with ≥1 finally successful SIP instalment in the prior 30 days.','pale',11)
card(329,292,275,106,'Unknown and bound','N = A + I + U, where I has no confirmed success and U is unresolved. Report A/N and missingness U/N; possible range [A/N, (A+U)/N].','paper',11)
card(618,292,302,106,'Multiple SIP rule','At checkpoint, active person = OR of qualifying successes across their SIPs. One failed plan or one manual purchase cannot be called an inactive investor.','warm',11)
line('Product pathway → where Groww might change an outcome',43,273,860,13,'teal',True)
for i,(h,b) in enumerate([('Setup','Mandate + amount/date fit'),('Due','Wanted payment attempted'),('Order','Final SIP success, not just debit'),('Recovery','Unwanted gap repaired safely'),('Checkpoint','Any SIP succeeds at month 12')]):
    card(40+i*178,169,168,83,h,b,'paper',10.2)
bar('If x net additional eligible people qualify: ΔNSM = 100 × x/N percentage points. x and N are unknown; one repaired plan may give x = 0.',40,96,880,'pale',11.3)
line('Actor cut: investor chooses; Groww explains and routes; bank, mandate/rail, fund and registrar affect execution. Do not assign every failure to Groww.',43,78,875,10.5,'muted')
c.showPage()

# 3: research plan + existing alternatives
base(3,'Research design','We investigated contrasting decisions, not just complaints','Nine-question audit; primary survey audit; official Groww and Coin help, checked 9 Nov 2026.')
card(40,235,275,163,'Question and method','Which *first-year* moment could separate intended continuation from a wanted interruption? Use critical incidents: starting intent → trigger → app/bank signals → action → this-cycle result → following due → other SIPs. Compare a repairer, continuer and informed pauser.','pale',11.2)
card(329,235,275,163,'Why these sources?','Public first-person accounts expose mechanisms and workarounds; the discovery engine organizes nine questions. The nine-response written survey screens cohort fit and tests whether the public story appears first-hand. Official help establishes capability, not usage.','paper',11.2)
card(618,235,302,163,'Current-flow/competitor check','Groww documents skip, edit, Pay/Pay Now, AutoPay and order-status help. Zerodha Coin documents modify, pause and delete. Therefore “add a pause button” or copy parity is weak. The possible gap is understanding and restoring the *next* scheduled state.','warm',11.2)
card(40,99,432,119,'Evidence rule','Code stated reason, supported situation and researcher driver hypothesis separately. One root ≠ one verified first-time Groww investor. No prevalence from selected posts.','paper',11)
card(488,99,432,119,'Decision rule','Compare user cost, target fit, plausible person-level path, Groww influence, current workaround, harm risk and rival. Keep reach/lift unknown. Reverse the choice if current help or a simpler fix resolves the task.','paper',11)
link('https://groww.in/help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79',618,235,302,163)
c.showPage()

# 4: discovery evidence and its limits
base(4,'AI Discovery Engine · nine questions','The engine generated leads; source checks changed their meaning','Live engine and AI Evidence Log, 9 Nov 2026. Counts are different units, not investor prevalence.')
for i,(num,cap) in enumerate([('932','review IDs retrieved'),('100','stored public voice rows'),('9/9','source-linked question readings'),('4','unscored opportunity leads')]):
    x=40+i*222;card(x,317,211,77,num,cap,'pale',10.8)
card(40,176,275,126,'Q1–3 · start and change','Long-term security can coexist with early-profit expectation. Posts describe skip, reduction, manual recovery and intended continuation. “Stop” must be separated from a single missed instalment.','paper',11)
card(329,176,275,126,'Q4–6 · check and seek help','People report checking returns, order status and mandate routes, then asking peers, bank or Groww support. Frequency and whether outside answers were correct are unknown.','paper',11)
card(618,176,302,126,'Q7–9 · contrast and need','Concern can coexist with continuation; a skip can precede a paid month. Candidate unmet needs: predictable changes, dependable recovery and understandable status. Silent drop-offs and segment rates remain unseen.','paper',11)
bar('Correction: 932 retrieved IDs ≠ 932 eligible investors; a bank debit ≠ completed SIP; a manual catch-up ≠ restored next AutoPay.',40,104,880,'warm',11.8)
line('Source-linked readings are research leads. They do not calculate Groww retention, establish a causal root cause or rank opportunity size.',43,87,875,10.7,'muted')
c.showPage()

# 5: actual primary research
base(5,'Part 3 · primary research','The survey challenges the story, but cannot validate a mechanism','PART3_PRIMARY_USER_RESEARCH_AND_PROBLEM_GATE_2026-11-08.md; private responses not displayed.')
for i,(num,cap) in enumerate([('9','form submissions'),('8','adult + willing'),('5/8','tried SIP'),('1/8','broad target fit')]):card(40+i*222,323,211,70,num,cap,'pale',10.5)
card(40,188,275,119,'Method chosen','A written form was available, so we screened prior MF, first platform and time since SIP. For causal detail, a neutral critical-incident follow-up is needed: what was intended, seen, done and what happened at the next due date.','paper',10.9)
card(329,188,275,119,'Observed arithmetic','Eight eligible = 4 completed SIP + 1 setup-only attempt + 3 never attempted. Five attempters = 1 no prior MF + 3 prior MF + 1 unsure. Only one respondent intersects no prior MF, first Groww SIP and 7–12 months.','paper',10.9)
card(618,188,302,119,'What changed in our thinking','The broad-fit respondent names long-term security but expected early profits and says a recent payment differed from expectation. There is no incident narrative, final order or following scheduled result. A payment-only interpretation is therefore too narrow.','warm',10.9)
box(40,91,880,79,'pale');line('Research gap, not a result: 0/5–6 interviews; 0 complete strict-cohort incidents; checking frequency and “what would help” were not directly captured.',54,153,850,11.8,'dark',True)
line('A volunteer form cannot estimate segment prevalence. Mock interviews would test a script, not validate the opportunity.',54,122,850,11,'muted')
c.showPage()

# 6: behavioral segmentation
base(6,'Part 3 · segment decision','Five situations were compared on the same PM criteria','PART2_4_CURRENT_DECISION_2026-11-09.md; original public accounts linked in Evidence Log.')
heads=[('Situation',42,220),('Evidence and user cost',270,260),('Metric path / rival',542,370)]
for t,x,w in heads:line(t,x,391,w,11,'teal',True)
rows=[('Automation-reliant restorer','Repeated manual investing, bank + Groww contact after a working routine.','Wanted all-plan gap could matter; bank/rail may own fault.'),('Budget recalibrator','Expense change → skip, pay next month, consider lower amount.','Revised routine could help; informed pause may be correct.'),('Schedule interpreter','Asks what edit/skip/cancel means for next due date.','Could avoid surprise; existing help may suffice.'),('Early-return reassessor','Checks negative/low return, yet a writer keeps SIPs going.','Expectation gap; no all-plan loss shown.'),('Externally guided starter','Friend influenced start; later reconsiders plan.','Ownership of plan unknown; circumstance may explain change.')]
for i,(a,b,d) in enumerate(rows):
    y=341-i*45;box(40,y,880,40,'pale' if i==0 else 'paper');line(a,51,y+30,210,10.7,'dark',i==0);line(b,278,y+30,251,10.3);line(d,550,y+30,355,10.3)
box(40,85,880,65,'warm');line('Working choice: the automation-reliant routine restorer. Why: repeated *reported* work and a concrete next-due uncertainty; not because this is the largest segment.',54,135,850,11.6,'ink',True)
line('All five can overlap within one person. Reach, severity distribution, cohort fit and retention effect are unknown; choice is reversible.',54,108,850,10.7,'muted')
c.showPage()

# 7: evidence-to-problem and underlying factors
base(7,'Part 4 · problem definition','The repair burden is real in a public account; its cause is unresolved','FINAL_PROBLEM_BOUNDARY_2026-11-09.md; current Groww help; public account links in Evidence Log.')
box(40,304,880,94,'pale');text('After an initially working SIP routine fails, a person who still wants to contribute may pay manually and contact multiple actors yet lack confidence that the following scheduled contribution will work.',55,378,846,15.2,True,'ink',67)
for i,(h,b) in enumerate([('Who / when','Provisional first-year automation-reliant restorer; after unwanted due failure, before next due.'),('What is observed','One writer reports months of manual repair, bank/Groww support and mandate replacement.'),('Underlying factors','Bank/rail, mandate linkage, order processing, status meaning and support hand-off are rival branches.'),('Workaround','Manual purchase, support contact, mandate change; none proves the next AutoPay is fixed.')]):
    x=40+(i%2)*446;y=212-(i//2)*96;card(x,y,432,92,h,b,'paper',10.8)
bar('Why solve? Investor: less repair and safer next action. Business: only net additional eligible people with month-12 SIP success move the NSM.',40,63,880,'warm',11.4)
c.showPage()

# 8: chronology and solution rationale
base(8,'Research → product choice','The solution narrowed as each piece of evidence ruled something out','Decision history: Part 2–4 recheck; creativity audit; MVP contract. Concept comparison untested.')
for i,(h,b) in enumerate([('Initial thought','Payment failure might equal SIP drop-off.'),('Metric correction','One failed plan or manual retry does not equal an inactive person.'),('User contrast','Same-cycle recovery, deliberate skip and continued SIP contradict one universal cause.'),('Primary challenge','One target-screen answer has expectation tension but no next-payment story.'),('Revised bet','Help distinguish this order from the following due, without claiming to fix AutoPay.')]):
    x=40+i*178;card(x,254,168,139,h,b,'pale' if i==4 else 'paper',10.5)
card(40,111,275,118,'A · Current help','Official information exists, but the person must join bank debit, SIP order, workaround and next AutoPay across pages.','paper',10.8)
card(329,111,275,118,'B · Fixed SIP Check','Six user-chosen facts create a safe two-cycle explanation. It handles known/unknown states without a model; currently live.','pale',10.8)
card(618,111,302,118,'C · Gated AI reading','Could translate ambiguous wording into proposed facts, then code checks conflicts and the user corrects them. Held after weak extraction; must beat B safely.','warm',10.8)
line('Decision: ship B as the testable baseline; do not claim C adds value until an independent quality and task comparison passes.',43,88,870,10.8,'muted')
c.showPage()

# 9: prototype and actual testing state
base(9,'Part 5–6 · MVP and evaluation','A customer completes one SIP-status task; AI remains gated','Live SIP Check and CONTINUITY_MAP_EVAL.md; no real target-user task study completed.')
for i,(h,b) in enumerate([('1 · Tell us','Choose a scenario or enter six facts: intent, debit, Groww order, workaround, next due, other SIP.'),('2 · Understand','See what is confirmed for this payment and what remains unknown for the following scheduled SIP.'),('3 · Verify','Get a precise question and official Groww help link. Review the entered facts; no account access or investment instruction.')]):card(40+i*297,248,286,147,h,b,'paper',11.2)
card(40,111,432,116,'Visible safety gate','Processing is never called complete; one-time/manual payment does not prove next AutoPay; another SIP remains separate; uncertain state routes to official checking. Free text is held when extraction cannot meet quality gate.','pale',10.9)
card(488,111,432,116,'What has been tested','148 code tests and a live manual-payment/pause walkthrough passed. Target-segment real tasks: 0/3. Independent ~20-item human golden-set agreement: unrun. These are different kinds of evidence.','warm',10.9)
line('AI would earn its place only by interpreting mixed user wording more accurately and safely than the fixed guide on the same task.',43,88,870,10.9,'muted')
link('https://sip-research-viewer.soumyasantra431.workers.dev/sip-map',40,248,880,147)
c.showPage()

# 10: outcomes, risks, exact open status
base(10,'Part 7–8 · measure and mitigate','Measure understanding first; test retention only with a mature cohort','Brief; PART2_4_CURRENT_DECISION_2026-11-09.md; AI Evidence Log. Proposed company experiment.')
card(40,261,275,132,'Leading outcomes','Correct known-vs-unknown status / completed tasks; correct official route / tasks; next wanted successful SIP / intended due instalments. Also track whether a changed plan matches stated intent.','paper',11)
card(329,261,275,132,'Business experiment','Randomize eligible *people*, not SIPs. Track this-cycle and next scheduled results, all-plan status and unresolved U. At month 12 compare A/N and investor-welfare guardrails. No public baseline or lift exists.','pale',11)
card(618,261,302,132,'Risks and responses','Duplicate-pay advice → no action until order check. Bank fault → actor-neutral support route. Retention pressure → respect informed pause. Bad AI extraction → fallback to fixed check. Selection bias → no prevalence claim.','warm',11)
box(40,132,880,108,'paper');line('Prioritisation and reversal',54,221,850,13,'teal',True)
line('RICE = reach × impact × confidence / effort. Numeric ranking is dishonest here: reach, incremental impact and effort are not measured. Reopen the choice if current help solves the task, strict-fit cases show budget changes dominate, or bank failure persists despite perfect explanation.',54,192,848,11)
bar('Completion boundary: 9 survey submissions; 0/5–6 interviews; 0/3 target-user tests; no independent AI quality result. This is a researched, deployed hypothesis test—not validated retention lift.',40,72,880,'warm',10.8)
c.showPage();c.save();print(OUT)
