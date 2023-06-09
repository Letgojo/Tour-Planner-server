"use strict";

const firebase = require("./firebase");
const firestore = require("./firestore");
const router = require("express").Router();
const request = require("request");
const haversine = require("haversine");

router.get("/tour", (req, res) => {
  const options = req.query;
  firestore
    .getData(options.tourType, options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        let temp = doc.data();
        temp["타입"] = options.tourType;
        temp["주소"] = doc.data()["장소"];
        temp["이름"] = doc.data()["관광지명"];
        delete temp["관광지명"];
        delete temp["장소"];
        jsonResult.push(temp);
      });

      res.status(200).send(jsonResult);
      console.log("Tour Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

router.get("/restaurant", (req, res) => {
  const options = req.query;
  firestore
    .getData("음식점", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const temp = doc.data();
        temp["이름"] = doc.id;
        temp["타입"] = "음식점";

        jsonResult.push(temp);
      });

      res.status(200).send(jsonResult);
      console.log("restaurant Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.get("/restaurant-img", (req, res) => {
  const options = req.query;

  firestore
    .getData("음식점 정보", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const temp = doc.id;
        console.log(temp);
        jsonResult.push(temp);
      });

      res.status(200).send(jsonResult);
      console.log("restaurant META Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.get("/tour-data", (req, res) => {
  const options = req.query;

  firestore
    .getData("지역정보", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const temp = doc.id;
        console.log(temp);
        jsonResult.push(temp);
      });

      console.log(jsonResult);

      res.status(200).send(jsonResult);
      console.log("tour META Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.get("/recommand-route", (req, res) => {
  // 관광 타입마다 골고루 섞어서 넣기
  const options = req.query;
  //options.days = 3;
  let returnResult = [];
  let jsonResult = [];
  let randomList = [];
  let restaurantList = [];

  firestore
    .getData(options.tourType, options)
    .then((result) => {
      result.forEach((doc) => {
        let temp = doc.data();
        temp["타입"] = options.tourType;
        temp["주소"] = doc.data()["장소"];
        temp["이름"] = doc.data()["관광지명"];
        delete temp["관광지명"];
        delete temp["장소"];
        jsonResult.push(temp);
      });

      shuffle(jsonResult);

      for (let i = 0; i < options.days * 2; i++) {
        randomList[i] = jsonResult[i];
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });

  firestore
    .getData("음식점", options)
    .then((result) => {
      result.forEach((doc) => {
        const temp = doc.data();

        temp["이름"] = doc.id;
        temp["타입"] = "음식점";
        restaurantList.push(temp);
      });

      shuffle(restaurantList);

      let temp = [];

      for (let i = 0; i < options.days * 3; i++) {
        temp.push(restaurantList[i]);
      }

      temp = optimizeRoute(temp);
      randomList = optimizeRoute(randomList);

      for (let i = 0; i < options.days; i++) {
        let tmp = [];
        for (let k = 1; k < 6; k++) {
          if (k % 2 != 0) {
            // 홀수
            const element = temp.shift();
            tmp.push(element);
          } else {
            const element = randomList.shift();
            tmp.push(element);
          }
        }

        returnResult.push(tmp);
      }

      console.log(returnResult);
      res.status(200).send(returnResult);
      console.log("recommand-tour Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

router.post("/send-route", (req, res) => {
  const options = req.body;

  firestore
    .addData("result_test", options)
    .then((result) => {
      console.log("route Send Succeeded!!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.get("/route-result", (req, res) => {
  const options = req.query;

  firestore
    .getData("result_test", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const temp = doc.data();

        jsonResult.push(temp);
      });
      res.status(200).send(jsonResult);
      console.log("route result Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get("/get-to", (req, res) => {
  const options = {
    uri: "http://10.178.0.3:50020/",
  };
  request.get(options, function (error, response, body) {
    //callback
  });
});

router.get("/get-to-resizeimg", (req, res) => {
  const options = {
    uri: "http://10.178.0.3:50020/resizeimg",
  };
  request.get(options, function (error, response, body) {
    //callback
  });
});

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomPosition = Math.floor(Math.random() * (index + 1));

    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }
}

function optimizeRoute(array) {
  let temp = array;
  let result = [];

  let first = {
    latitude: 35.181926,
    longitude: 129.176754,
  };

  while (temp.length > 1) {
    let distance = [];

    for (let i = 0; i < temp.length; i++) {
      let position = {
        latitude: temp[i]["위도"],
        longitude: temp[i]["경도"],
      };
      temp[i]["거리"] = haversine(first, position);
      distance.push(temp[i]["거리"]);
    }

    distance.sort();

    for (let i = 0; i < temp.length; i++) {
      if (temp[i]["거리"] == distance[0]) {
        result.push(temp[i]);
        first["latitude"] = temp[i]["위도"];
        first["longitude"] = temp[i]["경도"];
        temp.splice(i, 1);

        break;
      }
    }
  }
  result.push(temp[0]);

  return result;
}
module.exports = router;
