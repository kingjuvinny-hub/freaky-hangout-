import { Dare, DarePack } from '../types';

export const CORE_PACKS: DarePack[] = [
  {
    id: 'classic',
    name: 'Classic Fun',
    description: 'The good old-fashioned dares everyone knows and loves.',
    dares: [
      { text: "Do your best impression of another player.", type: 'text', difficulty: 1 },
      { text: "Speak in a silly accent for the next 3 rounds.", type: 'text', difficulty: 2 },
      { text: "Let the group choose a word you can't say for 10 minutes.", type: 'text', difficulty: 2 },
      { text: "Wear socks on your hands for the rest of the game.", type: 'text', difficulty: 1 },
      { text: "Do 10 pushups.", type: 'text', difficulty: 1 },
      { text: "Sing a song chosen by the group.", type: 'text', difficulty: 2 },
      { text: "Try to lick your elbow.", type: 'text', difficulty: 1 },
      { text: "Balance a spoon on your nose for 30 seconds.", type: 'text', difficulty: 2 },
      { text: "Post an old embarrassing photo to your social media story.", type: 'text', difficulty: 3 }
    ],
  },
  {
    id: 'ice_breaker',
    name: 'Ice Breaker',
    description: 'Perfect for getting to know each other on a sillier level.',
    dares: [
      { text: "Give a compliment to every player.", type: 'text', difficulty: 1 },
      { text: "Share two truths and one lie about yourself, and let the group guess the lie.", type: 'text', difficulty: 1 },
      { text: "Demonstrate your favorite dance move.", type: 'text', difficulty: 2 },
      { text: "Tell a cheesy joke.", type: 'text', difficulty: 1 },
      { text: "Create a secret handshake with the person to your left.", type: 'text', difficulty: 1 },
      { text: "Start a conversation with an inanimate object.", type: 'text', difficulty: 2 },
      { text: "Show everyone your most used emoji.", type: 'text', difficulty: 1 },
      { text: "Thank a famous person on social media for something ridiculous.", type: 'text', difficulty: 3 }
    ],
  },
  {
    id: 'what_the',
    name: 'What The?!',
    description: 'Weird, wacky, and wonderful challenges that will make everyone say "What?!"',
    dares: [
      { text: "Invent a new word and try to use it in a sentence without laughing.", type: 'text', difficulty: 2 },
      { text: "Pretend you are a news reporter reporting on the game.", type: 'text', difficulty: 2 },
      { text: "Try to juggle three items of the group's choosing.", type: 'text', difficulty: 3 },
      { text: "Make a hat out of toilet paper and wear it for the next 15 minutes.", type: 'text', difficulty: 1 },
      { text: "Have a conversation with your own reflection for one minute.", type: 'text', difficulty: 2 },
      { text: "Propose to a piece of furniture.", type: 'text', difficulty: 1 },
      { text: "Act like a cat and try to get someone to pet you.", type: 'text', difficulty: 2 },
      { text: "Try to put your foot behind your head.", type: 'text', difficulty: 3 },
      { text: "Eat a spoonful of a weird (but safe) food combination chosen by the group.", type: 'text', difficulty: 3 }
    ]
  }
];