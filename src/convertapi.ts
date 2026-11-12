import Params, {IParamInit} from "./params.js";
import {IParams} from "./param.js";
import Result, {IResultErrorDto} from "./result.js";

export default class ConvertApi {

    /**
     * Returns a ConvertApi object ready to use for conversions.
     *
     * @param credentials - Your API token (https://www.convertapi.com/a/authentication), sent in the `Authorization: Bearer` header.
     * @param host - API host name, without `https://` or a trailing slash: `v2.convertapi.com` (the default) or a regional host such as `eu-v2.convertapi.com` (https://www.convertapi.com/docs/servers-location). A leading `https://` or `http://` and trailing slashes are removed; requests always use https.
     * @returns - New ConvertApi object
     */
    static auth(credentials: string, host?: string): ConvertApi {
        return new ConvertApi(credentials, host)
    }

    /** API host name that requests go to, such as `v2.convertapi.com`, without `https://` or a trailing slash. */
    public readonly host: string

    constructor(
        public readonly authCredentials: string,
        host: string = 'v2.convertapi.com'
    ) {
        // Requests go to https://{host}/..., so a host given as a URL, such as 'https://eu-v2.convertapi.com/'
        // (in the README until https://github.com/ConvertAPI/convertapi-library-js/pull/34), loses its scheme
        // and trailing slashes instead of breaking every request.
        this.host = host.replace(/^https?:\/\//i, '').replace(/\/+$/, '')
    }

    /**
     * Returns initialized and ready to use new conversion parameters object.
     *
     * @returns - New conversion parameter object
     */
    public createParams(init?: IParamInit[]): Params {
        return new Params(this.host, init)
    }

    /**
     * Returns `Promise` to the `Result` object which can be used to retrieve converted files or chain result to the other conversions.
     *
     * @param fromFormat - Source file format (e.g. `docx`, `pdf`, ...)
     * @param toFormat - Destination file format (e.g. `pdf`, `jpg`, ...)
     * @param params - Conversion parameter object
     * @returns - Promise that will resolve to `Result` object.
     */
    public convert(fromFormat: string, toFormat: string, params: IParams): Promise<Result> {
        return Promise.resolve(params.dto)
            .then(dto => {
                return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}?storefile=true`,
                {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': `Bearer ${this.authCredentials}`
                        },
                        body: JSON.stringify(dto)
                    }
                )
                .then(r => Promise.all([r.ok, r.json()]))
                .then(([ok, o]) => ok ? o : Promise.reject<IResultErrorDto>(o))
                .then(dto => new Result(dto))
            })
    }
}