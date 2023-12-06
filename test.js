const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const replaceColor = require('replace-color');

const inputFolder = './imagenes_blanco';
const outputFolder = './imagenes_salida';

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
    const outputFilePath = path.join(outputFolder, file.replace('.jpg', '_transparent.png'));

    // Procesar cada imagen
    sharp(inputFilePath)
      .removeAlpha()  // Asegurarse de que la imagen tenga un canal alfa
      .toColorspace('b-w')
      .threshold(150)  // Establecer umbral máximo para convertir todo lo blanco en transparente
      .toFormat('png', { quality: 100 })
      .toBuffer()
      .then((buffer) => {
        // Guardar la imagen PNG con todo lo blanco hecho transparente
        fs.writeFileSync(outputFilePath, buffer);
        console.log(`Conversión exitosa para: ${file}`);
      })
      .catch((err) => {
        console.error(`Error al procesar la imagen ${file}:`, err);
      });
  });
});