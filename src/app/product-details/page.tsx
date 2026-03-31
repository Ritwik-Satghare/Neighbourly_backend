"use client";
import React from "react";

const ProductDetails: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(180deg,#7F86EC,#9CA5E8)",
        fontFamily: "Arial",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          background: "#5F6EE5",
          borderRadius: "50%",
          bottom: "-120px",
          left: "-120px",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "260px",
          background: "#C6CEF5",
          borderRadius: "60% 40% 60% 40%",
          top: "-100px",
          right: "-100px",
          opacity: 0.7,
        }}
      />

      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          width: "100%",
          padding: "0 20px",
        }}
      >

        <div
          style={{
            background: "#ECECEC",
            borderRadius: "30px",
            padding: "10px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <h3 style={{ margin: 0 }}>PROXIMI</h3>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>How it works</span>
            <span>List Your Item</span>
            <span>Messages</span>
            <span>🔔</span>

            <img
              src="https://i.pravatar.cc/40"
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>


        <div
          style={{
            background: "rgba(255,255,255,0.6)",
            padding: "22px",
            borderRadius: "18px",
          }}
        >

          <div
            style={{
              display: "flex",
              gap: "20px",
              background: "#fff",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              marginBottom: "18px",
            }}
          >
            <img
              src="https://i.imgur.com/zYIlgBl.png"
              style={{
                width: "260px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <div>
              <h2 style={{ margin: 0 }}>Green Sofa</h2>
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                ₹400 / day
              </p>
              <p style={{ margin: "3px 0" }}>📍 Andheri West</p>
              <p style={{ color: "#777" }}>1.5 km away</p>
            </div>
          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "20px",
            }}
          >

            <div>
              <h3 style={{ marginBottom: "6px" }}>Modern Green Sofa</h3>

              <div
              style={{
                height: "110px",
              color: "#555",
              fontSize: "14px",
              lineHeight: "22px",
              marginBottom: "15px"
              }}
              >
                Rent this modern green sofa, perfect for living rooms,
              studio setups, or short-term spaces. Designed for comfort
              with soft cushioning and durable fabric upholstery.
              Well maintained and suitable for everyday use.
              </div>

              <h3 style={{ marginTop: "15px" }}>Reviews</h3>

              <div
                style={{
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "10px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                }}
              >
                <strong>Riya</strong>

                <p style={{ fontSize: "12px", color: "#888" }}>
                  May 2025
                </p>

                <p style={{ fontSize: "13px", color: "#555" }}>
                  Really smooth experience. The product was exactly as
                  described and pickup was quick.
                </p>
              </div>
            </div>


            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>Rates</h3>

              <p style={{ fontSize: "13px" }}>Daily – ₹150</p>
              <p style={{ fontSize: "13px" }}>Weekly – ₹900</p>
              <p style={{ fontSize: "13px", marginBottom: "10px" }}>
                Monthly – ₹2100
              </p>


              <div
                style={{
                  background: "#F2F2F2",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <p style={{ textAlign: "center", fontSize: "13px" }}>
                  October 2025
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7,1fr)",
                    gap: "4px",
                    fontSize: "11px",
                    textAlign: "center",
                  }}
                >
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "5px",
                        borderRadius: "5px",
                        background:
                          i % 6 === 0 ? "#7F86EC" : "#fff",
                        color: i % 6 === 0 ? "#fff" : "#000",
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>


              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "18px",
                    border: "none",
                    background: "#7F86EC",
                    color: "#fff",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Make offer
                </button>

                <button
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "18px",
                    border: "none",
                    background: "#5F9EEB",
                    color: "#fff",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Chat owner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;