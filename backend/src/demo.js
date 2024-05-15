const { getConnections } = require("./database/db");

getConnections('user').then((list) =>{
    console.log(list);
})
