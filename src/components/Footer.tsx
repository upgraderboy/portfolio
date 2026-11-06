import React from "react";
import {
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
} from "lucide-react";

const socialLinks = [
  {
    href: "https://www.instagram.com/upgraderboy/",
    icon: <Instagram size={18} />,
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/upgraderboyorg/",
    icon: <Facebook size={18} />,
    label: "Facebook",
  },
  {
    href: "http://x.com/upgraderboy",
    icon: <Twitter size={18} />,
    label: "X (Twitter)",
  },
  {
    href: "https://github.com/upgraderboy",
    icon: <Github size={18} />,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/company/upgraderboy",
    icon: <Linkedin size={18} />,
    label: "LinkedIn",
  },
  {
    href: "https://youtube.com/@upgraderboy",
    icon: <Youtube size={18} />,
    label: "YouTube",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="spotlight" style={{ zIndex: 0, opacity: 0.08 }}></div>
      <div className="container">
        <div className="grid">
          <div className="col-2 column">
            <h3
              className="group__name"
              style={{ fontSize: "22px", marginBottom: "12px" }}
            >
              Upgrader Boy
            </h3>
            <p className="text__muted description" style={{ maxWidth: "380px" }}>
              Crafting responsive, high-performance web applications with clean 
              code and a user-focused approach. Let&apos;s build something 
              amazing together.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon__container handle rounded-md p-2"
                  aria-label={social.label}
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    minWidth: "2.5rem",
                    maxWidth: "2.5rem",
                    minHeight: "2.5rem",
                    maxHeight: "2.5rem",
                    border: "var(--gray-border)",
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="column">
            <h3 className="group__name">Quick Links</h3>
            <div className="routes__container">
              <a href="#header" className="route__item">
                Home
              </a>
              <a href="#about" className="route__item">
                About
              </a>
              <a href="#services" className="route__item">
                Services
              </a>
              <a href="#skills" className="route__item">
                Skills
              </a>
              <a href="#projects" className="route__item">
                Projects
              </a>
              <a href="#contact" className="route__item">
                Contact
              </a>
            </div>
          </div>
          <div className="column">
            <h3 className="group__name">Legal</h3>
            <div className="routes__container">
              <a href="#" className="route__item">
                Privacy Policy
              </a>
              <a href="#" className="route__item">
                Terms &amp; Conditions
              </a>
              <a href="#" className="route__item">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>
            © {currentYear}{" "}
            <span className="brand">Upgrader Boy</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
