import { createContext, useContext, useState } from "react";

type ImageContextType={
    imageUri:string,
    setImageUri:(imageUri:string)=>void,
    imageFilterMatrix:Array<number>;
    selectedFilterId:string,
    setImageFilterColorMatrix:(colorMatrix:Array<number>,selectedFilterId:string)=>void;
}
const ImageContext=createContext<ImageContextType|undefined>(undefined);

export const ImageContextProvider=({children}:any)=>{
     
       const [imageUri,setImage]=useState("");
       const [imageFilterMatrix,setImageFilterMatrix]=useState([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
      ]);
      const [selectedFilterId,setSelectedFilterId]=useState('original');
       const setImageUri=(imageUri:string)=>{
        setImage(imageUri);
      }
      const setImageFilterColorMatrix=(colorMatrix:Array<number>,selectedFilterId:string)=>{
         setImageFilterMatrix(colorMatrix);
        setSelectedFilterId(selectedFilterId);
      }
      const value={imageUri,setImageUri,imageFilterMatrix,selectedFilterId,setImageFilterColorMatrix};
   return (
    <ImageContext.Provider value={value}>
        {children}
    </ImageContext.Provider>
   )
}
export const UseImageContext=()=>{
    const imageContext=useContext(ImageContext);
    if(!imageContext)
      throw  Error("ImageContext is undefined")
    
    return imageContext;
}