const mongoose = require('mongoose');
const User = require('./models/user')
const Post = require('./models/post')
const uri = 'mongodb://localhost:27017/quacker';
const sha256 = require('sha256')
const faker = require('faker')
mongoose.connect(uri, {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

async function seed() {
  for (let i = 0; i < 20; i++) {
    let user = new User({
      email: faker.internet.email(),
      username: faker.name.firstName(),
      password: sha256(faker.lorem.word()),
    })
    await user.save();
    for (let j = 0; j < 10; j++) {
      user
      let post = new Post({
        img: 'https://cdn.filestackcontent.com/resize=w:200,h:100,fit:crop/3Sj4Q0DQ6edPMKXiL2rN',
        twit: faker.lorem.sentence(),
        likes: Math.round(Math.random() * 100),
        userId: user._id,
        createdAt: new Date(),
      })
      await post.save()
    }
  }
  mongoose.disconnect()
}

seed()
