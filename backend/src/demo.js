const jwt = require('jsonwebtoken')

function verify_token(token) {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, 'my_jwt_secret' , (err, authorizedData)=>{
            // console.log(err, authorizedData);
            
            if(err) {
                // console.log(err);
                reject(err)
            }
            else resolve(authorizedData)
        })
    })
}


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpYXQiOjE3MTM2NjQ1NTAsImV4cCI6MTcxMzY2ODE1MH0.RlrdcVzjH5cfts7fCFXNLLG3bVQZghyjy2bkq7mVPJE'
verify_token(token).then((data)=>{
    console.log('success', data);
    console.log(token);

}).catch((reason)=>{
    console.log('err', reason);

}) 
