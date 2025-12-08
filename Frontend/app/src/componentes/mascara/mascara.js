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

export function mascaraPreco(valor) {
  if (!valor) return "";

  // Remove tudo que não for número
  let v = valor.replace(/\D/g, "");

  // Se vazio, retorna
  if (v === "") return "";

  // Converte para centavos
  v = (parseInt(v, 10) / 100).toFixed(2);

  // Converte para formato brasileiro
  v = v.replace(".", ",");

  // Adiciona separador de milhar
  return "R$ " + v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
