
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Listing from './pages/Listing';
import LeaderBoard from './pages/LeaderBoard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { LoadScript } from '@react-google-maps/api';
import { Toaster } from 'react-hot-toast';



function App() {

  return (
    <>
    
    <LoadScript googleMapsApiKey="Your_GoogleMaps_Api_Key">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </LoadScript>
    </>
  )
}




export default App
