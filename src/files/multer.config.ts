import { diskStorage } from "multer"
import { extname } from "path"


export const multerConfig = {
    storage: diskStorage({
        destination: "./uploads",
        filename: (request: Request, file: any, callback: any) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('')
            callback(null, `${randomName}_${file.originalname}`)
        }
    })
}
