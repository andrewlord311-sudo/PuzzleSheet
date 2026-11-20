// ---- A big general-knowledge word list for the grown-ups' crossword (word - clue) ----
// Mixes plain definitions with a few trickier ones. Words are 3 to 9 letters so they cross well.
'use strict';
PS.CLUES_CROSS = `
ARIA - Operatic solo
ERA - Age or epoch
OPAL - Gem with shifting colours
IRON - Press for the creases, or a metal
TEA - Brew for a cuppa
RATE - Speed, or to assess
STAR - Twinkler overhead, or a celebrity
SEA - The briny
EAST - Direction of sunrise
OATS - Porridge grain
ORE - Mined rock containing metal
TREE - Oak or elm
SNOW - Flurries in winter
NOTE - A minim, say, or a brief message
TONE - Shade or sound quality
LEMON - Sour fruit, or a dud car
RIVER - Flows to the sea
ELBOW - Bend in the arm
STONE - Fourteen pounds
TIGER - Big cat with stripes
PIANO - Eighty-eight keys
OCEAN - Pacific, perhaps
TRAIN - Locomotive and carriages
ROAST - Sunday joint
ANGEL - Winged messenger
STORM - Tempest
RAISIN - Dried grape
SALAD - Mixed leaves, perhaps
LATTE - Milky coffee
MUSEUM - Home of exhibits
GARDEN - Eden, for example
SAILOR - Tar
ORANGE - Citrus fruit
SILVER - Second-place medal
ARMADA - Spanish fleet of 1588
CABERNET - Red grape variety
NOCTURNE - Chopin night piece
SONATA - Multi-movement instrumental work
MONET - Painter of water lilies
TURNER - Painter of the Fighting Temeraire
AUSTEN - Author of Emma
DICKENS - Author of Bleak House
ORWELL - Author of Animal Farm
HARDY - Wessex novelist
TOLSTOY - Author of War and Peace
SATIRE - Mockery in the form of art
IRONY - Words meaning the opposite of what is said
ESSAY - Short piece of non-fiction
POET - Versifier
VERSE - Stanza
RHYME - Chime at the end of lines
EPIC - Grand and heroic poem, or film
FABLE - Moral tale
LEGEND - Famous story from the past
MYTH - Ancient story of gods and heroes
SAGA - Long Norse tale
NOVEL - Book-length story, or new
PROSE - Writing that isn't verse
PLOT - Story line, or a patch of land
CAST - Actors in a play
SCENE - Part of an act
STAGE - Where actors tread the boards
DRAMA - Theatre, or fuss
TENOR - High male voice
BASS - Deepest voice
ALTO - Low female voice
CHOIR - Church singers
OPERA - Carmen or Tosca
CELLO - Large string instrument held between the knees
VIOLIN - Strad, perhaps
FLUTE - Woodwind with no reed
OBOE - Double-reed instrument
HARP - Instrument with strings, played by plucking
DRUM - Beaten instrument
TEMPO - Speed of the music
CHORD - Notes played together
SCALE - Do-re-mi sequence, or fish covering
CLEF - Sign at the start of a stave
MAJOR - Cheerful key, or army rank
MINOR - Sad key, or under age
WALTZ - Dance in three-four time
TANGO - Dance from Argentina
BALLET - Swan Lake, for one
JAZZ - Music of Louis Armstrong
BLUES - Music of sadness
ROCK - Stone, or music with a heavy beat
FOLK - Traditional music
SWING - Big band style, or playground fixture
PARIS - City of Light
ROME - Eternal City
LIMA - Capital of Peru
OSLO - Capital of Norway
BERN - Swiss capital
KIEV - Ukrainian capital, older spelling
DELHI - Indian capital
CAIRO - Capital on the Nile
ATHENS - Capital beneath the Acropolis
LISBON - Portuguese capital
MADRID - Spanish capital
VIENNA - City of Mozart and Strauss
BERLIN - German capital
PRAGUE - Czech capital
WARSAW - Polish capital
TOKYO - Japanese capital
SEOUL - South Korean capital
DUBLIN - Irish capital
LONDON - Capital on the Thames
ITALY - Boot-shaped country
SPAIN - Iberian country with Madrid
CHINA - Country of the Great Wall
INDIA - Land of the Taj Mahal
PERU - Land of the Incas
CHILE - Long thin South American country
CUBA - Caribbean island with Havana
EGYPT - Land of the pharaohs
KENYA - Nairobi's country
GHANA - West African country, capital Accra
NEPAL - Himalayan kingdom, now a republic
JAPAN - Land of the rising sun
IRAN - Country formerly Persia
IRAQ - Country between Iran and Syria
SYRIA - Damascus is its capital
TURKEY - Country, or a Christmas bird
GREECE - Country of the Parthenon
NORWAY - Fjord country
SWEDEN - Home of Abba
FRANCE - Hexagonal country
BRAZIL - Samba nation
CANADA - Maple leaf country
MEXICO - Country south of the Rio Grande
NILE - Longest river in Africa
THAMES - London's river
SEINE - Paris river
RHINE - River through Germany
DANUBE - Blue river of the waltz
VOLGA - Longest river in Europe
AMAZON - Mighty South American river
ANDES - Longest mountain chain on land
ALPS - Mont Blanc's range
ETNA - Sicilian volcano
EVEREST - Highest peak
SAHARA - Great desert
GOBI - Asian desert
ARCTIC - Region around the North Pole
ISLAND - Land surrounded by water
DELTA - River mouth, or Greek letter
ATOLL - Ring-shaped coral island
FJORD - Norwegian inlet
GEYSER - Hot spring that erupts
LAVA - Molten rock
TIDE - Ebb or flow
OASIS - Desert watering hole
DUNE - Sandy ridge
REEF - Coral ridge
CAPE - Headland, or a hero's garment
BAY - Wide curved inlet, or a laurel
TURIN - Italian city with a famous shroud
NAPLES - Pizza's birthplace
VENICE - Floating city
MILAN - Fashion capital of Italy
ROMEO - Juliet's lover
JULIET - Romeo's love
HAMLET - Prince of Denmark
OTHELLO - Moor of Venice
MACBETH - Thane of Glamis
LEAR - Shakespeare's mad king
PUCK - Midsummer night sprite
PROSPERO - Magician on an island in The Tempest
FALSTAFF - Fat knight in Henry IV
OBERON - Fairy king
TITANIA - Fairy queen
HOMER - Greek epic poet, or Simpson
ODYSSEY - Long, eventful journey
ILIAD - Epic about Troy
ZEUS - King of the Greek gods
HERA - Zeus's wife
ATHENA - Goddess of wisdom
APOLLO - God of the sun and music
VENUS - Goddess of love, or a planet
MARS - Red planet
JUPITER - Largest planet
SATURN - Ringed planet
NEPTUNE - Planet beyond Uranus
URANUS - Seventh planet
MERCURY - Closest planet to the Sun
PLUTO - Dwarf planet
COMET - Visitor with a tail
ORBIT - Path round a star
MOON - Earth's satellite
SOLAR - Of the Sun
LUNAR - Of the Moon
ECLIPSE - Shadow of the Moon or Earth
GALAXY - Milky Way, for one
COSMOS - The universe
NEBULA - Cloud of gas and dust in space
QUASAR - Remote, brilliant object in space
ATOM - Basic unit of an element
PROTON - Positive particle
NEUTRON - Neutral particle
ELECTRON - Negative particle
ENERGY - Capacity to do work
FORCE - Push or pull
GRAVITY - What keeps your feet on the ground
LIGHT - Not heavy, or what a lamp gives
SOUND - What an echo reflects
HEAT - Warmth
LASER - Intense beam of light
MAGNET - Attracts iron
PRISM - Splits white light
LENS - Curved glass in a camera
ACID - Sour chemical, or biting remark
ALKALI - Base that dissolves in water
CARBON - Element in diamonds
OXYGEN - Gas we breathe
HELIUM - Light gas for balloons
NEON - Gas in glowing signs
ARGON - Inert gas
IRON - Metal in the Eiffel Tower
ZINC - Galvanising metal
TIN - Cans are made of it
GOLD - Au
LEAD - Heavy metal, or to guide
COPPER - Cu, or a police officer
STEEL - Hard alloy
BRONZE - Third-place medal
CELL - Smallest unit of life, or a prison room
GENE - Inherited unit
DNA - Double helix
FOSSIL - Ancient imprint in rock
BONE - Skeleton part
SKULL - Head's protector
SPINE - Backbone
HEART - Pump in the chest
LUNG - Breathing organ
LIVER - Organ that filters blood
BRAIN - Organ for thinking
NERVE - Impulse carrier, or cheek
VEIN - Blood vessel back to the heart
ARTERY - Blood vessel from the heart
OTTER - River swimmer
BADGER - Striped woodland animal, or to pester
FOX - Cunning hunter
HARE - Fast field runner
DEER - Stag or doe
WOLF - Pack hunter
BEAR - Grizzly, or to carry
EAGLE - Bird with sharp talons
OWL - Night hunter that hoots
RAVEN - Large black bird
SWAN - Graceful bird, once seen on Avon
HERON - Wading bird
FALCON - Swift hunter of the air
ROBIN - Red-breasted bird
WREN - Tiny brown bird
DOVE - Symbol of peace
CRANE - Tall wading bird, or a lifting machine
SEAL - Pup is its young, or to close tightly
WHALE - Largest mammal
SHARK - Fish with fins that circle
SALMON - Fish that leaps upstream
TROUT - Fish caught by fly
EEL - Slippery fish
OYSTER - Pearl maker
CRAB - Sideways walker
LOBSTER - Red when boiled
SNAIL - Slow shelled creature
BEE - Honey maker
WASP - Stinging insect in stripes
MOTH - Night flyer drawn to light
ANT - Colony worker
SPIDER - Web spinner
ROSE - Flower with thorns, or got up
LILY - Flower that is white at Easter
IRIS - Flower, or part of the eye
TULIP - Spring bulb from Holland
DAISY - Lawn flower
ORCHID - Exotic bloom
LILAC - Purple spring bush
IVY - Climbing evergreen
FERN - Frond plant
MOSS - Soft green carpet
OAK - Acorn grower
ELM - Tree hit by a Dutch disease
ASH - Tree, or bonfire residue
PINE - Evergreen, or to yearn
BIRCH - Silver-barked tree
WILLOW - Weeping tree
MAPLE - Canadian tree
CEDAR - Fragrant softwood
BASIL - Pesto herb
THYME - Herb that sounds like time
SAGE - Wise one, or a herb
MINT - Cool herb, or where coins are made
DILL - Pickling herb
PEPPER - Hot spice
SALT - Seasoning, or sailor
SUGAR - Sweetener
HONEY - Bees' product
BREAD - Loaf
BUTTER - Spread
CHEESE - Edam or Brie
CREAM - Top of the milk
EGG - Omelette ingredient
OLIVE - Martini garnish
GRAPE - Wine fruit
PEACH - Fuzzy stone fruit
PEAR - Fruit with a stalk and curves
PLUM - Purple fruit
FIG - Fruit of Mediterranean trees
DATE - Sweet fruit, or a day in the calendar
APPLE - Newton's fruit
MANGO - Tropical stone fruit
MELON - Large juicy fruit
BERRY - Small fruit
WINE - Red or white drink
BEER - Pint, perhaps
CIDER - Drink from apples
PORT - Fortified wine, or harbour
SHERRY - Fortified wine from Jerez
BRANDY - Spirit from wine
WHISKY - Scotch, for one
STOUT - Dark beer, or plump
SOUP - Starter in a bowl
STEW - Slow-cooked dish
PIE - Pastry-topped dish
CURRY - Spicy dish
PASTA - Italian staple
PIZZA - Neapolitan dish
RICE - Paddy crop
SUSHI - Japanese raw fish dish
TACO - Mexican folded snack
CHILLI - Fiery pepper
GINGER - Spicy root
NUTMEG - Spice grated on custard
CLOVE - Spice, or part of a garlic bulb
VANILLA - Ice cream flavour
CARAMEL - Burnt sugar
TOAST - Browned bread, or a drink to the bride
BACON - Rasher, or Francis the painter
KETTLE - Boils water
OVEN - Roasting space
SPOON - Stirring tool
FORK - Prong for peas
KNIFE - Cutting tool
PLATE - Dinner dish
MUG - Tea holder
CLOCK - Timepiece
WATCH - Wrist timepiece, or to observe
LAMP - Light on a table
CANDLE - Wax light
MIRROR - Reflector
CARPET - Floor covering
CURTAIN - Window covering
SOFA - Settee
CHAIR - Seat with a back
TABLE - Dining furniture
BED - Place to sleep
DESK - Writing furniture
SHELF - Book support
CLOSET - Wardrobe
ATTIC - Roof room
CELLAR - Wine store below ground
GARAGE - Car's home
PORCH - Covered entrance
DOOR - Hinged entrance
WINDOW - Pane of glass in a wall
ROOF - Tiled top
WALL - Brick barrier
FENCE - Garden boundary
GATE - Entrance in a hedge
BRIDGE - Spans a river, or a card game
TOWER - Tall structure
CASTLE - Fortress
PALACE - Royal home
TEMPLE - Place of worship, or side of the head
ABBEY - Monks' home
CHURCH - Place of worship
CHAPEL - Small place of worship
SPIRE - Pointed top of a church tower
HARBOUR - Port for ships
ANCHOR - Keeps a boat in place
SAIL - Wind catcher on a boat
MAST - Pole for the sails
DECK - Ship floor, or to adorn
HULL - Body of a ship
CABIN - Small shelter, or a ship's room
YACHT - Racing sailboat
FERRY - Boat taking cars across water
RAFT - Simple floating platform
CANOE - Paddled boat
TRAM - Street car on rails
BUS - Double-decker, perhaps
TAXI - Cab
LORRY - Heavy goods vehicle
TRACTOR - Farm vehicle
ENGINE - Motor
WHEEL - Round turner
BRAKE - Stopping device
PEDAL - Cyclist's foot rest
SADDLE - Rider's seat
HELMET - Head protection
GLOVE - Hand cover
SCARF - Neck wrap
JACKET - Short coat
SHIRT - Collared top
SKIRT - Garment from waist to knee
BOOT - Wellington, perhaps
SANDAL - Open shoe
BUTTON - Fastener, or a bear's eye
ZIP - Fastener that closes with a pull
SILK - Fabric from worms
WOOL - Fleece
LINEN - Fabric from flax
COTTON - Fabric from a plant
VELVET - Soft pile fabric
LACE - Delicate openwork fabric, or to tie shoes
TWEED - Scottish woollen cloth
DENIM - Jeans fabric
EARL - Nobleman
DUKE - Nobleman above a marquess
KING - Monarch
QUEEN - Female monarch
PRINCE - Heir, perhaps
KNIGHT - Sir Lancelot, say
PAWN - Chess piece of least value, or to hock
BISHOP - Chess piece moving diagonally
ROOK - Castle in chess, or a crow
CHESS - Game of kings
CARDS - Pack for bridge
DICE - Gambler's cubes
LUDO - Board game with counters
DOMINO - Tile in a game
RIDDLE - Puzzling question
CLUE - Hint in a crossword
CODE - Cipher
CIPHER - Secret writing
MAZE - Labyrinth
SPY - Secret agent
AGENT - Representative, or 007
THIEF - Burglar
JUDGE - Court official
JURY - Twelve in the dock's audience
TRIAL - Court hearing, or a test
CRIME - Offence against the law
ALIBI - Excuse placing you elsewhere
MOTIVE - Reason for a crime
WITNESS - One who saw it happen
VERDICT - Court's decision
LAW - Statute
TAX - Government levy
BUDGET - Chancellor's statement, or cheap
BANK - River side, or where money's kept
COIN - Piece of money
NOTES - Paper money
CASH - Ready money
DEBT - What is owed
PROFIT - Gain
LOSS - Opposite of gain
TRADE - Business exchange
MARKET - Place for buying and selling
SHOP - Retail outlet
STORE - Keep, or a shop
EARN - Make money
SPEND - Use money
SAVE - Put by, or rescue
RICH - Wealthy
POOR - Needy
KIND - Generous
BRAVE - Courageous
CALM - Peaceful
WISE - Sensible
SHARP - Pointed, or a musical note raised
SWEET - Sugary
SOUR - Tart
BITTER - Acrid in taste
SALTY - Briny
SPICY - Hot to taste
SILENT - Making no sound
NOISY - Loud
QUIET - Hushed
GENTLE - Soft and kind
FIERCE - Savage
HUMBLE - Modest
PROUD - Pleased with oneself
HAPPY - Glad
ANGRY - Cross
GRIEF - Deep sorrow
JOY - Delight
HOPE - Optimism
FEAR - Dread
TRUST - Faith
HONOUR - Respect
GLORY - Fame
MERCY - Compassion
PEACE - Absence of war
WAR - Conflict
BATTLE - Fight between armies
SWORD - Blade
SHIELD - Defence in battle
ARROW - Shot from a bow
SPEAR - Pointed weapon for throwing
ARMY - Military force
NAVY - Fleet
FLEET - Group of ships, or swift
RAID - Sudden attack
TRUCE - Pause in fighting
TREATY - Formal agreement between nations
EMPIRE - Rome, once
REBEL - One who fights authority
TYRANT - Cruel ruler
CROWN - Royal headgear
THRONE - Royal seat
REIGN - Period of rule
ELECT - Choose by vote
VOTE - Cast a ballot
PARTY - Political group, or a celebration
MAYOR - Town's head
SENATE - Roman council
PEER - Equal, or noble
CHEF - Head of the kitchen
NURSE - Hospital carer
DOCTOR - GP
PILOT - Aircraft flier
BAKER - Bread maker
FARMER - Tiller of the soil
MINER - Digger underground
ARTIST - Painter, perhaps
POTTER - Clay shaper, or Harry
TAILOR - Suit maker
JEWELLER - Maker of rings
CARPENTER - Woodworker
SCULPTOR - Maker of statues
LIBRARY - Place for borrowing books
SCHOOL - Place of learning
LESSON - Class period
EXAM - Test
GRADE - Mark
PEN - Writing tool
INK - Fluid for the pen
PAPER - Sheet for writing
PENCIL - Lead holder
BOOK - Volume
PAGE - Leaf of a book, or a boy attendant
CHAPTER - Section of a book
TITLE - Name of a book
SPELL - Magic charm, or to write letter by letter
WORD - Unit of language
ALPHABET - A to Z
GRAMMAR - Rules of language
VERB - Doing word
NOUN - Naming word
TENSE - Past, present or future, or taut
PHRASE - Group of words
IDIOM - Expression like raining cats and dogs
SLANG - Informal language
ACCENT - Regional way of speaking
DIALECT - Local variety of a language
SIGN - Notice, or to autograph
SYMBOL - Sign standing for something
EMBLEM - Badge
FLAG - Banner
BADGE - Pin-on emblem
MEDAL - Award for the brave
TROPHY - Cup won
PRIZE - Award
RACE - Sprint, or ethnic group
SPRINT - Short fast race
RELAY - Race with a baton
HURDLE - Barrier in a race
MARATHON - Long-distance run
GOLF - Game with birdies and bogeys
TENNIS - Game with a net and love
CRICKET - Game with wickets, or an insect
RUGBY - Game with a scrum
POLO - Game on horseback
FENCING - Sport with foils
ROWING - Sport on a river with oars
ARCHERY - Sport with a bow
BOXING - Sport in a ring
SKIING - Sport on snow
SURFING - Riding waves
DIVING - Plunging into the water
CAMEL - Desert ship
DONKEY - Eeyore, for one
HORSE - Rider's mount
PONY - Small mount
STAG - Male deer
BULL - Male cow
LAMB - Young sheep
CALF - Young cow, or a leg muscle
FOAL - Young horse
KID - Young goat
CUB - Young bear
PUPPY - Young dog
KITTEN - Young cat
GOOSE - Waddling bird
DUCK - Bird that quacks, or to avoid
PIGEON - Town bird
PARROT - Bird that mimics
`.trim().split('\n').map(l => l.split(' - ')).filter(p => p.length === 2).reduce((acc, [w, c]) => { const W = w.trim().toUpperCase(); if (/^[A-Z]{3,9}$/.test(W) && !acc.seen.has(W)) { acc.seen.add(W); acc.list.push([W, c.trim()]); } return acc; }, { seen: new Set(), list: [] }).list;
