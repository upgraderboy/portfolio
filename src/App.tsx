import { Toaster } from "react-hot-toast";
import About from "./components/about/About.tsx";
import Contact from "./components/contact/Contact.tsx";
import Footer from "./components/footer/Footer.tsx";
import GlobalStyle from "./components/GlobalStyle.ts";
import Header from "./components/header/Header.tsx";
import Home from "./components/home/Home.tsx";
import Project from "./components/portfolio/Project.tsx";

import Qualification from "./components/qualification/Qualification.tsx";
import Services from "./components/services/Services.tsx";
import Skills from "./components/skills/Skills.tsx";
import Testimonials from "./components/testimonials/Testimonials.tsx";

const App = () => {
  return (
  <>
  <Toaster/>
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
 
  </>);
}
 
export default App;