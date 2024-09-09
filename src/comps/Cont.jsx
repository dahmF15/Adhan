import { Container } from "@mui/material";
import React from "react";

export default function Cont({ name, img, time }) {
  return (
    
    <Container
      maxWidth="md"
      style={{
        marginTop: "20px",
        color: "black",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "15px",
        direction: "rtl",
        justifyContent: "space-between",
        alignItems: "center",
        display: "flex",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={img} alt="" width={"30px"} style={{marginLeft: '10px', }}/>
        {name}
      </div>
      <div>
        {time}
      </div>
    </Container>
  );
}
