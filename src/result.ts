import {FileValue} from "./file-param.js";
import {FilesValue} from "./files-param.js";

export interface IResultFileDto {
    FileName: string,
    FileExt: string,
    FileSize: number,
    FileId: string,
    Url: string
}

export interface IResultDto {
    ConversionCost: number,
    Files: IResultFileDto[]
}

export interface IResultErrorDto {
    Code: number,
    Message: string
}

export default class Result {
    /**
     * Conversion result class. Can be used to get information about converted file(s) as well as passing result to other chained conversion `Parameters`.
     * 
     * @param dto
     */
    constructor(
        private readonly dto: IResultDto
    ) {}

    /**
     * Returns the conversion cost (`ConversionCost`), the amount deducted from your balance for this conversion.
     */
    public get duration(): number {
        return this.dto.ConversionCost
    }

    /**
     * Returns conversion result files. 
     */
    public get files(): IResultFileDto[] {
        return this.dto.Files
    }

    /**
     * Returns file parameter value. Value can be used to add file parameter to the chained conversion `Parameters` object.
     * ```ts
     * params.add('file', result.toParamFile())
     * ```
     * @param idx - If conversion result contains more than one file, then provided file index will be used.
     */
    public toParamFile(idx: number=0): FileValue {
        return new FileValue(this.dto.Files[idx].FileName, this.dto.Files[idx].FileId)
    }

    /**
     * Returns multiple files parameter value. Value can be used to add files parameter to the chained conversion `Parameters` object.
     * ```ts
     * params.add('files', result.toParamFiles())
     * ```
     * Can only be used with the conversions that accept multiple input files, such as `pdf` -> 'merge' conversion.
     */
    public toParamFiles(): FilesValue {
        return new FilesValue(this.dto.Files)
    }

    /**
     * Uploads file to AWS S3
     * @param region - AWS Region
     * @param bucket - S3 Bucket name
     * @param accessKeyId - AWS Access Key ID
     * @param secretAccessKey - AWS Access Key Secret
     * @returns - Array of promises that resolves to S3 PUT request responses
     */
    public uploadToS3(region: string, bucket: string, accessKeyId: string, secretAccessKey: string): Promise<Response>[] {
        return this.dto.Files.map(f => {
            let dto = {
                // TODO: fileServerUrl: params.get('fileServerUrl'),
                region: region,
                bucket: bucket,
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                fileId: f.FileId
            }
            
            return fetch(`https://integration.convertapi.com/s3/upload`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dto)
            })
        })
    }
}