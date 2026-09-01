import mongoose from 'mongoose';
import Dietitian from './models/Dietitian.js';

mongoose.connect("mongodb+srv://jethvas2305:jethva123@cluster0.hlazivc.mongodb.net/gym-backend")
  .then(async () => {
    const dietitians = await Dietitian.find({});
    console.log(JSON.stringify(dietitians, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
