var express = require('express');
const crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

exports.index = function(req, res) {
  Post.get(null, (err, posts) => {
    if(err) {
      posts = [];
    }
    res.render('index', { 
      title: '首页',
      posts
     });
  })
};

exports.user = function(req, res) {
  User.get(req.params.user, (err, user) => {
    if(!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Post.get(user.name, (err, posts) => {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', { 
        title: 'Express',
        posts,
      });
    })
  })
};

exports.reg= function(req, res) {
  res.render('reg', { title: '用户注册' });
};

exports.doReg = function(req, res) {
  if(req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的密码不一致');
    return res.redirect('/reg');
  }
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body['password']).digest('base64');

  var newUser = new User({
    name: req.body['username'],
    password,
  });

  User.get(newUser.name, (err, user) => {
    if(user) {
      err = "Usename already exist.";
    }
    if(err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }
    newUser.save((err) => {
      if(err){
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功了');
      res.redirect('/');
    });
  })
};

exports.login = function(req, res) {
  res.render('login', { title: '用户登入' });
};

exports.doLogin = function(req, res) {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body['password']).digest('base64');

  User.get(req.body['username'], (err, user) => {
    if(!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if(user.password != password) {
      req.flash('error', '密码不对');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/');
  })
};

exports.logOut = function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功');
  res.redirect('/');
};

exports.checkLogIn = function(req, res, next) {
  if(!req.session.user) {
    req.flash('error', '未登录');
    return res.redirect('/login');
  }
  next();
}

exports.checkNotLogIn = function(req, res, next) {
  if(req.session.user) {
    req.flash('error', '已登录');
    return res.redirect('/');
  }
  next();
}

exports.post= function(req, res) {
  res.render('post', { title: '用户发推' });
};

exports.doPost = function(req, res) {
  console.log('doPost')
  const currentUser = req.session.user;
  const name = currentUser.name;
  console.log(name)
  const newPost = new Post({
    name,
    post: req.body['post'],
  });
  
  newPost.save((err) => {
    if(err){
      console.log(err)
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发布成功了');
    res.redirect(`/u/${name}`);
  });
};