import { Request, Response } from "express";
import config from "config";
import { createSession, findSessions } from "../service/session.services";
import { validatePassword } from "../service/user.services";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";

export async function createUserSessionHandler(req: Request, res: Response) {
  //validate user's password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || " ");

  // create a access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );
  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 1year
  );

  // return access & refresh token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}
