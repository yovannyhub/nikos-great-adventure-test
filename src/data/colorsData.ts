import { ColorInfo, ColorKey } from '../types/game';

export interface ChallengeItem {
  id: string;
  name: string;
  colorKey: ColorKey;
  hex: string;
  emoji: string;
  isTarget: boolean;
  shapeSymbol: string;
  spokenHint: string;
}

export interface ColorChallengeData {
  stationTitle: string;
  stage1Prompt: string;
  stage1Items: ChallengeItem[];
  stage2Prompt: string;
  mixingColors?: { from1: string; from2: string; result: string };
  funFact: string;
  jessicaVoiceNote: string;
  barnabyVoiceNote: string;
}

export const FOREST_COLORS: Record<ColorKey, ColorInfo> = {
  red: {
    key: 'red',
    name: 'Red',
    hex: '#ef4444',
    lightHex: '#fee2e2',
    symbol: '★',
    symbolName: 'Star',
    floraName: 'Ruby Rose Blooms & Scarlet Berries',
    stationName: 'The Faded Meadow',
    location: { x: 22, y: 35 },
    description: 'A cozy clearing where ruby red berries and sweet wild roses once shone like jewels.',
    prompt: 'Can you help Niko spot all the radiant RED items to wake up the Ruby Blossom?',
    hint: 'Look for things that are as bright and warm as a sweet ripe strawberry!',
  },
  blue: {
    key: 'blue',
    name: 'Blue',
    hex: '#3b82f6',
    lightHex: '#dbeafe',
    symbol: '💧',
    symbolName: 'Waterdrop',
    floraName: 'Sapphire Stream & Azure River Stones',
    stationName: 'The Silent Sapphire Brook',
    location: { x: 75, y: 40 },
    description: 'A peaceful babbling stream waiting for its crystal azure blue waters to ripple again.',
    prompt: 'Listen to the river! Can you tap all the sparkling BLUE river stones to fill the brook?',
    hint: 'Look for things as deep and cool as the clear summer sky!',
  },
  yellow: {
    key: 'yellow',
    name: 'Yellow',
    hex: '#eab308',
    lightHex: '#fef9c3',
    symbol: '☀️',
    symbolName: 'Sun',
    floraName: 'Golden Sunflowers & Buttercups',
    stationName: 'The Sunbeam Glade',
    location: { x: 38, y: 72 },
    description: 'A sunny patch of forest where giant sunflowers and warm glow-mushrooms shine.',
    prompt: 'The glade is too dim! Can you collect the cheerful YELLOW sunbeams for the sunflowers?',
    hint: 'Look for things as bright and happy as warm morning sunshine!',
  },
  green: {
    key: 'green',
    name: 'Green',
    hex: '#22c55e',
    lightHex: '#dcfce7',
    symbol: '🍀',
    symbolName: 'Clover Leaf',
    floraName: 'Emerald Jade Oak & Mossy Rocks',
    stationName: 'The Emerald Canopy Grove',
    location: { x: 62, y: 78 },
    description: 'The ancient guardian oak tree whose mossy roots and leaves need their lush emerald green.',
    prompt: 'The great oak is sleeping! Help Barnaby gather fresh GREEN clover leaves to wake it up.',
    hint: 'Look for things as fresh and lively as springtime grass!',
  },
  purple: {
    key: 'purple',
    name: 'Purple',
    hex: '#a855f7',
    lightHex: '#f3e8ff',
    symbol: '💎',
    symbolName: 'Crystal Gem',
    floraName: 'Amethyst Crystal Blossom',
    stationName: 'The Twilight Hollow',
    location: { x: 48, y: 22 },
    description: 'A mystical hollow of glowing violet crystals that chime like soft bells.',
    prompt: 'Magic crystals are humming! Can you find the royal PURPLE amethyst gems?',
    hint: 'Look for things as rich as sweet grapes or twilight skies!',
  },
  orange: {
    key: 'orange',
    name: 'Orange',
    hex: '#f97316',
    lightHex: '#ffedd5',
    symbol: '🦋',
    symbolName: 'Butterfly',
    floraName: 'Marigold Sunset Lanterns',
    stationName: 'The Lantern Tree Clearing',
    location: { x: 80, y: 70 },
    description: 'Whimsical glowing marigold flowers that look like tiny paper lanterns.',
    prompt: 'The forest butterflies are looking for warm ORANGE marigold blooms! Can you guide them?',
    hint: 'Look for things as warm and zesty as a fresh juicy orange!',
  },
};

