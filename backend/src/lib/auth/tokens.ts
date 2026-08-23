import { SignJWT, jwtVerify } from "jose";

const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!,
);

const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!,
);

export async function createAccessToken(userId: string) {
  return new SignJWT({
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
}

export async function createRefreshToken(userId: string) {
  return new SignJWT({
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  return jwtVerify(token, accessSecret);
}

export async function verifyRefreshToken(token: string) {
  return jwtVerify(token, refreshSecret);
}