import React from "react";
import Points from "@/components/Points";
import { Github, Instagram, Linkedin, Youtube, Download } from "lucide-react";
import Image from "next/image";

const Header = () => {
  return (
    <>
      <section className="bg__secondary" id="header">
        <div className="spotlight"></div>
        <div className="container">
          <div className="grid">
            <div className="me" style={{ textAlign: "center" }}>
              <Image
                src={"/uboy2.png"}
                alt="Upgrader Boy"
                className="z-10 animate-float"
                width={350}
                height={350}
                priority
              />
            </div>
            <div className="user__info">
              <div className="badge">
                <span className="dot"></span>
                Available for Freelance
              </div>
              <h2 className="sub__title">
                Hi 👋, I&apos;m <span className="gradient__text">Upgrader Boy</span>
              </h2>
              <h1 className="title">
                Superior Senior<br />
                <span className="gradient__text">Software Engineer</span>
              </h1>
              <p className="description">
                I architect &amp; build modern, scalable, and high-performance
                web applications. With deep expertise across the full stack — 
                from pixel-perfect UIs to robust backend systems — I transform 
                complex ideas into elegant digital solutions that deliver 
                exceptional user experiences.
              </p>
              <div className="flex buttons">
                <div className="flex social__handles">
                  <a
                    href="https://www.instagram.com/upgraderboy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon__container handle rounded-md p-2"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://github.com/upgraderboy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon__container handle rounded-md p-2"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="https://linkedin.com/company/upgraderboy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon__container handle rounded-md p-2"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="https://www.youtube.com/@upgraderboy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon__container handle rounded-md p-2"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
                <a href="#contact" className="btn btn__primary">
                  Let&apos;s Talk
                </a>
                <a href="#" className="btn btn__outline">
                  <span className="flex items-center gap-2">
                    <Download size={16} /> Resume
                  </span>
                </a>
              </div>
            </div>
            <Points />
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
