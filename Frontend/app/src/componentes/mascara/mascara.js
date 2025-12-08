export function mascaraCpfCnpj(valor) {
  if (!valor) return "";

  // Remove tudo que não é número
  valor = valor.replace(/\D/g, "");

  if (valor.length <= 11) {
    // CPF
    return valor
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ
    return valor
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
}

export function mascaraTelefone(valor) {
  if (!valor) return "";
  valor = valor.replace(/\D/g, "");

  if (valor.length <= 10) {
    return valor
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    return valor
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
}

export function mascaraCEP(valor) {
  if (!valor) return "";
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

export function mascaraData(valor) {
  if (!valor) return "";
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d{1,4})$/, "$1/$2");
}
