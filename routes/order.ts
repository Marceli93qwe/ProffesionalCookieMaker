import {Request, Response, Router} from "express"
import {CookieMakerApp} from "../index";

export class OrderRouter {
    constructor(
        private cmapp: CookieMakerApp,
        public readonly router: Router = Router()
    ) {
        this.setUpRoutes();
    }

    setUpRoutes() {
        this.router.get('/summary', this.summary);
        this.router.get('/thanks', this.thanks);
    }

    summary = (req: Request, res: Response) => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('order/summary', {
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };

    thanks = (req: Request, res: Response) => {
        const {sum} = this.cmapp.getCookieSettings(req);

        res
            .clearCookie('cookieBase')
            .clearCookie('cookieAddons')
            .render('order/thanks', {
                sum,
            });
    }
}


