

import postgres from "../config/postgre";
import { UserDataType } from "../types";


class AuthModel {



  // ##### GET user details from email id
  public async findUserByEmail(email: string): Promise<UserDataType> {

    return (await postgres.db.query("SELECT *, '*****' AS password FROM users WHERE email = $1", [email])).rows[0];

  }



  // ##### GET user details from id
  public async findUserById(userId: string): Promise<UserDataType> {

    return (await postgres.db.query("SELECT *, '*****' AS password FROM users WHERE id = $1", [userId])).rows[0];

  }



  // ##### CREATE new user
  public async createNewUser({ name, email, hashedPassword }: { name: string; email: string; hashedPassword: string; }): Promise<UserDataType> {

    return (await postgres.db.query("INSERT INTO users ( name, email, password ) VALUES ( $1, $2, $3 ) RETURNING *, '*****' AS password",[name, email, hashedPassword])).rows[0];

  }



  // ##### update user
  public async updateUser({ userId, name, email, hashedPassword }: { userId: string; name: string; email: string; hashedPassword: string; }): Promise<UserDataType> {

    return (await postgres.db.query("UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *, '*****' AS password ", [name, email, hashedPassword, userId])).rows[0];

  }



  // ##### DELETE user
  public async deleteUser(userId: string): Promise<UserDataType> {

    return (await postgres.db.query("DELETE FROM users WHERE id = $1 RETURNING *, '*****' AS password ", [userId])).rows[0];

  }


}


const authModel: AuthModel = new AuthModel();



export default authModel;