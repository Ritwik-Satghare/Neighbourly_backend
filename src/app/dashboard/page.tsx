"use client";
import React from "react";

export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#7F86EC,#9CA5E8)",
        paddingTop: "60px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "350px",
          background: "#C6CEF5",
          borderRadius: "60% 40% 60% 40%",
          top: "-120px",
          right: "-120px",
          opacity: 0.7,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          background: "#5F6EE5",
          borderRadius: "50%",
          bottom: "-180px",
          left: "-180px",
          opacity: 0.6,
        }}
      />


      <div
        style={{
          maxWidth: "1050px",
          margin: "auto",
          padding: "0 20px",
        }}
      >

        <div
          style={{
            background: "#ECECEC",
            borderRadius: "30px",
            padding: "14px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>PROXIMI</h3>

          <div
            style={{
              display: "flex",
              gap: "28px",
              alignItems: "center",
            }}
          >
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
            marginTop: "30px",
            background: "rgba(255,255,255,0.55)",
            padding: "45px",
            borderRadius: "20px",
            minHeight: "480px",   
          }}
        >

          <div
            style={{
              background: "#D7B3D2",
              borderRadius: "18px",
              padding: "22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              <img
                src="https://i.pravatar.cc/60"
                style={{ borderRadius: "50%" }}
              />

              <div>
                <h3 style={{ margin: 0 }}>Rohan Mehta</h3>
                <p style={{ margin: "4px 0" }}>Pune, India</p>
                <p style={{ margin: "4px 0" }}>
                  ⭐ 4.7 Rating · 18 Reviews
                </p>
                <p style={{ margin: "4px 0" }}>✔ Profile Verified</p>
              </div>
            </div>

            <span>✏️</span>
          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
            }}
          >

            <div
              style={{
                background: "#B8D0E0",
                borderRadius: "18px",
                padding: "25px",
              }}
            >
              <h4>Earnings Overview</h4>

              <div
                style={{
                  background: "#E6EEF3",
                  borderRadius: "12px",
                  padding: "20px",
                  marginTop: "15px",
                }}
              >
                <h2 style={{ margin: 0 }}>₹ 18,920</h2>
                <p style={{ margin: 0 }}>
                  ₹ 3,450 earned this month
                </p>
              </div>
            </div>


            <div
              style={{
                background: "#C3BDE6",
                borderRadius: "18px",
                padding: "25px",
              }}
            >
              <h4>Activity Stats</h4>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  marginTop: "15px",
                }}
              >
                <div
                  style={{
                    background: "#E2DEF5",
                    borderRadius: "12px",
                    flex: 1,
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h2>4</h2>
                  <p>Listing</p>
                </div>

                <div
                  style={{
                    background: "#E2DEF5",
                    borderRadius: "12px",
                    flex: 1,
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h2>4</h2>
                  <p>Rentals</p>
                </div>

                <div
                  style={{
                    background: "#E2DEF5",
                    borderRadius: "12px",
                    flex: 1,
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h2>4</h2>
                  <p>Activity</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}