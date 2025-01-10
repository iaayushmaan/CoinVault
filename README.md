# CoinVault

The web application tracks real-time cryptocurrency data, fetching price, market cap, and 24-hour change every 2 hours. It provides APIs to retrieve the latest data and calculate price volatility (standard deviation) based on the last 100 records stored in a database for analysis and insights.





##  API documentation

#### Stats



```http
  GET /api/v1/stats?coin=bitcoin

```

| Description                |
 | :------------------------- |
 | Fetches the latest cryptocurrency data, including the current price, market cap, and 24-hour price change for a specified coin. |

```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```
#### Deviation

```http
  GET /api/v1/deviation?coin=bitcoin

```
| Description                |
 | :------------------------- |
 | Calculates and returns the standard deviation of the price of a specified cryptocurrency based on the last 100 records stored in the database. |

```json
{
  "deviation": 4082.48
}
```



## Run Locally

1. Clone the project

```bash
  git clone https://github.com/iaayushmaan/CoinVault.git
```

2. Go to the project directory

```bash
  cd ./CoinVault
```
### Backend Setup

3. Install Dependencies
```bash
  npm i
```
4. Create a .env file.

5. Run the Application

```bash
  npm run dev
```
You are live on "http://localhost:3000/".


## Authors

- [@iaayushmaan](https://www.github.com/iaayushmaan)

