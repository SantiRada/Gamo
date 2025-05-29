const fs = require('fs');
const path = require('path');

const fileGenerators = {
  scene: (name) => ({
    folder: 'src',
    extension: '.gamo',
    content: `import scene

scene ${name} {
    // complete the code to load the scene
}
`
  }),

  generic: (name) => ({
    folder: 'src',
    extension: '.gamo',
    content: `${name} {
    // Complete the code to create content
}
`
  }),

  audio: (name) => ({
    folder: 'src/audio/bank',
    extension: '.audio',
    content: `soundbank ${name} {
    music "" {
        // Complete the code to load the music
    }
}
`
  }),

  sound: (name) => ({
    folder: 'src/audio/logic',
    extension: '.sound',
    content: `bank ${name} {
    // Complete the code to create the music
}
`
  }),

  art: (optionalType, name) => {
    const validTypes = ['character', 'background', 'ground', 'environment', 'skin', 'anim', 'model'];
    const artType = validTypes.includes(optionalType) ? optionalType : 'character';

    return {
      folder: 'src/visual',
      extension: '.art',
      content: `${artType} ${name} {
    file: ""
    // Complete the code to create a ${artType}
}
`
    };
  },

  ui: (name) => ({
    folder: 'src/ui',
    extension: '.ui',
    content: `interface ${name} {
    // Complete the code to create a TYPE
}
`
  }),

  dialog: (name) => ({
    folder: 'src/narrative/dialog',
    extension: '.dialog',
    content: `dialog ${name} {
    // Complete the code to create a dialog
    "": ""

    [ options: 
        "" => branch("")
        "" => event("")
    ]

    "": "" break

    end()
}
`
  }),

  lang: (name) => ({
    folder: 'src/narrative/lang',
    extension: '.lang',
    content: `// Complete the code to create a change language
characters => 
    "": ""
    "": ""

dialogs =>
    "": ""
    "": ""

interface =>
    "": ""
    "": ""
`
  }),
};

function addCommand(type, name, optionalType) {
  const lowerType = type.toLowerCase();

  let fileData;

  if (lowerType === 'scene') {
    fileData = fileGenerators.scene(name);
  } else if (lowerType === 'audio') {
    fileData = fileGenerators.audio(name);
  } else if (lowerType === 'sound') {
    fileData = fileGenerators.sound(name);
  } else if (lowerType === 'art') {
    fileData = fileGenerators.art(optionalType || 'character', name);
  } else if (lowerType === 'ui') {
    fileData = fileGenerators.ui(name);
  } else if (lowerType === 'dialog') {
    fileData = fileGenerators.dialog(name);
  } else if (lowerType === 'lang') {
    fileData = fileGenerators.lang(name);
  } else {
    // default: gmi add NAME (generic)
    fileData = fileGenerators.generic(name);
  }

  const fullPath = path.join(process.cwd(), fileData.folder);
  fs.mkdirSync(fullPath, { recursive: true });

  const filePath = path.join(fullPath, `${name}${fileData.extension}`);
  if (fs.existsSync(filePath)) {
    console.log(`⚠️ El archivo ya existe: ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, fileData.content);
  console.log(`✅ Archivo creado: ${filePath}`);
}

module.exports = { addCommand };
