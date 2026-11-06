import {
  ArrowRight,
  Code,
  PencilRuler,
  Smartphone,
  Server,
  Brain,
  Search,
} from "lucide-react";

const servicesList = [
  {
    icon: <Smartphone size={28} />,
    name: "Responsive Web Design",
    description:
      "Crafting visually stunning and fully responsive websites that adapt seamlessly to any device, ensuring an excellent user experience across all screen sizes.",
  },
  {
    icon: <Code size={28} />,
    name: "Custom Web Development",
    description:
      "Building dynamic, interactive web applications tailored to your specific needs using modern frontend and backend technologies for scalable solutions.",
  },
  {
    icon: <PencilRuler size={28} />,
    name: "UI/UX Optimization",
    description:
      "Enhancing user engagement with intuitive and aesthetically pleasing interfaces, prioritizing performance, accessibility, and optimal satisfaction.",
  },
  {
    icon: <Server size={28} />,
    name: "Backend & API Development",
    description:
      "Designing and building robust RESTful & GraphQL APIs, microservices, and server-side architectures with Node.js, Express, and database optimization.",
  },
  {
    icon: <Brain size={28} />,
    name: "AI & ML Integration",
    description:
      "Integrating intelligent features into applications — from chatbots and recommendation engines to computer vision and natural language processing solutions.",
  },
  {
    icon: <Search size={28} />,
    name: "SEO & Performance",
    description:
      "Optimizing web applications for search engines and core web vitals, ensuring fast load times, excellent accessibility, and top search rankings.",
  },
];

const Services = () => {
  return (
    <>
      <section id="services">
        <div className="container">
          <div className="section__header reveal">
            <h2 className="sub__title">
              My <span className="gradient__text">Services</span>
            </h2>
            <p className="description">
              As a senior full-stack engineer, I deliver end-to-end solutions — 
              from stunning interfaces to powerful backends, optimized for 
              performance and scalability.
            </p>
          </div>

          <div className="services">
            {servicesList.map((service, index) => (
              <div
                className={`service reveal delay-${index + 1}`}
                key={service.name}
              >
                <div className="flex__center circle">
                  <div className="icon__container">{service.icon}</div>
                </div>
                <h3 className="name">{service.name}</h3>
                <p className="text__muted description">{service.description}</p>
                <div className="flex__center">
                  <a href="#contact" className="btn">
                    Let&apos;s Talk <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
