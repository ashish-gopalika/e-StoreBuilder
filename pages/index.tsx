import Head from "next/head";
import Image from "next/image";
import React from "react"
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import {FiMapPin} from "react-icons/fi";
import Cookies from "js-cookie";
import axios from "axios";
import WhatsappFab from "../components/WhatsappFab";
import FeaturedOffer from "../components/FeaturedOffer";
import {AppContext} from "../contexts/AppContext"
import {useEffect,useContext} from "react"
import Footer from "../components/Footer";


const getDetails = async (lat, long) => {
  try {
    const r = await axios.get(
      `https://swiggylocation.herokuapp.com/?lat=${lat}&long=${long}`
    );
    return r;
  } catch (e) {
    return e.message;
  }
};


export default function Home() {

  const {user,setUser} = useContext(AppContext);

  

  const [address,setAddress] = React.useState(Cookies.get('location'))
  const [button_label,setLabel] = React.useState(Cookies.get('location')?'Remove Location':'Locate')
  const getLocation = async () => {

    
    let location = "";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (location) {
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
        console.log(location.coords.accuracy);
        if (location.coords.latitude && location.coords.longitude) {
          const details = await getDetails(
            location.coords.latitude,
            location.coords.longitude
          );
  
          const main_data = details.data.location;
          console.log(main_data);
          setAddress(main_data.formatted_address)
          console.log(main_data.formatted_address)
          Cookies.set('location',main_data.formatted_address)
          setLabel('Remove Location');
        }
      });
    }
  };

  const handleGetLocation =()=>{
    setLabel('Locating...')
    getLocation()
    
  }

  const removeLocation =()=>{
    Cookies.remove('location');
    setAddress('');
    setLabel('Locate')
  }
  return (
    <div>
      <Head>
        <title>E-Store</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.content_header}>
          <div className={styles.header__textual}>
          <h3 className="text-3xl font-bold">Explore Store</h3>
          <span>{address && address.length>55&&address.slice(0, 55)+".."}</span>
          </div>
          <span className={styles.address__container}> <button className={`${styles.locate_btn} ${Cookies.get('location') && styles.remove_location_btn}`} onClick={!Cookies.get('location')?handleGetLocation:removeLocation}><span>{button_label}</span> {!Cookies.get('location') && <FiMapPin/>}</button></span>
          </div>

          <div className={styles.featured__offers}>
            <FeaturedOffer Image={"https://cdn3.mydukaan.io/app/image/489x280/?url=https://dukaan-us.s3.amazonaws.com/5146415/e9966f63-6d90-4c2e-95f7-480a3015c9eb/image-81a3ae48-f234-4242-80ae-6894cd4019c2.png"}/>
            <FeaturedOffer Image={"https://cdn3.mydukaan.io/app/image/489x280/?url=https://dukaan-us.s3.amazonaws.com/5146415/e9966f63-6d90-4c2e-95f7-480a3015c9eb/image-5593ba2f-abb5-4850-917f-78c44db77924.png"}/>
            <FeaturedOffer Image={"https://cdn3.mydukaan.io/app/image/489x280/?url=https://dukaan-us.s3.amazonaws.com/5146415/e9966f63-6d90-4c2e-95f7-480a3015c9eb/image-527ff8ef-f2f7-4660-8327-92319cf51017.png"}/>
            
          </div>
        </div>
        <WhatsappFab/>
        <Footer/>
      </main>
    </div>
  );
}
