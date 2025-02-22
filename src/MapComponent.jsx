import React from 'react'

const MapComponent = ({ latitude, longitude }) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return (
    <div>
      <iframe
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "8px" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=15`}
      ></iframe>
    </div>
  )
}

export default MapComponent
