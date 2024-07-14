import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import useLogin from "../hooks/useLogin";
import logo from "../img/logo.jpg";

const About = () => {
  useEffect(() => {
    document.title = "JO'E Cape | About Us";
  }, []);

  useLogin();

  return (
    <div className="flex flex-col min-h-screen font-rubik">
      <div className="bg-third">
        <Navbar />
      </div>
      <div className="text-center font-semibold text-2xl mt-8">About Us</div>
      <div className="flex flex-wrap items-center justify-center gap-10 md:px-12 mb-20 mt-10 grow">
        <div className="flex md:flex-row flex-col items-center justify-center gap-10 w-3/4">
          <img src={logo} className="rounded-full" />
          <div className="text-justify text-sm md:text-lg">
            <b>JOECAPE</b> telah beroperasi sejak tahun 2013 dan menjadi salah satu tujuan belanja favorit bagi pecinta barang-barang bekas berkualitas. Sejak awal berdiri, kami telah menawarkan koleksi pakaian yang cukup unik dan
            bervariasi. Berkomitmen untuk mempromosikan konsumsi yang lebih ramah lingkungan, terus mencari dan memilih barang-barang berkualitas dari sumber-sumber terpercaya untuk memastikan pelanggan mendapatkan nilai terbaik dari setiap
            pembelian. Dengan suasana toko yang nyaman dan staf yang bersahabat, kami telah menjadi destinasi belanja yang menyenangkan bagi para pencari barang unik dan berharga.
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.039176267677!2d112.159769!3d-8.0974874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78ed8ca621602d%3A0x21cf01641074ec10!2sJOECAPE%20THRIFT%20STORE!5e0!3m2!1sen!2sid!4v1719365012397!5m2!1sen!2sid"
          width="700"
          height="450"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          className="border-0 px-5"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
};

export default About;
