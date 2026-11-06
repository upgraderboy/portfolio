import { Code, Server, Wrench, Palette } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: <Code size={18} />,
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "HTML / CSS / SASS", level: 95 },
      { name: "Redux / Zustand", level: 88 },
    ],
  },
  {
    title: "Backend Development",
    icon: <Server size={18} />,
    skills: [
      { name: "Node.js / Express", level: 92 },
      { name: "MongoDB / Mongoose", level: 88 },
      { name: "PostgreSQL", level: 82 },
      { name: "REST API / GraphQL", level: 90 },
      { name: "Firebase / Supabase", level: 85 },
    ],
  },
  {
    title: "DevOps & Tools",
    icon: <Wrench size={18} />,
    skills: [
      { name: "Git / GitHub", level: 93 },
      { name: "Docker / CI-CD", level: 80 },
      { name: "AWS / Vercel / Netlify", level: 85 },
      { name: "Linux / Shell", level: 82 },
      { name: "Testing / Jest", level: 78 },
    ],
  },
  {
    title: "Design & Other",
    icon: <Palette size={18} />,
    skills: [
      { name: "Figma / UI Design", level: 85 },
      { name: "SEO Optimization", level: 88 },
      { name: "AI / ML Basics", level: 75 },
      { name: "Performance Tuning", level: 90 },
      { name: "Agile / Scrum", level: 85 },
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills">
      <div className="container">
        <div className="section__header reveal">
          <h2 className="sub__title">
            My <span className="gradient__text">Skills</span>
          </h2>
          <p className="description">
            A comprehensive toolkit refined over years of professional 
            experience, spanning the entire development lifecycle.
          </p>
        </div>

        <div className="skills__grid">
          {skillCategories.map((category, catIndex) => (
            <div
              className={`skill__category reveal delay-${catIndex + 1}`}
              key={category.title}
            >
              <h3 className="category__title">
                <span className="icon__wrapper">{category.icon}</span>
                {category.title}
              </h3>
              {category.skills.map((skill) => (
                <div className="skill__item" key={skill.name}>
                  <div className="skill__info">
                    <span>{skill.name}</span>
                    <span className="percentage">{skill.level}%</span>
                  </div>
                  <div className="skill__bar">
                    <div
                      className="skill__progress"
                      data-width={`${skill.level}%`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

