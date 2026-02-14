import multer from "multer";
import path from "path";
const storage=multer.diskStorage({
  destination(req, file, callback) {
    // console.log("Saving to:", path.join(process.cwd(), "uploads"));
    callback(null,path.join(process.cwd(),"uploads/"));
  },
  filename(req, file, callback) {
    const cleanName = file.originalname.replace(/\s+/g, "-");
    callback(null,`${Date.now()}-${cleanName}`);
  },
})

//file filter
const fileFilter=(req:any,file:any,callback:any)=>{
  const allowedTypes=["image/jpeg", 'image/png', "image/jpg","application/pdf"];
  if(allowedTypes.includes(file.mimetype)){
    callback(null,true);
  }
  else{
    callback(new Error("Only Jpeg or Png allowed or PDF allowed."),false);
  }
};

export const upload=multer({storage, fileFilter})