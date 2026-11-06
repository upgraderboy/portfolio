import { LucideGithub, SquareArrowOutUpRightIcon } from "lucide-react";
import Image from "next/image";

const projectList = [
  {
    id: 1,
    title: "Ultimate Animated Portfolio",
    description:
      "A stunning animated portfolio showcasing creative work with smooth transitions, scroll-triggered effects, and dynamic storytelling — built for maximum impact.",
    img: "/project1.png",
    tags: ["React", "GSAP", "Tailwind"],
  },
  {
    id: 2,
    title: "Designer Portfolio with Next.js",
    description:
      "A sleek and modern designer portfolio built with Next.js, showcasing responsive design, blazing-fast performance, and seamless navigation for creative professionals.",
    img: "/project2.png",
    tags: ["Next.js", "TypeScript", "CSS"],
  },
  {
    id: 3,
    title: "Video Conferencing Web App",
    description:
      "A cutting-edge, animated video conferencing app using ReactJS and ZegoCloud — combining real-time communication with sleek design and smooth interactions.",
    img: "/project3.png",
    tags: ["React", "ZegoCloud", "WebRTC"],
  },
  {
    id: 4,
    title: "Modern Solar Energy Website",
    description:
      "A modern solar energy website with clean, sustainable design. Featuring a responsive interface, smooth animations, and user-friendly navigation highlighting solar tech.",
    img: "/project4.png",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

const Projects = () => {
  return (
    <>
      <section id="projects">
        <div className="container">
          <div className="section__header reveal">
            <h2 className="sub__title">My Recent Projects</h2>
            <p className="description">
              Explore my latest work — blending creativity and engineering for
              functional, responsive applications with clean design and seamless
              user experiences.
            </p>
          </div>
          <div className="projects">
            {projectList.map((project, index) => {
              const { img, title, description, tags } = project;
              return (
                <div
                  className={`project reveal delay-${(index % 4) + 1}`}
                  key={project.id}
                >
                  <a href="#" target="_blank" className="picture">
                    <Image
                      src={img}
                      alt={title}
                      width={400}
                      height={250}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </a>
                  <div className="flex details">
                    <h3 className="line__clamp__1">{title}</h3>
                    {tags && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-md"
                            style={{
                              background: "var(--color-primary-soft)",
                              color: "var(--color-primary)",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text__muted description line__clamp__4">
                      {description}
                    </p>
                    <div className="flex bottom">
                      <a href="#" target="_blank" className="flex__center btn">
                        <SquareArrowOutUpRightIcon size={14} /> Demo
                      </a>
                      <a href="#" target="_blank" className="flex__center btn">
                        <LucideGithub size={14} /> Source
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
