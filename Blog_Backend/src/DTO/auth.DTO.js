class authDTO {
  constructor(user) {
    this._id = user._id;
    this.userName = user.userName;
    this.name = user.name;
    this.email = user.email;
  }
}

export { authDTO };
