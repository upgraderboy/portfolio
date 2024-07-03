;
import Data from './Data';
import "./testimonials.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import "swiper/css";
import 'swiper/css/scrollbar';
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import required modules
import { Scrollbar, Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

interface Testimonial {
  id: number;
  image: string;
  title: string;
  description: string;
}

const Testimonials: React.FC = () => {
  return (
    <>
      <section className="testimonial container section" id="testimonial">
        <h2 className="section__title">My Clients Say</h2>
        <span className="section__subtitle">Testimonials</span>
        <Swiper
          scrollbar={{
            hide: false,
          }}
          spaceBetween={24}
          modules={[Scrollbar, Navigation, Pagination, Mousewheel, Keyboard]}
          grabCursor={true}
          loop={true}
          cssMode={true}
          breakpoints={{
            576: {
              width: 576,
              slidesPerView: 1,
            },
            640: {
              width: 640,
              slidesPerView: 2,
            },
            1024: {
              width: 1024,
              slidesPerView: 4,
            },
          }}
          mousewheel={true}
          keyboard={true}
          className="mySwiper testimonial__container"
        >
          {Data.map(({ id, image, title, description }: Testimonial) => (
            <SwiperSlide className="testimonial__card" key={id}>
              <img src={image} alt="" className="testimonial__img" />
              <h3 className="testimonial__name">{title}</h3>
              <p className="testimonial__description">{description}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default Testimonials;