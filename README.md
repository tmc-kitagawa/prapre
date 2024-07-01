# prapre

## Backend セットアップ
### db 作成
ターミナルで以下実行
```
$ createdb prapredb
```
### 環境変数設定
.env　backend直下に作成
```
DB_URL=jdbc:postgresql://localhost/prapredb
DB_USER=[your db user name here]
DB_PASS=[your db user password here]
```