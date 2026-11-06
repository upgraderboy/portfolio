"use client";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonialsList = [
  {
    id: 1,
    name: "Rajesh Sharma",
    position: "CTO",
    company: "TechNova Solutions",
    image: "/client1.jpg",
    rating: 5,
    content:
      "Upgrader Boy transformed our entire web platform. His attention to detail and ability to translate our vision into a seamless interface was exceptional. We saw an immediate improvement in user engagement and performance.",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    position: "Product Manager",
    company: "Dynamic Designs",
    image: "/client2.jpg",
    rating: 5,
    content:
      "Working with Upgrader Boy was an incredible experience! He's fast, communicative, and his code is always clean and well-structured. Our application now performs better than ever.",
  },
  {
    id: 3,
    name: "Priya Patel",
    position: "Founder",
    company: "BrightPath Agency",
    image: "/client3.jpg",
    rating: 5,
    content:
      "His full-stack skills took our product to the next level. He was able to bring our design concepts to life with stunning accuracy and creativity. I highly recommend him for any complex project!",
  },
  {
    id: 4,
    name: "David Chen",
    position: "Engineering Lead",
    company: "Greenline Tech",
    image: "/client4.jpg",
    rating: 5,
    content:
      "Upgrader Boy is hands-down one of the best engineers I've worked with. His expertise made our site not only look great but perform flawlessly across all devices and scale under heavy load.",
  },
  {
    id: 5,
    name: "Aisha Johnson",
    position: "Co-Founder",
    company: "PixelSpark Studio",
    image: "/client5.jpg",
    rating: 5,
    content:
      "Incredibly talented and dedicated. He consistently delivers pixel-perfect designs and smooth user experiences. His commitment to excellence and innovation is truly outstanding.",
  },
  {
    id: 6,
    name: "Michael Torres",
    position: "Senior Developer",
    company: "CodeWave",
    image: "/client6.jpg",
    rating: 5,
    content:
      "A top-notch developer! His work always exceeds expectations, and he's a pleasure to collaborate with. Our platform is now faster and more user-friendly than ever before.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials">
      <div className="container">
        <div className="section__header reveal">
          <h2 className="sub__title">
            What My <span className="gradient__text">Clients</span> Say
          </h2>
          <p className="description">
            Don&apos;t just take my word for it — here&apos;s what people 
            I&apos;ve worked with have to say about the experience.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {testimonialsList.map((testimonial, index) => (
            <div
              className={`testimonial reveal delay-${(index % 3) + 1}`}
              key={testimonial.id}
            >
              <Quote className="quote__icon" size={48} />
              <div className="flex user">
                <div className="profile">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <div className="details">
                  <h4>{testimonial.name}</h4>
                  <p className="text__muted" style={{ fontSize: "13px" }}>
                    {testimonial.position} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="content">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex stars__container">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

