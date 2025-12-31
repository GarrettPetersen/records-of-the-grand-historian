const fs = require('fs');
const data = JSON.parse(fs.readFileSync('translations/current_translation_houhanshu.json', 'utf8'));

// Professional translations for batch 7
data.sentences[0].literal = 'Mencius said: "Xia fifty and tribute, Yin seventy and assistance, Zhou hundred mu and interchange, their substance all ten one also."';
data.sentences[0].idiomatic = 'Mencius said: "The Xia levied tribute on fifty-acre plots, the Yin provided assistance on seventy-acre plots, the Zhou alternated on hundred-acre plots—their substance was all one-tenth."';

data.sentences[1].literal = ') Now military officers farm fields, grain stores somewhat accumulated.';
data.sentences[1].idiomatic = ') Now the military officers cultivate fields, and grain stores have accumulated somewhat.';

data.sentences[2].literal = '(Wu Emperor initially opened the Western Regions, began establishing commandants to farm fields.';
data.sentences[2].idiomatic = '(Emperor Wu initially opened relations with the Western Regions and began establishing commandants to cultivate fields.';

data.sentences[3].literal = ') Order the commanderies and kingdoms to collect visible field rent thirty tax one, like old system.';
data.sentences[3].idiomatic = ') Order the commanderies and kingdoms to collect field rent at a rate of one-thirtieth, according to the old system.';

data.sentences[4].literal = '(Jing Emperor second year, caused people field rent thirty and tax one, now follow Jing Emperor, therefore say "old system".';
data.sentences[4].idiomatic = '(In the second year of Emperor Jing\\'s reign, the field rent was set at thirty parts with one part tax; now following Emperor Jing, therefore called the "old system".';

data.sentences[5].literal = ')';
data.sentences[5].idiomatic = ')';

data.sentences[6].literal = 'Wei Xiao sent general Xing Xun invade Fufeng, (Xing, surname;';
data.sentences[6].idiomatic = 'Wei Xiao sent his general Xing Xun to invade Fufeng. (Xing is the surname;';

data.sentences[7].literal = 'Xun, name.';
data.sentences[7].idiomatic = 'Xun is the given name.';

data.sentences[8].literal = 'Han has Xing You, served as chancellor of Zhao, see Fengsu Tong.';
data.sentences[8].idiomatic = 'The Han dynasty had a Xing You who served as chancellor of Zhao; see the Fengsu Tong.';

data.sentences[9].literal = ') Western Expedition Grand General Feng Yi resisted and defeated him.';
data.sentences[9].idiomatic = ') Western Expedition Grand General Feng Yi resisted and defeated them.';

data.sentences[10].literal = 'This year, initially abolished commandery and kingdom commandants offices.';
data.sentences[10].idiomatic = 'This year, the offices of commandery and kingdom commandants were initially abolished.';

data.sentences[11].literal = 'Began sending marquises to their fiefs.';
data.sentences[11].idiomatic = 'Began dispatching the marquises to their feudal territories.';

data.sentences[12].literal = 'Xiongnu sent envoys to offer tribute, sent Colonel to report the command.';
data.sentences[12].idiomatic = 'The Xiongnu sent envoys to offer tribute; sent a Colonel to convey the imperial response.';

data.sentences[13].literal = '(Han Guan Yi says: "Make Xiongnu Colonel, holds tally, rank compares to two thousand bushels."';
data.sentences[13].idiomatic = '(The Han Guan Yi says: "The Colonel for Xiongnu Affairs holds a tally and has a rank equivalent to two thousand bushels."';

data.sentences[14].literal = 'Xiongnu Biography says: "Ordered Colonel Han Tong report the command, bestowed gold coins."';
data.sentences[14].idiomatic = 'The Xiongnu Biography states: "Ordered Colonel Han Tong to convey the command and bestowed gold coins as gifts."';

fs.writeFileSync('translations/current_translation_houhanshu.json', JSON.stringify(data, null, 2));
console.log('✅ Translated all 15 sentences in batch 7');
