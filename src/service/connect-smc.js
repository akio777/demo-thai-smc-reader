const WebSocket = require('ws');
require('dotenv').config();
const socket = new WebSocket(`ws://localhost:${process.env.PORT}/ws`);


socket.onopen = () => {
    socket.send('subscribe message');
};

socket.onmessage = (event) => {
    let eventObj = JSON.parse(event.data)
    console.log(`EVENT : ${eventObj.event}`)
    switch (eventObj.event) {
        case "smc-inserted":
            console.log(`Card was inserted.`)
            break
        case "smc-data":
            console.log(`Read card data is :`)
            let cardData = eventObj.payload
            // // let { base64_img, card, ...filteredData } = cardData
            let filteredData = (({ base64_img, card, ...o }) => o)(cardData.personal)

            console.log(filteredData)
            console.log("-")
            console.log("-")
            break
        case "smc-removed":
            console.log(`Card was removed.`)
            break
        default:
            break

    }
};

export const connect = () => {
    socket.on('close', () => {
        console.log('Server closed, retrying...');
        setTimeout(connect, 1000);
    });
}