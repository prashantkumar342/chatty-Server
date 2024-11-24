import mongoose from "mongoose";

const connectDb = async (dburl) => {
  try {
    await mongoose.connect(`${dburl}`);
    console.log("Database connect successfully 🖥️");
  } catch (error) {
    console.log(error, "something went wrong");
  }
};

export default connectDb;