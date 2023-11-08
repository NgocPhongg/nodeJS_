"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleType = exports.TokenType = exports.UserVerifyStatus = void 0;
var UserVerifyStatus;
(function (UserVerifyStatus) {
    UserVerifyStatus[UserVerifyStatus["Unverified"] = 0] = "Unverified";
    UserVerifyStatus[UserVerifyStatus["Verified"] = 1] = "Verified";
    UserVerifyStatus[UserVerifyStatus["Banned"] = 2] = "Banned"; // bị khóa
})(UserVerifyStatus || (exports.UserVerifyStatus = UserVerifyStatus = {}));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["AccsessToken"] = 0] = "AccsessToken";
    TokenType[TokenType["RefreshToken"] = 1] = "RefreshToken";
    TokenType[TokenType["ForgotPassWordToken"] = 2] = "ForgotPassWordToken";
    TokenType[TokenType["EmailVerifyToken"] = 3] = "EmailVerifyToken"; //3
})(TokenType || (exports.TokenType = TokenType = {}));
var RoleType;
(function (RoleType) {
    RoleType["Admin"] = "ADMIN";
    RoleType["customr"] = "CUSTOMER";
    RoleType["Shop"] = "SHOP";
})(RoleType || (exports.RoleType = RoleType = {}));
