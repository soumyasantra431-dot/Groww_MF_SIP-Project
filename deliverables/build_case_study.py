"""Build the 10-slide, evidence-bounded Groww SIP case study PDF."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Groww_SIP_Graduation_Case_Study.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = 960, 540
INK, MUTED, GREEN, PALE, LINE, ORANGE = [HexColor(x) for x in
    ("#17363B", "#547075", "#0C897E", "#F2F8F6", "#D6E7E3", "#D4874E")]
FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Aptos", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("AptosB", str(FONT_DIR / "arialbd.ttf")))

def para(c, text, x, top, width, size=15, color=INK, bold=False, leading=None):
    style = ParagraphStyle("p", fontName="AptosB" if bold else "Aptos",
                           fontSize=size, leading=leading or size * 1.38,
                           textColor=color, spaceAfter=0)
    p = Paragraph(text, style)
    _, height = p.wrap(width, 500)
    p.drawOn(c, x, top - height)
    return top - height

def rect(c, x, y, w, h, fill=PALE, stroke=None, radius=12):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=int(stroke is not None))

def line(c, x1, y1, x2, y2, color=LINE, width=1):
    c.setStrokeColor(color); c.setLineWidth(width); c.line(x1, y1, x2, y2)

def base(c, n, section, title, source):
    c.setFillColor(HexColor("#FFFFFF")); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN); c.rect(0, H-9, W, 9, fill=1, stroke=0)
    para(c, section.upper(), 44, 505, 860, 11, GREEN, True)
    title_size = 23 if len(title) > 65 else 28
    para(c, title, 44, 475, 872, title_size, INK, True, title_size * 1.22)
    line(c, 44, 416, 916, 416)
    para(c, source, 44, 35, 834, 9.3, MUTED)
    para(c, f"{n:02d} / 10", 862, 35, 55, 9.3, GREEN, True)

def card(c, x, y, w, h, heading, body, accent=GREEN):
    rect(c, x, y, w, h)
    c.setFillColor(accent); c.rect(x, y+h-5, w, 5, fill=1, stroke=0)
    heading_bottom = para(c, heading, x+18, y+h-23, w-36, 15, INK, True)
    para(c, body, x+18, min(y+h-57, heading_bottom-9), w-36, 13.5, MUTED, False, 18)

c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
c.setTitle("Groww SIP continuation | evidence-led graduation case study")

# 1 · Brief and decision boundary
base(c,1,"The brief","Keep the investor's intention and the metric separate",
     "Source: Groww graduation brief; project charter, 9 Nov 2026. Academic prototype; not affiliated with Groww.")
para(c,"North Star",48,394,180,12,GREEN,True)
para(c,"First-time mutual-fund investors with an active SIP 12 months after their first one",48,367,820,24,INK,True,31)
card(c,48,91,410,152,"Investor-good outcome","A contribution the person still wants is completed. An informed pause is also a valid choice.")
card(c,476,91,436,152,"Product decision","Investigate where a wanted recurring payment becomes an unclear or repeated repair task. Do not assume a market fall or an app defect.")
c.showPage()

# 2 · Metric math
base(c,2,"Part 2 · metric decomposition","The unit is a person, not a plan or a payment",
     "Source: assignment NSM definition; PART2_4_CURRENT_DECISION_2026-11-09.md. N, A, I, U require Groww data.")
rect(c,48,280,864,115)
para(c,"N = A + I + U",70,374,800,28,GREEN,True)
para(c,"Eligible people at month 12 = confirmed active + confirmed inactive + unresolved.",70,330,800,15,INK)
card(c,48,98,270,164,"Qualifying event","At least one successful SIP instalment in the preceding 30 days, across any of that person's SIPs.")
card(c,330,98,280,164,"Not the same event","Bank debit, pending order, one-time payment, failed retry or stopping one of several plans.")
card(c,622,98,290,164,"Potential lift","If x net eligible people become active, change = 100 × x / N percentage points. x and N are unknown.")
c.showPage()

# 3 · Discovery engine process
base(c,3,"Part 1 · discovery engine","A source-linked question finder, not a churn calculator",
     "Source: live SIP Lens engine; AI_EVIDENCE_LOG_DRAFT_2026-11-06.md; research records as of 9 Nov 2026.")
for x,num,lab in [(50,"932","review IDs retrieved"),(270,"100","user-voice rows saved"),(490,"9","provisional question readings"),(710,"4","unscored opportunity leads")]:
    rect(c,x,280,200,110); para(c,num,x+18,371,160,30,GREEN,True); para(c,lab,x+18,322,165,13,MUTED)
para(c,"Collect → screen SIP relevance and duplicates → propose event, action and outcome → check the original → answer nine research questions.",54,250,850,17,INK,True)
para(c,"Proposed themes group a stated trigger, action and outcome by source root. Each question card keeps a rival explanation and a missing fact visible.",54,180,850,15,MUTED)
para(c,"Quality boundary: original-source review and independent AI accuracy remain open. Retrieval counts are records, not investors or prevalence.",54,118,850,13.5,MUTED)
c.showPage()

# 4 · Episode contrasts
base(c,4,"Parts 2–3 · behavioral evidence","The same visible symptom can end three ways",
     "Public accounts: reddit.com/r/MutualfundsIndia/comments/1wtfugh/; /1t2f3wm/; reddit.com/r/IndianStockMarket/comments/1hcgq2k/.")
card(c,48,168,270,218,"Wanted payment, repeated repair","One Groww writer reports AutoPay working for months, then repeated failures, manual investing, bank and Groww contact, and an attempted new mandate.")
card(c,330,168,280,218,"Same-cycle recovery","Another Groww writer reports one of several SIPs debiting and manual catch-up of others. The following automatic cycle is not verified.")
card(c,622,168,290,218,"Informed adjustment","A writer reports a skipped month followed by a paid month. A skip is not necessarily lost intent or a lost person.")
para(c,"PM inference: compare intent → actual order → workaround → following due result. These self-reports do not establish first-ever-MF status or a 12-month rate.",54,139,850,14,INK,True)
c.showPage()

# 5 · Segmentation and opportunity
base(c,5,"Parts 3–4 · segment choice","Five situations, one reversible research bet",
     "Source: PARTS2_TO5_RESEARCH_CONCLUSION_2026-11-09.md; FINAL_PROBLEM_BOUNDARY_2026-11-09.md.")
para(c,"BEHAVIORAL SITUATION",68,402,245,10,GREEN,True)
para(c,"OBSERVED SIGNAL",334,402,260,10,GREEN,True)
para(c,"BEST RIVAL",637,402,250,10,GREEN,True)
for i,(name,signal,rival) in enumerate([
  ("Automation-reliant repairer","Repeated manual repair","Bank or rail execution"),
  ("Changed-obligation adjuster","Skip, then resume","Correct informed pause"),
  ("Schedule interpreter","Asks what an edit changes","Current help suffices"),
  ("Early-return reassessor","Concern, yet continues","No qualifying-payment gap"),
  ("Externally guided starter","Friend shapes initial plan","Changed circumstance drove revision")]):
    y=339-i*52
    rect(c,50,y,860,45,HexColor("#DEF2ED") if i==0 else PALE, radius=7)
    para(c,name,68,y+33,255,13,INK,True)
    para(c,signal,334,y+33,290,12.5,MUTED)
    para(c,rival,637,y+33,257,12.5,MUTED)
para(c,"Decision: test the repeated repair task because burden is reported and a hand-off is within Groww's influence. No evidence ranks its reach or month-12 lift above the alternatives.",54,93,846,13.5,INK,True)
c.showPage()

# 6 · Primary research boundary
base(c,6,"Part 3 · validation","The survey informs questions; it cannot validate the cohort problem",
     "Source: PART2_4_CURRENT_DECISION_2026-11-09.md; PART3_PRIMARY_USER_RESEARCH_AND_PROBLEM_GATE_2026-11-08.md.")
for x,num,lab in [(50,"9","survey submissions"),(282,"5 / 8","eligible respondents who attempted a SIP"),(552,"1","broad target-screen fit"),(748,"0 / 5–6","critical-incident interviews")]:
    rect(c,x,276,200 if x!=552 else 170,112)
    para(c,num,x+15,366,170,25,GREEN,True); para(c,lab,x+15,326,170,12,MUTED)
para(c,"Needed contrast: a first-year Groww investor with an unwanted payment gap and a comparable continuer or informed chooser. Ask both what they intended, saw, did, and what happened at the next scheduled SIP.",54,246,850,16,INK,True)
para(c,"One broad target-screen response mixed a long-term security goal with an early-profit expectation. That challenges a payment-only explanation, but does not measure how common either motive is.",54,164,850,13.5,MUTED)
para(c,"No mock account is treated as an interview. Final payment status and strict cohort fit are unverified in public stories.",54,93,850,12.5,MUTED)
c.showPage()

# 7 · Problem definition
base(c,7,"Part 4 · problem definition","Repeated repair work is observed; the root cause is open",
     "Source: FINAL_PROBLEM_BOUNDARY_2026-11-09.md; Groww help for payment, mandate and order-processing states.")
rect(c,48,277,864,111)
para(c,"After an initially working SIP unexpectedly fails, a person who still wants to contribute may pay manually and contact several actors yet not know whether the following scheduled payment will work.",68,365,824,18,INK,True)
card(c,48,89,270,168,"User value","Know which fact is confirmed, avoid an unsafe repeat payment, and carry a clear question to official support.")
card(c,330,89,280,168,"Business path","Better hand-off may help wanted next-cycle success; person-level month-12 effect remains unmeasured.")
card(c,622,89,290,168,"Rival explanations","Bank or rail execution may remain broken despite perfect information; current Groww help may already suffice.",ORANGE)
c.showPage()

# 8 · Solution comparison
base(c,8,"Part 5 · solution rationale","AI earns a place only if it beats a simpler guide on the same task",
     "Source: MVP_CREATIVITY_AUDIT_2026-11-09.md; mvp/CONTINUITY_MAP_CONTRACT.md. Comparison is designed, not user-tested.")
card(c,48,177,270,208,"A · Groww help","Official status and payment pages already exist. The user must find the page that matches mixed bank and order signals.")
card(c,330,177,280,208,"B · Fixed receipt","The user selects known facts. Code gives a safe question and official route; no model uncertainty.")
card(c,622,177,290,208,"C · Continuity Map","AI proposes six anchored facts from mixed wording; code checks conflicts, then the user corrects the map.")
para(c,"Compare: correct known/unknown facts, correct official check, unsafe second-payment idea, effort and corrections. If B works as well, prefer B.",54,143,852,14,INK,True)
c.showPage()

# 9 · MVP and tests
base(c,9,"Parts 5–6 · prototype and evaluation","A working map, with a visible safety fallback",
     "Prototype: sip-research-viewer.soumyasantra431.workers.dev/sip-map.html; build/test record, 9 Nov 2026.")
rect(c,48,266,864,121)
para(c,"Intent  →  bank debit  →  Groww order  →  this-cycle workaround  →  next SIP  →  other SIP",68,357,823,17,INK,True)
para(c,"Each row is anchored to supplied words or says unknown. Code checks conflicting states and produces fixed neutral questions. No account lookup or payment action.",68,313,823,13.5,MUTED)
card(c,48,87,410,162,"Quality check","148 automated tests passed. One synthetic Groq Free call returned structured fields. These are engineering checks, not real-item accuracy.")
card(c,476,87,436,162,"Release boundary","Independent ~20-item hand labels and 3 real target-user tasks are outstanding. Public AI stays off; the fixed map works.",ORANGE)
c.showPage()

# 10 · Success, risks, next decision
base(c,10,"Parts 7–8 · success and risk","Measure welfare-aligned continuation, not fewer pauses",
     "Source: assignment NSM; FINAL_PROBLEM_BOUNDARY_2026-11-09.md; mvp/CONTINUITY_MAP_EVAL.md.")
card(c,48,258,410,131,"Business and leading outcomes","NSM = A/N unique eligible people. Leading: correct status understanding / tasks; correct official check / tasks; wanted next-SIP success / wanted failed dues.")
card(c,476,258,436,131,"Investor and AI guardrails","Unexpected debit, duplicate-pay direction, false success, invented actor fault, advice-like output, affordability strain and wrongly discouraged pauses.")
card(c,48,94,410,146,"Main risk and mitigation","Explanation cannot repair an upstream failure. Keep actor fault unknown, route to official checks, and separate other-SIP and next-cycle outcomes.",ORANGE)
card(c,476,94,436,146,"Next evidence gate","Get strict-cohort contrasting incidents, independent real-item AI labels, and 3 target-user task tests. Keep or drop AI based on the same-task result.")
c.showPage()
c.save()
print(OUT)
