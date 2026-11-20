// ---- The grown-ups' edition: word banks, and bigger versions of the games from the other editions ----
'use strict';
// Clues for a general-knowledge reader. Crossword (several themes mixed) and Anagrams use these.
PS.CLUES_ADULT = {
  'Around the world': [
    ['PARIS', 'French capital on the Seine'], ['LISBON', 'Capital of Portugal'], ['SAHARA', 'The world’s largest hot desert'], ['NILE', 'River that flows through Cairo'],
    ['ANDES', 'South American mountain range'], ['TOKYO', 'Japan’s capital'], ['VENICE', 'Italian city of canals'], ['DANUBE', 'River through Vienna and Budapest'],
    ['ATLANTIC', 'Ocean between Europe and America'], ['ICELAND', 'Island nation of geysers and volcanoes'], ['KENYA', 'East African country famous for safaris'],
    ['NORWAY', 'Land of the fjords'], ['MADRID', 'Spain’s capital'], ['SYDNEY', 'Australia’s largest city'], ['ALPS', 'Mountain range including Mont Blanc'],
    ['AMAZON', 'Giant South American rainforest and river'], ['EVEREST', 'The highest mountain above sea level'], ['DUBLIN', 'Capital of Ireland'],
    ['CAIRO', 'Egyptian capital near the pyramids'], ['GREECE', 'Birthplace of the Olympic Games'], ['VIENNA', 'Austrian capital of waltzes'], ['MOROCCO', 'North African country with Marrakech'],
  ],
  'Food and drink': [
    ['BASIL', 'Herb that goes with tomato and mozzarella'], ['SAFFRON', 'Costly spice from crocus flowers'], ['PAELLA', 'Spanish rice dish with seafood'],
    ['CROISSANT', 'Flaky French breakfast pastry'], ['RISOTTO', 'Creamy Italian rice dish'], ['NUTMEG', 'Spice grated over custard tarts'],
    ['VINEGAR', 'Sour liquid made from wine or malt'], ['MANGO', 'Sweet tropical fruit with a large stone'], ['CHUTNEY', 'Spicy fruit relish eaten with cheese'],
    ['TRUFFLE', 'Prized fungus hunted by dogs'], ['SOURDOUGH', 'Tangy bread raised with a starter'], ['WASABI', 'Hot green paste served with sushi'],
    ['CUSTARD', 'Yellow sauce for apple crumble'], ['ESPRESSO', 'Strong small shot of coffee'], ['GINGER', 'Root with a hot, zingy flavour'],
    ['MUSSELS', 'Shellfish often steamed in white wine'], ['PRALINE', 'Sugar-coated nut sweet'], ['OLIVE', 'Salty fruit pressed for oil'], ['FONDUE', 'Swiss pot of melted cheese'],
    ['SALSA', 'Spicy tomato dip'], ['MERINGUE', 'Crisp baked egg-white and sugar'], ['PESTO', 'Green Genoese sauce of basil and pine nuts'],
  ],
  'Nature and science': [
    ['PLANET', 'Venus or Mars'], ['GALAXY', 'The Milky Way is one'], ['ECLIPSE', 'When the Moon hides the Sun'], ['GRAVITY', 'Force that keeps our feet on the ground'],
    ['COMET', 'Icy visitor with a glowing tail'], ['ATOM', 'Smallest unit of an element'], ['MAGNET', 'It attracts iron'], ['PRISM', 'Glass shape that splits light into colours'],
    ['TELESCOPE', 'Used to see distant stars'], ['FOSSIL', 'Ancient remains in rock'], ['GLACIER', 'A slow river of ice'], ['VOLCANO', 'Mountain that erupts'],
    ['MONSOON', 'Season of heavy Asian rains'], ['LAGOON', 'Shallow sea water behind a reef'], ['ORCHID', 'Delicate, showy flower'], ['LAVENDER', 'Purple plant with a soothing scent'],
    ['WILLOW', 'Weeping tree beside a river'], ['HEDGEHOG', 'Spiky garden visitor'], ['OTTER', 'Playful swimmer'], ['BADGER', 'Striped woodland animal that lives in a sett'],
    ['FALCON', 'Bird of prey that dives at great speed'], ['PENGUIN', 'Flightless bird of the Antarctic'], ['KANGAROO', 'Animal that hops and carries a joey'], ['CHAMELEON', 'Lizard that changes colour'],
  ],
  'Arts and ideas': [
    ['SONNET', 'Fourteen-line poem'], ['MELODY', 'The tune of a song'], ['CANVAS', 'A painter’s surface'], ['EASEL', 'Stand that holds a painting'], ['PALETTE', 'Artist’s board for mixing paints'],
    ['SYMPHONY', 'Long orchestral work'], ['ORCHESTRA', 'Large group of musicians'], ['OPERA', 'Drama that is sung'], ['NOVELIST', 'Writer of long stories'], ['LIBRARY', 'Place full of borrowed books'],
    ['SCULPTOR', 'Carves statues'], ['CHORUS', 'The part everyone joins in with'], ['THEATRE', 'Where plays are staged'], ['ENCORE', 'One more song, please!'], ['DIARY', 'Daily private record'],
    ['PHILOSOPHY', 'Love of wisdom'], ['MEMOIR', 'Life story written by the person themself'], ['RHYTHM', 'Pattern of beats'], ['HARMONY', 'Notes sounding pleasantly together'], ['POTTERY', 'Clay made into bowls and vases'],
  ],
  'Everyday things': [
    ['ANCHOR', 'Heavy hook that holds a ship still'], ['LANTERN', 'Portable light with a glass case'], ['COMPASS', 'Needle that points north'], ['HAMMOCK', 'Hanging bed slung between trees'],
    ['BLANKET', 'Warm cover for a bed'], ['KETTLE', 'Boils water for tea'], ['CHIMNEY', 'Smoke leaves the house through it'], ['VELVET', 'Soft, plush fabric'], ['MARATHON', '26-mile race'],
    ['SCARF', 'Warm wrap for your neck'], ['BICYCLE', 'Two wheels and pedals'], ['LIGHTHOUSE', 'Tower with a warning beam for ships'], ['UMBRELLA', 'Opens against the rain'],
    ['BALCONY', 'Platform sticking out of an upper floor'], ['PUZZLE', 'What you are doing right now'], ['CHAMPION', 'Winner of the whole contest'], ['TREASURE', 'Pirates bury it'],
    ['MIRROR', 'You see yourself in it'], ['ATTIC', 'Room under the roof'], ['CANDLE', 'Wax and a wick'], ['SUITCASE', 'Packed for a holiday'], ['GARDENER', 'Looks after the borders and lawn'],
  ],
};

