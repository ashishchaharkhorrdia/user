import React from "react";
import { assets } from "../assets/assets";


const HeroHealthcare = () => {
  const cardStyle = (bg) => ({
    background: bg,
    padding: "25px",
    borderRadius: "12px",
    flex: 1,
    minWidth: "220px",
  });

  return (
    <div>
      {/* HERO - full width from edge to edge */}
      <div
        style={{
          width: "100vw", // full viewport width
          marginLeft: "calc(-50vw + 50%)", // remove any container margin
          minHeight: "500px",
          backgroundImage: `url(${assets.doctor_hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        {/* Gradient overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
          }}
        ></div>

        {/* Hero Text */}
        <div style={{ position: "relative", zIndex: 2, padding: "0 20px" }}>
          <h1 style={{ fontSize: "44px", fontWeight: "700", margin: 0 }}>
            Healthcare for Good <br /> Today. Tomorrow. Always
          </h1>

          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            Comprehensive, compassionate care for a healthier you.
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "0 20px",
  }}
>
  {/* Card 1 */}
  <div
    style={{
      ...cardStyle("#f4f8d8"),
      transition: "all 0.3s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#dbe3a8";
      e.currentTarget.style.transform = "translateY(-6px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#f4f8d8";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <h3>Book an Appointment</h3>
    <p>With country's leading experts</p>
  </div>

  {/* Card 2 */}
  <div
    style={{
      ...cardStyle("#e8f7ff"),
      transition: "all 0.3s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#bfeaff";
      e.currentTarget.style.transform = "translateY(-6px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#e8f7ff";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <h3>Hospitals</h3>
    <p>Health needs under one roof</p>
  </div>

  {/* Card 3 */}
  <div
    style={{
      ...cardStyle("#f5f2ff"),
      transition: "all 0.3s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#d8d2ff";
      e.currentTarget.style.transform = "translateY(-6px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#f5f2ff";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <h3>Specialities</h3>
    <p>Our expertise in healthcare</p>
  </div>

  {/* Card 4 */}
  <div
    style={{
      ...cardStyle("#fff2eb"),
      transition: "all 0.3s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#ffd4bd";
      e.currentTarget.style.transform = "translateY(-6px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff2eb";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <h3>Doctors</h3>
    <p>Top experts for your health</p>
  </div>
</div>

    </div>
  );
};

export default HeroHealthcare;
