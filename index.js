const express = require('express')
port = 4000
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
mongoose.connect("mongodb://localhost:27017/test")


//integrating m-pesa
let BusinessShortCode = ""
let passKey = ""

//generating an stk token

const generateToken = async(req,res,next)=>{
    let consumerKey = "" 
    let consumerSecret = "" 

    auth = new Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")

    await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',{
        headers:{
            authorization : `Basic ${auth}`
        }
    }).then((response)=>{
        token = response.data.access_token
        next()
    }).catch((err)=>{
        console.log(err)
    })
    
}
app.post('/stk', generateToken , async (req,res)=>{
    const phone = req.body.phone.substring(1)
    const amount = req.body.amount

    const date = new Date()
    const timestamp = date.getFullYear() + 
    ("0" + (date.getMonth() + 1)).slice(-2) + 
    ("0" +date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) + 
    ("0" + date.getSeconds()).slice(-2)

    const shortCode = BusinessShortCode
    const passkey = passKey

    const password = new Buffer.from(shortCode + passkey + timestamp).toString("base64")


    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {  
                BusinessShortCode: shortCode,    
                Password: password,    
                Timestamp: timestamp,    
                TransactionType: "CustomerPayBillOnline",    
                Amount: amount,    
                PartyA:`254${phone}`,    
                PartyB: shortCode,    
                PhoneNumber:`254${phone}`,    
                CallBackURL: "  https://a978-154-159-252-249.ngrok-free.app/callback",    
                AccountReference:`254${phone}`,    
                TransactionDesc:"Test"
        },{
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    ).then((data)=>{
        console.log(data.data);
        res.status(200).json(data.data)       
    }).catch((err)=>{
       console.log(err.message) 
       res.status(400).json(err.message)
    })
})

app.post('/callback', (req,res)=>{
    const callbackData = req.body
    console.log(callbackData.Body);    
    if(!callbackData.Body.stkCallback.CallbackMetadata){
        console.log(callbackData.Body);
        return res.json("ok")
    }

    const phone = callbackData.Body.stkCallback.CallbackMetadata.Item[4].Value
    const amount = callbackData.Body.stkCallback.CallbackMetadata.Item[0].Value
    const trnx_id = callbackData.Body.stkCallback.CallbackMetadata.Item[1].Value

    console.log({phone, amount, trnx_id});

    const payment = new paymentSchema()
    payment.number = phone
    payment.trnx_id = trnx_id
    payment.amount = amount

    payment.save().then((data)=>{
        console.log("Saved", data);        
    }).catch((err)=>{
        console.log(err.message);
        
    })
            
})

const paymentSchema = mongoose.model('paymentSchema', {
    number: {type: String, required: true},
    trnx_id: {type: String, required: true},
    amount: {type: String, required: true}
},{
    timestamps : true
})




app.listen(port, (error)=>{
    if(!error){
        console.log(`Server starting at port ${port}`)
    }else{
        console.log(error)
    }
})


