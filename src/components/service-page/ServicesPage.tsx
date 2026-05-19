import { AboutClients } from "../about-page/AboutClients"
import { AboutServices } from "../about-page/Aboutservices"
import { AboutStrengths } from "../about-page/Aboutstrengths"
import Footer from "../landingPage/Footer"
import Navbar from "../landingPage/Navbar"
import { ServicesHero } from "./ServicesHeroPage"

export const ServicesPage=()=>{
return(
  <>
  <Navbar/>
  <ServicesHero/>
  <AboutServices/>
  <AboutStrengths/>
  <AboutClients/>
  <Footer/>
  </>
)
}