export const COLOR_CHALLENGES: Record<ColorKey, ColorChallengeData> = {
  red: {
    stationTitle: 'Restore Radiant Red',
    stage1Prompt: 'Tap on all the RED objects to collect ruby energy for Barnaby’s magic paintbrush!',
    stage1Items: [
      { id: 'r1', name: 'Ripe Red Strawberry', colorKey: 'red', hex: '#ef4444', emoji: '🍓', isTarget: true, shapeSymbol: '★', spokenHint: 'A delicious red berry!' },
      { id: 'b1', name: 'Blue River Pebble', colorKey: 'blue', hex: '#3b82f6', emoji: '💎', isTarget: false, shapeSymbol: '💧', spokenHint: 'That is blue like water.' },
      { id: 'r2', name: 'Shiny Red Apple', colorKey: 'red', hex: '#ef4444', emoji: '🍎', isTarget: true, shapeSymbol: '★', spokenHint: 'A crunchy red apple!' },
      { id: 'g1', name: 'Green Clover', colorKey: 'green', hex: '#22c55e', emoji: '🍀', isTarget: false, shapeSymbol: '🍀', spokenHint: 'That is fresh green grass.' },
      { id: 'r3', name: 'Red Ladybug', colorKey: 'red', hex: '#ef4444', emoji: '🐞', isTarget: true, shapeSymbol: '★', spokenHint: 'A friendly spotted red ladybug!' },
      { id: 'y1', name: 'Yellow Lemon', colorKey: 'yellow', hex: '#eab308', emoji: '🍋', isTarget: false, shapeSymbol: '☀️', spokenHint: 'That is bright yellow sunshine.' },
    ],
    stage2Prompt: 'Dip Barnaby’s paintbrush into the RED paint pot and brush the faded wild roses!',
    funFact: 'Did you know? Ladybugs have bright red wings to tell their friends they are safe and happy!',
    jessicaVoiceNote: 'Splendid observation! Red brings warm energy and life to the sleeping meadow flowers.',
    barnabyVoiceNote: 'Hop-tastic! My ears are wiggling with joy! Look at those roses blushing bright red!',
  },
  blue: {
    stationTitle: 'Restore Sparkling Blue',
    stage1Prompt: 'Tap on all the BLUE objects to fill the riverbed with cool, sparkling water!',
    stage1Items: [
      { id: 'bl1', name: 'Blue Water Droplet', colorKey: 'blue', hex: '#3b82f6', emoji: '💧', isTarget: true, shapeSymbol: '💧', spokenHint: 'A fresh blue water drop!' },
      { id: 'r4', name: 'Red Cardinal Bird', colorKey: 'red', hex: '#ef4444', emoji: '🎈', isTarget: false, shapeSymbol: '★', spokenHint: 'That is warm red.' },
      { id: 'bl2', name: 'Bluebell Flower', colorKey: 'blue', hex: '#3b82f6', emoji: '🫐', isTarget: true, shapeSymbol: '💧', spokenHint: 'A sweet wild blueberry!' },
      { id: 'y2', name: 'Yellow Star', colorKey: 'yellow', hex: '#eab308', emoji: '⭐', isTarget: false, shapeSymbol: '☀️', spokenHint: 'That is sunny yellow.' },
      { id: 'bl3', name: 'Blue River Pebble', colorKey: 'blue', hex: '#3b82f6', emoji: '🐟', isTarget: true, shapeSymbol: '💧', spokenHint: 'A shiny blue river fish!' },
      { id: 'g2', name: 'Green Oak Leaf', colorKey: 'green', hex: '#22c55e', emoji: '🍃', isTarget: false, shapeSymbol: '🍀', spokenHint: 'That is green moss.' },
    ],
    stage2Prompt: 'Use the BLUE brush to paint the bubbling brook and watch the water start flowing!',
    funFact: 'Water in mountain streams looks blue because it reflects the clear, open sky above!',
    jessicaVoiceNote: 'Wonderfully done, young explorer! Blue creates peace and helps forest creatures drink.',
    barnabyVoiceNote: 'Splish splash! The river is humming a gentle song again! Thank you, Niko!',
  },
  yellow: {
    stationTitle: 'Restore Sunny Yellow',
    stage1Prompt: 'Tap on all the YELLOW objects to bring warm sunbeams to the giant sunflowers!',
    stage1Items: [
      { id: 'y3', name: 'Golden Sunbeam', colorKey: 'yellow', hex: '#eab308', emoji: '☀️', isTarget: true, shapeSymbol: '☀️', spokenHint: 'A bright warm sunbeam!' },
      { id: 'bl4', name: 'Blue Raindrop', colorKey: 'blue', hex: '#3b82f6', emoji: '💧', isTarget: false, shapeSymbol: '💧', spokenHint: 'That is cool blue.' },
      { id: 'y4', name: 'Bright Sunflower', colorKey: 'yellow', hex: '#eab308', emoji: '🌻', isTarget: true, shapeSymbol: '☀️', spokenHint: 'A smiling yellow sunflower!' },
      { id: 'r5', name: 'Red Strawberry', colorKey: 'red', hex: '#ef4444', emoji: '🍓', isTarget: false, shapeSymbol: '★', spokenHint: 'That is lovely red.' },
      { id: 'y5', name: 'Sweet Honeycomb', colorKey: 'yellow', hex: '#eab308', emoji: '🍯', isTarget: true, shapeSymbol: '☀️', spokenHint: 'Golden sweet honey from friendly bees!' },
      { id: 'g3', name: 'Green Frog', colorKey: 'green', hex: '#22c55e', emoji: '🐸', isTarget: false, shapeSymbol: '🍀', spokenHint: 'That is a green frog.' },
    ],
    stage2Prompt: 'Swirl the magical YELLOW paint onto the sleepy mushroom caps and watch them glow!',
    funFact: 'Sunflowers actually turn their flower heads during the day to follow the warm sun across the sky!',
    jessicaVoiceNote: 'You have a wonderful eye for colors! Yellow fills the forest with warmth and happiness.',
    barnabyVoiceNote: 'Wiggle-waggle! It feels like a cozy warm blanket out here now!',
  },
  green: {
    stationTitle: 'Restore Emerald Green',
    stage1Prompt: 'Tap on all the GREEN objects to restore life to the ancient mossy roots and leaves!',
    stage1Items: [
      { id: 'g4', name: 'Lucky Clover', colorKey: 'green', hex: '#22c55e', emoji: '🍀', isTarget: true, shapeSymbol: '🍀', spokenHint: 'A soft four-leaf green clover!' },
      { id: 'y6', name: 'Yellow Banana', colorKey: 'yellow', hex: '#eab308', emoji: '🍌', isTarget: false, shapeSymbol: '☀️', spokenHint: 'That is sunny yellow.' },
      { id: 'g5', name: 'Fresh Oak Leaf', colorKey: 'green', hex: '#22c55e', emoji: '🍃', isTarget: true, shapeSymbol: '🍀', spokenHint: 'A fluttery green oak leaf!' },
      { id: 'r6', name: 'Red Cherry', colorKey: 'red', hex: '#ef4444', emoji: '🍒', isTarget: false, shapeSymbol: '★', spokenHint: 'That is sweet red.' },
      { id: 'g6', name: 'Friendly Green Frog', colorKey: 'green', hex: '#22c55e', emoji: '🐸', isTarget: true, shapeSymbol: '🍀', spokenHint: 'A cute green tree frog smiling at you!' },
      { id: 'bl5', name: 'Blue Crystal', colorKey: 'blue', hex: '#3b82f6', emoji: '💎', isTarget: false, shapeSymbol: '💧', spokenHint: 'That is sparkling blue.' },
    ],
    stage2Prompt: 'Touch the GREEN paintbrush to the great oak tree and watch its giant leaves flutter!',
    funFact: 'Plants are green because of a special superpower called chlorophyll that turns sunbeams into food!',
    jessicaVoiceNote: 'Extraordinary effort! Green shows us growth, nature, and peaceful strength.',
    barnabyVoiceNote: 'The great oak whispered a thank you on the gentle breeze! You are a true forest friend!',
  },
  purple: {
    stationTitle: 'Restore Magical Purple',
    stage1Prompt: 'Tap on all the PURPLE objects to activate the ancient harmonic crystal flowers!',
    stage1Items: [
      { id: 'p1', name: 'Amethyst Crystal', colorKey: 'purple', hex: '#a855f7', emoji: '🔮', isTarget: true, shapeSymbol: '💎', spokenHint: 'A glowing purple crystal sphere!' },
      { id: 'g7', name: 'Green Moss', colorKey: 'green', hex: '#22c55e', emoji: '🌿', isTarget: false, shapeSymbol: '🍀', spokenHint: 'That is emerald green.' },
      { id: 'p2', name: 'Purple Lavender', colorKey: 'purple', hex: '#a855f7', emoji: '🪻', isTarget: true, shapeSymbol: '💎', spokenHint: 'Fragrant purple lavender bells!' },
      { id: 'y7', name: 'Yellow Star', colorKey: 'yellow', hex: '#eab308', emoji: '⭐', isTarget: false, shapeSymbol: '☀️', spokenHint: 'That is golden yellow.' },
      { id: 'p3', name: 'Sweet Purple Grapes', colorKey: 'purple', hex: '#a855f7', emoji: '🍇', isTarget: true, shapeSymbol: '💎', spokenHint: 'Juicy royal purple grapes!' },
      { id: 'r7', name: 'Red Heart', colorKey: 'red', hex: '#ef4444', emoji: '❤️', isTarget: false, shapeSymbol: '★', spokenHint: 'That is bright red.' },
    ],
    stage2Prompt: 'Did you know Red and Blue make Purple? Tap the palette to mix them and awaken the crystals!',
    mixingColors: { from1: '#ef4444', from2: '#3b82f6', result: '#a855f7' },
    funFact: 'In nature, purple flowers often attract hummingbirds and friendly bumblebees with their sweet scent!',
    jessicaVoiceNote: 'Magnificent! Mixing primary colors red and blue creates this royal, magical purple.',
    barnabyVoiceNote: 'Ooh! The crystal hollow is chiming like a magical music box! Listen to that harmony!',
  },
  orange: {
    stationTitle: 'Restore Glowing Orange',
    stage1Prompt: 'Tap on all the ORANGE objects to light up the warm marigold sunset lanterns!',
    stage1Items: [
      { id: 'o1', name: 'Orange Monarch Butterfly', colorKey: 'orange', hex: '#f97316', emoji: '🦋', isTarget: true, shapeSymbol: '🦋', spokenHint: 'A graceful orange monarch butterfly!' },
      { id: 'bl6', name: 'Blue Droplet', colorKey: 'blue', hex: '#3b82f6', emoji: '💧', isTarget: false, shapeSymbol: '💧', spokenHint: 'That is cool blue.' },
      { id: 'o2', name: 'Juicy Orange Fruit', colorKey: 'orange', hex: '#f97316', emoji: '🍊', isTarget: true, shapeSymbol: '🦋', spokenHint: 'A round, sweet orange fruit!' },
      { id: 'g8', name: 'Green Clover', colorKey: 'green', hex: '#22c55e', emoji: '🍀', isTarget: false, shapeSymbol: '🍀', spokenHint: 'That is green.' },
      { id: 'o3', name: 'Golden Orange Carrot', colorKey: 'orange', hex: '#f97316', emoji: '🥕', isTarget: true, shapeSymbol: '🦋', spokenHint: 'A crunchy orange carrot (Barnaby’s favorite!)' },
      { id: 'p4', name: 'Purple Crystal', colorKey: 'purple', hex: '#a855f7', emoji: '💎', isTarget: false, shapeSymbol: '💎', spokenHint: 'That is purple.' },
    ],
    stage2Prompt: 'Mix Red and Yellow on Barnaby’s palette to make warm Glowing Orange for the lanterns!',
    mixingColors: { from1: '#ef4444', from2: '#eab308', result: '#f97316' },
    funFact: 'Barnaby says carrots get their cheerful orange color from sunshine vitamins that help him see in the dark!',
    jessicaVoiceNote: 'Spectacular work! When bright red and warm yellow dance together, they form warm orange.',
    barnabyVoiceNote: 'Yum! Did someone say crunchy carrots?! And look at those lanterns glowing!',
  },
};
