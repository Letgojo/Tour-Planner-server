"use strict";

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
} = require("firebase/auth");

const firebaseAdmin = require("firebase-admin/auth");

const { initializeApp } = require("firebase/app");

const firebaseConfig = require("./config/firebaseConfig");

const app = initializeApp(firebaseConfig.settingValues);

const auth = getAuth(app);

////// email 회원가입 //////

exports.signUpEmail = (email, password, userName) => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        sendEmailVerification(result.user);
        updateProfile(result.user, {
          displayName: userName,
        });
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

////// jwt 토큰 생성 //////

exports.createToken = (uid) => {
  // return new Promise((resolve, reject) => {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("already");
  //     } else {
  //     }
  //   });
  // });
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log(user.email);
  //   }
  // });
  // firebaseAdmin
  //   .getAuth()
  //   .createCustomToken(uid)
  //   .then((result) => {
  //     const jwt = result.toString();
  //     console.log(jwt);
  //     return jwt;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

// email 로그인
exports.signinEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 비밀번호 초기화
exports.resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

// 비밀번호 변경
exports.changePassword = async (newPassword) => {
  const user = getAuth().currentUser;

  return await updatePassword(user, newPassword);
};

// 유저 프로필 업데이트

exports.updateProfile = async (userName) => {
  const user = getAuth().currentUser;
  return await updateProfile(user, { displayName: userName });
};
