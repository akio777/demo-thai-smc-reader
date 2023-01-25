// import logo from './logo.svg';
// import './App.css';
// import React, { Component } from 'react';
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { useEffect } from 'react';

import { convertImage } from './service'

import './PersonalDataForm.css';
const fs = require('fs');

const URL = `ws://${process.env.REACT_APP_SMC_HOST}:${process.env.REACT_APP_SMC_PORT}/ws`

const defaultSMCData = {
  "cid": "-",
  "name": {
    "prefix": "-",
    "first_name": "-",
    "middle_name": "",
    "last_name": "-",
    "full_name": "-"
  },
  "name_eng": {
    "prefix": "-",
    "first_name": "-",
    "middle_name": "",
    "last_name": "-",
    "full_name": "-"
  },
  "dob": "0000-00-00",
  "gender": "0",
  "card_issuer": "-",
  "issue_date": "0000-00-00",
  "expire_date": "0000-00-00",
  "address": {
    "house_no": "-",
    "moo": "-",
    "soi": "",
    "street": "",
    "subdistrict": "-",
    "district": "-",
    "province": "-",
    "address": "-"
  }
}

const WebSocketForm = () => {
  const [socket, setSocket] = useState(null);
  const [serverData, setServerData] = useState('');
  const [smcData, setSMCData] = useState(defaultSMCData)
  const [imageBase64, setImageBase64] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(URL);
    console.log(ws.readyState)
    ws.onopen = () => {
      console.log('Connection established');
      console.log(ws.readyState)
      ws.send('subscribe message');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      console.log(ws.CONNECTING)
      // setServerData(event.data);
      let eventObj = JSON.parse(event.data)
      console.log(`EVENT : ${eventObj.event}`)
      switch (eventObj.event) {
        case "smc-inserted":
          console.log(`Card was inserted.`)
          break
        case "smc-data":
          console.log(`Read card data is :`)
          let cardData = eventObj.payload
          setImageBase64(cardData.personal.base64_img)
          let filteredData = (({ base64_img, card, ...o }) => o)(cardData.personal)
          setSMCData(cardData.personal)
          console.log(filteredData)
          break
        case "smc-removed":
          console.log(`Card was removed.`)
          setSMCData(defaultSMCData)
          setImageBase64(null)
          break
        default:
          break

      }
    };

    ws.onclose = () => {
      console.log('Connection closed');
    };

    return () => {
      ws.close();
    }
  }, []);

  return (
    <div className="personal-card-container">
      <div className="personal-card">
        <h1 className="personal-card-name">{"ข้อมูลบัตรประชาชน"}</h1>
        <img src={`data:image/png;base64,${imageBase64}`} />
        <p className="personal-card-email">เลขประจำตัว : {smcData.cid}</p>
        <p className="personal-card-email">ชื่อ-สกุล : {smcData.name.prefix} {smcData.name.full_name}</p>
        <p className="personal-card-email">วันเดือนปีเกิด : {smcData.dob}</p>
        <p className="personal-card-email">ที่อยู่ : {smcData.address.house_no} {smcData.address.moo} {smcData.address.subdistrict} {smcData.card_issuer}</p>
      </div>
    </div>
  );
};

export default WebSocketForm;
