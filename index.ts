import {COOKIE_ADDONS, COOKIE_BASES} from "./data/cookies-data";
import * as express from "express";
import {Express, Request, Response} from "express";
import * as cookieParser from 'cookie-parser';
import {HomeRouter} from "./routes/home";
import {ConfiguratorRouter} from "./routes/configurator";
import {OrderRouter} from "./routes/order";
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import {engine} from "express-handlebars";
import {CookieAddonsAsType, CookieBasesAsType, Cookies_Data} from "./types/cookie_types";


export class CookieMakerApp {
    constructor(
        public data: Cookies_Data = {
            COOKIE_BASES,
            COOKIE_ADDONS,
        },
        private app: Express = express(),
    ) {
        this._configureApp();
        this._setRoutes();
        this._run();
    }

    getAddonsFromReq(req: Request): CookieAddonsAsType[] {
        const {cookieAddons} = req.cookies;
        return cookieAddons ? JSON.parse(cookieAddons) : [];
    }

    getCookieSettings(req: Request): {
        addons: CookieAddonsAsType[],
        base: CookieBasesAsType,
        sum: number,
        allBases: [CookieBasesAsType, number][],
        allAddons: [CookieAddonsAsType, number][],
    } {
        const base = (req.cookies.cookieBase) as CookieBasesAsType;
        const addons: CookieAddonsAsType[] = this.getAddonsFromReq(req);
        const allBases = Object.entries(this.data.COOKIE_BASES) as [CookieBasesAsType, number][];
        const allAddons = Object.entries(this.data.COOKIE_ADDONS) as [CookieAddonsAsType, number][];

        const sum = (base ? handlebarsHelpers.findPrice(allBases, base) : 0)
            + addons.reduce((prev: number, curr: any) => (
                prev + handlebarsHelpers.findPrice(allAddons, curr)
            ), 0);

        return {
            // Selected stuff
            addons,
            base,

            // Calculations
            sum,

            // All possibilities
            allBases,
            allAddons,
        };
    }

    public showErrorPage(res: Response, description: string): void {
        res.render('error', {
            description,
        });
    }

    private _configureApp(): void {
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(cookieParser());
        this.app.engine('.hbs', engine({
            extname: '.hbs',
            helpers: handlebarsHelpers,
        }));
        this.app.set('view engine', '.hbs');
    }

    private _setRoutes(): void {
        this.app.use('/', new HomeRouter(this).router);
        this.app.use('/configurator', new ConfiguratorRouter(this).router);
        this.app.use('/order', new OrderRouter(this).router);
    }

    private _run(): void {
        this.app.listen(3000, '0.0.0.0', () => {
            console.log('Listening on http://localhost:3000');
        });
    }


}

new CookieMakerApp();
