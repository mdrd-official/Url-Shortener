import * as mongoose from 'mongoose';

export const UrlSchema = new mongoose.Schema({
  urlCode: String,
  originalUrl: String,
  shortUrl: String,
  created: {
    type: Date,
    default: Date.now,
  },
});
