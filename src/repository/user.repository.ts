import knexDB from '../db/knex';
import { User } from '../interface/user.interface';
import { UserNotFound, DatabaseError } from "../common/http-exeption"
export class UserRepository {
    public knx: typeof knexDB;

    constructor() {
        this.knx = knexDB;
    }

    async getAllUsers(): Promise<User[]> {

        return new Promise(async (resolve, reject) => {
            this.knx.db
                .select("*")
                .from("userdb")
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
    async getUserbyId(id: number): Promise<User[]> {
        return new Promise(async (resolve, reject) => {
            await this.knx.db("userdb")
                .select("*")
                .where({ id: id })
                .first()
                .then((result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(new UserNotFound("usernotfound"));
                    }
                })
                .catch(() => {
                    reject(new DatabaseError("databaseerr"));
                });
        });
    }
    async createUser(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            this.knx.db("userdb").insert(user)
                .returning("*")
                .then((result) => {
                    resolve(result[0]);
                })
                .catch((error) => {
                    reject(error);

                })
        })
    }
    async updateUser(body: User): Promise<User[]> {
        return new Promise(async (resolve, reject) => {
            await this.knx.db("userdb")
                .select("*")
                .where("id",body.id)
                .first()                         
                .then((result) => {
                    if (result) {
                        this.knx.db("userdb").select("*").where({ id: body.id }).update(body, ["id", "isim", "lokasyon"]).then((result)=>{
                            resolve(result)
                        })
                    }
                    else {
                        reject(new UserNotFound("usernotfound"));
                    }
                })
                .catch(() => {
                    reject(new DatabaseError("databaseerr"));

                })
        })
    }
    async deleteUser(id: number): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            await this.knx.db("userdb").where({ id: id }).del()
                .then((result) => {
                    if (result) {
                        resolve(true);
                    }
                    else {
                        reject(new UserNotFound("usernotfound"));
                    }
                })
                .catch((error) => {
                    reject(error);

                })
        })
    }
}


//then catch yapısı eklenecek