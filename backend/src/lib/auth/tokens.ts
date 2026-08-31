import { SignJWT, jwtVerify } from "jose";

const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!,
);

const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!,
);

const resetSecret = new TextEncoder().encode(
  process.env.JWT_RESET_SECRET!,
)

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
  const { payload } = await jwtVerify(token, refreshSecret);

  if (payload.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  if (typeof payload.sub !== "string") {
    throw new Error("Invalid token object");
  }

  return payload.sub;
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  return new SignJWT({
    type: "password_reset",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(resetSecret);
}

export async function verifyPasswordResetToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, resetSecret);

  if (payload.type !== "password_reset") {
    throw new Error("Invalid token type");
  }

  if (typeof payload.sub !== "string") {
    throw new Error("Invalid token subject");
  }

  return payload.sub;
}