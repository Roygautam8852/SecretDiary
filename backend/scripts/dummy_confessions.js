const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');
const Confession = require('../models/Confession');

const dummyTexts = [
    "I've been secretly watering my roommate's plant with coffee. It's growing faster than ever but I'm worried it's developing an addiction. ☕🌱",
    "To the girl in the red scarf at the bus stop: You have the most beautiful laugh I've ever heard. I wish I was brave enough to say hi. 🧣❤️",
    "I accidentally submitted my shopping list instead of my economics essay. My professor's feedback: 'Interesting choice of data points, but we need more bread.' 🛒📉",
    "I've been using the staff lounge microwave for months and nobody has caught me. The power of a confident walk and a fake lanyard. 🍕🤫",
    "My secret talent is knowing exactly which floor tile in the library doesn't creak. I am the ninja of the quiet zone. 🥷📚",
    "I told my parents I'm majoring in Engineering. I'm actually a Dance major. Graduation is going to be... interesting. 💃🤫",
    "There's a stray cat that visits my dorm window every night at 11 PM. I call him Sir Meowsalot and he's my only true study buddy. 🐱📖",
    "I once spent 2 hours arguing with a bot on Twitter before realizing it was an automated customer service account. My brain is fried. 🤖🤡",
    "Every time I walk past the campus fountain, I make the same wish: for just one day where I don't feel like an impostor. ✨🏫",
    "I stole a traffic cone after the festival last night. He now lives in my closet and I've named him Harold. Harold is a good listener. 🗼👂"
];

const categories = ['Funny', 'Crush', 'Study', 'General', 'General', 'Rant', 'General', 'Funny', 'General', 'Funny'];
const hashtags = [
    ['#roommate_probs', '#coffee_addict'],
    ['#bus_stop_crush', '#silent_admirer'],
    ['#essay_fail', '#economics'],
    ['#staff_lounge', '#microwave_ninja'],
    ['#library_hacks', '#quiet_zone'],
    ['#secret_major', '#dance_life'],
    ['#dorm_cat', '#study_buddy'],
    ['#twitter_fails', '#broken_brain'],
    ['#impostor_syndrome', '#campus_life'],
    ['#harold_the_cone', '#festival_nights']
];

const seedDummy = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whisperwall');
        console.log('✅ Connected to MongoDB');

        const users = await User.find({});
        if (users.length === 0) {
            console.log('❌ No users found to assign confessions to. Please run the main seed script first.');
            process.exit(1);
        }

        const newConfessions = dummyTexts.map((text, i) => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            return {
                userId: randomUser._id,
                text: text,
                secretCode: Math.floor(1000 + Math.random() * 9000).toString(),
                category: categories[i],
                hashtags: hashtags[i],
                reactions: {
                    like: Math.floor(Math.random() * 500),
                    love: Math.floor(Math.random() * 100),
                    laugh: Math.floor(Math.random() * 200)
                }
            };
        });

        await Confession.insertMany(newConfessions);
        console.log(`✅ Successfully added ${newConfessions.length} dummy confessions!`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding dummy confessions:', err);
        process.exit(1);
    }
};

seedDummy();
