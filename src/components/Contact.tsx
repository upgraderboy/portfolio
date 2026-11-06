"use client";
import { AtSign, Globe, Phone, Send } from "lucide-react";
import Icon from "./Icon";

const Contact = () => {
  return (
    <section id="contact">
      <div className="container">
        <div className="left__column">
          <div className="box reveal">
            <div className="cluster">
              <h2 className="sub__title">
                Let&apos;s{" "}
                <span className="gradient__text">
                  create something amazing together!
                </span>
              </h2>
              <p className="description">
                Feel free to reach out for projects, collaborations, or full-stack
                development inquiries via the form or email!
              </p>
            </div>
            <div>
              <Icon
                name="list-option-ui"
                className="list__ui"
                width={400}
                height={100}
              />
            </div>
          </div>
          <div className="box reveal delay-2">
            <div className="cluster">
              {/* Email */}
              <div className="flex option rounded-md">
                <div className="icon__container">
                  <AtSign size={20} />
                </div>
                <div className="details">
                  <h3 className="name">E-Mail</h3>
                  <a
                    href="mailto:upgraderboy@gmail.com"
                    className="text__muted value"
                  >
                    upgraderboy@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex option rounded-md">
                <div className="icon__container">
                  <Phone size={20} />
                </div>
                <div className="details">
                  <h3 className="name">Phone</h3>
                  <a href="tel:+919166271496" className="text__muted value">
                    +91 9166 27 1496
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex option rounded-md">
                <div className="icon__container">
                  <Globe size={20} />
                </div>
                <div className="details">
                  <h3 className="name">Website</h3>
                  <a
                    href="https://upgraderboy.com"
                    className="text__muted value"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    upgraderboy.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <form className="contact__form reveal delay-1">
            <div className="spotlight"></div>
            <h2 className="sub__title">
              Let&apos;s work{" "}
              <span className="gradient__text">together!</span>
            </h2>
            <div className="row">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                className="control"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                className="control"
              />
            </div>
            <div className="row">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                className="control"
              />
              <input
                type="tel"
                placeholder="Phone No."
                name="phone"
                className="control"
              />
            </div>
            <textarea
              name="message"
              placeholder="Tell me about your project..."
              className="control"
            ></textarea>
            <button type="button" className="btn btn__primary submit__btn">
              <span className="flex items-center gap-2">
                <Send size={16} /> Send Message
              </span>
            </button>
          </form>
          <div className="box reveal delay-3">
            <div className="cluster">
              <div className="flex flex-col option rounded-md gap-2">
                <div className="details">
                  <h3 className="name">
                    Find us everywhere as{" "}
                    <span
                      style={{
                        background: "var(--gradient-1)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 800,
                      }}
                    >
                      @upgraderboy
                    </span>
                  </h3>
                  <p className="text__muted value">
                    Connect with us on any social media platform!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
