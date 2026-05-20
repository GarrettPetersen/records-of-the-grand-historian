#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  s0001: ['Of the twenty-eight lodges in the East: the two stars of Horn form the Celestial Gate-tower; between them is the Heavenly Gate, and within is the Celestial Court.', 'In the eastern quarter of the twenty-eight lodges, Horn\'s two stars form the Celestial Gate-tower—the Heavenly Gate lies between them, and the Celestial Court within.'],
  s0002: ['Therefore the Yellow Path passes through their midst—the path of the seven luminaries.', 'The ecliptic runs through them, marking the course of the seven luminaries.'],
  s0003: ['The left Horn is the Celestial Field and the office of judgment, governing punishment; south of it is the Solar Path.', 'The left Horn is the Celestial Field and seat of justice, governing punishment; the Solar Path lies to its south.'],
  s0004: ['The right Horn is the General, governing armies; north of it is the Lunar Path.', 'The right Horn is the General, governing warfare; the Lunar Path lies to its north.'],
  s0005: ['They are the three gates of Heaven, like the four outer markers of Chamber.', 'They are Heaven\'s three gates, as Chamber has its four outer markers.'],
  s0006: ['When their stars are bright and large, the royal Way is at peace and worthy men hold office.', 'When these stars shine bright and large, the royal Way is tranquil and the worthy serve at court.'],
  s0007: ['If they tremble and shift, the king goes on campaign.', 'When they quiver and move, the sovereign takes the field.'],
  s0008: ['Neck has four stars—the Son of Heaven\'s inner court.', 'Neck\'s four stars form the Son of Heaven\'s inner court.'],
  s0009: ['It oversees all memorials under Heaven, hears lawsuits, adjudicates cases, and records merit.', 'It receives memorials from the realm, hears lawsuits, judges cases, and records achievements.'],
  s0010: ['It is also called the Dispersal Temple and governs pestilence.', 'Also called the Dispersal Temple, it governs epidemic disease.'],
  s0011: ['When the stars are bright and large, ministers offer loyal counsel, the realm is at peace, and the people suffer no pestilence.', 'Bright, large stars mean loyal ministers, a peaceful realm, and freedom from plague.'],
  s0012: ['If they move, pestilence will be widespread.', 'Movement foretells widespread disease.'],
  s0013: ['Root has four stars—the king\'s lodging palace, the consorts\' residence, and the chamber of rest and release.', 'Root\'s four stars are the king\'s lodging, the consorts\' quarters, and the chamber of repose.'],
  s0014: ['The first two stars are the principal wife; the last two are concubines.', 'The front pair represents the principal wife; the rear pair, concubines.'],
  s0015: ['When corvée labor is imminent, Root moves first.', 'When forced labor is at hand, Root stirs first.'],
  s0016: ['If the stars are bright and large, ministers observe the law and the people know no toil.', 'Bright, large stars mean ministers uphold the law and the people are not overworked.'],
  s0017: ['Chamber\'s four stars are the Bright Hall—the palace where the Son of Heaven dispenses government—and also the Four Assistants.', 'Chamber\'s four stars form the Bright Hall, where the Son of Heaven governs, and also represent the Four Assistants.'],
  s0018: ['The lowest star is the Chief General;', 'The lowest star is the Chief General;'],
  s0019: ['the next, the Second General;', 'the next is the Second General;'],
  s0020: ['the next, the Second Chancellor;', 'the next is the Second Chancellor;'],
  s0021: ['the upper star is the Chief Chancellor.', 'the uppermost star is the Chief Chancellor.'],
  s0022: ['The two southern stars are the sovereign\'s seat; the two northern stars are the consort\'s seat.', 'The southern pair marks the sovereign\'s place; the northern pair, the consort\'s.'],
  s0023: ['They also serve as the four outer markers; between them is the great road of the Celestial Crossroads, the Celestial Gate-tower, and the path the Yellow Path follows.', 'They also form the four outer markers; between them runs the Celestial Crossroads—the Celestial Gate-tower where the ecliptic passes.'],
  s0024: ['The southern gap is called the Solar Ring; south of it is the Great Yang.', 'The southern interval is the Solar Ring; beyond it lies Great Yang.'],
  s0025: ['The northern gap is called the Lunar Interval; north of it is Great Yin.', 'The northern interval is the Lunar Gap; beyond it lies Great Yin.'],
  s0026: ['When the seven luminaries travel by the Celestial Crossroads, the realm is at peace.', 'If the seven luminaries pass through the Celestial Crossroads, the realm enjoys peace.'],
  s0027: ['If they take the solar path, drought and mourning prevail; if the lunar path, flood and war.', 'The solar path brings drought and mourning; the lunar path, flood and war.'],
  s0028: ['It is also called the Celestial Team of Four and the Heavenly Horses, governing the royal carriage.', 'Also called the Celestial Team of Four and the Heavenly Horses, it governs the imperial chariot.'],
  s0029: ['The southern star is the Left Outrigger; next the Left Shaft-horse; next the Right Shaft-horse; next the Right Outrigger.', 'From south to north: Left Outrigger, Left Shaft-horse, Right Shaft-horse, Right Outrigger.'],
  s0030: ['It is also called the Celestial Stable and governs opening and closing—the source of livestock stores.', 'Also the Celestial Stable, it governs gates and stores—the source of livestock reserves.'],
  s0031: ['When Chamber\'s stars are bright, the king is enlightened.', 'Bright Chamber stars mean an enlightened sovereign.'],
  s0032: ['If the outrigger stars grow large, armies rise; if the stars scatter, the people disperse.', 'Large outrigger stars herald war; scattered stars, mass migration.'],
  s0033: ['Two small stars north of Chamber are called Hook and Lock—Chamber\'s bolt and key, Heaven\'s pipes and valves, governing closure and storage, locking the Heart of Heaven.', 'Two small stars north of Chamber are Hook and Lock—Chamber\'s bolt, Heaven\'s valve, governing sealed stores and locking the Heart of Heaven.'],
  s0034: ['When the king is filial, Hook and Lock are bright.', 'Filial kings make Hook and Lock shine bright.'],
  s0035: ['If they lie close to Chamber, the realm is united; if far, the realm is divided and the king\'s line ends.', 'Near Chamber, the realm stands united; far from it, the realm splits and the royal line fails.'],
  s0036: ['If stars appear between Chamber and Hook and Lock, or if they scatter, the earth quakes and the rivers run clear.', 'Stars between Chamber and Hook and Lock, or their scattering, mean earthquakes and rivers turning clear.'],
  s0037: ['Heart has three stars—the Celestial King\'s rightful seat.', 'Heart\'s three stars mark the Celestial King\'s rightful throne.'],
  s0038: ['The central star is called the Bright Hall, the Son of Heaven\'s seat and the Great Mark; it governs reward and punishment under Heaven.', 'The central star is the Bright Hall—the Son of Heaven\'s throne and Great Mark, governing reward and punishment throughout the realm.'],
  s0039: ['When the realm changes, Heart stars show auspicious signs.', 'When the realm shifts, Heart stars reveal omens.'],
  s0040: ['If the stars are bright and large, the realm is united; if dim, the ruler is obscured.', 'Bright, large stars mean unity; dim stars, a darkened sovereign.'],
  s0041: ['The front star is the Heir Apparent; if it is not bright, the Heir Apparent cannot succeed.', 'The front star is the Heir Apparent; if dim, he cannot inherit.'],
  s0042: ['The rear star is the secondary son; if bright, a secondary son will succeed.', 'The rear star is a secondary son; if bright, he will take the throne.'],
  s0043: ['If Heart stars turn black, great men face grief.', 'Black Heart stars bring sorrow to great men.'],
  s0044: ['If straight, the king loses power; if they move, the state faces urgent trouble; if the horns shake, there is war; if they scatter, the people flee.', 'Straight alignment means the king loses power; movement, urgent crisis; quivering horns, war; scattering, mass flight.'],
  s0045: ['Tail has nine stars—the inner precinct of the rear palace, the consorts\' residence.', 'Tail\'s nine stars form the rear palace precinct and the consorts\' quarters.'],
  s0046: ['The first star is the empress;', 'The first star is the empress;'],
  s0047: ['the next three are ladies;', 'the next three are noble ladies;'],
  s0048: ['the remaining stars are concubines.', 'the rest are concubines.'],
  s0049: ['Beside the third star is one called the Spirit Palace—the inner chamber where one removes garments.', 'Beside the third star lies the Spirit Palace, the inner chamber of disrobing.'],
  s0050: ['Tail also represents the nine sons.', 'Tail also images the nine sons.'],
  s0051: ['The stars should be evenly bright, large and small in proper succession—then the rear palace is ordered and there are many descendants.', 'Even brightness and orderly succession among the stars mean an ordered rear palace and many heirs.'],
  s0052: ['If the stars are faint, fine, and dim, the empress faces illness and grief.', 'Faint, fine, dim stars bring the empress illness and worry.'],
  s0053: ['If scattered and distant, the empress loses power.', 'Scattered, distant stars mean the empress loses influence.'],
  s0054: ['If they tremble, ruler and ministers are at odds and the realm falls into chaos.', 'Trembling stars mean discord between ruler and ministers and chaos in the realm.'],
  s0055: ['If they gather close, great floods come.', 'Gathering close foretells great floods.'],
  s0056: ['Winnowing Basket has four stars—also the rear palace of consorts and empresses.', 'Winnowing Basket\'s four stars also form the consorts\' and empresses\' rear palace.'],
  s0057: ['It is also called the Celestial Ford and, alternatively, the Celestial Cock.', 'Also called the Celestial Ford—or the Celestial Cock.'],
  s0058: ['It governs the eight winds: whenever sun or moon lodge in Winnowing Basket, Eastern Wall, Wings, or Chariot, wind rises.', 'It governs the eight winds: when sun or moon lodge in Winnowing Basket, Eastern Wall, Wings, or Chariot, wind rises.'],
  s0059: ['It also governs speech and debate, hosts and guests, barbarians and northern tribes—so when southern tribes stir, Winnowing Basket shows the sign first.', 'It also governs speech, diplomacy, and barbarian peoples—when southern tribes stir, Winnowing Basket signals first.'],
  s0060: ['If the stars are very bright and straight, grain ripens—with differences between inner and outer domains.', 'Very bright, straight stars mean ripe grain, with variation between center and periphery.'],
  s0061: ['If they gather close and grow faint, the realm faces grief.', 'Gathering faint stars bring national sorrow.'],
  s0062: ['If they move, barbarian envoys arrive.', 'Movement means envoys from barbarian lands.'],
  s0063: ['If they scatter and shift, the people move; within three days, great wind.', 'Scattering and shifting mean mass migration—and great wind within three days.'],
  s0064: ['The North: Southern Dipper has six stars—the Celestial Temple, the seat of the Chancellor and Grand Steward, governing praise of worthies and advancement of scholars, granting ranks and stipends, and also governing armies.', 'In the north, Southern Dipper\'s six stars form the Celestial Temple—the Chancellor and Grand Steward\'s seat—praising worthies, advancing scholars, granting ranks and stipends, and governing armies.'],
  s0065: ['It is also called the Celestial Mechanism.', 'Also called the Celestial Mechanism.'],
  s0066: ['The two southern stars are the Dipper Head and the Celestial Beam.', 'The two southern stars are the Dipper Head and Celestial Beam.'],
  s0067: ['The two central stars are the Celestial Minister.', 'The two central stars are the Celestial Minister.'],
  s0068: ['The two northern stars are the Dipper Handle and the Celestial Treasury court—also the span of the Son of Heaven\'s life.', 'The two northern stars are the Dipper Handle and Celestial Treasury court—also marking the Son of Heaven\'s lifespan.'],
  s0069: ['When affairs of the Son of Heaven are at hand, take omens from the Dipper.', 'When royal affairs loom, read omens in the Dipper.'],
  s0070: ['When Dipper stars flourish and are bright, the royal Way is peaceful and ranks and stipends are granted.', 'Flourishing, bright Dipper stars mean a peaceful royal Way and the granting of honors.'],
  s0071: ['If horned rays tremble and shift, the Son of Heaven grieves, armies rise, ministers are driven out.', 'Horned, trembling, shifting stars bring royal grief, war, and the expulsion of ministers.'],
  s0072: ['Ox-Driver has six stars—Heaven\'s barrier and bridge, governing sacrificial victims.', 'Ox-Driver\'s six stars are Heaven\'s barrier and bridge, governing sacrificial offerings.'],
  s0073: ['Two stars north of it: one is called Road\'s End; one is called Gathered Fire.', 'North of it are two stars: Road\'s End and Gathered Fire.'],
  s0074: ['It is also said: the upper star governs roads; the next two govern barriers and bridges; the last three govern Southern Yue.', 'Also: the upper star governs roads; the middle pair, barriers and bridges; the lower three, Southern Yue.'],
  s0075: ['If they tremble and change color, take omens from them.', 'Trembling and color change call for divination.'],
  s0076: ['If the stars are bright and large, the royal Way flourishes, barriers and bridges are open, and cattle are prized.', 'Bright, large stars mean a flourishing royal Way, open passes, and costly cattle.'],
  s0077: ['If angry, horses are prized.', 'Angry stars make horses costly.'],
  s0078: ['If not bright and abnormal, grain fails.', 'Dim, abnormal stars mean failed harvests.'],
  s0079: ['If fine, cattle are cheap.', 'Fine stars mean cheap cattle.'],
  s0080: ['If the central star shifts up or down, many cattle die.', 'If the central star shifts vertically, many cattle die.'],
  s0081: ['If small stars vanish, cattle suffer plague.', 'Vanishing small stars bring cattle plague.'],
  s0082: ['It is also said: when Ox-Driver stars move, cattle suffer disaster.', 'Also: moving Ox-Driver stars bring cattle calamity.'],
  s0083: ['Weaving Maid has four stars—the Celestial Minor Treasury.', 'Weaving Maid\'s four stars form the Celestial Minor Treasury.'],
  s0084: ['Weaving Maid is the title of a lowly concubine—the humblest of women\'s duties—governing cloth, cutting garments, and marriage.', 'Weaving Maid names a humble concubine—the lowest women\'s office—governing cloth, tailoring, and marriage.'],
  s0085: ['If the stars are bright, the realm is abundant, women\'s work flourishes, and the state is rich.', 'Bright stars mean abundance, flourishing women\'s crafts, and national wealth.'],
  s0086: ['If small and dim, the state\'s stores are empty.', 'Small, dim stars mean empty treasuries.'],
  s0087: ['If they move, there are marriages, disbursements, and garment-cutting affairs.', 'Movement brings marriages, disbursements, and tailoring.'],
  s0088: ['Emptiness has two stars—the office of the Grand Minister.', 'Emptiness\'s two stars are the Grand Minister\'s office.'],
  s0089: ['It governs the north, settlements and temples, regular sacrifices and prayers, and also death, mourning, and weeping.', 'It governs the north, towns and temples, regular sacrifice and prayer, and also death, mourning, and lament.'],
  s0090: ['Rooftop has three stars—governing the Celestial Treasury, the Celestial Storehouse, and building frames; other omens follow Emptiness.', 'Rooftop\'s three stars govern the Celestial Treasury, Celestial Storehouse, and roof frames; other omens follow Emptiness.'],
  s0091: ['If the stars are not bright, guests face execution.', 'Dim stars mean guests will be executed.'],
  s0092: ['If they move, the king builds palaces and there is earthwork.', 'Movement means palace construction and earthworks.'],
  s0093: ['Tomb Mound has four stars beneath Rooftop—governing death, mourning, and weeping; they are the burial mounds.', 'Tomb Mound\'s four stars below Rooftop govern death, mourning, and weeping—they are the graves.'],
  s0094: ['If the stars are not bright, drought spreads under Heaven.', 'Dim stars bring drought throughout the realm.'],
  s0095: ['If they move, there is mourning.', 'Movement brings mourning.'],
  s0096: ['Encampment has two stars—the Son of Heaven\'s palace.', 'Encampment\'s two stars form the Son of Heaven\'s palace.'],
  s0097: ['One is called the Dark Palace; one the Pure Temple; it is also the storehouse of army grain and earthwork affairs.', 'One is the Dark Palace; one the Pure Temple; it also holds army grain and governs earthworks.'],
  s0098: ['If the stars are bright, the state flourishes; if small and not bright, sacrifices to ghosts and spirits go unaccepted and the state suffers much illness.', 'Bright stars mean a flourishing state; small, dim stars mean rejected sacrifices and widespread disease.'],
  s0099: ['If they move, there is earthwork and armies go into the field.', 'Movement brings earthworks and armies in the field.'],
  s0100: ['Detached Palace has six stars—the Son of Heaven\'s secondary palace, governing hidden places of rest and repose.', 'Detached Palace\'s six stars are the Son of Heaven\'s retreat, governing hidden places of rest.'],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-020-batch1.mjs <translation.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
