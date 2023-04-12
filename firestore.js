"use strict";

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const winston = require("winston");

const { v4 } = require("uuid");

const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

const serviceAccount = require("./config/accountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

exports.addData = (project, data) => {
  const docId = uuid();

  data.uid = docId;

  const docRef = db.collection(project).doc(docId);

  return new Promise(async (resolve, reject) => {
    await docRef
      .set(data)
      .then((result) => {
        resolve(docId);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteData = async (project, id) => {
  const docRef = db.collection(project).doc(id);

  return new Promise(async (resolve, reject) => {
    if (!docRef.get().exists) {
      reject("Fail");
    } else {
      resolve(docRef.delete());
    }
  });
};

exports.getData = async (project, options) => {
  if (project === "post") {
    const docPages = Number(options.pages);

    if (options.docId) { // 나중에 DB 커서 적용해서 제대로 고쳐야 함
      const docRef = db.collection(project).doc(options.docId);
      const snapshot = await docRef.get();
      const startAtSnapshot = db
        .collection(project)
        .orderBy("date", "desc")
        .startAfter(snapshot);

      return await startAtSnapshot.limit(docPages).get();
    } else {
      const docRef = db
        .collection(project)
        .orderBy("date", "desc")
        .limit(docPages);

      return await docRef.get();
    }
  } else if (project === "reply") {
    return await db
      .collection(project)
      .where("docId", "==", options.docId)
      .orderBy("date", "desc")
      .get();
  } else if (project === "회원정보") {
    if (options.email) {
      return await db
        .collection(project)
        .where("email", "==", options.email)
        .get();
    }
    return await db.collection(project).doc(options.uid).get();
  }
};

exports.updateData = async (project, id, data) => {
  const docRef = db.collection(project).doc(id);
  return await docRef.update(data);
};
