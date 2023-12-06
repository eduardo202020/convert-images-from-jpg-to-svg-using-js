const fs = require('fs');
const path = require('path');
const replaceColor = require('replace-color');

const inputFolder = './imagenes_salida';
const outputFolder = './imagenes_transparentes';

// Crear la carpeta de salida si no existe
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Obtener la lista de archivos en la carpeta de entrada
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error al leer la carpeta:', err);
    return;
  }

  // Iterar sobre cada archivo en la carpeta
  files.forEach((file) => {
    const inputFilePath = path.join(inputFolder, file);
    const outputFilePath = path.join(outputFolder, file.replace('.jpg', '_processed.jpg'));

    // Reemplazar el color en cada imagen
    replaceColor({
      image: inputFilePath,
      colors: {
        type: 'hex',
        targetColor: '#FFFFFF',
        replaceColor: '#00000000'
      },
    }, (err, jimpObject) => {
      if (err) {
        console.log(`Error al procesar la imagen ${file}:`, err);
        return;
      }

      // Guardar la imagen procesada
      jimpObject.write(outputFilePath, (err) => {
        if (err) {
          console.log(`Error al guardar la imagen procesada ${file}:`, err);
          return;
        }
        console.log(`Imagen procesada y guardada correctamente: ${outputFilePath}`);
      });
    });
  });
});
