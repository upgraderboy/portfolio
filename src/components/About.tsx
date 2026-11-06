"use client";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Image from "next/image";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <>
      <section id="about">
        <div className="container grid">
          {/* Box 1 — Personal Card */}
          <div className="box self__start reveal">
            <div className="spotlight"></div>
            <div className="cluster">
              <div className="flex user">
                <div className="profile">
                  <Image
                    src="/uboy4.png"
                    className="w-12 h-12"
                    width={200}
                    height={100}
                    alt="Upgrader Boy"
                  />
                </div>
                <div className="details">
                  <h4>Upgrader Boy</h4>
                  <p className="text__muted">
                    Superior Senior Software Engineer
                  </p>
                </div>
              </div>
              <h2 className="sub__title">
                <span className="gradient__text">Passionate </span>
                Developer &amp; Lifelong Learner
              </h2>
              <p className="description">
                I adapt to different time zones and cultures to ensure 
                communication is smooth, no matter where you&apos;re located. 
                Quality and reliability are my core values.
              </p>
            </div>
            <Image
              src="/icons/window.svg"
              alt="Kit Window"
              width={200}
              height={200}
            />
          </div>

          {/* Box 2 — Code Block + What Drives Me */}
          <div className="col-2 box reveal delay-2">
            <div className="spotlight"></div>
            <div className="flex row cluster">
              <div className="code__block">
                <div className="flex__center dot__container">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <pre>
                  <code className="language-javascript">
                    {`const developer = {
  firstName: "Ankit",
  lastName: "Bhuria",
  aka: "Upgrader Boy",
  role: "Senior Software Engineer",
  repeat: () => {
    eat();
    sleep();
    code();
    repeat();
  }
};`}
                  </code>
                </pre>
              </div>
              <div className="my__drive">
                <h2 className="sub__title">
                  What <span className="gradient__text">Drives Me</span>
                </h2>
                <p className="description">
                  I&apos;m passionate about the intersection of design and
                  development. I believe the best digital experiences are built
                  with a deep understanding of the user and a commitment to
                  innovation. Whether working on a simple landing page or a
                  complex enterprise app, I bring precision, creativity, and a
                  user-first mindset to every project.
                </p>
              </div>
            </div>
            <Image
              src="/icons/grid-wire-frame.svg"
              alt="Grid Wire Frame"
              className="kit grid__wireframe"
              width={1000}
              height={400}
            />
          </div>

          {/* Box 3 — Tech Stack */}
          <div className="col-2 box reveal delay-3">
            <div className="cluster">
              <div className="column">
                <h2 className="sub__title">
                  My <span className="gradient__text">Tech Stack</span>
                </h2>
                <p className="description">Always Evolving My Arsenal</p>
              </div>
              <div className="column stacks__container">
                <div className="flex__center btn stack">
                  <Image
                    src="/icons/react.svg"
                    alt="ReactJS"
                    width={20}
                    height={20}
                  />{" "}
                  React JS
                </div>
                <div className="flex__center btn stack">
                  <Image
                    src="/icons/express.svg"
                    alt="ExpressJS"
                    width={20}
                    height={20}
                  />{" "}
                  Express JS
                </div>
                <div className="flex__center btn stack">
                  <Image
                    src="/icons/typescript.svg"
                    alt="TypeScript"
                    width={20}
                    height={20}
                  />{" "}
                  TypeScript
                </div>
                <div className="flex__center btn stack">
                  <Image
                    src="/icons/nextjs.svg"
                    alt="NextJS"
                    width={20}
                    height={20}
                  />{" "}
                  Next JS
                </div>
                <div className="flex__center btn stack">
                  <Image
                    src="/icons/tailwindcss.svg"
                    alt="Tailwind CSS"
                    width={20}
                    height={20}
                  />{" "}
                  Tailwind CSS
                </div>
                <div className="flex__center btn stack">
                  🗄️ MongoDB
                </div>
              </div>
            </div>
            <Image
              src="/icons/grid.svg"
              alt="Grid"
              className="kit grid__box"
              width={400}
              height={400}
            />
            <Image
              src="/icons/card-ui.svg"
              alt="Card UI"
              className="kit card__ui"
              width={200}
              height={200}
            />
          </div>

          {/* Box 4 — CTA */}
          <div className="box flex__center last__box reveal delay-4">
            <div className="cluster">
              <h2 className="text__white sub__title">
                I&apos;m Committed to Collaboration &amp; Clear Communication
              </h2>
              <div className="flex__center btn__wrapper">
                <a href="#contact" className="btn">
                  Let&apos;s Collaborate
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
