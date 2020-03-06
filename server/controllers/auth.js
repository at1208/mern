const User = require('../models/user');
const jwt = require( 'jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.signup = (req,res) => {
  console.log(req.body)
  const { name,email,password} = req.body

  User.findOne({ email }).exec((err,user) => {
    if(user){
      return res.status(400).json({
        error: "Email is taken"
      })
    }
  })

  const token = jwt.sign({ name,email,password }, process.env.JWT_ACCOUNT_ACTIVATION)

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Account Activation link',
    html:`
     <h1>Please use the following link to activate your account</h1>
     <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
     <hr />
     <p>This email may contain sensitive information</p>
     <p>${process.env.CLIENT_URL}</p>
    `
  }
  sgMail.send(emailData)
  .then(sent => {
    return res.json({
       message: `Email has been sent to ${email}. Follow the instruction to activate your account`
    })
  })
  .catch(err => {
    return res.json({
      message: err.message
    })
  })


};


module.exports.accountActivation = (req,res) => {
  const {token} = req.body
  if(token){
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if(err){
        console.log(`JWT VERIFY IN ACCOUNT ACTIVATION ERROR`, err)
        return res.status(401).json({
          error: 'Expired link, Signup again'
        })
      }
      const {name, email, password} = jwt.decode(token)

      const newUser = new User({name,email,password});

      newUser.save((err, success) => {
        if(err){
          console.log(`Error in saving user in database: ${err}`)
          return res.status(400).json({
            error: err
          });
        }
        res.json({
          message: "Signup success! please login"
        })
      });
    })
  }
  else{
    return res.json({
      message: 'something went wrong'
    })
  }
}

module.exports.signin = (req,res) => {
    const {email,password} = req.body
    User.findOne({email}).exec((err,user) => {
      if(err || !user){
        return res.status(400).json({
          error: "User with that email does not exist. please signup!"
        })
      }

      if(!user.authenticate(password)){
        return res.status(400).json({
          error: "Email and password do not match"
        })
      }

      const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
      const { _id, name, role} = user;
      return res.json({
        token,
        user: {_id, name, email, role}
      })

    })

}
