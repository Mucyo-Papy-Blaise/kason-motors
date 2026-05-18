import { AboutClients } from "../about-page/AboutClients"
import { AboutHero } from "../about-page/Abouthero"
import { AboutServices } from "../about-page/Aboutservices"
import { AboutStrengths } from "../about-page/Aboutstrengths"
import Footer from "../landingPage/Footer"
import Navbar from "../landingPage/Navbar"

export const ServicesPage=()=>{
return(
  <>
  <Navbar/>
   <AboutHero/>
  <AboutServices/>
  <AboutStrengths/>
  <AboutClients/>
  <Footer/>
  </>
)
}