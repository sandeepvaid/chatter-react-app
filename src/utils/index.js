export * from './constants';
export const setItemInLocalStorage = (key, value) => {
  if (!key || !value) {
    return null;
  }
  const valueToStore =
    typeof value !== "string" ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};

export const getItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error("Can get the value from LS");
  }
  return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error("Can get the value from LS");
  }
  localStorage.removeItem(key);
};

export const getFormBody = (params) => {
  let formBody = [];

  for (let property in params) {
    let encodedKey = encodeURIComponent(property); 
    let encodedValue = encodeURIComponent(params[property]); 

    formBody.push(encodedKey + "=" + encodedValue);
  }
  console.log("params", formBody.join("&"));
  return formBody.join("&");
};