"use client";
import React from "react";

const listings = [
  { status: "Active" },
  { status: "Inactive" },
];

const MyListings: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(180deg,#7F86EC,#9CA5E8)",
        fontFamily: "Arial",
        position: "relative",
        overflow: "hidden",
        paddingTop: "30px",
      }}
    >

      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
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
          width: "420px",
          height: "300px",
          background: "#C6CEF5",
          borderRadius: "60% 40% 60% 40%",
          top: "-120px",
          right: "-120px",
          opacity: 0.7,
        }}
      />

      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >

        <div
          style={{
            background: "#ECECEC",
            borderRadius: "30px",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
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
              alt="profile"
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>


        <div
          style={{
            background: "rgba(255,255,255,0.6)",
            borderRadius: "20px",
            padding: "25px",
            height: "550px",
          }}
        >
          <div
            style={{
              border: "1.5px solid #8E8CFF",
              borderRadius: "16px",
              padding: "20px",
            }}
          >

            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              My Listings
            </h3>

            <div
              style={{
                height: "2px",
                background: "#8E8CFF",
                marginBottom: "25px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
              }}
            >
              {listings.map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: "200px",
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "15px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  }}
                >

                  <img
                    src={`https://picsum.photos/200/150?random=${index}`}
                    alt="chair"
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "contain",
                      marginBottom: "10px",
                    }}
                  />


                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "#777",
                      marginBottom: "6px",
                    }}
                  >
                    <span>May 12 – May 15</span>

                    <span
                      style={{
                        background: "#E7EAFF",
                        color: "#6A73F5",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 style={{ margin: "4px 0" }}>Polished Chair</h4>

                  <p style={{ margin: 0, fontSize: "13px" }}>
                    ₹ 500 / day
                  </p>

                  <p style={{ fontSize: "12px", color: "#777", margin: "3px 0" }}>
                    1.5 km away
                  </p>

                  <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>
                    📍 Andheri West
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListings;