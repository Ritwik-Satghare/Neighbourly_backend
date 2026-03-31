"use client";
import React from "react";

const BeforePicture: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(180deg,#7F86EC,#9CA5E8)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          background: "#5F6EE5",
          borderRadius: "50%",
          bottom: "-140px",
          left: "-140px",
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
          top: "-100px",
          right: "-100px",
          opacity: 0.7,
        }}
      />


      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
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

          <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
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
            background: "rgba(255,255,255,0.55)",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h1
          style={{
            marginBottom: "25px",
            fontSize: "32px",
            fontWeight: "600"
            }}
        >
            Before Picture
        </h1>


          <div
            style={{
              width: "360px",
              margin: "auto",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            }}
          >

            <div
              style={{
                background: "#F3F3F3",
                borderRadius: "16px",
                padding: "30px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                📷
              </div>

              <p style={{ fontWeight: "bold", margin: 0 }}>
                Add photos of your item
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "5px",
                }}
              >
                Upload 3–4 clear images
              </p>
            </div>


            <div style={{ textAlign: "left", marginBottom: "15px" }}>
              <label>Description</label>

              <textarea
              placeholder="Tell renters about condition, features, etc."
              style={{
                width: "100%",
                height: "90px",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginTop: "6px",
                resize: "none",
                fontFamily: "Arial"
                }}
              />
            </div>


            <button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "30px",
                border: "none",
                background: "linear-gradient(90deg,#7F86EC,#5F9EEB)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforePicture;