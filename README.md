# The Menufy ERP

## 1) Important : Change TempMail Variable For Testing

`.env`

```
#Mailing
TEMP_MAIL=nfjnqi151h@illubd.com
```

## 2) Start Backend using Docker

```
docker compose up -d --build
```

---

## 3) Filling Database

```
docker compose exec express-backend pnpm seed
```
