import About from "./about/About.tsx";
import GlobalStyle from "./GlobalStyle.ts";
import Header from "./header/Header.tsx";
import Home from "./home/Home.tsx";
import Project from "./portfolio/Project.tsx";

import Qualification from "./qualification/Qualification.tsx";
import Skills from "./skills/Skills.tsx";
import Services from "./services/Services.tsx";
import Testimonials from "./testimonials/Testimonials.tsx";

import Contact from "./contact/Contact";
import Footer from "./footer/Footer.tsx";

const App = () => {
  return (
  <>
  <GlobalStyle />
  <Header />
  <Home />
  <About />
  <Skills />
  <Services />
  <Qualification />
  <Project />
  <Testimonials />
  <Contact />
  <Footer />
  {/* <h1>{import.meta.env.VITE_SERVICE_ID}</h1> */}
  </>);
}
 
export default App;