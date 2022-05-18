const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://root:root@cluster0.xit6t.mongodb.net/servers", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
module.exports = mongoose;