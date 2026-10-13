# 🦋 Բարև 

A small gift website from one Armenian to another.
Someone scans the QR code, and a blue page full of butterflies opens. The butterflies fly away, and this message appears:

> **We are Armenians.**
> Երևի ամենասիրուն բաներից է ՀԱՅ լինելը, չէ՞
> This small thing is a part of me that I made, and I want you to have it.
> Always remember — our goal is to support each other ։).

After the message, the page shows your two stickers and a music player with your songs.

## Turn the website on (one time)

1. On GitHub, open this repo and go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**, then pick your branch and the `/ (root)` folder, and press **Save**.
3. After about a minute the site is live at **https://sirkamar23.github.io/Found-dream/**

`qr-code.png` (and `qr-code.svg` for printing) already points to that address, so you can print it or put it on your stickers.

## Add your stickers

Put your two images in the `stickers` folder with these exact names:

- `stickers/found-dream.png` (the Found Dream cartoon sticker)
- `stickers/glendale-bmw.png` (the Glendale Kopnik in his BMW)

Until you add them, the page shows a 🦋 and a 🚘 in their place.

## Add your music

1. Put your songs (`.mp3` or `.m4a`) in the `music` folder.
2. Open `songs.js` and add one line for each song:

```js
window.SONGS = [
  { title: "My First Song", artist: "Me", file: "music/my-first-song.mp3" },
  { title: "Another Song",  artist: "Me", file: "music/another-song.mp3" },
];
```

Phones don't let websites start music on their own, so people press **▶ Play my music** to hear it.
