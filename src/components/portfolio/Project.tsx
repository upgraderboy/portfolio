
import Projects from './Projects.jsx';
import "./project.css";
const Project: React.FC = ()=>{
  return (
    <>
        <section className="work section" id='portfolio'>
            <h2 className="section__title">Portfolio</h2>

            <span className="section__subtitle">Most Recent Works</span>
            <Projects />
        </section>
    </>
  )
}
export default Project;
