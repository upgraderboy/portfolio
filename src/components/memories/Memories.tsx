import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./memories.css";

interface MemoriesProps {
  navigate: (to: string) => void;
}

const Memories: React.FC<MemoriesProps> = ({ navigate }) => {
  const { fetchMemories, portfolioData } = usePortfolioData();
  const [displayedMemories, setDisplayedMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMemories(3).then((list) => {
      if (active) {
        setDisplayedMemories(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [portfolioData.memories, fetchMemories]);

  if (loading) {
    return (
      <section className="memories section" id="memories">
        <h2 className="section__title">Memories</h2>
        <span className="section__subtitle">Special Moments & Events</span>
        <div className="memories__container container grid">
          {[1, 2, 3].map((n) => (
            <div className="memories__card skeleton-shimmer" key={n} style={{ border: "1px solid var(--border-color)", borderRadius: "1.25rem", padding: "1.5rem" }}>
              <div className="skeleton-item" style={{ height: "220px", borderRadius: "1rem", marginBottom: "1rem" }}></div>
              <div className="skeleton-item" style={{ height: "22px", width: "70%", marginBottom: "0.5rem" }}></div>
              <div className="skeleton-item" style={{ height: "14px", width: "35%", marginBottom: "1rem" }}></div>
              <div className="skeleton-item" style={{ height: "14px", width: "100%", marginBottom: "8px" }}></div>
              <div className="skeleton-item" style={{ height: "14px", width: "85%", marginBottom: "1.5rem" }}></div>
              <div className="skeleton-item" style={{ height: "32px", width: "110px", borderRadius: "0.5rem" }}></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="memories section" id="memories">
      <h2 className="section__title">Memories</h2>
      <span className="section__subtitle">Special Moments & Events</span>

      {displayedMemories.length > 0 ? (
        <>
          <div className="memories__container container grid">
            {displayedMemories.map((event) => {
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

                  <button className="memories__button" onClick={() => navigate("/memories")}>
                    {hasMultiple ? "View Gallery" : "View Photo"}{" "}
                    <i className="uil uil-arrow-right memories__button-icon"></i>
                  </button>
                </div>
              );
            })}
          </div>

          {(portfolioData.memories || []).length > 3 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }}>
              <button 
                className="button button--flex" 
                onClick={() => navigate("/memories")}
                style={{ display: "inline-flex", alignItems: "center", columnGap: "0.5rem", cursor: "pointer" }}
              >
                View All Memories <i className="uil uil-arrow-right" style={{ fontSize: "1.2rem" }}></i>
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "var(--font-color)" }}>No memories available yet.</p>
      )}
    </section>
  );
};

export default Memories;
