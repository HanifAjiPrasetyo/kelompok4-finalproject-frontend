import { useEffect, useState } from "react";

const Carousel = (props) => {
  const { images } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 4000); // Interval waktu dalam milidetik (5 detik)
    setIntervalId(id);

    // Cleanup interval saat komponen dihancurkan
    return () => clearInterval(intervalId);
  }, [images.length]);

  const handlePrev = (e) => {
    e.preventDefault();
    clearInterval(intervalId);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    clearInterval(intervalId);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="carousel w-full scale-75 bg-white rounded-lg">
      {images.map((item, id) => {
        return (
          <div key={id} id={currentIndex} className={`carousel-item relative w-full ${id === currentIndex ? "block" : "hidden"}`}>
            <img src={item} className="mx-auto" width={500} height={400} />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a onClick={handlePrev} className="btn btn-circle">
                ❮
              </a>
              <a onClick={handleNext} className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
