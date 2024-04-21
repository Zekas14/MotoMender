const mongoose = require('mongoose');
const url = "mongodb+srv://MotoMenderDb:RuqFzS4Pj1rzBE1B@project.tmqmpov.mongodb.net/?retryWrites=true&w=majority&appName=Project";
function connectToDB(){
mongoose.connect(url).then(()=>{
    console.log('Connected Successfully');
});
}
module.exports = connectToDB;