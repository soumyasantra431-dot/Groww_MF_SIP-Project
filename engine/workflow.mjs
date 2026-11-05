// Research contract, not findings or source-use permission. Dated access status
// comes from the separate terms register; a route below never enables collection.
export const DISCOVERY_CONTRACT_VERSION='2026-11-04-phase-0';
export const SOURCE_ROUTES={
 'Play Store':{status:'route unresolved',seek:'SIP-specific payment, status, adjustment and ordinary-success experiences.',route:'Permission-checked public originals or an authorised review export → local CSV.',tier:'Tier A first; Tier B only if an actual sequence is stated.',limit:'Developer credentials for our own app do not unlock Groww review data. Public collection route remains unresolved.'},
 'App Store':{status:'restricted under checked India terms',seek:'SIP-specific execution and comprehension experiences; compare platform differences only when stated.',route:'No review collection under the currently checked India terms; reconsider only with an explicit valid permission basis.',tier:'Potential Tier A if a lawful route later exists.',limit:'Apple India terms restrict automated or equivalent manual collection and analysis of App Store content. No review corpus is admitted.'},
 'Reddit':{status:'restricted without approved research access',seek:'Starting expectations, changing circumstances, informed pauses, ordinary continuation and recovery narratives.',route:'Approved research access/export → local CSV; no manual-copy bypass of a restricted route.',tier:'Tier A first; select source-linked narratives for Tier B.',limit:'Historical seed inputs are not cleared for model use. Approved researcher access remains unresolved.'},
 'Investing forums':{status:'bounded source-specific local assessment',seek:'A specific SIP event, speaker-separated replies, workarounds and reported endings.',route:'Bounded original-page reading → de-identified local CSV with topic/post locator.',tier:'Tier A first; qualifying narratives feed Tier B.',limit:'TradingQ&A and Personal Finance & Money Stack Exchange have separate recorded local-use decisions. The posts are mostly adjacent to the Groww target; public raw-text redistribution remains held.'},
 'Social':{status:'source not selected',seek:'A named gap, such as a stated influence, life event or ordinary-success account.',route:'Choose a public platform and inspect its terms before bounded collection/import.',tier:'Tier A; Tier B only for a supported personal sequence.',limit:'No platform-specific collection route is established. No private groups or profile harvesting.'},
 'YouTube':{status:'analytics amendment not confirmed',seek:'Commenters’ own SIP experiences and explicitly stated influence; creator advice is context.',route:'Optional official comments API → local CSV, only after the source-use basis is resolved.',tier:'Tier A first; longer first-person sequences may qualify for Tier B.',limit:'The key is available locally, but comment tagging and counts need a qualifying YouTube analytics amendment. No YouTube request has run; replies are not collected by this adapter.'},
 'Other':{status:'original-specific review required',seek:'Published investor stories or reader questions with a traceable original, speaker and reported experience.',route:'Check the individual publisher and story provenance → bounded manual CSV.',tier:'User accounts: Tier A then eligible Tier B. Expert/company material: separate context.',limit:'Illustrative stories, expert prescriptions and company documents do not become investor episodes. No generic source clearance.'}
};
export const ANSWER_REQUIREMENTS={
 Q1:'State the reported starting purpose and expectation; distinguish an investor’s words from advice they received.',
 Q2:'Describe an actual before-and-after sequence within one account. Do not join different people into a timeline.',
 Q3:'Separate intended pause, amount reduction, failed payment, cancellation and recovery; retain the final outcome separately.',
 Q4:'Say what was checked and why. Give frequency only when explicitly stated; otherwise say it is not established.',
 Q5:'Name the SIP-related screen, message or action and its reported consequence; a generic app complaint is insufficient.',
 Q6:'Describe help or action outside the app and whether the author actually tried it. Advice is not a completed workaround.',
 Q7:'Compare supported continuation, interruption and recovery accounts with similar circumstances; show unmatched cases and unknown outcomes.',
 Q8:'Compare stated circumstances and behaviours with their own denominators. Missing income, age or tenure stays missing; no automatic segment selection.',
 Q9:'Propose a need tied to desired progress, consequences and current alternatives, with a rival explanation and a next test.'
};
export const NEXT_EVIDENCE={
 Q1:'Ask a first-SIP investor what they hoped the recurring payment would achieve and when they expected to notice progress; record who influenced that expectation.',
 Q2:'Find one person describing their own starting month and a later month, including the changed circumstance, action and resulting payment state.',
 Q3:'Find an intended next instalment, the initiating event, what the investor did and whether that scheduled payment later succeeded; compare an informed pause.',
 Q4:'Ask what the investor checked, the explicit checking cadence and the period that cadence covers; public posts without a cadence cannot answer frequency.',
 Q5:'Find the exact SIP screen, message or control that was interpreted, what action followed and whether the app or an outside actor created the issue.',
 Q6:'Find a first-person sequence showing what help was sought outside the app, what was actually tried and whether the next SIP action worked.',
 Q7:'Pair a continuer and an interrupter who faced a comparable difficult month; record circumstances, protective cues and the next scheduled payment for both.',
 Q8:'Collect explicitly stated income pattern, source of funds, age or influence alongside first-year actions and outcomes; leave unstated attributes unknown.',
 Q9:'For each candidate need, capture the desired progress, current workaround, reported consequence and a counterexample where existing controls sufficed.'
};
export const WORKFLOW={
 purpose:'Help a researcher identify and compare evidence-backed situations that may affect first-year SIP continuation, then decide what to investigate with investors.',
 boundary:'The engine proposes findings and research questions. It does not choose a segment, prove a root cause, calculate Groww retention or recommend investments.',
 steps:[
  ['Collect real evidence','Search for both difficulties and ordinary success. Keep an original link, date/unknown date, speaker context and collection record. A link alone is not analysed.'],
  ['Check and clean','Check source use, remove identifiers, reject irrelevant content, normalise metadata and flag duplicate/dependent accounts. Preserve negation, Hinglish and event order.'],
  ['Code and reconstruct','A lean first pass proposes material fields, metric node and exit form with source anchors. Review the source. Reconstruct a small set of strong episodes in greater depth: expectation → circumstance → event → action → outcome.'],
  ['Count and challenge','Code computes counts and denominators. Check source meaning, cohort fit, speaker attribution, counterexamples and unknowns. Reported reasons stay separate from inferred drivers.'],
  ['Answer and compare','After real extraction, answer each brief question from cited records. Compare researcher-named candidate problems by evidence, reach proxy, consequence, metric pathway, rival and next test. Do not rank or select automatically.']
 ],
 dataset_rule:'A spreadsheet is a delivery format, not evidence. Real public accounts need original links; consented survey responses stay in a separate lane. Invented investor stories are test fixtures and never contribute to findings.',
 answer_order:['Direct answer within the evidence’s limits','Supporting episodes with source links','Count, denominator, source mix and cohort fit','Counterexample or rival explanation','What is unknown and what to test next'],
 collection_priority:'Seek all seven families; collect unequal volumes according to evidence yield and access. Never fill an unavailable family with synthetic stories or context documents.',
 selection:'Detailed Tier B is a stretch on 3–5 distinct source roots after the lean review. Choose contrasting real sequences across initiating stage, exit form and reported circumstance; do not fill the sample with context or invented accounts.'
};