// Bigger or harder versions of puzzles the children's editions also have.
(function () {
  const alias = (id, base, over, params) => {
    PS.PUZZLES[id] = Object.assign({}, PS.PUZZLES[base], over, { render: (el, ctx) => PS.PUZZLES[base].render(el, Object.assign({}, ctx, { adult: true }, params(ctx.level))) });
  };
  alias('queensA', 'queens', { name: 'Crown Garden', icon: '♛', colour: '#e8438f', host: 'butterscotch', intro: 'One crown in every row, every column and every colour. No two may touch, not even diagonally.' },
    lv => ({ size: [6, 7, 8][lv - 1], symbol: '♛', word: 'crown' }));
  alias('zipA', 'zip', { name: 'Zip Trail', icon: '🧵', colour: '#2f8cff', host: 'dreamy', intro: 'Join the numbers in order with a single path that visits every square.' },
    lv => ({ size: [6, 7, 8][lv - 1], marks: [7, 8, 9][lv - 1] }));
  alias('tangoA', 'tango', { name: 'Sun and Moon', colour: '#f5a300', host: 'melody' },
    lv => ({ size: lv === 1 ? 6 : 8, extra: lv === 1 ? 8 : lv === 2 ? 4 : 0 }));
  alias('crosswordA', 'crossword', { name: 'Crossword', icon: '✏️', colour: '#ff8a1f', host: 'barnaby', intro: 'Read each clue and fill in the word. Tap a square, then type!' },
    lv => ({ want: [14, 20, 26][lv - 1] }));
  alias('scrambleA', 'scramble', { name: 'Anagrams', icon: '🔀', colour: '#8f5cff', host: 'barnaby', intro: 'The letters are jumbled. Work out the word from the clue.' },
    lv => ({ want: [5, 6, 7][lv - 1], span: [[5, 7], [6, 8], [7, 10]][lv - 1] }));
})();
