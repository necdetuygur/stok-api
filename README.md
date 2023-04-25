# Stok API

## Canlı Adres

[https://necdetuygur.github.io/stok/](https://necdetuygur.github.io/stok/)

## UI Front-end Projesi

[https://github.com/necdetuygur/stok](https://github.com/necdetuygur/stok)

### Örnek kullanıcı hesabı oluşturmak.

http://localhost:3000/kullanici/seed

### Örnek stok kaydı oluşturmak.

http://localhost:3000/stok/seed

### Kayıt olmuş kullanıcıyı yönetici yapmak.

http://localhost:3000/kullanici/yonetici-yap/KullaniciAdi

### Örnek Kullanıcı:

```
curl 'http://localhost:3000/kullanici/giris' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  --data-raw '{"KullaniciAdi":"test","Sifre":"123456"}' \
  --compressed
```
