export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum TokenType {
  AccsessToken, //0
  RefreshToken, //1
  ForgotPassWordToken, // 2
  EmailVerifyToken //3
}
export enum RoleType {
  Admin = 'ADMIN',
  customr = 'CUSTOMER',
  Shop = 'SHOP'
}
