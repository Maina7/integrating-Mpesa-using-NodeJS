import React, {useState} from 'react'
import './PhoneNumber.css'

const PhoneNumber = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const handleSubmit = (e) =>{
        e.preventDefault();
        fetch("http://localhost:4000/stk", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({phoneNumber:phoneNumber})
        })
         .then((response)=> response.json())
         .then((data)=>{
            console.log(data);            
         })
         .catch((error)=>{
            console.error(error);
            
         })
        console.log("Phone number submitted");        
    }

  return (
    <div className='phoneNumberForm'>
      <form onSubmit={handleSubmit}>
        <div className='numberContainer'>
            <input type="tel"
            id='phonenumber'
            placeholder='Enter your phone number' 
            name='phoneNumber'
            value={phoneNumber}
            onChange={(e)=>{setPhoneNumber(e.target.value)}}
            required/>
            <button type='submit' className='phoneNumberButton'>Proceed</button>
        </div>
      </form>


    </div>
  )
}

export default PhoneNumber
