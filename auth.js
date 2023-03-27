"use strict";

const firebase = require("./firebase");
const firestore = require("./firestore");
const router = require("express").Router();
const { v4 } = require("uuid");

const firebaseConfigKey = require("./config/firebaseConfig");

const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

////// 회원가입  //////

router.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  delete req.body.password;

  firebase
    .signUpEmail(email, password)
    .then((result) => {
      console.log("Sign Up Succeeded!");
      res.sendStatus(200);
      firestore.addData("회원정보", req.body);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 로그인 //////

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  firebase
    .signinEmail(email, password)
    .then((result) => {
      if (!result.user.emailVerified) {
        console.log("Not Verified Email!");
        res.status(401).send({ message: "Not-Verified-Email" });
      } else {
        console.log("Sign In Succeeded");
        firebase.createToken(uuid());
        res.sendStatus(200);
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 비밀번호 초기화 //////

router.post("/reset-password", (req, res) => {
  const email = req.body.email;

  firebase
    .resetPassword(email)
    .then((result) => {
      console.log("reset mail Sent!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 유저 찾기 //////
router.get("/search-user", (req, res) => {
  const options = req.query;

  firestore
    .getData("회원정보", options)
    .then((result) => {
      console.log("find user!");

      result.forEach((doc) => {
        console.log(doc.data());
        res.status(200).send(doc.data());
      });
    })
    .catch((error) => {
      res.status(404).send({ message: error.message });
    });
});

////// ****** //////

router.patch("/settings", (req, res) => {
  const options = req.body;

  firestore
    .updateData("회원정보", docId, data)
    .then((result) => {
      console.log("post updated!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// firebase config key 전송 //////

router.get("/config-key", (req, res) => {
  res.status(200).send(firebaseConfigKey.settingValues);
});

module.exports = router;
