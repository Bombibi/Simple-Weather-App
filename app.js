import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const apiKey = "afd0b9bc08baf6d4766e411efb792784";

const location = [
  { state: "Kedah", lat: 6.155672, long: 100.569649 },
  { state: "Perak", lat: 4.69395, long: 101.117577 },
  { state: "Perlis", lat: 6.443589, long: 100.216599 },
  { state: "Penang", lat: 5.285153, long: 100.456238 },
  { state: "Negeri Sembilan", lat: 2.731813, long: 102.252502 },
  { state: "Penang", lat: 5.285153, long: 100.456238 },
  { state: "Kelantan", lat: 6.125397, long: 102.238068 },
  { state: "Sabah", lat: 5.420404, long: 116.796783 },
  { state: "Pahang", lat: 3.974341, long: 102.438057 },
  { state: "Selangor", lat: 3.509247, long: 101.524803 },
  { state: "Johor", lat: 1.937344, long: 103.366585 },
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", { content: "waiting for data..." });
  } catch (error) {
    console.error(error);
  }
});

app.post("/submit", async (req, res) => {
  try {
    const stateInput = req.body.state;
    let foundLocation = null;

    // looking for the state based on user input
    for (let i = 0; i < location.length; i++) {
      if (location[i].state === stateInput) {
        foundLocation = location[i];
        break; // Exit the loop once a match is found
      }
    }

    if (foundLocation) {
      const lat = foundLocation.lat;
      const long = foundLocation.long;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
      );

      const temp = response.data.main.temp;
      const weather = response.data.weather[0].main;
      const description = response.data.weather[0].description;

      const weatherImages = {
        Clear: "./images/sunny.svg",
        Clouds: "./images/cloudy.svg",
        Rain: "./images/rainy.svg",
        Thunderstorm: "./images/thunderstorm.svg",
      };

      const hasClouds = description.toLowerCase().includes("clouds");
      const hasRain = description.toLowerCase().includes("rain");
      const thunderstorm = description.toLowerCase().includes("thunderstorm");
      const clear = description.toLowerCase().includes("clear");

      let weatherImage = "/images/default.svg";

      if (hasClouds) {
        weatherImage = weatherImages["Clouds"]; // Set image for clouds
      } else if (hasRain) {
        weatherImage = weatherImages["Rain"]; // Set image for rain
      } else if (thunderstorm) {
        weatherImage = weatherImages["Thunderstorm"];
      } else if (clear) {
        weatherImage = weatherImages["Clear"];
      }

      res.render("index.ejs", {
        temp: temp,
        weather: weather,
        description: description,
        weatherImage: weatherImage,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
