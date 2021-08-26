import { Router, Response, Request, NextFunction } from "express";
import { UserServices } from "../services/user.service";
import schema from "../validation/user.validator";
import Joi from "joi";
import { ValidationError } from "../common/http-exeption"
import paginationMiddleware from "../middlewares/pagination.middleware";
import  { PaginationOptions } from "../interface/requestPagination.interface";
export class UserController {
    public router: Router;
    private userService: UserServices;
    private paginationOptions: PaginationOptions;
        constructor() {
        this.router = Router();
        this.userService = new UserServices();
        this.paginationOptions = new PaginationOptions;
        this.routes();
    }
    getAllUsers(req: Request, res: Response, next: NextFunction) {
            const options = req.query;
            options.orderBy = "created_at"
            
            this.userService.getAllUsers(options).then(user=>{
                return res.status(200).send(user);
            })
            
            .catch((err) => {
                next(err);
            });

    }
    getUserbyId(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        schema.idControl.validateAsync({ id }).then((validatedId) => {
            this.userService.getUserbyId(id).then((user) => {
                return res.status(200).send(user);
            })
                .catch((err) => {
                    next(err);
                });
        })
            .catch((err: Joi.ValidationError) => {
                next(new ValidationError(err.message));
            })
    }
    createUser(req: Request, res: Response, next: NextFunction) {
        const { body } = req;
        schema.create.validateAsync(body).then((validatedUser) => {
            this.userService.createUser(validatedUser)
                .then((user) => {
                    return res.status(200).send(user);
                })
                .catch((err) => {
                    next(err);
                });
        })
            .catch((err: Joi.ValidationError) => {
                next(new ValidationError(err.message));
            })
    }
    updateUser(req: Request, res: Response, next: NextFunction) {
        const { body } = req;
        schema.update.validateAsync(body).then((validatedUser) => {
            this.userService.updateUser(validatedUser)
                .then((user) => {
                    return res.status(200).send(user);
                })
                .catch((err) => {
                    next(err);
                });
        })
            .catch((err: Joi.ValidationError) => {
                next(new ValidationError(err.message));
            })
    }
    deleteUser(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        const { body } = req;
        schema.idControl.validateAsync({ id }).then((validatedId) => {
            this.userService.deleteUser(id).then((user) => {
                return res.status(200).send(user);

            })
                .catch((err) => {
                    next(err);
                });
        })
            .catch((err: Joi.ValidationError) => {
                next(new ValidationError(err.message));
            })
    }
    public routes() {
        this.router.get('/', [paginationMiddleware],  this.getAllUsers.bind(this));
        this.router.get('/:id', this.getUserbyId.bind(this));
        this.router.post('/', this.createUser.bind(this));
        this.router.put('/:id', this.updateUser.bind(this));
        this.router.delete('/:id', this.deleteUser.bind(this));
    }
    //validasyon + promise
}