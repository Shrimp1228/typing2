# 日本語タイピング練習アプリ

SvelteKitで作成された日本語タイピング練習Webアプリケーションです。<br>
このアプリケーションでは、従来のタイピング練習サイトと違い、漢字変換まで行います。<br>
変換するタイミングも含めて練習することにより、実際のタイピングに即したスキルの練習になります。<br>
また、タイピング練習は飽きやすいのでモチベーション維持が困難ですが、<br>
本アプリケーションでは美しい背景画像と癒しの音楽により、リラックスしながら練習を続けることができます。<br>

## ✨ 機能

- 🎯 **多彩な日本語お題** - 生成AIによって作成された様々なジャンルの練習テキスト
- 📊 **詳細統計表示** - KPM、CPM、タイム、削除回数を記録・表示
- 🎨 **美しい背景** - 廃墟やファンタジー風景のノスタルジックな高品質背景画像
- 🎵 **BGM対応** - 集中力を高める環境音楽
- 🌸 **日本語IME最適化** - 漢字変換に配慮したUI設計

## 🎮 遊び方

1. [TOPページ](https://shrimp1228.github.io/typing2/)にアクセスします。
2. **SPACEキー**を押すと通常モード、**ESCキー**を押すと制限時間モードでタイピングページに移動します。
3. タイピングページにアクセスすると、ランダムでお題が表示されます
4. 表示されたテキストを正確にタイピングしてください
5. 完了すると統計情報（KPM、CPM、タイム、削除回数）が表示されます
6. **ESCキー**を押すと、新しいお題に変更できます

## 🛠️ 技術スタック

- **フレームワーク**: SvelteKit
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: GitHub Pages (GitHub Actions)
- **パッケージマネージャー**: npm

## 🚀 ローカル開発

### 前提条件
- Node.js 18以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/Shrimp1228/typing2.git
cd typing2

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 📝 統計情報について

| 指標 | 説明 |
|------|------|
| **KPM** | Keys Per Minute - 1分間あたりのキー入力の総数 |
| **CPM** | Characters Per Minute - 1分間あたりの変換後の文字数 |
| **TIME** | タイピング開始から完了までの所要時間 |
| **BS/DEL** | BackspaceキーやDeleteキーの使用回数 |

## 🎨 カスタマイズ

### 背景画像の追加
`src/lib/utils/backgroundImages.ts` に新しい画像パスを追加

### お題の追加・編集
`src/lib/data/data.json` でタイピングお題を管理

### BGMの追加
`static/mp3/bgm/` に音楽ファイルを追加し、`src/lib/utils/bgmManager.ts` で設定


## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。<br>
詳細は[LICENSE](LICENSE)ファイルをご確認ください。<br>

## 🌟 クレジット

このプロジェクトでは以下のフリー素材を使用しています：

### 背景画像 - [ぱくたそ](https://www.pakutaso.com)
- [ジャングルの神殿　忘れられた古代文明の探検](https://www.pakutaso.com/20230709209post-47917.html)
- [ジャングルの秘境と古代文明の扉](https://www.pakutaso.com/20230703209post-47918.html)
- [崩壊した都市の中の静寂な戦車](https://www.pakutaso.com/20241158306post-52633.html)
- [時が止まった工場跡地に降り注ぐ雨と秋の情景](https://www.pakutaso.com/20250330072post-53259.html)
- [時間が刻んだ錆びついた線路と工場の遺構](https://www.pakutaso.com/20250257049post-53261.html)
- [海底から見上げる海底遺跡](https://www.pakutaso.com/20250911251post-55201.html)
- [濡れた床にネオンの光が反射する薄暗い廊下](https://www.pakutaso.com/20250559127post-54280.html)
- [荒野に残された昔日の面影を残す廃屋](https://www.pakutaso.com/20241237355post-53263.html)
- [雨上がりの静寂に包まれた都会の通路](https://www.pakutaso.com/20250624177post-54593.html)
- [霧に消えゆく古城の面影](https://www.pakutaso.com/20250318072post-53260.html)
- [霧の中に浮かび上がる廃墟の階段](https://www.pakutaso.com/20241211355post-53262.html)

### BGM - [BGMer](http://bgmer.net)
- [すこしの安息と](https://youtu.be/jQd3QKGxm2s)
- [ソメイヨシノ](https://youtu.be/91xkv3pz9rw)
- [みやびごころ](https://youtu.be/BC-H2Frjf_M)
- [別れの時](https://youtu.be/BNz66r7L6oo)
- [千年の孤独](https://youtu.be/g1rjz1mUNLg)
- [屍を越えて](https://youtu.be/l5pz76G5BhM)
- [憂愁](https://youtu.be/yc_cJjOvs3M)
- [日曜のおわりに](https://youtu.be/TCEl2hujuG0)
- [母なる海へ](https://youtu.be/4uZnppQ2-zw)
- [淡々と流れていく時間](https://youtu.be/j3VeYvS-uAQ)

### 効果音
- タイプ音：[PC　キーボード06] - [オトロジック(CC BY 4.0)](https://otologic.jp)
