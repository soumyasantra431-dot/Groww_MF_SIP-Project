// Short, source-linked desk readings. These are editorial research notes,
// separate from the model-coded corpus, its reviewed counts and approved answers.
// Store links and paraphrases only; never raw posts, usernames or account details.
export const deskSources = Object.freeze({
 G1:{family:'Public investor account',fit:'Groww stated · about six months in · first-ever MF unknown',url:'https://www.reddit.com/r/MutualfundsIndia/comments/1qalisr/19_looking_for_mutual_fund_advice/',limit:'Considering a change is not a completed stop or later missed instalment.'},
 G2:{family:'Public investor account',fit:'Groww stated · first-year timing stated · first-ever MF unconfirmed',url:'https://www.reddit.com/r/MutualfundsIndia/comments/1scucrj/need_review_of_my_mutual_fund_portfolio_groww/',limit:'Self-reported continuation; following scheduled and month-12 payments unverified.'},
 G3:{family:'Public investor account',fit:'Groww stated · several months in · first-ever MF unknown',url:'https://www.reddit.com/r/MutualfundsIndia/comments/1h4t6nw/how_do_i_skip_sip/',limit:'A planned pause and question, not a confirmed pause or app failure.'},
 G4:{family:'Public investor account',fit:'Groww stated · first-year timing unknown',url:'https://www.reddit.com/r/IndianStockMarket/comments/1hcgq2k/can_i_skip_sip_instalments_in_alternate_month/',limit:'Reports a following-month payment and intended reduction; no month-12 outcome.'},
 G5:{family:'Public investor account',fit:'Groww stated · about three months in · first-ever MF uncertain',url:'https://www.reddit.com/r/MutualfundsIndia/comments/1ux60ye/20_started_investing_in_mfs_3_months_ago/',limit:'Reports early continuation and affordability; later payments unknown.'},
 G6:{family:'Public investor account',fit:'Groww stated · first-year and first-ever MF unknown',url:'https://www.reddit.com/r/MutualfundsIndia/comments/1wtfugh/grow_autopay_failure_help/',limit:'Manual investing and complaints are self-reported; cause and qualifying SIP recovery unknown.'},
 G7:{family:'Public investor account',fit:'Groww stated · new SIP · first-ever MF unknown',url:'https://www.reddit.com/r/MutualfundsIndia/comments/1fuaccg/',limit:'Next-date confusion is reported; no later missed-payment outcome.'},
 S1:{family:'Regulator survey · context',fit:'13,862 MF/ETF respondents, not first-time Groww SIP cohort',url:'https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768910470286.pdf',limit:'Multiple-response challenges; neither cause nor Groww retention rate.'},
 H1:{family:'Groww help · capability',fit:'Official documentation, not an observed user experience',url:'https://groww.in/help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79',limit:'A documented skip control does not prove it was visible or usable to a particular investor.'},
 H2:{family:'Groww help · capability',fit:'Official documentation, not an observed user experience',url:'https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1',limit:'A bank debit can precede final order completion; this does not diagnose a particular case.'}
});

