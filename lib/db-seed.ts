import bcrypt from 'bcrypt';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';

export const seedDatabase = async () => {
  try {
    const users = [
      {
        name: 'Anya Sikora',
        username: 'queen',
        email: 'anya@gmail.com',
        bio: '✨ Reigning supreme, one dream at a time.',
        image:
          'https://res.cloudinary.com/dunymn6b8/image/upload/v1732568171/anya_g2cpev.png',
      },
      {
        name: 'Cookie Monster',
        username: 'cookie',
        email: 'cookie@gmail.com',
        bio: 'Me want cookie! 🍪 Sharing cookies, one crumb at a time.',
        image:
          'https://media4.giphy.com/media/YL2lpKcT5G1MjaNiEwNX3dD3H3QQ9cKJ6N21yMm5pbXIzemZ1bW9fbWXZ3V3Nm9reHZhaXo1clD2MV9pbmRlcnh5bF9naWVfYW1faWQ/200.webp',
      },
      {
        name: 'Tom Thumb',
        username: 'tom',
        email: 'tom@gmail.com',
        bio: 'Small in size, big in adventure. ✨',
        image:
          'https://media1.giphy.com/media/YL2lpKcT5G1MjaNiEwNX2TmMzdTd2jpZh5aDnhYWyWo5N/200.webp',
      },
      {
        name: 'Bob Builder',
        username: 'bob',
        email: 'bob@gmail.com',
        bio: 'Can we fix it? Yes, we can! 🛠️',
        image:
          'https://media4.giphy.com/media/YL2lpKcT5G1MjaNiEwNX3TmM5aMGVYtN3dm92M9pbmRlcnh5bF9naWVfYW1faWQ/200.webp',
      },
      {
        name: 'Lucy Lovely',
        username: 'lovely',
        email: 'lucy@gmail.com',
        bio: 'Spreading love and kindness wherever I go. 💕',
        image:
          'https://media1.giphy.com/media/YL2lpKcT5G1MjaNiEwNX3cFoKxWhWF2eTFyYzF3VlNF2UVFOtw/200.webp',
      },
      {
        name: 'Ron Weasley',
        username: 'ron',
        email: 'ron@gmail.com',
        bio: 'When in doubt, follow the spiders. 🕷️',
        image:
          'https://64.media.tumblr.com/f6c22c5cf39f998b488ded8ebb6d6/200.webp',
      },
      {
        name: 'George Washington',
        username: 'freedom',
        email: 'george@gmail.com',
        bio: 'It is assuredly better to go laughing than crying thro’ the rough journey of life.',
        image:
          'https://hips.hearstapps.com/hmg-prod/images/george-washington.jpg',
      },
      {
        name: 'Luna Lovegood',
        username: 'luna',
        email: 'luna@gmail.com',
        bio: 'Don’t worry, you’re just as sane as I am. 🦋',
        image:
          'https://i.pinimg.com/736x/42/1f/09/421f09b504eb9e7e1ef2d845b.jpg',
      },
      {
        name: 'Draco Malfoy',
        username: 'draco',
        email: 'draco@gmail.com',
        bio: 'Being bad never looked so good. 🐍',
        image: 'https://pm1.narvii.com/6096/2647.jpg',
      },
      {
        name: 'Marilyn Monroe',
        username: 'marilyn',
        email: 'marilyn@gmail.com',
        bio: 'Keep smiling because life is a beautiful thing, and there’s so much to smile about.',
        image: 'https://hips.hearstapps.com/hmg-prod/images/marilyn-monroe.jpg',
      },
      {
        name: 'Leonhard Euler',
        username: 'euler',
        email: 'leonhard@gmail.com',
        bio: 'Mathematics is the poetry of logical ideas.',
        image: 'https://images.unsplash.com/3620.jpg',
      },
      {
        name: 'Sigmund Freud',
        username: 'freud',
        email: 'sigmund@gmail.com',
        bio: 'Sometimes a cigar is just a cigar. 💭',
        image: 'https://images.unsplash.com/2001.jpg',
      },
      {
        name: 'Friedrich Nietzsche',
        username: 'zarathustra',
        email: 'friedrich@gmail.com',
        bio: 'He who has a why to live can bear almost any how.',
        image: 'https://images.unsplash.com/7984.jpg',
      },
      {
        name: 'Ernest Hemingway',
        username: 'oldmanandthesea',
        email: 'ernest@gmail.com',
        bio: 'Write drunk, edit sober.',
        image: 'https://upload.wikimedia.org/medium.jpg',
      },
      {
        name: 'Emily Dickinson',
        username: 'emily',
        email: 'emily@gmail.com',
        bio: 'Hope is the thing with feathers that perches in the soul.',
        image: 'https://images.unsplash.com/emily.jpg',
      },
    ];

    const password = 'demo1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    const documentTypes = ['playlist', 'event', 'friendRequest', 'user'];
    const results = {};

    // Initialize results with 0 for all document types
    for (const type of documentTypes) {
      results[type] = 0;
    }

    // Function to check if a user already exists
    const userExists = async (type: 'username' | 'email', value: string) => {
      const query =
        type === 'username'
          ? `*[_type == "user" && username == $value][0]`
          : `*[_type == "user" && email == $value][0]`;
      const exists = !!(await client.fetch(query, { value }));
      return exists;
    };

    // Seed users
    const userPromises = users.map(async (user) => {
      // Check for existing username or email
      const usernameExists = await userExists('username', user.username);
      const emailExists = await userExists('email', user.email);

      if (usernameExists || emailExists) {
        console.log(
          `Skipping user creation: Username (${user.username}) or email (${user.email}) already exists.`,
        );
        return null; // Skip user creation if already exists
      }


      const id = Math.floor(10000000 + Math.random() * 90000000); // Generate unique 8-digit ID
      return writeClient.create({
        _type: 'user',
        id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: hashedPassword,
        image: user.image,
        friends: [],
      });
    });

    const createdUsers = await Promise.all(userPromises);

    // Update results for the "user" type
    results.user = createdUsers.length;

    return {
      status: 'SUCCESS',
      message: 'Seeded database successfully.',
      results,
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      status: 'ERROR',
      message: 'Failed to seed database.',
      error: JSON.stringify(error),
    };
  }
};
