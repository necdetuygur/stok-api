const ENDPOINT = "http://localhost:3000";
const KAYIT_URL = ENDPOINT + "/kullanici/kayit";
const GIRIS_URL = ENDPOINT + "/kullanici/giris";
const STOK_URL = ENDPOINT + "/stok";

const Kayit = async (Ad, Soyad, Telefon, KullaniciAdi, Sifre) => {
  return (
    await (
      await fetch(KAYIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Ad,
          Soyad,
          Telefon,
          KullaniciAdi,
          Sifre,
        }),
      })
    ).json()
  ).token;
};
await Kayit("b", "b", "b", "b", "b");

const Giris = async (KullaniciAdi, Sifre) => {
  return (
    await (
      await fetch(GIRIS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          KullaniciAdi,
          Sifre,
        }),
      })
    ).json()
  ).token;
};
await Giris("b", "b");

const StokEkle = async (token, Ad, Miktar, Birim) => {
  return await (
    await fetch(STOK_URL, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Ad,
        Miktar,
        Birim,
      }),
    })
  ).json();
};
await StokEkle(await Giris("b", "b"), "b", "b", "b");

const Stoklar = async () => await (await fetch(STOK_URL)).json();
await Stoklar();
