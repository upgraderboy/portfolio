import { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import ProjectItems from "./ProjectItems";

function Projects() {
  const { portfolioData } = usePortfolioData();
  const { projects } = portfolioData;

  const [item, setItem] = useState({ name: "All" });
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [active, setActive] = useState(0);

  // Dynamically derive categories from projects
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  useEffect(() => {
    if (item.name === "All") {
      setFilteredProjects(projects);
    } else {
      const newProjects = projects.filter((project) => {
        return project.category === item.name;
      });
      setFilteredProjects(newProjects);
    }
  }, [item, projects]);

  const handleClick = (name: string, index: number) => {
    setItem({ name });
    setActive(index);
  };

  return (
    <>
      <div className="project__filters">
        {categories.map((name, index) => {
          return (
            <span
              className={`${active === index ? "active-work" : ""} project__item`}
              key={index}
              onClick={() => handleClick(name, index)}
            >
              {name}
            </span>
          );
        })}
      </div>
      <div className="project__container container grid">
        {filteredProjects.map((project, index) => {
          return <ProjectItems item={project} key={project.id || index} />;
        })}
      </div>
    </>
  );
}

export default Projects;