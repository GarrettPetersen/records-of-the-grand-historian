import {draftGroup,year,interval,read,v} from './host-date-repair-tools.mjs';
const g=draftGroup(3),units=new Map(read(v+'prospective-packet.json').units.map(u=>[u.id,u]));
const memorialDate={sourceDate:{text:'又聞庾亮薨；乃表曰；又與冰書曰'},westernInterval:interval(340,341)};
const exempla=[
 [524,'p086',['s0221','s0253'],'Shen Bo is praised as the maternal uncle who held a frontier fief without grasping court power, and proposed as a model for Yu Bing.'],
 [529,'p087',['s0222'],'King Zhao of Qin is cited as a capable ruler whose trust in his two maternal uncles nearly threw his state into disorder.'],
 [534,'p088',['s0223','s0224'],'Emperor Wu of Han is recalled for entrusting crucial decisions to Tian Fen and bitterly regretting it after Fen’s death.'],
 [539,'p089',['s0223','s0224'],'Tian Fen is recalled as the influential minister who decided vital affairs for Emperor Wu of Han; after Fen died, the emperor bitterly regretted his trust.'],
 [544,'p090',['s0225'],'Emperor Cheng of Han is cited as a weak ruler whose indulgence of his consort and maternal uncles enabled Wang Mang’s seizure of the throne.'],
 [550,'p091',['s0225'],'Emperor Cheng of Han’s beautiful consort is cited as the distracting court influence in the memorial’s account of his weakness.'],
 [553,'p092',['s0225'],'Wang Mang is recalled as having seized the imperial throne after Emperor Cheng indulged his consort and maternal uncles.'],
 [557,'p093',['s0227'],'The Marquis of Rang is cited as a powerful maternal uncle whose prominence eclipsed his ruler.'],
 [561,'p094',['s0227'],'Wang Feng is cited as a powerful maternal uncle whose prominence eclipsed his ruler.'],
 [565,'p095',['s0228','s0254'],'Dou Xian is cited as a disastrous precedent for powerful relatives and as a warning to Yu Bing.'],
 [569,'p096',['s0228','s0254'],'Liang Ji is cited as a disastrous precedent for powerful relatives and as a warning to Yu Bing.'],
 [591,'p101',['s0245'],'Xu Fu is recalled for warning about the Huo clan; Emperor Xuan failed to heed the warning before loyal ministers became a treasonous clan.'],
 [596,'p102',['s0245'],'Emperor Xuan of Han is recalled for failing to heed Xu Fu’s warning about the Huo clan.'],
 [600,'p103',['s0248'],'Wang Zhang is cited with Liu Xiang as a critic of the Wang clan whose memorials led to death or punishment.'],
 [605,'p104',['s0248'],'Liu Xiang is cited with Wang Zhang as a critic of the Wang clan whose memorials led to death or punishment.'],
 [610,'p105',['s0249'],'Gu Yong is cited with Zhang Yu as equivocating to preserve himself and earning later criticism.'],
 [614,'p106',['s0249'],'Zhang Yu is cited with Gu Yong as equivocating to preserve himself and earning later criticism.'],
 [618,'p107',['s0258','s0259'],'Dou Wu is recalled with He Jin for welcoming worthy men, suffering harm from eunuchs and sacrificing himself for the state.'],
 [623,'p108',['s0258','s0259'],'He Jin is recalled with Dou Wu for welcoming worthy men, suffering harm from eunuchs and sacrificing himself for the state.']
];
for(const[n,person,evidence,action]of exempla){
 g.remove('claim-'+n,'The owned passage is a retrospective citation in Huang’s memorial or letter. Withdraw an imported personal career/death date; the complete named source episode is retained below as a classified reception event.');
 g.reception([person,'event-participation',{kind:'retrospective-reference',receptionType:'retrospective',role:'cited exemplum',action,dateContext:memorialDate},'explicit-event-contextual-date',evidence],'Preserve this source-specific historical exemplum and all its cited units as a later reception. The memorial/letter follows Yu Liang’s340death and precedes the court deliberation placed in341by ZZTJ96; use340–341for the citation rather than importing the subject’s life dates.');
}
g.remove('claim-540','Tian Fen’s death is expressly recalled in the later memorial, but no BC131conversion appears here. Preserve the death and the emperor’s subsequent regret in the p089retrospective event; remove the independently imported exact life date.');
g.remove('claim-573','The living Jin emperor is addressed in this memorial, not attested across his whole reign. Remove the imported325–342reign span and retain the source-specific current-memorial attestation.');
g.life('claim-574',memorialDate,'This attestation concerns the same post-Yu-Liang-death memorial and recognition deliberation as s0077–s0079. The source gives a lower bound of340and ZZTJ96 narrates the decision in341; retain340–341rather than assume immediate340delivery.');
const flightDate={sourceDate:{text:'初，段遼之敗也；乃陽狂恣酒'},westernInterval:interval(338,340)};
g.life('claim-649',flightDate,'初 marks a flashback to Duan Liao’s338defeat. Han’s flight, feigned madness and unrestrained stay fall after that defeat and before his return in the second month of340(ZZTJ96). The inclusive338–340year window does not exclude the early340stay.', ['s0082','s0083']);
g.life('claim-660',flightDate,'Yuwen Gui’s hosting belongs to Han’s338–340stay following Duan Liao’s defeat, not an undifferentiated340–341episode. Retain the exact flight/hosting source units and the inclusive year precision.');
for(const n of [652,653])g.context('claim-'+n,flightDate,'Add the source-backed flashback window only; preserve the flight/deception action, participants and source evidence. The stay begins after338and ends before the February340return.');
const returnDate={sourceDate:{text:'乃遣車遺翰弓矢；攜其二子而還'},westernYear:year(340)};
g.add(['p113','attestation',returnDate,'explicit-event-contextual-date',['s0084','s0085','s0086']],'Separate the return from the earlier flashback stay. ZZTJ96 Xiankang6/secondmonth explicitly narrates Han’s escape with his two sons and return in340. Preserve the chapter’s intermediary messages and bow/arrow gift as return evidence.');
g.context('claim-654',returnDate,'The return event has the same participants and action; ZZTJ96 explicitly dates Han’s escape/return to340, distinct from the earlier338–340stay.');
const former={sourceDate:{text:'先帝列將之授'},unresolved:true,unresolvedReason:'The letter names only a former emperor and recalls a grant of military command. This chapter separately records Huang’s Jianwu317and lateTaining325appointments; it does not identify which grant or emperor this allusion means. Withdraw the imported323–325reign span until independent source research establishes the referent and grant date.'};
g.life('claim-628',former,'A former emperor’s reign is not the date of the recalled grant. Retain the source-backed grant, unnamed former-emperor identity and explicit unresolved chronology instead of importing323–325.');
g.context('claim-630',former,'The grantor and command fact remain unchanged. Make its chronology explicitly unresolved because neither the emperor nor the grant date is established by this source allusion.');
g.hints({...Object.fromEntries(exempla.map(x=>[x[1],[]])),p083:['AD 327-328','AD 340'],p097:['AD 340-341'],p109:[],p113:['AD 338-340','AD 340'],p114:['AD 338-340']});
g.finish([{url:'https://zh.wikisource.org/wiki/晉書/卷109',sourceUnits:exempla.flatMap(x=>x[2]),supports:'Complete memorial and letter exempla preserve historical facts as retrospective reception; s0261does not identify the former emperor or date the grant.',accessedAt:new Date().toISOString()},{url:'https://zh.wikisource.org/wiki/資治通鑑/卷096',supports:'Xiankang4/338Duan Liao defeat and Han’s flight; Xiankang6/secondmonth340return; Yu Liang death340and court deliberation341.',accessedAt:new Date().toISOString()}],{additionalAffectedTargets:['claim-574','claim-652','claim-653','claim-654','claim-630'],researchHolds:[{person:'p109',sourceUnits:['s0261'],reason:former.unresolvedReason}],retrospectivePeople:exempla.length,retrospectiveDateWindow:'AD 340-341; conservative post-death/pre-deliberation window, reconciled with group002'});
