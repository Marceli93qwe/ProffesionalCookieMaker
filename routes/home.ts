import {Request, Response, Router} from "express"
import {CookieMakerApp} from "../index";

export class HomeRouter {
    constructor(
        private cmapp: CookieMakerApp,
        public readonly router: Router = Router()
    ) {
        this.setUpRoutes();
    }

    private setUpRoutes(): void {
        this.router.get('/', this.home);
    }

    private home = (req: Request, res: Response): void => {
        const {base, addons, allBases, allAddons, sum} = this.cmapp.getCookieSettings(req);
        res.render('home/index', {
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };
}

