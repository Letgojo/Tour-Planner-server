"use strict";

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  signOut,
} = require("firebase/auth");

const firebaseAdmin = require("firebase-admin/auth");

const { initializeApp } = require("firebase/app");

const firebaseConfig = require("./config/firebaseConfig");
const { firestore } = require("firebase-admin");

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

// 회원 재인증
exports.reauthenticateUser = (email, password) => {
  const user = getAuth().currentUser;

  return new Promise((resolve, reject) => {
    this.signinEmail(email, password)
      .then((result) => {
        reauthenticateWithCredential(user, result);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 회원 삭제
exports.deleteUser = async (options) => {
  this.signinEmail(options.email, options.password)
    .then((result) => {
      const user = getAuth().currentUser;
      return deleteUser(user);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.signOut = async () => {
  return await signOut(getAuth());
};
