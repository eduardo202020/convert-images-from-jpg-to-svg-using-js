const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const replaceColor = require('replace-color');

const inputFolderBlanco = './imagenes_blanco';
const outputFolderBlanco = './imagenes_salida';
const inputFolderTransparente = './imagenes_salida';
const outputFolderTransparente = './imagenes_transparentes';

// Crear la carpeta de salida blanco si no existe
if (!fs.existsSync(outputFolderBlanco)) {
  fs.mkdirSync(outputFolderBlanco);
}

// Obtener la lista de archivos en la carpeta de entrada blanco
fs.readdir(inputFolderBlanco, (errBlanco, filesBlanco) => {
  if (errBlanco) {
    console.error('Error al leer la carpeta:', errBlanco);
    return;
  }

  // Iterar sobre cada archivo en la carpeta blanco
  filesBlanco.forEach((fileBlanco) => {
    const inputFilePathBlanco = path.join(inputFolderBlanco, fileBlanco);
    const outputFilePathBlanco = path.join(outputFolderBlanco, fileBlanco.replace('.jpg', '_transparent.png'));

    // Procesar cada imagen
    sharp(inputFilePathBlanco)
      .removeAlpha()  // Asegurarse de que la imagen tenga un canal alfa
      .toColorspace('b-w')
      .threshold(150)  // Establecer umbral máximo para convertir todo lo blanco en transparente
      .toFormat('png', { quality: 100 })
      .toBuffer()
      .then((bufferBlanco) => {
        // Guardar la imagen PNG con todo lo blanco hecho transparente
        fs.writeFileSync(outputFilePathBlanco, bufferBlanco);
        console.log(`Conversión exitosa para: ${fileBlanco}`);

        // Crear la carpeta de salida transparente si no existe
        if (!fs.existsSync(outputFolderTransparente)) {
          fs.mkdirSync(outputFolderTransparente);
        }

        // Obtener la lista de archivos en la carpeta de entrada transparente
        fs.readdir(inputFolderTransparente, (errTransparente, filesTransparente) => {
          if (errTransparente) {
            console.error('Error al leer la carpeta:', errTransparente);
            return;
          }

          // Iterar sobre cada archivo en la carpeta transparente
          filesTransparente.forEach((fileTransparente) => {
            const inputFilePathTransparente = path.join(inputFolderTransparente, fileTransparente);
            const outputFilePathTransparente = path.join(outputFolderTransparente, fileTransparente.replace('.jpg', '_processed.jpg'));

            // Reemplazar el color en cada imagen
            replaceColor({
              image: inputFilePathTransparente,
              colors: {
                type: 'hex',
                targetColor: '#FFFFFF',
                replaceColor: '#00000000',
              },
            }, (err, jimpObject) => {
              if (err) {
                console.log(`Error al procesar la imagen ${fileTransparente}:`, err);
                return;
              }

              // Guardar la imagen procesada
              jimpObject.write(outputFilePathTransparente, (err) => {
                if (err) {
                  console.log(`Error al guardar la imagen procesada ${fileTransparente}:`, err);
                  return;
                }
                console.log(`Imagen procesada y guardada correctamente: ${outputFilePathTransparente}`);
              });
            });
          });
        });
      })
      .catch((errBlanco) => {
        console.error(`Error al procesar la imagen ${fileBlanco}:`, errBlanco);
      });
  });
});
