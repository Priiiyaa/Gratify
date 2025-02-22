import React, { useEffect } from 'react'

const Home = () => {
  useEffect(() =>{
    document.title = "Home - Gratify";
  },[])
  return (
    <>
        <div className="parallax">
    <div className="min-h-screen">
       <div className="flex flex-col items-center">
        <div className="text-white w-2/5 text-center flex flex-col gap-5 mt-70">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Save food ,Share Hope connect with others to share meals and reduce waste.
          </h1>
          <h4 className="mb-8 text-lg font-normal text-gray-300 lg:text-xl dark:text-gray-300">
          Join the movement to reduce food waste—save, share, and enjoy delicious meals while making a positive impact with Gratify"
          </h4>
        </div>
        <div className="bg-white w-3/5 mt-20 rounded-sm shadow-xl p-20 mb-10 flex space-between items-center gap-10">
          <div>
            <img className="w-60 h-60" src="images/logoBlack.svg" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold">Gratify</p>
            <p className="text-lg text-center mt-5">Transform the way you save and share food—cut waste, save resources, and make a difference with Gratify</p>
            <button className="p-3 w-1/2 bg-[#265646] rounded-md text-neutral-50 mt-10">
              Grab a Meal
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center px-40">
          <h2 className="text-3xl font-semibold mt-10">
            What Our App Does?
          </h2>
          <div className="flex mt-10 mb-10">
            <div className="flex flex-col gap-6 border-r-2 p-10 border-gray-400">
              <h6 className="text-2xl font-light">Surplus Food Listings</h6>
              <p className="font-light">
              Users can list surplus food items that are still good but not sellable, such as excess stock or near-expiry items. These can be offered at discounted or free prices to reduce waste and help those in need. Listings include details like food type, price, quantity, and location.
              </p>
            </div>
            <div className="flex flex-col gap-6 border-r-2 p-10 border-gray-400">
              <h6 className="text-2xl font-light">Surplus Food Categories</h6>
              <p className="font-light">
              Users can search for available surplus food in their area, filter by food types. The system provides location details, pick-up hours, and any restrictions, making it easy to access affordable or free food while reducing waste.
              </p>
            </div>
            <div className="flex flex-col gap-6 p-10">
              <h6 className="text-2xl font-light">Food Search and Pickup</h6>
              <p className="font-light">
              Food items are organized into categories like vegetables, fruits, dietary restrictions, and prepared meals to help users easily find what they need. Filters can include options for vegan, gluten-free, or vegetables, simplifying the process of locating specific food types and accommodating various preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>

    </>
  );
}

export default Home