const fs = require('fs');
const path = require('path');

const saveImageFromDataUrl = async (dataUrl, filename) => {
  return new Promise((resolve, reject) => {
    // Extract the data from the data URL
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

    // Create a buffer from the base64 data
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine the file path to save the image
    const profileDir = path.join(__dirname, 'profile');
    const imagePath = path.join(profileDir, filename + '.jpg'); // Saves the image in the profile directory with the custom filename

    // Check if the profile directory exists, and create it if not
    fs.access(profileDir, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(profileDir, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating profile directory:', err);
            reject(err);
          } else {
            saveImage();
          }
        });
      } else {
        saveImage();
      }
    });

    // Write the buffer to a file
    const saveImage = () => {
      fs.writeFile(imagePath, buffer, (err) => {
        if (err) {
          console.error('Error saving image:', err);
          reject(err);
        } else {
          console.log('Image saved successfully:', imagePath);
          resolve(imagePath);
        }
      });
    };
  });
};

module.exports.saveImageFromDataUrl = saveImageFromDataUrl;
