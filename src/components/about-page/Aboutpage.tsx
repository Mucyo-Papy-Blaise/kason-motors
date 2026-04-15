import { AboutHero } from "./Abouthero";
import { AboutMission } from "./Aboutmission";
import { AboutServices } from "./Aboutservices";
import { AboutAudience } from "./Aboutaudience";
import { AboutStrengths } from "./Aboutstrengths";
import { AboutCta } from "./Aboutcta";
import Navbar from "../landingPage/Navbar";
import Footer from "../landingPage/Footer";
import { AboutClients } from "./AboutClients";

export const AboutPage = () => (
  <>
  <Navbar />
    <AboutHero />
    <AboutMission />
    <AboutServices />
    <AboutAudience />
    <AboutStrengths />
    {/* <AboutClients/> */}
    <AboutCta />
    <Footer />
  </>
);
