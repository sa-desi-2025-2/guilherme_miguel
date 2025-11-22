export async function listarPaises() {
  const url = "https://restcountries.com/v3.1/all?fields=name,capital,population,flags,cca2,cca3";
  const response = await fetch(url);

  if (!response.ok) {
    console.error("Erro ao buscar países:", response.status, response.statusText);
    return [];
  }

  const data = await response.json();

  return data.map(pais => ({
    nome: pais.name.common,
    bandeira: pais.flags ? pais.flags.png : "",
    iso2: pais.cca2,
    iso3: pais.cca3
  }));
}
