
const colors = [
  "#B2EA1B",
  "#CE7459",
  "#5F67FF",
  "#73EEFF",
  "#FFB53F"
]

const usedColors = new Set()

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


export const  getRandomColor = () => {
  if (usedColors.size === colors.length) {
    // Todos los colores se han utilizado, reiniciar el conjunto de colores utilizados.
    usedColors.clear();
  }

  if (usedColors.size === colors.length) {
    // Esto sucede si todos los colores se han utilizado al menos una vez, se puede reiniciar el conjunto.
    usedColors.clear();
  }

  if (usedColors.size === 0) {
    // Si es la primera selección, barajamos los colores.
    shuffleArray(colors);
  }

  let color;
  for (const c of colors) {
    if (!usedColors.has(c)) {
      color = c;
      usedColors.add(c);
      break;
    }
  }

  return color;
}