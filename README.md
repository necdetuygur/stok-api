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

### Docker Bash
```sh
docker build . -t stok-api
docker run --name stok-api1 --mount type=bind,source="$(pwd)",target=/home/node/app -p 3000:3000 -d stok-api
```

### Docker Windows PowerShell
```sh
docker stop stok-api1
docker rm stok-api1
docker image rm stok-api
docker build . -t stok-api
docker run --name stok-api1 -v .:/app1 -p 3000:3000 -d stok-api
docker exec -d stok-api1 sh -c "killall node"
docker exec -d stok-api1 sh -c "cd /app1 && npm i && nodemon ."
```

### Örnek Kullanıcı:

```
curl 'http://localhost:3000/kullanici/giris' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  --data-raw '{"KullaniciAdi":"test","Sifre":"123456"}' \
  --compressed
```
