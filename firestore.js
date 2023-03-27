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
  if (project === "게시글") {
    const docPages = Number(options.pages);

    if (options.docId) {
      const docRef = db.collection(project).doc(options.docId);
      const snapshot = await docRef.get();
      const startAtSnapshot = db
        .collection(project)
        .orderBy("date")
        .startAfter(snapshot);

      return await startAtSnapshot.limit(docPages).get();
    } else {
      const docRef = db.collection(project).orderBy("date").limit(docPages);

      return await docRef.get();
    }
  } else if (project === "댓글") {
    return await db
      .collection(project)
      .where("docId", "==", options.docId)
      .orderBy("date")
      .get();
  } else if (project === "회원정보") {
    return await db
      .collection(project)
      .where("email", "==", options.email)
      .get();
  }
};

exports.updateData = async (project, id, data) => {
  const docRef = db.collection(project).doc(id);
  return await docRef.update(data);
};
