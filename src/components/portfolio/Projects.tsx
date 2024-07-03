import { useEffect, useState } from 'react'
import { projectData, projectNav } from './Data'
import ProjectItems from './ProjectItems'

function Projects() {
    const [item, setItem] = useState({name: 'All'});
    const [projects, setProjects] = useState([]);

    const [active, setActive] = useState(0);
    useEffect(()=>{
        if(item.name === 'All'){
            // @ts-ignore
            setProjects(projectData);
        }
        else{
            const newProjects = projectData.filter((project)=>{
                return project.category === item.name;
            })
            // @ts-ignore
            setProjects(newProjects);
        }

    }, [item]);
    // @ts-ignore
    const handleClick = (e, index)=>{
        setItem({name: e.target.textContent})
        setActive(index);
    }
  return (
    <>
        <div className="project__filters">{projectNav.map((item, index)=>{return <span className={`${active === index ? 'active-work' : ''} project__item`} key={index} onClick={(e)=>handleClick(e, index)}>{item.name}</span>})}</div>
        <div className="project__container container grid">{projects.map((item, index)=>{return <ProjectItems item={item} key={index} />})}</div>
    </>
  )
}

export default Projects;