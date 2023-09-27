import * as mongoose from 'mongoose';

const uri = 'mongodb+srv://vue:Qazwsx1234!!@cluster0.eiqsmtt.mongodb.net/database?retryWrites=true&w=majority';
const dbName = 'database';
const defaultCollection = 'SM';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName,
});

const schema = new mongoose.Schema(
  {
    _id: String,
    value: mongoose.Schema.Types.Mixed,
  },
  { collection: defaultCollection }
);

const Model = mongoose.model('Data', schema);

async function set(key, value) {
  await Model.updateOne({ _id: key }, { value }, { upsert: true, setDefaultsOnInsert: true });
}

async function get(key) {
  const doc = await Model.findOne({ _id: key });
  return doc ? doc.value : null;
}

async function deleteKey(key) {
  await Model.deleteOne({ _id: key });
}

async function destroy() {
  await Model.deleteMany({});
}

async function query(filter) {
  const docs = await Model.find(filter).exec();
  return docs;
}

export default {
  set,
  get,
  delete: deleteKey,
  destroy,
  query,
};
