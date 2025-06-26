// Fun and meme-inspired words for generating memorable room names
const adjectives = [
  'happy', 'clever', 'bright', 'swift', 'calm', 'bold', 'wise', 'kind',
  'quick', 'cool', 'warm', 'fresh', 'sharp', 'smooth', 'strong', 'gentle',
  'brave', 'smart', 'clear', 'neat', 'clean', 'pure', 'fine', 'good',
  'nice', 'safe', 'sure', 'true', 'fast', 'easy', 'light', 'dark',
  'deep', 'high', 'wide', 'thin', 'thick', 'long', 'short', 'big',
  'small', 'tiny', 'huge', 'vast', 'great', 'grand', 'sweet', 'sour',
  // Fun additions
  'epic', 'mega', 'ultra', 'super', 'hyper', 'turbo', 'cosmic', 'legendary',
  'glorious', 'magnificent', 'fabulous', 'spectacular', 'amazing', 'incredible',
  'spicy', 'crispy', 'salty', 'chunky', 'thicc', 'smol', 'chonky', 'sleepy',
  'wacky', 'silly', 'goofy', 'funky', 'groovy', 'bouncy', 'fluffy', 'sparkly'
];

const nouns = [
  'cat', 'dog', 'bird', 'fish', 'bear', 'lion', 'wolf', 'fox',
  'deer', 'duck', 'frog', 'bee', 'ant', 'fly', 'owl', 'hawk',
  'tree', 'leaf', 'rock', 'star', 'moon', 'sun', 'sky', 'cloud',
  'rain', 'snow', 'wind', 'fire', 'lake', 'sea', 'hill', 'cave',
  'book', 'pen', 'cup', 'box', 'key', 'door', 'window', 'chair',
  'desk', 'lamp', 'clock', 'phone', 'car', 'bike', 'boat', 'plane',
  'apple', 'cake', 'bread', 'milk', 'tea', 'soup', 'rice', 'egg',
  // Meme and fun additions
  'meme', 'doge', 'pepe', 'karen', 'chad', 'simp', 'boomer', 'zoomer',
  'pickle', 'banana', 'potato', 'nugget', 'taco', 'burrito', 'pizza', 'donut',
  'unicorn', 'dragon', 'llama', 'sloth', 'penguin', 'hamster', 'capybara', 'otter',
  'wizard', 'ninja', 'pirate', 'robot', 'alien', 'ghost', 'zombie', 'vampire',
  'bean', 'sock', 'spoon', 'rubber', 'bubble', 'cheese', 'waffle', 'muffin'
];

const verbs = [
  'runs', 'jumps', 'flies', 'swims', 'walks', 'talks', 'sings', 'dances',
  'plays', 'works', 'reads', 'writes', 'draws', 'paints', 'builds', 'makes',
  'cooks', 'bakes', 'grows', 'plants', 'climbs', 'slides', 'rolls', 'spins',
  'shines', 'glows', 'sparkles', 'twinkles', 'flows', 'moves', 'turns', 'lifts',
  'pushes', 'pulls', 'throws', 'catches', 'holds', 'grabs', 'opens', 'closes',
  'starts', 'stops', 'goes', 'comes', 'leaves', 'stays', 'sits', 'stands',
  // Fun and meme additions
  'vibes', 'slaps', 'bops', 'yeets', 'zooms', 'boops', 'snacks', 'chills',
  'flexes', 'dabs', 'trolls', 'memes', 'snoozes', 'giggles', 'wobbles', 'bounces',
  'wiggles', 'jiggles', 'splashes', 'squishes', 'munches', 'crunches', 'fizzes', 'pops',
  'zaps', 'beeps', 'honks', 'squeaks', 'chirps', 'purrs', 'roars', 'howls'
];

/**
 * Generates a random room name using 3 fun words in the format:
 * adjective-noun-verb (e.g., "epic-doge-yeets", "thicc-capybara-vibes")
 */
export function generateRoomName(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  
  return `${randomAdjective}-${randomNoun}-${randomVerb}`;
}

/**
 * Generates a room ID with the fun readable name plus a short random suffix
 * to ensure uniqueness (e.g., "epic-doge-yeets-x7k3", "thicc-capybara-vibes-m9p2")
 */
export function generateRoomId(): string {
  const readableName = generateRoomName();
  const randomSuffix = Math.random().toString(36).substr(2, 4);
  return `${readableName}-${randomSuffix}`;
}
