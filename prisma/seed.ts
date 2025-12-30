import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: `file:${process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db'}`
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Fetching users from API...');
  const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await usersResponse.json();

  console.log('Fetching posts from API...');
  const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await postsResponse.json();

  console.log('Seeding users...');
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  }

  console.log('Seeding posts...');
  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        body: post.body,
        userId: post.userId,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  