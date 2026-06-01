import mongoose from "mongoose";


 const conectionDB = async () => {
  try {

    const DBConection = process.env.MONGODB_URI || process.env.MONGOURI;
    await mongoose.connect(`${DBConection}`);
                            
    console.log('Database active');
  } catch (err) {
    console.error(err);
  }
};

export default conectionDB