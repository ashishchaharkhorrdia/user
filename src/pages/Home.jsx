import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import SpecialitiesSection from "../components/SpecialitiesSection";
import Speciality from '../components/Speciality';



const Home = () => {
  return (
    <div>
      <Header />
      <SpecialitiesSection />
      {/* <SpecialityMenu /> */}
      <TopDoctors />
      {/* <Speciality/> */}
      <Banner />
    </div>
  )
}

export default Home