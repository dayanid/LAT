const fs = require('fs');
const path = require('path');

const saveImageFromDataUrl = async (dataUrl, filename) => {
  return new Promise((resolve, reject) => {
    // Extract the data from the data URL
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

    // Create a buffer from the base64 data
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine the file path to save the image
    const imagePath = path.join(__dirname, 'profile', filename +".jpg"); // Saves the image in the same directory as the script with the custom filename

    // Write the buffer to a file
    fs.writeFile(imagePath, buffer, (err) => {
      if (err) {
        console.error('Error saving image:', err);
        reject(err);
      } else {
        console.log('Image saved successfully:', imagePath);
        resolve(imagePath);
      }
    });
  });
};

module.exports.saveImageFromDataUrl = saveImageFromDataUrl;
