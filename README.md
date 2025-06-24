# 📱 BelieveScreener

<div align="center">
  <p><strong>Real-time DEx Token Screener for Mobile</strong></p>
  <p>A clean React Native app for tracking cryptocurrency tokens using DexScreener API</p>
</div>

## ✨ Features

- 📊 Real-time token data (price, market cap, volatility)
- 🔍 Filter tokens by price, market cap, and volatility
- ⚡ Fast performance with clean UI
- 📱 Cross-platform (iOS & Android)

## 📱 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/48009514-f9de-45ae-aeed-960478b62d85" width="180" alt="Home"/><br/><b>light mode</b></td>
      <td><img src="https://github.com/user-attachments/assets/4a1cb6b6-0936-4ea6-a947-df6b3b89635f" width="180" alt="Details"/><br/><b>dark mode</b></td>
      <td><img src="https://github.com/user-attachments/assets/753e80e4-9bd6-4c43-afd2-0aff736bc751" width="180" alt="Filter"/><br/><b>token detailes</b></td>
      <td><img src="https://github.com/user-attachments/assets/da6f745b-8a8a-47f3-88dd-077c249d7780" width="180" alt="Dark Mode"/><br/><b>filter</b></td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/18bharathkumar/Believescreener.git
cd Believescreener

# Install dependencies
npm install

# Install Expo CLI (if needed)
npm install -g expo-cli

# Start the app
npx expo start
```

## 🌐 API

Uses **DexScreener API** endpoints:
- `GET /token-profiles/latest/v1` - Latest token profiles
- `GET /tokens/v1/{chainId}/{tokenAddresses}` - Token details

## 🛠️ Tech Stack

- React Native + Expo
- DexScreener API
- JavaScript

## 👨‍💻 Author

**Bharath Kumar** - [@18bharathkumar](https://github.com/18bharathkumar)
