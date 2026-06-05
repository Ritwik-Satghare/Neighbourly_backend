const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/neighbourly')
  .then(async () => {
    const bookings = await mongoose.connection.collection('bookings').find().sort({ createdAt: -1 }).limit(3).toArray();
    console.log("RECENT BOOKINGS:");
    bookings.forEach(b => {
      console.log(`ID: ${b._id}`);
      console.log(`Status: ${b.status}`);
      console.log(`Rental State: ${b.rentalState}`);
      console.log('---');
    });
    process.exit(0);
  });
