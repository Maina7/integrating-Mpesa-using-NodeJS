import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PhoneNumber from './Pages/PhoneNumber.jsx'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<PhoneNumber/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
