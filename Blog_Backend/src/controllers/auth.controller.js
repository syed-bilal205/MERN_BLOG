import Joi from "joi";
import jwt from "jsonwebtoken";
import { options } from "../constant.js";
import { authDTO } from "../DTO/auth.DTO.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something  went wrong while generating refresh and access tokens"
    );
  }
};

export const register = asyncHandler(async (req, res) => {
  /*
  get the data
  check the all fields are filled
  give error if not filled
  check user is already available or not
  validate the data
  hash the password 
  add the data to database
  generate tokens 
  give the response
  */

  const userRegisterSchema = Joi.object({
    userName: Joi.string().max(30).min(5).required(),
    name: Joi.string().max(30).min(3).required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
      .required(),
    confirmPassword: Joi.ref("password"),
  });

  const { error } = userRegisterSchema.validate(req.body);

  if (error) {
    throw new ApiError(422, `Validation Error ${error.message}`);
  }

  const { name, userName, email, password } = req.body;

  if ([name, userName, email, password].some((filed) => filed?.trim() === "")) {
    throw new ApiError(422, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ userName, email }],
  });

  if (existingUser) {
    throw new ApiError(
      422,
      "User already exist with same username or already registered!!"
    );
  }

  const user = await User.create({
    name: name,
    userName: userName.toLowerCase().trim(),
    email: email,
    password: password,
  });

  if (!user) {
    throw new ApiError(400, "Something went wrong while creating user!!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const createdUser = new authDTO(user);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { createdUser, auth: true },
        "User registered successfully"
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  /*
  get the data
  validate the data 
  check all fields are filed
  check is user is register of not
  compare the password
  generate the token
  give the response
  */

  const userLoginSchema = Joi.object({
    userName: Joi.string().min(5).max(30),
    email: Joi.string().email(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
      .required(),
  }).or("userName", "email");

  const { error } = userLoginSchema.validate(req.body);

  if (error) {
    throw new ApiError(401, `Login validation failed ${error.message}`);
  }

  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "username or password is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User doesn't exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const updatedRefreshToken = await User.findByIdAndUpdate(
    user._id,
    {
      refreshToken: refreshToken,
    },
    { new: true }
  );

  const loggedInUser = new authDTO(updatedRefreshToken);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", updatedRefreshToken.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, auth: true },
        "user login successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  /*
  get the data from the req.user with the help of middleware
  verify JWT
  find the user by id
  update the user refreshToken in data base
  is not give the error
  if ok give the response
  */
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { auth: false }, "User logout successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  /*
  get the refreshToken data from cookies
  validate the data
  verify with jsonwebtoken
  find the user
  then check the both refreshToken
  if not give the error
  generate the access and refresh token
  store in data base 
  store in cookie give the response
  */
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  // console.log(token);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token does not exist");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decoded) {
      throw new ApiError(401, "Refresh token is expire");
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token!!");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access and refreshToken are refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  /*
  get the user password from req.body old + new
  validate the data
  if error give the error
  find the user 
  update the password
  store the password 
  give the response
  */

  const userChangePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
      .required(),
    confirmPassword: Joi.ref("newPassword"),
  });

  const { error } = userChangePasswordSchema.validate(req.body);

  if (error) {
    throw new ApiError(422, `Validation Error ${error.message}`);
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password update Successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  /*
  get the user data from req.user
  and give the response
  */

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export const updateAccountsDetails = asyncHandler(async (req, res) => {
  /*
  get the user data
  validate the data
  if error give the error
  then find the user and update
  store the data in database
  give the response
  */

  const updateUserAccountSchema = Joi.object({
    name: Joi.string().max(30).min(3),
    email: Joi.string().email(),
    userName: Joi.string().max(30).min(5),
  });

  const { error } = updateUserAccountSchema.validate(req.body);

  if (error) {
    throw new ApiError(422, `Validation Error ${error.message}`);
  }

  const { name, userName, email } = req.body;

  if (!name && !userName && !email) {
    throw new ApiError(400, "At least one field is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name: name,
        userName: userName,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User account details has been updated"));
});
