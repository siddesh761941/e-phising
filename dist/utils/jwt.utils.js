"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQB9ktPsKOlQIXdfvb5F2+WgC0/Ve9s5k2XxyzvMiKxbSlFapi6h
Wi+R7nHRq2qvGp3omEdWlc0S4lnSr+ozuw8Zc7eTFN1Vjj1lXiTiS0fYCqsBtmUw
ocbBEhudlyTq0Q9uabfE+/N4tp2yc72XmhOU2QRfp8nmXekU//WvoxcMr6NOjxm6
bpxvLQhtyTVhF7ywQOokRQEYIY8Pqti/i/axpMTtIwId79HaFj9GdZj87WanocSU
b8D1lYc3MpDAmyobI3nBPqX9npI+qn2cH3L2+tbtPj2M4BBuIHevjEdsHMRf82+7
dJD56AmJD96LgVdtnt8IPdmIFBgyJKwppPFvAgMBAAECggEAFqlPq1e6uyY+970z
QEItz1MbRiiC6IIMLLWDhibIC/V+dwB0e9Pdr9U7Hx5zM0R3aMlKXnrMNnM4yIfM
mSdR00MJxvZF9zGjLM7vkxMI1RkfwUBcRIl9Z8xPxYHIPMQbp85WRqs9RfSWwuSW
O2ynyf3cBzMtgXBDJvIGMXsaJsSufQaK4UmF5EG2+8Z4WII3qic9+KkX74kreAg0
Xu/q44px2X4t+9fdrG+OPkAkzFQNR67BEreVu8wvxfq6Uarivg2LvvR2JNKFMHRF
5q7fGKD28IzJCEiodngGOCapaWMiTEAF9h5ferxStk3XrQbAKGQ7jDgvk2oIXOXi
OiMESQKBgQDHXTP6Mc4/b7kjQyg+V3/Dg7oc4qT8mSxfz+ZlJTh8uQeZ8qwaMFCs
ve6MO0f8MoSiR1YBi1dlWqSRKNVL4ctRjmOzqiRfDjD43aB9Kp4A5FBeMfJNNPI7
oUv0QTq5575sw+9WrY3Kjn5OHPYX1VLRNfutZL4HMjrPi/vzb6K12wKBgQChPzEt
LInIg+jL9e8ftamLrvw/OK8igSRDX/uYZZ0CdQC04esAYxKiMTB+jsufa9J4Uewz
5/Ea4JOBcuV0kXfvYxNUT63f9kZ8VN1GUM3sbGgHlH4OlKEgH5HlSTMFR6m9a8h7
XVUyZ/Q7M/vc25NjR1JqJR4eZ+jUetHVlFco/QKBgAxnwko5Oyo7W3vUO/bVHwAd
fEE74SROq7Iyj5WPoVoxcUWlEgx3IS3+i49ySOJqilJGuhVShFesMj1OGyejnzEt
+Qo+9hBsI6P4tnnTYw2PJ2kVFoyzVLddLArA3FShFPpTntr35bDK+RUHPFDzVznp
cAW0FRcBiyNLBJx7P9atAoGANGJeLInanUzVVWWpcMjIsvt/MV7N7sy7pjPJfeIN
Fx5Bw4HdobuN8yk90u+7ESirMLGUpexFNPEemqBkEPGtYBT006ArIaZVkdDULiLU
M2mohkXkigIZMmFvOWkFbUKxzzrz37gblIuXGaCywzaGdGtYR+mVFlW1m0nnX5aY
llUCgYAbuk1UMqKJ34i4f6MjTjsmgag/ZrdxlaIwJWI8GTpoI0289Uhg7jTNQFWZ
ywkqfMPIjUW4eLlRoeuXbCOxCcQzbKorxU+eq7rh0O8L0SOJ5wsaB/zSHatM64SW
ySwWl4X7/iSIxcE7bQ7KFmCErNGZCq4izDgBtVcKm+UzYP9T1A==
-----END RSA PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB9ktPsKOlQIXdfvb5F2+Wg
C0/Ve9s5k2XxyzvMiKxbSlFapi6hWi+R7nHRq2qvGp3omEdWlc0S4lnSr+ozuw8Z
c7eTFN1Vjj1lXiTiS0fYCqsBtmUwocbBEhudlyTq0Q9uabfE+/N4tp2yc72XmhOU
2QRfp8nmXekU//WvoxcMr6NOjxm6bpxvLQhtyTVhF7ywQOokRQEYIY8Pqti/i/ax
pMTtIwId79HaFj9GdZj87WanocSUb8D1lYc3MpDAmyobI3nBPqX9npI+qn2cH3L2
+tbtPj2M4BBuIHevjEdsHMRf82+7dJD56AmJD96LgVdtnt8IPdmIFBgyJKwppPFv
AgMBAAE=
-----END PUBLIC KEY-----`;
// sign jwt
function signJWT(payload, expiresIn) {
    return jsonwebtoken_1.default.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
}
exports.signJWT = signJWT;
// verify jwt
function verifyJWT(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return { payload: decoded, expired: false };
    }
    catch (error) {
        // @ts-ignore
        return { payload: null, expired: error.message.includes("jwt expired") };
    }
}
exports.verifyJWT = verifyJWT;
