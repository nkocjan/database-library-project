const pool = require("../db");

async function registerValidate({ login, password, email, phone, biblioteki }) {
  const toast = {
    isOk: true,
    title: "Success",
    message: "Walidacja zakończona pomyślnie",
  };

  const loginRegex = /^[a-zA-Z0-9]{3,20}$/;
  if (!loginRegex.test(login)) {
    toast.isOk = false;
    toast.title = "Error";
    toast.message =
      "Login musi mieć od 3 do 20 znaków i zawierać tylko litery i cyfry.";
    return toast;
  }

  const existingLogin = await pool.query(
    "SELECT 1 FROM project.administrator WHERE login = $1",
    [login]
  );
  if (existingLogin.rows.length > 0) {
    toast.isOk = false;
    toast.title = "Error";
    toast.message = "Login jest już zajęty.";
    return toast;
  }

  const passwordRegex = /^(?=.*[A-Z]).{5,30}$/;
  if (!passwordRegex.test(password)) {
    toast.isOk = false;
    toast.title = "Error";
    toast.message =
      "Hasło musi mieć od 5 do 30 znaków i zawierać co najmniej jedną wielką literę.";
    return toast;
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.isOk = false;
      toast.title = "Error";
      toast.message = "Podano niepoprawny adres email.";
      return toast;
    }
  }

  const phoneDigits = phone.replace(/\s/g, "");
  const phoneRegex = /^[0-9]{9}$/;
  if (!phoneRegex.test(phoneDigits)) {
    toast.isOk = false;
    toast.title = "Error";
    toast.message = "Numer telefonu musi zawierać dokładnie 9 cyfr.";
    return toast;
  }

  if (!Array.isArray(biblioteki) || biblioteki.length === 0) {
    toast.isOk = false;
    toast.title = "Error";
    toast.message = "Musisz zaznaczyć przynajmniej jedną bibliotekę.";
    return toast;
  }

  return toast;
}

module.exports = registerValidate;
