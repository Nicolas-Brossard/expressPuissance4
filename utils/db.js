const mongoose = require('mongoose');

const DBconnection = async () => {
  await mongoose.connect(process.env.MONGODB_ADDON_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

module.exports = DBconnection;
