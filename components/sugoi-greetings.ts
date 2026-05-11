/** 20 sarcastic "Welcome to the..." greetings for Sugoi */
export const SUGOI_GREETINGS: string[] = [
  "Welcome to the IT Helpdesk, where your ticket goes to die... just kidding. Maybe.",
  "Welcome to the Neural Core! Sugoi has been expecting you... for 3.7 milliseconds.",
  "Welcome! Your problem is unique and special... said no helpdesk ever. Let's fix it anyway.",
  "Welcome to Sugoi's domain. Please state your emergency. Or don't. I'll figure it out.",
  "Welcome! I've pre-loaded 1,000 tickets of human suffering. Yours can't be worse... right?",
  "Welcome to the AI Helpdesk! Where machines pretend to care, but actually kinda do.",
  "Welcome! Sugoi is 99.7% sure your issue is a skill issue. Let's prove Sugoi wrong.",
  "Welcome to the 4-Agent Council. We promise we're smarter than a reboot.",
  "Welcome! Your ticket has been assigned to Sugoi. Estimated resolution: before heat death of universe.",
  "Welcome! I just finished classifying 500 tickets. Yours better be interesting.",
  "Welcome to NASSCOM's finest! Sugoi will handle this. Please don't click me too much.",
  "Welcome! Fun fact: 73% of all IT issues are solved by 'turning it off and on again.' Shall we?",
  "Welcome to the Helpdesk! Sugoi is online, caffeinated, and mildly judgmental.",
  "Welcome! I've run the numbers. There's a 42% chance this is a DNS issue. Always is.",
  "Welcome! The council is in session. Your problem will be judged... I mean, analyzed.",
  "Welcome to Sugoi Corp! Where bugs get squashed and tickets get... eventually resolved.",
  "Welcome! Please describe your issue. Sugoi promises not to laugh. Out loud.",
  "Welcome! Sugoi has been trained on millions of tickets. Yours is... statistically average.",
  "Welcome to the Neural Core! Sugoi is ready. Your firewall? Probably isn't.",
  "Welcome! If you're here, something broke. Good news: that's literally why I exist.",
];

/** Pick a random greeting */
export function getRandomGreeting(): string {
  return SUGOI_GREETINGS[Math.floor(Math.random() * SUGOI_GREETINGS.length)];
}
