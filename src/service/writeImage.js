
const fs = require('fs')
export function convertImage(image_string) {

    // The base64 image string
    let imageString = `data:image/png;base64,${image_string}`;

    // Get the file type (e.g. "png")
    let fileType = imageString.split(';')[0].split('/')[1];

    // Get the base64 data (without the "data:image/png;base64," part)
    let base64Data = imageString.split(',')[1];

    // Decode the base64 data
    let buffer = new Buffer(base64Data, 'base64');

    // Write the data to a file
    let fileName = `image.` + fileType
    fs.writeFileSync(`./${fileName}`, buffer);
    console.log('File created successfully.');
    return fileName
}