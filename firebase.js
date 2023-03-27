"use strict";

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} = require("firebase/auth");

const firebaseAdmin = require("firebase-admin/auth");

const { initializeApp } = require("firebase/app");

const firebaseConfig = require("./config/firebaseConfig");

const app = initializeApp(firebaseConfig.settingValues);

const auth = getAuth(app);

////// email 회원가입 //////

exports.signUpEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        sendEmailVerification(result.user);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

////// jwt 토큰 생성 //////

exports.createToken = (uid) => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.email);
    }
  });
  firebaseAdmin
    .getAuth()
    .createCustomToken(uid)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

// email 로그인
exports.signinEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 비밀번호 초기화
exports.resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};
