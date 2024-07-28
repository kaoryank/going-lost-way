# AWS Location Service サンプルアプリケーション

このプロジェクトは、AWS Location Serviceを使用して地図上に位置データを結んだ軌跡を描画します。
TypeScriptを使用したReactアプリケーションです。

## 目次

- [AWS Location Service サンプルアプリケーション](#aws-location-service-サンプルアプリケーション)
  - [目次](#目次)
  - [特徴](#特徴)
  - [前提条件](#前提条件)
  - [インストール](#インストール)
  - [使用方法](#使用方法)
  - [環境変数](#環境変数)
  - [ライセンス](#ライセンス)

## 特徴

- AWS Location Serviceを使用して地図を表示します
- CSVファイルから位置データを読み込んでいます
  - サンプルとしてCSVファイルには、四谷三丁目を出発し、周辺の神社仏閣を巡りながら市ヶ谷健保会館まで歩いた軌跡が記録されています。
  - 猛暑の最中屋外で、位置情報データを記録することは、熱中症のリスクの高まる行為となる恐れがありますので、涼しい季節や時間帯を選ぶなど、熱中症の対策をおこなった上で実施して下さい。
- AWS Location Serviceの地図上に、Reactのプログラムで点と線を描画しています
  - まずは、サンプルデータの迷走ぶりを堪能ください。

## 前提条件

- Node.js（バージョン14以上）
- AWSアカウント
- 適切な権限を持つAWS IAMロール
- AWS Location Serviceの有効化
  - AWSの使用料がかかります
- MapLibre GL JS

## インストール

1. リポジトリをクローンします:

   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. 依存関係をインストールします:

   ```sh
   npm install
   ```

3. ルートディレクトリに `.env` ファイルを作成し、AWS Location Serviceの認証情報を追加します:

   ```makefile
   VITE_MAP_API_KEY=your-aws-location-service-api-key
   VITE_MAP_NAME=your-map-name
   VITE_MAP_REGION=your-region
   ```

4. `locations.csv` ファイルを `public/data` ディレクトリに配置します。

- CSVファイルのカラムには、必ず"latitude"（緯度）と"longitude"（経度）を含めて下さい。
- CSVファイルの行の順番に線が引かれます。日時情報は使用しません。

## 使用方法

開発サーバーを起動します:

```sh
npm run dev
```

ブラウザで `http://localhost:5173/` にアクセスします。

## 環境変数

このアプリケーションは以下の環境変数を必要とします:

- `VITE_MAP_API_KEY`: AWS Location Service APIキー
- `VITE_MAP_NAME`: AWS Location Serviceの地図名
- `VITE_MAP_REGION`: AWSリージョン

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細は [LICENSE](LICENSE) ファイルを参照してください。
