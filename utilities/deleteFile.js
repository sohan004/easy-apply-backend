const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dirName = await path.join(__dirname, '../media');
            const file = await path.join(dirName, filePath);
            if (fs.existsSync(file)) {
                await fs.unlinkSync(file);
                resolve('File deleted successfully');
            }
            resolve('File not found');
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = deleteFile;