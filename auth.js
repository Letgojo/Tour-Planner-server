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

/*
 *
 *  회원가입
 *
 */
router.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;

  delete req.body.password;

  firebase
    .signUpEmail(email, password, userName)
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

/*
 *
 *  로그인
 *
 */
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  firebase
    .signinEmail(email, password)
    .then((result) => {
      const a = 1;
      if (a != 1) {
        console.log("Not Verified Email!");
        res.status(401).send({ message: "Not-Verified-Email" });
      } else {
        // const jwt = firebase.createToken(uuid());

        const options = { email: result.user.email };
        firestore.getData("회원정보", options).then((result) => {
          result.forEach((doc) => {
            const data = doc.data();
            console.log("Sign In Succeeded");
            res.status(200).send(data);
          });
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

/*
 *
 *  비밀번호 초기화
 *
 */
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

/*
 *
 *  사용자 검색 처리
 *
 */
router.get("/search-user", (req, res) => {
  const options = req.query;

  firestore
    .getData("회원정보", options)
    .then((result) => {
      result.forEach((doc) => {
        console.log("find user!");
        res.status(200).send(doc.data());
      });
    })
    .catch((error) => {
      res.status(404).send({ message: error.message });
    });
});

/*
 *
 *  사용자 프로필 설정
 *
 */
router.patch("/settings", (req, res) => {
  const options = req.body;

  /* 
  
    비밀번호 변경
  
  */
  if (options.newPassword) {
    console.log(options.newPassword);
    console.log("in!!");
    firebase
      .changePassword(options.newPassword)
      .then(() => {
        console.log("user profiles(password) updated!");
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ message: error.message });
      });
  }

  /* 
  
    전화번호 또는 닉네임 변경
  
  */
  if (options.phoneNum || options.userName) {
    const uid = options.uid;

    for (const x in options) {
      if (!options[x]) {
        delete options[x];
      }
    }

    firestore
      .updateData("회원정보", uid, options)
      .then((result) => {
        console.log("user profile updated!");
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(400).send({ message: error.message });
      });

    firebase.updateProfile(options.userName);
  }
});

/*
 *
 *  회원 탈퇴
 *
 */
router.post("/delete-user", (req, res) => {
  const options = req.body;

  firebase
    .deleteUser(options)
    .then((result) => {
      console.log("user deleted!");
      // firestore
      //   .deleteData("회원정보", options.email)
      //   .then(() => {})
      //   .catch((error) => {
      //     console.log(error);
      //   });
      res.sendStatus(200);
    })
    .catch((error) => {
      //console.log(error);
      res.sendStatus(400);
    });
});

/*
 *
 *   firebase SDK 키 값 전송
 *
 */
router.get("/config-key", (req, res) => {
  res.status(200).send(firebaseConfigKey.settingValues);
});

module.exports = router;
