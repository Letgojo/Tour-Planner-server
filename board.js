"use strict";

const firebase = require("./firebase");
const firestore = require("./firestore");
const router = require("express").Router();

/* 

게시글 관련 api 요청 처리 

*/

////// 게시글 작성 //////

router.post("/post", (req, res) => {
  const data = req.body;
  data.date = "" + Date.now();

  firestore
    .addData("post", data)
    .then((result) => {
      console.log("post succeeded!");
      res.status(200).send({ docId: result });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 게시글 수정 //////

router.patch("/post", (req, res) => {
  const docId = req.body.docId;

  delete req.body.docId;

  const data = req.body;

  firestore
    .updateData("post", docId, data)
    .then((result) => {
      console.log("post updated!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 게시글 가져오기 //////

router.get("/post", (req, res) => {
  const options = req.query;

  firestore
    .getData("post", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const value = doc.data();
        value.date = convertDateFormat(value.date);
        jsonResult.push(value);
      });

      res.status(200).send(jsonResult);
      console.log("Post Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Fail");
    });
});

////// 게시글 삭제 //////

router.delete("/post/:id", (req, res) => {
  const docId = req.params.id;

  firestore
    .deleteData("post", docId)
    .then((result) => {
      console.log("post deleted!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Delete Failed!");
      res.status(401).send({ message: error });
    });
});

////// 댓글 작성 //////

router.post("/reply", (req, res) => {
  const data = req.body;
  data.date = Date.now();

  firestore
    .addData("reply", data)
    .then((result) => {
      console.log("reply succeeded!");
      res.status(200).send({ replyId: result });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 댓글 수정 //////

router.patch("/reply", (req, res) => {
  const replyId = req.body.replyId;
  delete req.body.replyId;
  const data = req.body;

  firestore
    .updateData("reply", replyId, data)
    .then((result) => {
      console.log("reply edit succeeded!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
});

////// 댓글 가져오기 //////

router.get("/reply", (req, res) => {
  const options = req.query;

  firestore
    .getData("reply", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const value = doc.data();
        value.date = convertDateFormat(value.date);
        jsonResult.push(value);
      });

      res.status(200).send(jsonResult);
      console.log("Reply Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Fail");
    });
});

////// 댓글 삭제 //////

router.delete("/reply", (req, res) => {
  const replyId = req.params.id;

  firestore
    .deleteData("reply", replyId)
    .then((result) => {
      console.log("reply deleted!");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Delete Failed!");
      res.status(400).send({ message: error });
    });
});

////// 날짜 가져오는 함수 //////

const convertDateFormat = (date) => {
  const prevFormat = new Date(date);

  return (
    prevFormat.toLocaleDateString() +
    " " +
    prevFormat.toTimeString().split(" ")[0]
  );
};

module.exports = router;
