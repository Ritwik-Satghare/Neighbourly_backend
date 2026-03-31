"use client";
import React from "react";

export default function SidebarPage() {
  const menu = [
    "My Account",
    "My Bookings",
    "My Listings",
    "Deposits & Earnings",
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#E8E8EE" }}>
      
      <div
        style={{
          width: "300px",
          padding: "30px 20px",
          borderTopRightRadius: "25px",
          borderBottomRightRadius: "25px",
          background: "linear-gradient(180deg,#7F86EC,#8D80D8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "230px",
            height: "230px",
            background: "#5F6EE5",
            borderRadius: "55% 45% 60% 40%",
            top: "-60px",
            right: "-40px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "220px",
            background: "#BFC6F3",
            borderRadius: "50%",
            right: "-70px",
            top: "220px",
            opacity: 0.4,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "260px",
            height: "260px",
            background: "#5F6EE5",
            borderRadius: "50%",
            bottom: "-120px",
            left: "-90px",
            opacity: 0.45,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              style={{ borderRadius: "50%" }}
            />
            <span style={{ color: "#fff", fontWeight: 600 }}>
              Hello! User,
            </span>
          </div>

          <span style={{ fontSize: "18px", cursor: "pointer" }}>←</span>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          {menu.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "14px 20px",
                marginBottom: "18px",
                borderRadius: "30px",
                border: "1px solid rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#E8E8EE",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "350px",
            background: "#B9C4F1",
            borderRadius: "60% 40% 70% 30%",
            top: "-120px",
            right: "-120px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "450px",
            height: "500px",
            background: "#D8DCF6",
            borderRadius: "60% 40% 60% 40%",
            right: "-120px",
            top: "120px",
          }}
        />

        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        ></div>
      </div>
    </div>
  );
}