import DataUriParser from 'datauri/parser.js'
import path from 'path'

const parser=new DataUriParser();

const getDataUri=(file)=>{
    if (!file || !file.buffer || !file.originalname) {
        throw new Error("Invalid file object");
    }
    const extName=path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer).content;

}
export default getDataUri;