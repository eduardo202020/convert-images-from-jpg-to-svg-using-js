const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const inputFolder = './imagenes_transparentes';
const outputFolder = './png2svg';

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
    // Verificar si el archivo es un PNG
    if (path.extname(file).toLowerCase() === '.png') {
      const inputFilePath = path.join(inputFolder, file);
      const outputFilePath = path.join(outputFolder, file.replace('.png', '.svg'));

      // Convertir la imagen PNG a SVG
      potrace.trace(inputFilePath, (err, svg) => {
        if (err) {
          console.error(`Error al convertir la imagen a SVG (${file}):`, err);
          return;
        }

        // Guardar el archivo SVG resultante
        fs.writeFileSync(outputFilePath, svg);
        console.log(`Imagen convertida a SVG correctamente: ${outputFilePath}`);
      });
    }
  });
});