export const editorialBriefs = Object.freeze({
 Q1:{title:'Why start a SIP, and what was expected?',answer:'The accounts show more than one starting logic. One Groww investor began regular contributions without a clear explanation for the choices and later sought help. Another described a long-term goal and an amount they felt able to sustain. These are stated motives and plans; neither account tells us what first-time Groww investors generally expect.',points:[
  {text:'One person described starting somewhere, then questioning the fund choices about six months later.',sources:['G1']},
  {text:'Another described long-term wealth creation, an emergency buffer and early continued contributions.',sources:['G5']},
  {text:'SEBI reports a wider mix of growth, income, diversification and peer-related starting motives among securities investors; its population differs from this project cohort.',sources:['S1']}
 ],rival:'A later question about fund choice may be normal learning, not an unmet Groww need.',unknown:'The typical first-SIP expectation, its accuracy, and whether a mismatch precedes a missed payment are unknown.',next:'Ask a first-ever MF investor what they expected the first payment, first statement and first year to show.'},
 Q2:{title:'What changes after starting?',answer:'The first months can bring different decisions, even when the SIP was started with good intent. One Groww user later questioned the original choices; another reported continuing despite negative displayed returns; another reported paying after a skipped month and considering a smaller amount. These are different accounts, so they cannot be stitched into one typical journey.',points:[
  {text:'About six months after starting, one investor sought help about changing or stopping some purchases.',sources:['G1']},
  {text:'Another said they were continuing SIPs while seeing negative returns.',sources:['G2']},
  {text:'A separate writer reported a skip, a payment the following month, then a plan to reduce the amount temporarily.',sources:['G4']}
 ],rival:'Different circumstances may explain the different actions; time since start alone may not.',unknown:'A within-person month-by-month sequence and the month-12 qualifying outcome are not established.',next:'Reconstruct one person’s starting expectation, difficult month, action and next scheduled payment.'},
 Q3:{title:'What leads to pausing, reducing or stopping?',answer:'The visible accounts separate intention from failure. Anticipated expenses prompted one Groww user to ask how to pause. Another chose a temporary reduction after skipping and then paying a month. A different user reported recurring AutoPay failures despite wanting to invest. Calling all three “churn” would erase whether the investor chose the change and whether another SIP remained active.',points:[
  {text:'Higher expected expenses led to a pause and penalty question; the actual pause is not confirmed.',sources:['G3']},
  {text:'A writer reported paying the month after a skip and then choosing a temporary amount reduction.',sources:['G4']},
  {text:'A writer reported repeated AutoPay failures and manual investing, with the responsible actor unresolved.',sources:['G6']},
  {text:'Groww documents a skip action and timing conditions; documentation alone does not establish successful use.',sources:['H1']}
 ],rival:'A deliberate pause can be the investor’s appropriate decision, while an apparent failure can recover or concern only one of several SIPs.',unknown:'The later qualifying SIP outcome, reason mix and frequency within first-time Groww investors are unknown.',next:'For each episode, ask what the investor intended, whether the change was wanted, and what happened at the next due date.'},
 Q4:{title:'What do investors check, and how often?',answer:'The accounts show checking for meaning and reassurance: one user reviewed choices after months of investing and another looked at negative returns while continuing. They do not state a reliable checking cadence. Public posts over-represent people motivated to ask a question, so this engine cannot answer “how often” for the first-time Groww cohort.',points:[
  {text:'One investor checked their holdings and sought a review after about six months.',sources:['G1']},
  {text:'Another referred to displayed XIRR and negative returns but said they continued contributing.',sources:['G2']},
  {text:'In the broader SEBI MF/ETF respondent group, difficulty tracking performance and understanding statements were separately reported challenges.',sources:['S1']}
 ],rival:'People who never post may check more, less or only when notified.',unknown:'Checking frequency, the trigger for each visit, and whether a check changes the next SIP payment are unknown.',next:'Use a neutral 30-day recall question or a small diary: what was checked, when, what set it off and what action followed.'},
 Q5:{title:'What confuses or worries them inside the app?',answer:'The most concrete Groww-related questions in this desk set concern what a skip changes, whether another skip could cancel a SIP, when the next payment is due, and what a debit means before the order completes. Those are comprehension and control questions. The posts do not establish that Groww’s current interface lacks the information or that the investor failed a task.',points:[
  {text:'A user anticipating higher expenses asked how to pause and whether a penalty applied.',sources:['G3']},
  {text:'Another worried about the consequence of another skip after reporting a following-month payment.',sources:['G4']},
  {text:'Groww documents skip conditions and says an order may still be processing after a bank debit.',sources:['H1','H2']}
 ],rival:'The information may be available but not noticed, or the question may arise outside the app before any attempt to find it.',unknown:'Actual screen exposure, comprehension, control success and effect on a scheduled payment are unknown.',next:'Observe a safe task in the current Groww flow: explain a skip and an incomplete order before asking for preferences.'},
 Q6:{title:'What happens outside the app?',answer:'When unsure, investors in these accounts sought help from public forums; one payment-trouble writer also reported contacting both the bank and Groww. This shows information-seeking and a manual workaround, not proof that advice was correct or changed a later SIP result.',points:[
  {text:'The investor unsure of their choices asked a public community what to change.',sources:['G1']},
  {text:'A continuer with negative returns also asked for outside feedback.',sources:['G2']},
  {text:'The AutoPay writer reported bank and platform support contacts and manual investing.',sources:['G6']}
 ],rival:'Outside advice may coexist with confident continuation; asking for help is not itself a drop-off signal.',unknown:'Whether the person acted on replies, what support resolved, and the next scheduled SIP outcome are unknown.',next:'Keep the original poster’s action separate from a commenter’s suggestion; ask which advice, if any, they actually used.'},
 Q7:{title:'What differs between continuation and interruption?',answer:'The selected cases offer contrasts, not a causal separator. One Groww user reported continuing through negative returns; another reported a skip followed by payment; a third reported manual investing during repeated AutoPay failures. These outcomes show why a difficult month, one missed instalment or a fund-level pause cannot be equated with person-level inactivity.',points:[
  {text:'A newer investor explicitly reported continuing SIPs while returns appeared negative.',sources:['G2']},
  {text:'A separate writer reported a payment after a skipped month, then considered a lower amount.',sources:['G4']},
  {text:'The AutoPay writer still reported investing manually, but whether that counted as a qualifying SIP instalment is unknown.',sources:['G6']},
  {text:'Another early-stage account reported continued contributions and a possible affordable increase.',sources:['G5']}
 ],rival:'Goal clarity, affordability, prior knowledge and payment reliability could each differ between writers; none is isolated here.',unknown:'Comparable first-year Groww continuers and drop-offs with known next and month-12 outcomes are missing.',next:'Compare a difficult-month continuer and an unwanted interrupter using the same questions and time window.'},
 Q8:{title:'How do circumstances differ across accounts?',answer:'The desk cases show plausible dimensions to investigate: a new investor’s unclear starting rationale, an expected expense increase, a stated long horizon and a perceived ability to increase contributions. They do not establish demographic or income-based segment differences. Age, salary stability, source of money and who influenced the start must remain unknown unless each writer states them.',points:[
  {text:'An expected expense increase preceded one person’s pause question.',sources:['G3']},
  {text:'Another described an affordable early increase and an emergency buffer.',sources:['G5']},
  {text:'A continuer with negative returns stated a long horizon while seeking a portfolio review.',sources:['G2']}
 ],rival:'Who chooses to post publicly may explain the apparent differences between accounts.',unknown:'The size of each behavioral group, joint cohort fit, and whether these dimensions predict month-12 continuation are unknown.',next:'Screen first-ever MF and first Groww SIP explicitly, then compare stated circumstances and outcomes without inferring income from ticket size.'},
 Q9:{title:'Which unmet needs deserve investigation?',answer:'Three possible needs emerge from the contrasts: understanding what the SIP was meant to achieve after starting, making an informed temporary adjustment when finances change, and knowing what happened when an intended payment fails. They are opportunity hypotheses, not a ranked list. Groww already documents skip and order-status guidance, so the next test is whether people can use those routes at the moment they need them.',points:[
  {text:'An investor’s uncertainty about original choices suggests a possible understanding gap, without proving a later stop.',sources:['G1']},
  {text:'An expense-driven pause question and a reported temporary reduction suggest a need to understand adjustment consequences.',sources:['G3','G4']},
  {text:'Repeated AutoPay trouble produced manual work, while Groww’s order help describes a different processing state; they must not be conflated.',sources:['G6','H2']}
 ],rival:'The current product may already satisfy some of these needs; the real blocker could be outside Groww’s control.',unknown:'Reach, severity across the eligible cohort, current-task failure and 12-month lift are unmeasured.',next:'Test each candidate against a real intended action, existing Groww help, next scheduled outcome and a comparable continuer.'}
});

export function validateEditorialBriefs(briefs=editorialBriefs,sources=deskSources){
 const expected=Array.from({length:9},(_,i)=>`Q${i+1}`);
 if(JSON.stringify(Object.keys(briefs))!==JSON.stringify(expected))throw Error('Exactly nine ordered research briefs required');
 for(const [id,b] of Object.entries(briefs)){
  if(!b.title||!b.answer||!b.rival||!b.unknown||!b.next||!Array.isArray(b.points)||b.points.length<2)throw Error(`${id}: incomplete research brief`);
  for(const p of b.points){if(!p.text||!Array.isArray(p.sources)||!p.sources.length||p.sources.some(s=>!sources[s]))throw Error(`${id}: unsupported source link`);}
 }
 return true;
}
validateEditorialBriefs();
