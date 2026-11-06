const NavigationLinks = ({ name }: { name: string }) => {
  return (
    <>
      <div
        className={`${
          name === "route" ? "flex nav__routes" : "middle navlinks"
        }`}
      >
        <a href="#header" className={`${name} active`}>
          Home
        </a>
        <a href="#about" className={name}>
          About
        </a>
        <a href="#services" className={name}>
          Services
        </a>
        <a href="#skills" className={name}>
          Skills
        </a>
        <a href="#projects" className={name}>
          Projects
        </a>
        <a href="#contact" className={name}>
          Contact
        </a>
      </div>
    </>
  );
};

export default NavigationLinks;
