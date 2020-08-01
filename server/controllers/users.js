const User = require('./../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  findAll: async (req, res) => {
    try {
      const payload = await User.findAll();

      return res.status(200).send(payload);
    } catch (error) {
      return res.status(500).send({
        message: error.message || 'There was an error fetching users.'
      });
    }
  },

  // getById: async (req, res) => {
  //   try {
  //     const user = await User.findByPk(req.params.id);

  //     return res.status(200).json({ payload: user });
  //   } catch (error) {
  //     return res.status(400).json({
  //       message: "There was an error fetching user.",
  //       error: error.message
  //     });
  //   }
  // },

  // create: async (req, res) => {
  //   try {
  //     const { email, password, firstName, lastName, isAdmin = false } = req.body;

  //     const newUser = {
  //       email: email.toLowerCase(),
  //       password,
  //       firstName,
  //       lastName,
  //       isAdmin
  //     };

  //     if (!email || !password) {
  //       return res.status(400).json({ message: "Please enter an email and password." });
  //     }

  //     const existingEmail = await User.findOne({
  //       where: { email: newUser.email }
  //     });

  //     if (existingEmail) {
  //       return res.status(400).json({ message: "An account with that email already exists." });
  //     }

  //     const salt = await bcrypt.genSalt(10);

  //     newUser.password = await bcrypt.hash(password, salt);

  //     const user = await User.create(newUser);

  //     const payload = {
  //       id: user.id,
  //       email: user.email,
  //       isAdmin: user.isAdmin,
  //       firstName: user.firstName,
  //       lastName: user.lastName
  //     };

  //     const token = await jwt.sign(payload, process.env.SECRET_OR_KEY, {
  //       expiresIn: "8h"
  //     });

  //     return res.status(200).json({
  //       message: "Account created successfully.",
  //       payload: `Bearer ${token}`
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: "There was an error creating account.",
  //       error: error.message
  //     });
  //   }
  // },

  // updateById: async (req, res) => {
  //   try {
  //     const { email, password, firstName, lastName, isAdmin = false } = req.body;

  //     const user = {
  //       email: email.toLowerCase(),
  //       password,
  //       firstName,
  //       lastName,
  //       isAdmin
  //     };

  //     const salt = await bcrypt.genSalt(10);

  //     user.password = await bcrypt.hash(password, salt);

  //     const updated = await User.update(user, {
  //       where: { id: req.params.id }
  //     });

  //     if (!updated) {
  //       return res.status(404).json({ message: "User not updated." });
  //     }

  //     return res.status(200).json({ message: "User updated successfully." });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: "There was an error updating User.",
  //       error: error.message
  //     });
  //   }
  // },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return res.status(500).send({ message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const payload = {
          id: user.id,
          isAdmin: user.isAdmin,
          email: user.email
        };

        const token = await jwt.sign(payload, process.env.SECRET_OR_KEY, {
          expiresIn: '8h'
        });

        return res.status(200).json({
          message: 'User logged in successfully.',
          payload: `Bearer ${token}`
        });
      }

      return res.status(400).send({ message: 'Password incorrect.' });
    } catch (error) {
      return res.status(500).send({
        message: error.message || 'There was an error logging in this user.'
      });
    }
  }

  // current: (req, res) => {
  //   return res.status(200).json({
  //     payload: {
  //       id: req.user.id,
  //       isAdmin: req.user.isAdmin,
  //       email: req.user.email,
  //       firstName: req.user.firstName,
  //       lastName: req.user.lastName
  //     }
  //   });
  // },

  // deleteById: async (req, res) => {
  //   try {
  //     const deleted = !!(await User.destroy({
  //       where: { id: req.params.id }
  //     }));

  //     if (!deleted) {
  //       return res.status(404).json({ message: "User not deleted." });
  //     }

  //     return res.status(200).json({ message: "User deleted successfully." });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: "There was an error deleting user.",
  //       error: error.message
  //     });
  //   }
  // }
};
