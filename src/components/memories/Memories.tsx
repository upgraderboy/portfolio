import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import { MemoryItem } from "../db/portfolioDb";
import "./memories.css";

const Memories: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const memories = portfolioData.memories;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  // Lightbox State
  const [selectedEvent, setSelectedEvent] = useState<MemoryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [lightboxActive, setLightboxActive] = useState<boolean>(false);



  // Reset page if memories length changes (e.g. items deleted/added)
  useEffect(() => {
    setCurrentPage(1);
  }, [memories.length]);

  // Pagination calculations
  const totalItems = memories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemories = memories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const section = document.getElementById("memories");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Lightbox controls
  const openLightbox = (event: MemoryItem) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    setLightboxActive(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxActive(false);
    setSelectedEvent(null);
    document.body.style.overflow = "unset";
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedEvent) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedEvent) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxActive) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxActive, selectedEvent]);



  return (
    <>
      <section className="memories section" id="memories">
        <h2 className="section__title">Memories</h2>
        <span className="section__subtitle">Special Moments & Events</span>



        {memories.length > 0 ? (
          <>
            <div className="memories__container container grid">
              {currentMemories.map((event) => {
                const hasMultiple = event.images.length > 1;
                return (
                  <div className="memories__card" key={event.id}>
                    <div className="memories__img-wrapper">
                      <span className="memories__category">{event.category}</span>
                      {hasMultiple && (
                        <span className="memories__badge">
                          <i className="uil uil-images"></i> {event.images.length} Photos
                        </span>
                      )}
                      <img src={event.images[0]} alt={event.title} className="memories__img" />
                    </div>

                    <h3 className="memories__title">{event.title}</h3>
                    <div className="memories__date">
                      <i className="uil uil-calendar-alt"></i> {event.date}
                    </div>
                    <p className="memories__description">{event.description}</p>

                    <button className="memories__button" onClick={() => openLightbox(event)}>
                      {hasMultiple ? "View Gallery" : "View Photo"}{" "}
                      <i className="uil uil-arrow-right memories__button-icon"></i>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="memories__pagination">
                <button
                  className="memories__page-btn memories__page-arrow"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`memories__page-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="memories__page-btn memories__page-arrow"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p style={{ textAlign: "center", color: "var(--font-color)" }}>No memories available yet.</p>
        )}
      </section>

      {/* Lightbox Modal */}
      <div className={`memories__modal ${lightboxActive ? "active" : ""}`} onClick={closeLightbox}>
        {selectedEvent && (
          <div className="memories__lightbox-content" onClick={(e) => e.stopPropagation()}>
            <i className="uil uil-multiply memories__modal-close" onClick={closeLightbox}></i>

            <div className="memories__lightbox-slider">
              {selectedEvent.images.length > 1 && (
                <>
                  <button className="memories__lightbox-arrow memories__lightbox-arrow--prev" onClick={prevImage}>
                    <i className="uil uil-angle-left-b"></i>
                  </button>
                  <button className="memories__lightbox-arrow memories__lightbox-arrow--next" onClick={nextImage}>
                    <i className="uil uil-angle-right-b"></i>
                  </button>
                </>
              )}
              <img
                src={selectedEvent.images[currentImageIndex]}
                alt={`${selectedEvent.title} - ${currentImageIndex + 1}`}
                className="memories__lightbox-img"
                key={currentImageIndex}
              />
            </div>

            <div className="memories__lightbox-info">
              <h3 className="memories__lightbox-title">{selectedEvent.title}</h3>
              <p className="memories__lightbox-desc">{selectedEvent.description}</p>

              {selectedEvent.images.length > 1 && (
                <div className="memories__lightbox-dots">
                  {selectedEvent.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`memories__lightbox-dot ${idx === currentImageIndex ? "active" : ""}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Memories;
