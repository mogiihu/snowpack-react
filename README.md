# h5 项目

---

## 启动

```shell
git clone http://52.80.155.217:8100/QuickView/commonVideoClient.git

cd commonVideoClient

git checkout h5

# 不要用 cnpm
npm install

npm start
```

## 测试部署

```
$ npm run build:test
```

## 生产部署

```
$ npm run build:prod
```

## 注意

❗️ snowpack 项目中不要使用 cnpm 装包，启动时会 snowpack 会扫描不到该包。
