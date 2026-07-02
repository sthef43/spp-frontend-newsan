function nestedFilterCheck(search, data, key): string {
  if (typeof data[key] === "object") {
    for (const k in data[key]) {
      if (data[key][k] !== null) {
        search = nestedFilterCheck(search, data[key], k);
      }
    }
  } else {
    search += data[key];
  }
  return search;
}
export const Buscador = (data, filter: string) => {
  //   const accumulator = (currentTerm, key) => {
  //     return nestedFilterCheck(currentTerm, data, key);
  //   };
  const dataStr = Object.keys(data).map((key) => {
    return nestedFilterCheck("", data, key).toLocaleLowerCase();
  });
  const dataToReturn = [];
  const array = dataStr.filter((x, index) => {
    const vari = x.includes(filter.toLocaleLowerCase());
    if (vari) {
      dataToReturn.push(data[index]);
      return vari;
    }
  });
  //const dataStr = Object.keys(data).reduce(accumulator, "").toLowerCase();
  console.log(dataToReturn);
  return dataToReturn;
};
